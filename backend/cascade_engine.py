"""
Contractor Supply Chain & Cascading Compliance Risk Engine.
Ministry of Coal | SIH 2026 - Smart Compliance Monitoring.

Models multi-mine contractor operations and calculates how a statutory violation
or DGMS safety penalty at one mine propagates across other mining leases and subsidiaries.
"""

from typing import Dict, List, Any, Optional
from .database import SessionLocal, Contractor, Mine, ContractorMineAssignment, SafetyIncident, Inspection

def get_contractor_network() -> List[Dict[str, Any]]:
    """Build the contractor dependency graph across CIL subsidiaries."""
    network = []
    db = SessionLocal()
    contractors = db.query(Contractor).all()
    
    for c in contractors:
        assigned_mines = [assignment.mine for assignment in c.mine_assignments]

        total_open_violations = 0
        total_fatalities = 0

        for m in assigned_mines:
            m_id = m.id
            incidents = db.query(SafetyIncident).filter(SafetyIncident.mine_id == m_id).all()
            total_fatalities += sum(i.fatalities if i.fatalities else 1 for i in incidents)
            
            insp = db.query(Inspection).filter(Inspection.mine_id == m_id).first()
            total_open_violations += insp.open_violations if insp else 0

        # Base fleet score penalized by historical incidents and open inspection flags
        base_score = 92.0
        penalty = (total_fatalities * 10.0) + (total_open_violations * 4.0)
        overall_safety_rating = max(30.0, round(base_score - penalty, 1))

        network.append({
            "contractor_id": c.id,
            "name": c.name,
            "category": c.category,
            "fleet_size": max(0, c.fleet_size if c.fleet_size else 0),
            "safety_rating": overall_safety_rating,
            "status": c.status,
            "blacklisted": c.blacklisted,
            "assigned_mines": [
                {
                    "id": m.id,
                    "name": m.name,
                    "subsidiary": m.subsidiary,
                    "state": m.state,
                    "production_mtpa": max(0.0, float(m.production_mtpa if m.production_mtpa else 0.0))
                }
                for m in assigned_mines
            ],
            "total_open_violations": total_open_violations,
            "total_fatalities": total_fatalities,
            "cascade_vulnerability": "HIGH" if overall_safety_rating < 60 else ("MEDIUM" if overall_safety_rating < 80 else "LOW"),
        })

    db.close()
    return network

def simulate_contractor_stop_work(contractor_name: Optional[str] = None, coal_rate_inr: float = 2800.0) -> Dict[str, Any]:
    """
    Simulate the operational and financial impact if a non-compliant contractor 
    is issued a DGMS stop-work order under Section 22 of Mines Act 1952.
    Cleanly handles edge cases (zero values, negative rates, missing contractor records).
    """
    network = get_contractor_network()
    safe_rate = max(0.0, float(coal_rate_inr))

    if not network:
        return {
            "target_contractor": contractor_name or "Unknown Contractor",
            "safety_rating": 50.0,
            "fleet_grounded": 0,
            "affected_mines_count": 0,
            "affected_mines": [],
            "total_impacted_capacity_mtpa": 0.0,
            "estimated_daily_revenue_impact_crores": 0.0,
            "statutory_mitigation_plan": "No active contractor records identified for impact evaluation."
        }

    search_query = (contractor_name or "").strip().lower()
    target = None

    if search_query:
        target = next((c for c in network if search_query in c["name"].lower() or search_query in c["contractor_id"].lower()), None)
    
    if not target:
        # Fallback to the highest-vulnerability contractor or first available
        target = next((c for c in network if c["cascade_vulnerability"] == "HIGH"), network[0])

    affected_mines = target.get("assigned_mines", [])
    total_affected_production = max(0.0, sum(m.get("production_mtpa", 0.0) for m in affected_mines))
    
    # Financial estimation: (MT * 1,000,000 tonnes * safe_rate INR) / 365 days / 10,000,000 (Cr)
    # Formula: (total_affected_production * safe_rate) / 3650.0
    est_daily_dispatch_loss_cr = round((total_affected_production * safe_rate) / 3650.0, 2)

    return {
        "target_contractor": target["name"],
        "safety_rating": target.get("safety_rating", 50.0),
        "fleet_grounded": max(0, target.get("fleet_size", 0)),
        "affected_mines_count": len(affected_mines),
        "affected_mines": affected_mines,
        "total_impacted_capacity_mtpa": round(total_affected_production, 2),
        "estimated_daily_revenue_impact_crores": est_daily_dispatch_loss_cr,
        "statutory_mitigation_plan": "Invoke Regulation 31 clause to reassign standby equipment from auxiliary pool under certified supervision within 48 hours."
    }
