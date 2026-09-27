"""
Statutory Authority Reporting & Escalation Dispatch Engine.
Ministry of Coal - SIH26024 Smart Governance Platform.
Enables formal digital reporting and automated escalation to DGMS, CPCB, SPCB, and Ministry of Coal Vigilance.
"""

import time
import hashlib
from typing import Dict, List, Any, Optional
from pydantic import BaseModel
from .data import MINES
from .blockchain_ledger import ledger_instance

class AuthorityReportSubmission(BaseModel):
    mine_id: str
    target_authority: str # 'DGMS', 'CPCB', 'MINISTRY_VIGILANCE', 'SPCB', 'NDMA'
    reporter_name: str
    reporter_role: str
    reporter_contact: str
    hazard_title: str
    statutory_regulation: str
    severity_level: str # 'P1_CRITICAL_IMMINENT_DANGER', 'P2_MAJOR_NON_COMPLIANCE', 'P3_ROUTINE_AUDIT'
    detailed_description: str
    mandated_immediate_action: str
    lat: float
    lng: float
    evidence_hash: Optional[str] = None
    sla_hours: int = 24

# In-memory Authority Reports Database
AUTHORITY_REPORTS: List[Dict[str, Any]] = [
    {
        "id": "AUTH-REP-2026-0891",
        "reference_no": "DGMS/DIRECT/2026/SGR-014",
        "timestamp": "2026-09-08 10:15 IST",
        "mine_id": "nigahi",
        "mine_name": "Nigahi Opencast Project",
        "subsidiary": "Northern Coalfields Limited (NCL)",
        "target_authority": "Directorate General of Mines Safety (DGMS)",
        "recipient_office": "DGMS Northern Zone, Singrauli Regional Directorate",
        "reporter_name": "R. C. Meena",
        "reporter_role": "Dy. Director of Mines Safety",
        "reporter_contact": "+91 94251 XXXXX",
        "hazard_title": "100T Tipper Reversing Radar & Proximity Sensor Failure",
        "statutory_regulation": "Regulation 94 & 106 of Coal Mines Regulations 2017",
        "severity_level": "P1_CRITICAL_IMMINENT_DANGER",
        "detailed_description": "Multiple haulage tippers operated by Contractor Apex Infrastructure observed operating without operational Audio-Visual Alarms (AVAs) and proximity warning radars in active coal face loading zone.",
        "mandated_immediate_action": "Ground all non-compliant HEMM vehicles immediately; stop coal face loading until certified by Mine Safety Head.",
        "lat": 24.1355,
        "lng": 82.6001,
        "sla_hours": 6,
        "status": "DISPATCHED_TO_DGMS_DIRECTORATE",
        "escalation_state": "ESCALATED_LEVEL_2",
        "evidence_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "blockchain_block_hash": "b39d10e82c194a098bf890123ca49081bcde4120984ba19082348fc091283af0",
    },
    {
        "id": "AUTH-REP-2026-0892",
        "reference_no": "CPCB/ENV-ALERT/2026/KRB-042",
        "timestamp": "2026-09-07 15:40 IST",
        "mine_id": "kusmunda",
        "mine_name": "Kusmunda Opencast Mine",
        "subsidiary": "South Eastern Coalfields Limited (SECL)",
        "target_authority": "Central Pollution Control Board (CPCB)",
        "recipient_office": "CPCB Regional Directorate (Central), Korba Chhattisgarh",
        "reporter_name": "Dr. S. Mukherjee",
        "reporter_role": "Regional Environment Auditor",
        "reporter_contact": "+91 98300 XXXXX",
        "hazard_title": "CAAQMS PM10 Exceedance (164.8 µg/m³) at In-Pit Crusher",
        "statutory_regulation": "Section 21 of Air (Prevention & Control of Pollution) Act 1981",
        "severity_level": "P2_MAJOR_NON_COMPLIANCE",
        "detailed_description": "Continuous ambient air quality monitor recorded sustained PM10 exceedances >160 µg/m³ for 6 consecutive hours due to water mist nozzle clogging at primary coal crusher.",
        "mandated_immediate_action": "Deploy 2 mobile mist cannons and descale high-pressure suppression lines within 12 hours.",
        "lat": 22.3331,
        "lng": 82.6672,
        "sla_hours": 12,
        "status": "ACKNOWLEDGED_BY_CPCB",
        "escalation_state": "IN_COMPLIANCE_MONITORING",
        "evidence_hash": "9f82d1685a4ef213498f45a198c89b21f98d1a498b8c12a7894bcfa8921e4812",
        "blockchain_block_hash": "3189fa0812903bcde14908123afbc0192834b901284719082348fc091283af01",
    }
]

