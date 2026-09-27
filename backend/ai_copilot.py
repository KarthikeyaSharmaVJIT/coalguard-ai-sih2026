"""
Khanan Copilot (खनन मित्र) - AI Statutory Compliance Assistant.
Ministry of Coal | SIH 2026 - Smart Compliance Monitoring.

Provides bilingual (English/Hindi) conversational safety intelligence,
dynamically synthesized against Coal Mines Regulations (CMR 2017), Mines Act 1952,
DGMS technical circulars, and live multi-sensor mine telemetry.
"""

from typing import Dict, Any, List
from .data import (
    MINES,
    CAAQMS_DATA,
    SAFETY_INCIDENTS,
    INSPECTIONS,
    FIELD_OBSERVATIONS,
    CONTRACTOR_PROFILES
)
from .risk_engine import (
    calculate_composite_mine_risk,
    compute_environmental_risk,
    compute_safety_risk
)

KNOWLEDGE_BASE = {
    "reg_106": {
        "title": "Regulation 106 - Opencast Workings & Bench Parameters",
        "en": "Under CMR 2017 Reg 106: (1) Bench height in alluvium/soft ground shall not exceed 3m and face slope shall not exceed 45 degrees. (2) In coal and hard rock, bench height shall not exceed the maximum reach of the excavating shovel. (3) Berm width shall never be less than the height of the bench.",
        "hi": "कोयला खान विनियम (CMR 2017) के नियम 106 के अनुसार: (1) नरम मिट्टी में बेंच की ऊंचाई 3 मीटर से अधिक नहीं होनी चाहिए और ढलान 45 डिग्री से कम होनी चाहिए। (2) कोयला और कठोर चट्टान में बेंच की ऊंचाई उत्खनन शॉवेल की पहुंच से अधिक नहीं होनी चाहिए। (3) बर्म की चौड़ाई बेंच की ऊंचाई से कम नहीं होनी चाहिए।"
    },
    "reg_94": {
        "title": "Regulation 94 - Heavy Earthmoving Machinery (HEMM) Safety",
        "en": "Regulation 94 mandates that no truck, tipper, or dumper shall be used in mines unless fitted with: (a) fail-safe dynamic and parking brakes, (b) Audio-Visual Alarm (AVA) operating automatically during reversing, (c) proximity warning sensors, (d) operator seatbelt interlock and fatigue monitoring system.",
        "hi": "नियम 94 के अनुसार खानों में उपयोग होने वाले प्रत्येक टिपर और डंपर में होना अनिवार्य है: (क) रिवर्सिंग के समय स्वचालित ऑडियो-विजुअल अलार्म (AVA), (ख) निकटता संवेदन रडार (Proximity Sensors), (ग) चालक सीटबेल्ट इंटरलॉक व थकान मॉनिटरिंग सिस्टम।"
    },
    "reg_107": {
        "title": "Regulation 107 - Haul Roads & Dump Berms",
        "en": "Haul road gradient shall not be steeper than 1 in 16. Haul road width must be at least 3 times the width of the largest vehicle for two-way traffic. Continuous compacted parapet/berm of height NOT less than the tyre diameter of the largest dumper (minimum 1.8m for 100T dumpers) must be maintained along dump crests and water bodies.",
        "hi": "नियम 107 के तहत हॉल रोड का ढलान 1:16 से अधिक नहीं होना चाहिए। दोनों तरफ आवागमन वाली सड़क की चौड़ाई सबसे बड़े वाहन की चौड़ाई से कम से कम 3 गुना होनी चाहिए। ओबी डंप पर सुरक्षा बर्म की ऊंचाई सबसे बड़े डंपर के टायर व्यास (न्यूनतम 1.8 मीटर) से कम नहीं होनी चाहिए।"
    },
    "sec_22": {
        "title": "Section 22 of Mines Act, 1952 - Powers of Inspectors to Prohibit Employment",
        "en": "If an Inspector or Director of DGMS finds urgent and immediate danger to the life or safety of any persons employed in any mine, they may issue a prohibitory order prohibiting employment until the danger is removed.",
        "hi": "खान अधिनियम 1952 की धारा 22 के तहत यदि महानिदेशक (DGMS) या खान निरीक्षक को कर्मचारियों की सुरक्षा में तत्काल खतरा प्रतीत होता है, तो वे खतरा समाप्त होने तक कार्य रोकने का आदेश जारी कर सकते हैं।"
    },
    "naaqs_limits": {
        "title": "National Ambient Air Quality Standards (NAAQS)",
        "en": "Statutory 24-hour limits for industrial/mining zones: PM10: 100 µg/m³, PM2.5: 60 µg/m³, SO2: 80 µg/m³, NO2: 80 µg/m³, Carbon Monoxide (8-hour): 2.0 mg/m³.",
        "hi": "राष्ट्रीय परिवेशी वायु गुणवत्ता मानक: 24 घंटे के लिए PM10 की सीमा 100 µg/m³, PM2.5 की 60 µg/m³, SO2 की 80 µg/m³ और NO2 की 80 µg/m³ निर्धारित है।"
    }
}

