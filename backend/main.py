"""
FastAPI Server for AI-Based Smart Governance & Compliance Monitoring System for Coal Mines.
Ministry of Coal - SIH26024 Implementation.
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any, Optional

from .database import SessionLocal, Mine, AirQualityReading, SafetyIncident, Inspection, FieldObservation, Contractor
from .risk_engine import calculate_composite_mine_risk, get_all_mine_risk_matrix, detect_recurring_violation_patterns
from .cascade_engine import get_contractor_network, simulate_contractor_stop_work
from .blockchain_ledger import ledger_instance
from .ocr_digitizer import analyze_statutory_document, SAMPLE_DOCUMENTS
from .statutory_reports import generate_dgms_form_iv, generate_cpcb_form_v
from .ai_copilot import ask_khanan_copilot
from .prediction_engine import predict_mine_hazards
from .authority_reporting import (
    AuthorityReportSubmission, 
    submit_authority_report, 
    get_all_authority_reports, 
    trigger_authority_escalation
)

app = FastAPI(
    title="Coal Mine Smart Governance & Authority Dispatch API",
    description="Centralized AI Governance Platform for Ministry of Coal, DGMS & CPCB",
    version="2.4.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class FieldObservationCreate(BaseModel):
    mine_id: str
    inspector_name: str
    inspector_role: str
    hazard_type: str
    severity: str
    description: str
    action_required: str
    lat: float
    lng: float
    deadline_hours: int = 24

class CopilotQuery(BaseModel):
    query: str
    mine_id: Optional[str] = "gevra"
    language: Optional[str] = "en"

class DocumentAnalyzeRequest(BaseModel):
    document_text: str
    document_title: Optional[str] = "Uploaded Statutory Order"

class EscalationRequest(BaseModel):
    report_id: str

@app.get("/")
def root():
    db = SessionLocal()
    mines_count = db.query(Mine).count()
    db.close()
    return {
        "service": "Coal Mine Smart Governance API",
        "status": "ONLINE",
        "version": "2.4.0",
        "authority": "Ministry of Coal / DGMS / CPCB",
        "total_monitored_mines": mines_count,
        "ledger_blocks_count": len(ledger_instance.chain),
    }

@app.get("/api/mines")
def list_mines():
    """List all 12 verified Coal India opencast mines with summary risk metrics."""
    result = []
    db = SessionLocal()
    mines = db.query(Mine).all()
    db.close()
    
    for m in mines:
        risk = calculate_composite_mine_risk(m.id)
        result.append({
            "id": m.id,
            "name": m.name,
            "subsidiary": m.subsidiary,
            "state": m.state,
            "lat": m.lat,
            "lng": m.lng,
            "capacity_mtpa": m.capacity_mtpa,
            "production_mtpa": m.production_mtpa,
            "ec_limit_mtpa": m.ec_limit_mtpa,
            "opening_year": m.opening_year,
            "mine_type": m.mine_type,
            "contractor": m.contractor,
            "caaqms_station": m.caaqms_station,
            "safety_officer": m.safety_officer,
            "worker_count": m.worker_count,
            "active_ptw_count": m.active_ptw_count,
            "data_confidence": m.data_confidence,
            "composite_risk_score": risk["composite_score"],
            "risk_level": risk["risk_level"],
            "color": risk["color"],
        })
    return result

@app.get("/api/mines/{mine_id}")
def get_mine_details(mine_id: str):
    """Retrieve in-depth details, telemetry, incidents, and risk profile for a single mine."""
    db = SessionLocal()
    mine = db.query(Mine).filter(Mine.id == mine_id).first()
    if not mine:
        db.close()
        raise HTTPException(status_code=404, detail="Mine not found")

    telemetry = db.query(AirQualityReading).filter(AirQualityReading.mine_id == mine_id).all()
    incidents = db.query(SafetyIncident).filter(SafetyIncident.mine_id == mine_id).all()
    inspection = db.query(Inspection).filter(Inspection.mine_id == mine_id).first()
    observations = db.query(FieldObservation).filter(FieldObservation.mine_id == mine_id).all()
    
    mine_dict = {
        "id": mine.id,
        "name": mine.name,
        "subsidiary": mine.subsidiary,
        "state": mine.state,
        "lat": mine.lat,
        "lng": mine.lng,
        "capacity_mtpa": mine.capacity_mtpa,
        "production_mtpa": mine.production_mtpa,
        "ec_limit_mtpa": mine.ec_limit_mtpa,
        "opening_year": mine.opening_year,
        "mine_type": mine.mine_type,
        "contractor": mine.contractor,
        "caaqms_station": mine.caaqms_station,
        "safety_officer": mine.safety_officer,
        "worker_count": mine.worker_count,
        "active_ptw_count": mine.active_ptw_count,
        "data_confidence": mine.data_confidence,
    }
    telemetry_list = [{"date": t.date, "pm25": t.pm25, "pm10": t.pm10, "so2": t.so2, "no2": t.no2, "co": t.co} for t in telemetry]
    incidents_list = [{"date": i.date, "cause": i.cause, "severity": i.severity, "fatalities": i.fatalities, "alert_no": i.alert_no, "status": i.status} for i in incidents]
    inspection_dict = {"last_inspection_days_ago": inspection.last_inspection_days_ago, "open_violations": inspection.open_violations, "pending_notices": inspection.pending_notices, "cto_valid_until": inspection.cto_valid_until} if inspection else {}
    observations_list = [{"id": o.id, "mine_id": o.mine_id, "mine_name": o.mine_name, "inspector": o.inspector, "timestamp": o.timestamp, "lat": o.lat, "lng": o.lng, "hazard_type": o.hazard_type, "severity": o.severity, "description": o.description, "action_required": o.action_required, "status": o.status, "deadline_hours": o.deadline_hours} for o in observations]

    db.close()
    risk = calculate_composite_mine_risk(mine_id)

    return {
        "mine": mine_dict,
        "risk_assessment": risk,
        "telemetry_history": telemetry_list,
        "safety_incidents": incidents_list,
        "inspection_status": inspection_dict,
        "field_observations": observations_list,
    }

@app.get("/api/risk-matrix")
def get_risk_matrix():
    """Ranked multi-signal governance risk matrix across all mines."""
    return get_all_mine_risk_matrix()

@app.get("/api/analytics/recurring-violations")
def get_recurring_violations():
    """Clustered violation patterns and AI preventive directives."""
    return detect_recurring_violation_patterns()

@app.get("/api/cascade-network")
def get_cascade_network():
    """Contractor supply chain graph and risk propagation scores."""
    return get_contractor_network()

@app.get("/api/cascade-network/simulate")
def simulate_contractor_impact(contractor: str = Query("Apex Infrastructure", description="Contractor name to simulate")):
    """Simulate stop-work order ripple effects across subsidiaries."""
    return simulate_contractor_stop_work(contractor)

@app.get("/api/ledger")
def get_blockchain_ledger():
    """Fetch all blocks from the cryptographic tamper-proof ledger."""
    return ledger_instance.get_all_blocks()

@app.get("/api/ledger/verify")
def verify_blockchain_ledger():
    """Verify cryptographic SHA-256 chain integrity."""
    return ledger_instance.verify_integrity()

@app.post("/api/inspections/submit")
def submit_field_inspection(obs: FieldObservationCreate):
    """Submit a geo-tagged field observation and record to cryptographic ledger."""
    db = SessionLocal()
    obs_count = db.query(FieldObservation).count()
    obs_id = f"OBS-2026-{obs_count + 901}"
    
    mine = db.query(Mine).filter(Mine.id == obs.mine_id).first()
    mine_name = mine.name if mine else obs.mine_id

    new_obs = FieldObservation(
        id=obs_id,
        mine_id=obs.mine_id,
        mine_name=mine_name,
        inspector=obs.inspector_name,
        timestamp="Just now (Live)",
        lat=obs.lat,
        lng=obs.lng,
        hazard_type=obs.hazard_type,
        severity=obs.severity,
        description=obs.description,
        action_required=obs.action_required,
        status="Under Investigation",
        deadline_hours=obs.deadline_hours,
    )
    db.add(new_obs)
    db.commit()
    db.refresh(new_obs)
    
    obs_entry = {
        "id": new_obs.id,
        "mine_id": new_obs.mine_id,
        "mine_name": new_obs.mine_name,
        "inspector": new_obs.inspector,
        "timestamp": new_obs.timestamp,
        "lat": new_obs.lat,
        "lng": new_obs.lng,
        "hazard_type": new_obs.hazard_type,
        "severity": new_obs.severity,
        "description": new_obs.description,
        "action_required": new_obs.action_required,
        "status": new_obs.status,
        "deadline_hours": new_obs.deadline_hours,
    }
    db.close()

    # Append to cryptographic audit ledger
    block = ledger_instance.add_entry(
        action_type="MOBILE_FIELD_OBSERVATION_LOGGED",
        actor_id=obs.inspector_name,
        actor_role=obs.inspector_role,
        mine_id=obs.mine_id,
        payload={
            "obs_id": obs_id,
            "hazard_type": obs.hazard_type,
            "severity": obs.severity,
            "coordinates": f"{obs.lat}, {obs.lng}"
        }
    )

    return {
        "status": "SUCCESS",
        "observation": obs_entry,
        "ledger_block": block
    }

@app.get("/api/ocr/sample-documents")
def get_ocr_samples():
    """Fetch pre-packaged sample statutory documents."""
    return SAMPLE_DOCUMENTS

@app.post("/api/ocr/analyze")
def analyze_document(req: DocumentAnalyzeRequest):
    """Parse text/OCR scan of statutory document and extract compliance clauses."""
    return analyze_statutory_document(req.document_text, req.document_title or "Uploaded Document")

@app.get("/api/reports/form-iv/{mine_id}")
def get_form_iv(mine_id: str):
    """Generate DGMS Form IV notice of accident report."""
    return generate_dgms_form_iv(mine_id)

@app.get("/api/reports/form-v/{mine_id}")
def get_form_v(mine_id: str):
    """Generate CPCB Form V annual environmental statement."""
    return generate_cpcb_form_v(mine_id)

@app.post("/api/copilot/ask")
def query_copilot(req: CopilotQuery):
    """Query Khanan Copilot multilingual assistant."""
    return ask_khanan_copilot(query=req.query, mine_id=req.mine_id or "gevra", language=req.language or "en")

# New: Authority Escalation & Direct Reporting Endpoints
@app.get("/api/authority-reports")
def list_authority_reports():
    """Retrieve all lodged statutory authority reports."""
    return get_all_authority_reports()

@app.post("/api/authority-reports/submit")
def create_authority_report(report_data: AuthorityReportSubmission):
    """Lodge and dispatch formal statutory violation report to DGMS/CPCB/Ministry."""
    return submit_authority_report(report_data)

@app.post("/api/authority-reports/escalate")
def escalate_authority_report(req: EscalationRequest):
    """Trigger priority escalation to Apex Secretary / DGMS Director General."""
    return trigger_authority_escalation(req.report_id)

@app.get("/api/predictions/{mine_id}")
def get_mine_predictions(mine_id: str):
    """Retrieve 24-48h AI predictive hazard and incident projections for a mine."""
    return predict_mine_hazards(mine_id)

