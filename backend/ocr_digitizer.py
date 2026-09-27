"""
OCR & Statutory Document Digitizer for Coal Mining Governance.
Simulates and parses Environmental Clearances (MoEFCC), DGMS Notices,
and State Pollution Control Board Consent-to-Operate (CTO) permits.
"""

import re
from typing import Dict, List, Any

# Pre-packaged sample statutory documents for instant demonstration
SAMPLE_DOCUMENTS = {
    "ec_gevra": """
GOVERNMENT OF INDIA
MINISTRY OF ENVIRONMENT, FOREST AND CLIMATE CHANGE
(IA Division - Coal Mining Sector)
Indira Paryavaran Bhawan, Jor Bagh Road, New Delhi - 110003

F. No. J-11015/12/2020-IA.II(M)                               Dated: 14th June, 2024
To,
The General Manager (Environment),
M/s South Eastern Coalfields Limited (SECL),
Gevra Opencast Coal Mining Project, Korba, Chhattisgarh.

Subject: Expansion of Gevra Opencast Coal Mine Project from 50 MTPA to 70 MTPA in an ML area of 4184.486 ha by M/s SECL located in Korba District, Chhattisgarh - Environmental Clearance (EC) regarding.

Sir,
This has reference to your online proposal No. IA/CG/CMIN/2024/09 regarding the cited project.
The Ministry of Environment, Forest and Climate Change hereby accords Environmental Clearance (EC) subject to specific and general conditions:

1. STATUTORY PRODUCTION CEILING: The peak production capacity shall strictly NOT exceed 70.0 MTPA (Seventy Million Tonnes Per Annum) under any circumstances.
2. AIR POLLUTION MITIGATION: Continuous Ambient Air Quality Monitoring Stations (CAAQMS) must be operated 24x7 with live streaming to CPCB/CECB servers. PM10 shall not exceed 100 µg/m³ and PM2.5 shall not exceed 60 µg/m³.
3. WATER SPRINKLING & HAUL ROADS: Mist spray cannons (minimum 40m throw) must be deployed along all heavy haul roads.
4. GREEN BELT: 3-tier biological reclamation barrier covering at least 33% of total project boundary within 3 financial years.
5. OVERBURDEN DUMP STABILITY: Slope stability monitoring with automatic piezometers and slope radars mandatory under CMR 2017.

Compliance reports must be submitted biannually via PARIVESH portal before 1st June and 1st December every year.
""",
    "dgms_notice_nigahi": """
GOVERNMENT OF INDIA
MINISTRY OF LABOUR & EMPLOYMENT
DIRECTORATE GENERAL OF MINES SAFETY (DGMS)
Singrauli Region, Northern Zone

No. DGMS/NZ/SGR/CMR-106/2026/SA-02                             Dated: 18th February, 2026

SHOW-CAUSE NOTICE UNDER REGULATION 106 & 94 OF COAL MINES REGULATIONS 2017

To,
The Agent & Mine Manager,
Nigahi Opencast Mine, Northern Coalfields Limited (NCL),
District Singrauli, Madhya Pradesh.

Sub: Fatal accident and recurring tipper inversion incidents on Overburden Haul Road Bench #3.

During the statutory safety inspection conducted on 12th February 2026, serious contraventions were observed:
1. Contractor Apex Infrastructure is operating 100T dumpers without functional proximity warning devices and audio-visual alarms (AVA).
2. Haul road gradient on North Ramp exceeds 1 in 16 without statutory DGMS exemption.
3. Berm height along the dump crest was measured at 0.9m, violating Regulation 107 (requiring minimum berm height equal to largest tyre diameter 2.2m).

YOU ARE HEREBY DIRECTED TO:
a) Stop haulage operations on North Ramp until berm reconstruction is certified by Manager.
b) Ground all non-compliant HEMM vehicles operated by Contractor Apex Infrastructure.
c) Submit compliance within 7 (seven) days of receipt of this notice, failing which action under Section 22(3) of Mines Act 1952 will be initiated.

(R. C. Meena)
Deputy Director of Mines Safety, Singrauli Region
""",
    "cto_kusmunda": """
CHHATTISGARH ENVIRONMENT CONSERVATION BOARD (CECB)
Regional Office: Korba, Chhattisgarh

Consent Order No: 8421/RO/CECB/CTO/2025                       Date: 12-11-2025

CONSENT TO OPERATE (CTO) UNDER SECTION 25/26 OF WATER ACT 1974 AND SECTION 21 OF AIR ACT 1981

Consent is hereby granted to M/s South Eastern Coalfields Limited (Kusmunda OCM) for mining of coal up to 62.5 MTPA validity until 31st December 2026 subject to:
1. Effective mist spraying at coal handling plants (CHP) and rail dispatch silos.
2. Effluent treatment plant (ETP) discharge shall strictly maintain TSS < 100 mg/L and Oil & Grease < 10 mg/L.
3. Mandatory online data relay to Central Environment Server.
"""
}