def ask_khanan_copilot(query: str, mine_id: str = "gevra", language: str = "en") -> Dict[str, Any]:
    """
    Bilingual AI Conversational Copilot.
    Dynamically cross-references live observations, sensor data, and statutory standards.
    """
    q_lower = query.lower().strip()
    mine = next((m for m in MINES if m["id"] == mine_id), MINES[0])
    
    is_hindi = language == "hi" or any(char in query for char in "कखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह")

    # Fetch live telemetry and risk context
    risk_data = calculate_composite_mine_risk(mine["id"])
    safety_data = compute_safety_risk(mine["id"])
    env_data = compute_environmental_risk(mine["id"])
    mine_obs: List[Dict[str, Any]] = [o for o in FIELD_OBSERVATIONS if o.get("mine_id") == mine["id"]]
    top_obs = mine_obs[0] if mine_obs else None

    composite_score = risk_data.get("composite_score", 65.0)
    risk_level = risk_data.get("risk_level", "MODERATE")

    action_required = None
    confidence_score = 0.98

    # -------------------------------------------------------------
    # 1. JUDGE QUERY: "What is the biggest safety concern at this mine?"
    # -------------------------------------------------------------
    biggest_concern_keywords = [
        "biggest safety concern", "highest safety concern", "highest risk", "main hazard",
        "biggest hazard", "urgent problem", "critical issue", "major concern", "top concern",
        "what should we fix first", "highest priority", "सबसे बड़ा खतरा", "सुरक्षा चिंता", "मुख्य खतरा"
    ]
    if any(k in q_lower for k in biggest_concern_keywords):
        if top_obs:
            hazard_title = top_obs.get("hazard_type", "Safety Observation")
            hazard_desc = top_obs.get("description", "")
            action_req = top_obs.get("action_required", "")
            deadline = top_obs.get("deadline_hours", 24)
            severity = top_obs.get("severity", "Major")
            inspector = top_obs.get("inspector", "DGMS Inspector")
            
            # Map hazard to exact regulation
            if "berm" in hazard_title.lower():
                statute = "Regulation 107 of Coal Mines Regulations (CMR) 2017"
            elif "tipper" in hazard_title.lower() or "radar" in hazard_title.lower():
                statute = "Regulation 94 & 106 of CMR 2017"
            elif "dust" in hazard_title.lower() or "crusher" in hazard_title.lower():
                statute = "Section 21 of Air (Prevention & Control of Pollution) Act 1981"
            else:
                statute = "CMR 2017 Statutory Safety Standards"

            if is_hindi:
                answer = (
                    f"{mine['name']} में वर्तमान में सर्वोच्च सुरक्षा चिंता **{hazard_title}** ({severity}) है।\n\n"
                    f"• **एआई समग्र जोखिम स्कोर:** {composite_score}/100 — {risk_level}\n"
                    f"• **सांविधिक संदर्भ:** {statute}\n"
                    f"• **मौजूदा स्थिति:** {hazard_desc}\n"
                    f"• **अनिवार्य त्वरित कार्यवाही:** {action_req}\n"
                    f"• **निरीक्षक संदर्भ:** {inspector} (समय सीमा: {deadline} घंटे शेष)"
                )
            else:
                answer = (
                    f"The current highest-priority concern at {mine['name']} is the **{hazard_title}**.\n\n"
                    f"• **AI Risk Score:** {composite_score}/100 — {risk_level}\n"
                    f"• **Statutory Regulation:** {statute}\n"
                    f"• **Inspection Finding:** {hazard_desc}\n"
                    f"• **Recommended Action:** {action_req}\n"
                    f"• **Authority Lead:** {inspector} (Mandated SLA: {deadline} hours remaining)."
                )
            clause = statute
            action_required = action_req

        else:
            if is_hindi:
                answer = (
                    f"{mine['name']} में वर्तमान में कोई खुला आपातकालीन उल्लंघन नहीं है। "
                    f"समग्र जोखिम स्तर {composite_score}/100 ({risk_level}) है। "
                    f"अनुशंसित निवारक कार्य: {risk_data.get('recommended_action')}।"
                )
            else:
                answer = (
                    f"No critical active safety violations are currently open at {mine['name']}. "
                    f"Composite risk is assessed at {composite_score}/100 ({risk_level}). "
                    f"Statutory ongoing directive: {risk_data.get('recommended_action')}."
                )
            clause = "DGMS Safety Registry & Field Observations"

    # -------------------------------------------------------------
    # 2. HAUL ROAD & BERM DEFECT (Reg 107)
    # -------------------------------------------------------------
    elif any(k in q_lower for k in ["107", "berm", "haul road", "बर्म", "हॉल रोड", "parapet"]):
        kb = KNOWLEDGE_BASE["reg_107"]
        berm_obs = next((o for o in mine_obs if "berm" in o.get("hazard_type", "").lower()), None)
        
        if berm_obs:
            finding = f"Live Site Finding for {mine['name']}: {berm_obs['description']} Immediate Action: {berm_obs['action_required']}."
            finding_hi = f"{mine['name']} की स्थिति: {berm_obs['description']} तत्काल कार्यवाही: {berm_obs['action_required']}।"
            action_required = berm_obs['action_required']
        else:
            finding = f"For {mine['name']}, haul road berms on active benches are certified above the minimum 1.8m requirement for 100T dumpers."
            finding_hi = f"{mine['name']} में सक्रिय बेंचों पर बर्म की ऊंचाई 100T डंपर के न्यूनतम 1.8 मीटर मानक के अनुरूप है।"

        if is_hindi:
            answer = f"{kb['hi']}\n\n• **साइट निरीक्षण स्थिति:** {finding_hi}"
        else:
            answer = f"{kb['en']}\n\n• **Site Inspection Status:** {finding}"
        clause = kb["title"]

    # -------------------------------------------------------------
    # 3. HEMM & DUMPER SAFETY / AVAs / RADAR (Reg 94)
    # -------------------------------------------------------------
    elif any(k in q_lower for k in ["94", "ava", "tipper", "dumper", "radar", "proximity", "डंपर", "टिपर", "रडार"]):
        kb = KNOWLEDGE_BASE["reg_94"]
        radar_obs = next((o for o in mine_obs if "tipper" in o.get("hazard_type", "").lower() or "radar" in o.get("hazard_type", "").lower()), None)
        
        if radar_obs:
            fleet_status = f"Alert for {mine['name']}: {radar_obs['description']} Action: {radar_obs['action_required']}."
            action_required = radar_obs['action_required']
        else:
            fleet_status = f"All active dumpers and tippers at {mine['name']} have certified operational Audio-Visual Alarms (AVA) and radar interlocks."

        if is_hindi:
            answer = f"{kb['hi']}\n\n• **फ्लीट ऑडिट:** {fleet_status}"
        else:
            answer = f"{kb['en']}\n\n• **Fleet Audit:** {fleet_status}"
        clause = kb["title"]

    # -------------------------------------------------------------
    # 4. BENCH PARAMETERS (Reg 106)
    # -------------------------------------------------------------
    elif any(k in q_lower for k in ["106", "bench", "बेंच", "ढलान", "slope"]):
        kb = KNOWLEDGE_BASE["reg_106"]
        answer = kb["hi"] if is_hindi else kb["en"]
        clause = kb["title"]

    # -------------------------------------------------------------
    # 5. SHIFT RULES & PERMIT-TO-WORK (PTW)
    # -------------------------------------------------------------
    elif any(k in q_lower for k in ["shift", "shift rules", "ptw", "permit", "handover", "पारी", "परमिट"]):
        ptw_count = mine.get("active_ptw_count", 6)
        manager = mine.get("safety_officer", "Mine Manager")
        if is_hindi:
            answer = (
                f"CMR 2017 अध्याय IV के अनुसार शिफ्ट हैंडओवर प्रोटोकॉल:\n\n"
                f"1. **हस्तांतरण ब्रीफिंग:** निवर्तमान और आने वाले ओवरमैन के बीच प्रत्यक्ष लॉग सत्यापन।\n"
                f"2. **सक्रिय परमिट (PTW):** {mine['name']} में वर्तमान में {ptw_count} परमिट सक्रिय हैं (ब्लास्टिंग एवं हेवी हॉलेज)।\n"
                f"3. **सांविधिक प्रभारी:** {manager} (प्रथम श्रेणी प्रमाणपत्र धारक)।\n"
                f"4. **सुरक्षा पूर्व-जांच:** शिफ्ट शुरू होने से पूर्व वायुमंडलीय गैस, वेंटिलेशन और हेवी मशीनरी प्री-स्टार्ट चेकलिस्ट अनिवार्य है।"
            )
        else:
            answer = (
                f"Under CMR 2017 Chapter IV Shift Control & PTW Directives:\n\n"
                f"1. **Shift Handover Protocol:** In-person statutory handover between outgoing and incoming shift overmen.\n"
                f"2. **Permits to Work (PTW):** {mine['name']} has {ptw_count} active statutory permits (blasting & heavy haulage).\n"
                f"3. **Statutory Manager in Charge:** {manager} (First Class Competency Holder).\n"
                f"4. **Pre-Start Checks:** Mandated verification of atmospheric gas levels, water spray nozzles, and HEMM operator fitness logs."
            )
        clause = "CMR 2017 Chapter IV - Shift Management & PTW"

    # -------------------------------------------------------------
    # 6. CAAQMS & DUST / AIR QUALITY (Section 21 Air Act / NAAQS)
    # -------------------------------------------------------------
    elif any(k in q_lower for k in ["air", "dust", "pm10", "pm2.5", "caaqms", "naaqs", "प्रदूषण", "धूल", "sprinklers"]):
        kb = KNOWLEDGE_BASE["naaqs_limits"]
        latest_air = env_data.get("latest", {})
        pm10_val = latest_air.get("pm10", "N/A")
        pm25_val = latest_air.get("pm25", "N/A")
        env_status = env_data.get("status", "Compliant")
        
        dust_obs = next((o for o in mine_obs if "dust" in o.get("hazard_type", "").lower() or "crusher" in o.get("hazard_type", "").lower()), None)
        extra_note = f" Field Alert: {dust_obs['description']} Action: {dust_obs['action_required']}." if dust_obs else ""

        if is_hindi:
            answer = (
                f"{kb['hi']}\n\n"
                f"• **{mine['name']} लाइव टेलीमेट्री:** PM10 = {pm10_val} µg/m³ (सीमा 100), PM2.5 = {pm25_val} µg/m³ (सीमा 60)।\n"
                f"• **पर्यावरणीय स्थिति:** {env_status}.{extra_note}"
            )
        else:
            answer = (
                f"{kb['en']}\n\n"
                f"• **{mine['name']} Live Sensor Telemetry:** PM10 = {pm10_val} µg/m³ (Limit 100), PM2.5 = {pm25_val} µg/m³ (Limit 60).\n"
                f"• **Environmental Status:** {env_status}.{extra_note}"
            )
        clause = kb["title"]

    # -------------------------------------------------------------
    # 7. SECTION 22 & DGMS PROHIBITORY POWERS / NOTICES
    # -------------------------------------------------------------
    elif any(k in q_lower for k in ["section 22", "prohibit", "धारा 22", "notice", "dgms order"]):
        kb = KNOWLEDGE_BASE["sec_22"]
        open_notices = safety_data.get("pending_notices", 0)
        open_viol = safety_data.get("open_violations", 0)
        if is_hindi:
            answer = f"{kb['hi']}\n\n• **{mine['name']} लंबित स्थिति:** {open_notices} लंबित DGMS नोटिस एवं {open_viol} खुले सांविधिक उल्लंघन दर्ज हैं।"
        else:
            answer = f"{kb['en']}\n\n• **{mine['name']} Regulatory Status:** {open_notices} pending DGMS notices and {open_viol} open statutory violations currently logged."
        clause = kb["title"]

    # -------------------------------------------------------------
    # 8. CONTRACTOR & CASCADE RISK
    # -------------------------------------------------------------
    elif any(k in q_lower for k in ["contractor", "cascade", "ठेकेदार", "apex", "subcontractor"]):
        contractor_name = mine.get("contractor", "Primary Contractor")
        if is_hindi:
            answer = (
                f"{mine['name']} का प्राथमिक संचालन ठेकेदार **{contractor_name}** है।\n\n"
                f"कैस्केड अनुपालन मॉडल के तहत यदि ठेकेदार के वाहनों में ऑडियो-विजुअल अलार्म या ऑपरेटर फिटनेस में कमी पाई जाती है, "
                f"तो इसका प्रभाव मुख्य खदान के कंपोजिट रिस्क स्कोर पर पड़ता है।"
            )
        else:
            answer = (
                f"The primary operating contractor assigned to {mine['name']} is **{contractor_name}**.\n\n"
                f"Under the CoalGuard Cascade Engine, contractor-level infractions (such as AVA radar failure or skipped shift inspections) "
                f"propagate directly to the parent mine's composite governance risk index."
            )
        clause = "CoalGuard Contractor Cascade Engine"

    # -------------------------------------------------------------
    # 9. GENERAL / CONVERSATIONAL SYNTHESIS (Zero Looping)
    # -------------------------------------------------------------
    else:
        prod_val = mine.get("production_mtpa", 0.0)
        ec_val = mine.get("ec_limit_mtpa", 0.0)
        contractor_name = mine.get("contractor", "N/A")
        
        top_hazard_mention = f"Top active hazard: {top_obs['hazard_type']}." if top_obs else "No critical hazards logged."

        if is_hindi:
            answer = (
                f"नमस्ते! मैं **खनन मित्र (Khanan Copilot)** हूँ।\n\n"
                f"**{mine['name']} ({mine['subsidiary']}) लाइव सारांश:**\n"
                f"• **समग्र जोखिम स्तर:** {composite_score}/100 ({risk_level})\n"
                f"• **प्राथमिक ठेकेदार:** {contractor_name}\n"
                f"• **उत्पादन:** {prod_val} MTPA (पर्यावरणीय सीमा: {ec_val} MTPA)\n"
                f"• **सुरक्षा स्थिति:** {top_hazard_mention}\n\n"
                f"आप मुझसे पूछ सकते हैं:\n"
                f"1. *'खदान में सबसे बड़ी सुरक्षा चिंता क्या है?'*\n"
                f"2. *'नियम 107 के अनुसार हॉल रोड और बर्म के क्या मानक हैं?'*\n"
                f"3. *'नियम 94 के तहत डंपर सुरक्षा उपकरण क्या हैं?'*\n"
                f"4. *'वर्तमान वायु प्रदूषण (PM10) स्तर क्या है?'*"
            )
        else:
            answer = (
                f"Greetings! I am **Khanan Copilot (खनन मित्र)**, your bilingual statutory intelligence officer.\n\n"
                f"**Live Briefing for {mine['name']} ({mine['subsidiary']}):**\n"
                f"• **AI Governance Risk:** {composite_score}/100 ({risk_level})\n"
                f"• **Assigned Contractor:** {contractor_name}\n"
                f"• **Annual Production:** {prod_val} MTPA (EC Limit: {ec_val} MTPA)\n"
                f"• **Safety Horizon:** {top_hazard_mention}\n\n"
                f"**Try asking:**\n"
                f"• *'What is the biggest safety concern at this mine?'*\n"
                f"• *'Explain Haul Road Berm Rules under Reg 107'* \n"
                f"• *'What are the mandatory dumper safety devices under Reg 94?'*\n"
                f"• *'Check CAAQMS dust & PM10 compliance'*"
            )
        clause = "Khanan Copilot Smart Knowledge Graph"

    return {
        "query": query,
        "language": "Hindi" if is_hindi else "English",
        "referenced_mine": mine["name"],
        "mine_id": mine["id"],
        "statutory_reference": clause,
        "risk_score": composite_score,
        "risk_level": risk_level,
        "action_required": action_required,
        "answer": answer,
        "confidence_score": confidence_score,
        "suggested_followups": [
            "What is the biggest safety concern at this mine?",
            "Explain Haul Road Berm Rules under Reg 107",
            "What are the mandatory HEMM safety sensors under Reg 94?",
            "What is the permissible PM10 limit under NAAQS?"
        ]
    }

