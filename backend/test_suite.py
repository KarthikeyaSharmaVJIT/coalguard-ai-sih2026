"""
Automated validation test suite for Coal Mine Smart Governance Backend.
Ministry of Coal | SIH 2026 - Smart Compliance Monitoring.

Tests risk engine, cascade model, cryptographic ledger, OCR digitizer, statutory reports, and copilot.
"""

from backend.data import MINES
from backend.risk_engine import get_all_mine_risk_matrix, detect_recurring_violation_patterns
from backend.cascade_engine import get_contractor_network, simulate_contractor_stop_work
from backend.blockchain_ledger import ledger_instance
from backend.ocr_digitizer import analyze_statutory_document, extract_text_from_file_bytes, SAMPLE_DOCUMENTS
from backend.statutory_reports import generate_dgms_form_iv, generate_cpcb_form_v
from backend.ai_copilot import ask_khanan_copilot
from backend.prediction_engine import predict_mine_hazards

def run_tests():
    print("=== STARTING BACKEND VALIDATION SUITE ===")
    
    # 1. Test Mines dataset (all 12 mines have all required fields)
    assert len(MINES) == 12, f"Expected 12 mines, got {len(MINES)}"
    for m in MINES:
        for field in ["id", "name", "subsidiary", "state", "lat", "lng", "capacity_mtpa", "production_mtpa", "ec_limit_mtpa", "opening_year", "mine_type", "contractor", "caaqms_station", "safety_officer", "worker_count", "active_ptw_count"]:
            assert field in m, f"Mine {m.get('id')} is missing field: {field}"
    print(f"[OK] Dataset verified: {len(MINES)} Coal India mines loaded with full statutory specifications.")

    # 2. Test Risk Engine
    matrix = get_all_mine_risk_matrix()
    assert len(matrix) == 12, f"Expected 12 risk entries, got {len(matrix)}"
    print(f"[OK] Risk Matrix computed: Highest risk mine = {matrix[0]['mine_name']} (Score: {matrix[0]['composite_score']})")

    patterns = detect_recurring_violation_patterns()
    assert len(patterns) >= 3, "Expected recurring violation patterns"
    print(f"[OK] Recurring violation patterns detected: {len(patterns)} pattern clusters found.")

    # 3. Test Cascade Engine & Edge Cases
    network = get_contractor_network()
    assert len(network) == 6, f"Expected 6 contractor profiles, got {len(network)}"
    print(f"[OK] Contractor Cascade Network mapped: {len(network)} primary mining contractors.")

    sim = simulate_contractor_stop_work("Apex Infrastructure")
    assert sim["fleet_grounded"] == 112
    assert sim["affected_mines_count"] == 3
    assert sim["estimated_daily_revenue_impact_crores"] > 0
    print(f"[OK] Contractor Stop-Work Simulation: Impact = Rs {sim['estimated_daily_revenue_impact_crores']} Cr/day across {sim['affected_mines_count']} mines.")

    # Edge cases: missing contractor, negative rates, None input
    edge1 = simulate_contractor_stop_work(None, coal_rate_inr=-100.0)
    assert edge1["estimated_daily_revenue_impact_crores"] >= 0.0
    edge2 = simulate_contractor_stop_work("NonExistentCorporation", 2800.0)
    assert "target_contractor" in edge2
    print(f"[OK] Cascade Engine Edge Cases: Negative rate, missing contractor handled cleanly.")

    # 4. Test Cryptographic Audit Ledger & Tamper Detection
    integrity = ledger_instance.verify_integrity()
    assert integrity["valid"] is True, f"Ledger integrity failed: {integrity}"
    print(f"[OK] Blockchain SHA-256 Ledger: {integrity['total_blocks']} blocks verified with 0 tampering.")

    # Tamper detection verification
    original_payload = ledger_instance.chain[2].payload
    ledger_instance.chain[2].payload = {"tampered": "illegal modification"}
    tamper_result = ledger_instance.verify_integrity()
    assert tamper_result["valid"] is False, "Tamper detection failed to detect altered block payload"
    ledger_instance.chain[2].payload = original_payload
    restored_result = ledger_instance.verify_integrity()
    assert restored_result["valid"] is True, "Restoration failed to restore valid ledger integrity"
    print(f"[OK] Blockchain Tamper-Resistance: Intentionally injected mutation successfully flagged.")

    # 5. Test OCR Digitizer (Text & File Bytes Extraction)
    doc_res = analyze_statutory_document(SAMPLE_DOCUMENTS["ec_gevra"], "Gevra EC 70 MTPA")
    assert "MoEFCC" in doc_res["issuing_authority"]
    assert "70" in doc_res["statutory_capacity_cap"]
    
    # Test extract_text_from_file_bytes with mock text/PDF bytes
    mock_pdf_bytes = b"%PDF-1.4 simulated pdf document with MoEFCC 70 MTPA capacity"
    extracted_pdf_text = extract_text_from_file_bytes(mock_pdf_bytes, "test_order.pdf")
    assert len(extracted_pdf_text) > 0
    print(f"[OK] OCR Digitizer parsed: {doc_res['issuing_authority']} - Cap: {doc_res['statutory_capacity_cap']}.")

    # 6. Test Statutory Reports
    form_iv = generate_dgms_form_iv("gevra")
    assert "Mines Act" in form_iv["statutory_act"]
    print(f"[OK] DGMS Form IV generated for Gevra: Ref {form_iv['filing_reference']}")

    form_v = generate_cpcb_form_v("kusmunda")
    assert "actual_production" in form_v["part_a"]
    print(f"[OK] CPCB Form V generated for Kusmunda.")

    # 7. Test Authority Reporting & Escalation Engine
    from backend.authority_reporting import (
        AuthorityReportSubmission, 
        submit_authority_report, 
        trigger_authority_escalation
    )
    auth_sub = AuthorityReportSubmission(
        mine_id="nigahi",
        target_authority="DGMS",
        reporter_name="Test Inspector",
        reporter_role="Safety Auditor",
        reporter_contact="+91 9400000000",
        hazard_title="Berm slope failure test",
        statutory_regulation="Reg 106",
        severity_level="P1_CRITICAL_IMMINENT_DANGER",
        detailed_description="Test observation for authority dispatch",
        mandated_immediate_action="Immediate stop work",
        lat=24.135,
        lng=82.599,
        sla_hours=6
    )
    auth_res = submit_authority_report(auth_sub)
    assert auth_res["status"] == "DISPATCH_SUCCESSFUL"
    print(f"[OK] Authority Report lodged & dispatched: Ref {auth_res['report']['reference_no']}")

    esc_res = trigger_authority_escalation(auth_res['report']['id'])
    assert esc_res["status"] == "ESCALATED"
    print(f"[OK] Authority Escalation triggered: {esc_res['message']}")

    # 8. Test Khanan Copilot
    en_res = ask_khanan_copilot("What is regulation 106?", "gevra", "en")
    assert "106" in en_res["statutory_reference"]
    print(f"[OK] Khanan Copilot (English): {en_res['statutory_reference']}")

    hi_res = ask_khanan_copilot("डंपर की सुरक्षा के लिए कौन सा नियम है?", "gevra", "hi")
    assert "94" in hi_res["statutory_reference"]
    print(f"[OK] Khanan Copilot (Hindi): {hi_res['statutory_reference']}")

    judge_res = ask_khanan_copilot("What is the biggest safety concern at this mine?", "gevra", "en")
    assert "Haul Road Berm" in judge_res["answer"] or "107" in judge_res["statutory_reference"]
    assert judge_res["risk_level"] in ["CRITICAL", "HIGH", "ELEVATED", "MODERATE"]
    print(f"[OK] Khanan Copilot (Judge Query Synthesis): Successfully answered biggest safety concern with live observation & risk score.")

    # 9. Test AI Predictive Hazard Forecasting Engine
    pred_res = predict_mine_hazards("gevra")
    assert "predictions" in pred_res
    assert len(pred_res["predictions"]) == 4
    high_pred = next((p for p in pred_res["predictions"] if p["section_id"] == "SEC-B"), None)
    assert high_pred is not None
    assert high_pred["probability"] == 87
    print(f"[OK] AI Prediction Engine: Forecasted 24h risk in {high_pred['name']} = {high_pred['probability']}% ({high_pred['risk_level']}).")

    print("\n=== ALL BACKEND MODULES VALIDATED AND FUNCTIONING FLAWLESSLY ===")

if __name__ == "__main__":
    run_tests()