def analyze_statutory_document(text_content: str, document_title: str = "Uploaded Statutory Order") -> Dict[str, Any]:
    """Parse text and extract compliance entities, limits, regulations, and risk flags."""
    text_upper = text_content.upper()

    # Identify Issuing Authority
    authority = "Unknown Regulatory Body"
    if "MINISTRY OF ENVIRONMENT" in text_upper or "MOEFCC" in text_upper:
        authority = "MoEFCC (Ministry of Environment, Forest & Climate Change)"
    elif "DIRECTORATE GENERAL OF MINES SAFETY" in text_upper or "DGMS" in text_upper:
        authority = "DGMS (Directorate General of Mines Safety)"
    elif "ENVIRONMENT CONSERVATION BOARD" in text_upper or "POLLUTION CONTROL" in text_upper or "CPCB" in text_upper:
        authority = "State Pollution Control Board / CPCB"

    # Extract Mine Reference
    mine_match = "Unassigned Mine"
    for m in ["Gevra", "Kusmunda", "Dipka", "Jayant", "Nigahi", "Dudhichua", "Makardhokra", "Bhatadi", "Basundhara", "Lakhanpur", "Kulda", "Sonepur"]:
        if m.upper() in text_upper:
            mine_match = m
            break

    # Extract Production / Capacity Cap
    # Priority search for phrases like "70.0 MTPA" or "to 70 MTPA" or "CAPACITY SHALL STRICTLY NOT EXCEED 70.0 MTPA"
    cap_match = re.search(r"(?:NOT EXCEED|EXPANSION.*?TO|MINING OF COAL UP TO|CAPACITY OF)\s*([0-9]+(?:\.[0-9]+)?)\s*(MTPA|MILLION TONNES|MTE)", text_content, re.IGNORECASE)
    if not cap_match:
        cap_match = re.search(r"(\d+(\.\d+)?)\s*(MTPA|MILLION TONNES|MTE)", text_content, re.IGNORECASE)
    
    capacity_cap = f"{cap_match.group(1)} MTPA" if cap_match else "Not specified"


    # Extract Statutory Regulations
    regulations_found = []
    if "CMR" in text_upper or "COAL MINES REGULATIONS" in text_upper:
        regs = re.findall(r"REGULATION\s+\d+", text_content, re.IGNORECASE)
        regulations_found.extend(list(set(regs)))
        if not regulations_found:
            regulations_found.append("Coal Mines Regulations 2017")
    if "MINES ACT" in text_upper:
        regulations_found.append("Mines Act 1952 (Section 22)")
    if "AIR ACT" in text_upper or "WATER ACT" in text_upper:
        regulations_found.append("Air Act 1981 / Water Act 1974")

    # Extract Mandated Deadlines & Clauses
    clauses = []
    lines = text_content.split("\n")
    for line in lines:
        cleaned = line.strip()
        if re.match(r"^(\d+\.|\w\)|•|-)\s+", cleaned) and len(cleaned) > 25:
            clauses.append(cleaned)

    # Compliance Risk Evaluation
    is_show_cause = "SHOW-CAUSE" in text_upper or "CONTRAVENTION" in text_upper or "STOP HAULAGE" in text_upper
    risk_level = "CRITICAL / ENFORCEMENT" if is_show_cause else ("COMPLIANCE_MANDATE" if "ENVIRONMENTAL CLEARANCE" in text_upper else "ROUTINE_PERMIT")

    return {
        "document_title": document_title,
        "issuing_authority": authority,
        "matched_mine": mine_match,
        "statutory_capacity_cap": capacity_cap,
        "regulations_invoked": regulations_found if regulations_found else ["General Environmental / Mining Standards"],
        "total_clauses_extracted": len(clauses),
        "key_statutory_clauses": clauses[:6],
        "document_risk_category": risk_level,
        "requires_immediate_field_action": is_show_cause,
        "ai_summary": f"Document processed by OCR engine. Identified {authority} statutory mandate applicable to {mine_match}. Contains {len(clauses)} compliance stipulations requiring verifiable digital audit evidence."
    }