def submit_authority_report(data: AuthorityReportSubmission) -> Dict[str, Any]:
    """Process, digitally sign, dispatch, and ledger-chain a formal statutory report."""
    mine = next((m for m in MINES if m["id"] == data.mine_id), MINES[0])
    
    report_id = f"AUTH-REP-2026-{len(AUTHORITY_REPORTS) + 893}"
    ref_prefix = "DGMS/DIRECT" if "DGMS" in data.target_authority.upper() else ("CPCB/ENV" if "CPCB" in data.target_authority.upper() else "MOC/VIG")
    ref_no = f"{ref_prefix}/{time.strftime('%Y')}/{data.mine_id.upper()[:3]}-{len(AUTHORITY_REPORTS) + 1:03d}"

    # Calculate digital evidence hash if not provided
    content_str = f"{report_id}:{data.mine_id}:{data.target_authority}:{data.detailed_description}:{time.time()}"
    ev_hash = data.evidence_hash or hashlib.sha256(content_str.encode()).hexdigest()

    # Append to Cryptographic SHA-256 Ledger
    block = ledger_instance.add_entry(
        action_type=f"STATUTORY_AUTHORITY_REPORT_DISPATCHED_{data.target_authority.upper()}",
        actor_id=data.reporter_name,
        actor_role=data.reporter_role,
        mine_id=data.mine_id,
        payload={
            "report_id": report_id,
            "reference_no": ref_no,
            "target_authority": data.target_authority,
            "hazard_title": data.hazard_title,
            "severity": data.severity_level,
            "coordinates": f"{data.lat}, {data.lng}",
            "evidence_hash": ev_hash
        }
    )

    recipient_map = {
        "DGMS": "Directorate General of Mines Safety (DGMS) - Regional Director",
        "CPCB": "Central Pollution Control Board (CPCB) - Zonal Enforcement",
        "MINISTRY_VIGILANCE": "Ministry of Coal - Chief Vigilance Officer (CVO)",
        "SPCB": "State Pollution Control Board - Regional Environmental Officer",
        "NDMA": "National Disaster Management Authority - Mining Safety Cell"
    }

    entry = {
        "id": report_id,
        "reference_no": ref_no,
        "timestamp": time.strftime("%Y-%m-%d %H:%M IST"),
        "mine_id": data.mine_id,
        "mine_name": mine["name"],
        "subsidiary": mine["subsidiary"],
        "target_authority": data.target_authority,
        "recipient_office": recipient_map.get(data.target_authority, f"{data.target_authority} Apex Directorate"),
        "reporter_name": data.reporter_name,
        "reporter_role": data.reporter_role,
        "reporter_contact": data.reporter_contact,
        "hazard_title": data.hazard_title,
        "statutory_regulation": data.statutory_regulation,
        "severity_level": data.severity_level,
        "detailed_description": data.detailed_description,
        "mandated_immediate_action": data.mandated_immediate_action,
        "lat": data.lat,
        "lng": data.lng,
        "sla_hours": data.sla_hours,
        "status": "DISPATCHED_TO_AUTHORITY_SECURE_GATEWAY",
        "escalation_state": "ACTIVE_SLA_TRACKING",
        "evidence_hash": ev_hash,
        "blockchain_block_hash": block["hash"],
        "blockchain_block_index": block["index"],
    }

    AUTHORITY_REPORTS.insert(0, entry)

    return {
        "status": "DISPATCH_SUCCESSFUL",
        "message": f"Report successfully dispatched to {entry['recipient_office']} and chained into SHA-256 Ledger Block #{block['index']}.",
        "report": entry,
        "ledger_block": block
    }

def get_all_authority_reports() -> List[Dict[str, Any]]:
    """Retrieve all lodged statutory authority reports."""
    return AUTHORITY_REPORTS

def trigger_authority_escalation(report_id: str) -> Dict[str, Any]:
    """Trigger manual or automated high-priority escalation to Apex Ministry Secretary."""
    rep = next((r for r in AUTHORITY_REPORTS if r["id"] == report_id), None)
    if not rep:
        return {"error": "Report not found"}

    rep["escalation_state"] = "ESCALATED_APEX_SECRETARY_LEVEL"
    rep["status"] = "URGENT_APEX_ACTION_MANDATED"
    
    # Ledger audit
    ledger_instance.add_entry(
        action_type="AUTHORITY_REPORT_HIGH_ESCALATION_TRIGGERED",
        actor_id="SYSTEM_AUTO_ESCALATION_DAEMON",
        actor_role="Automated Compliance Monitor",
        mine_id=rep["mine_id"],
        payload={
            "report_id": report_id,
            "escalation_level": "APEX_SECRETARY",
            "reason": "SLA threshold exceeded / Critical hazard severity"
        }
    )

    return {
        "status": "ESCALATED",
        "message": f"Statutory Notice {rep['reference_no']} escalated to Ministry of Coal Joint Secretary & DGMS Director General.",
        "updated_report": rep
    }
