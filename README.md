# ⛏️ CoalGuard AI - Smart Governance & Statutory Compliance Platform
### **Ministry of Coal | Smart India Hackathon (SIH 2026)**
**Category:** Software | **Theme:** Smart Automation | **Problem ID:** SIH26024

---

## 🌟 Executive Summary
**CoalGuard AI** is a centralized, AI-enabled smart governance, statutory compliance monitoring, and regulatory authority dispatch platform designed specifically for the Indian coal mining ecosystem (Coal India Limited subsidiaries: **SECL, NCL, WCL, MCL, ECL**). 

---

## 🚀 Key Modules & Capabilities

### 1. 🌐 National 3D Spatial Command Grid (`/`)
- Centered, interactive 3D Globe (`react-globe.gl` + `Three.js`) visualizing 12 verified Coal India opencast mines.
- Real-time color-coded risk hotspots (🔴 Critical, 🟡 Elevated, 🟢 Stable).
- Live national telemetry HUD (Production vs EC Cap, active PTWs, workforce roster).

### 2. 🚨 Authority Reporting & Escalation Dispatch (`/authority-dispatch`) [NEW]
- Formal statutory violation notice lodgement directly to **DGMS**, **CPCB**, **Ministry Coal Vigilance**, **SPCB**, and **NDMA**.
- Severity SLAs (P1 - 6h Imminent Danger, P2 - 12h Major Non-Compliance, P3 - 24h Routine Audit).
- Automated digital escalation to Ministry Apex Secretary & DGMS Director General.
- Instant SHA-256 cryptographic audit ledger seal.

### 3. 🤖 खनन Copilot (Khanan Copilot) - Bilingual AI Assistant
- Conversational compliance copilot supporting **English and हिन्दी**.
- Knowledge base: **Coal Mines Regulations (CMR 2017)** (Reg 94, 106, 107), **Mines Act 1952 (Section 22)**, and **NAAQS Ambient Air Quality Standards**.

### 4. 📄 OCR & Statutory Document Digitizer
- Parses scanned Environmental Clearances (MoEFCC), DGMS Show-Cause orders, and State Pollution Control Board Consent-to-Operate (CTO) permits.
- Automatically extracts statutory production ceilings, emission thresholds, compliance deadlines, and risk classifications.

### 5. ⛏️ Mine Official Field Hub (`/mine-hub`)
- Site Safety Manager workbench with live Permit-to-Work (PTW) tracking, CAAQMS air quality telemetry, and CMR 2017 shift checklists.

### 6. 🏢 Corporate HQ & Subsidiary Matrix (`/corporate`)
- Multi-subsidiary analytics (SECL vs NCL vs WCL vs MCL vs ECL) with Recharts charts (Production vs EC Cap).

### 7. ⚖️ DGMS & CPCB Regulatory Audit Engine (`/regulatory`)
- Recurring contravention analytics, Section 22 prohibitory order management, and show-cause notice registry.

### 8. 📱 Field Mobile Inspection PWA Hub (`/field-app`)
- Geo-tagged (GPS Lat/Lng) and timestamped field hazard logging with offline caching and automatic blockchain sync.

### 9. 🚛 Contractor Supply Chain & Cascade Risk (`/contractors`)
- Maps multi-mine contractor dependency networks and simulates stop-work order ripple effects (quantifying grounded fleets & daily revenue loss in Crores).

### 10. ⛓️ Cryptographic SHA-256 Audit Ledger (`/ledger`)
- Tamper-proof, immutable audit block chain recording all statutory notices, inspections, PTWs, and filings.

---

## 📁 Clean Folder Structure

```
coal/
├── backend/
│   ├── data.py                  # 12 Verified CIL Mines & Telemetry Dataset
│   ├── risk_engine.py           # Multi-Signal AI Risk & Anomaly Scoring
│   ├── cascade_engine.py        # Contractor Cascade & Stop-Work Simulation
│   ├── authority_reporting.py   # Authority Dispatch & Escalation Engine [NEW]
│   ├── blockchain_ledger.py     # SHA-256 Cryptographic Audit Ledger
│   ├── ocr_digitizer.py         # Statutory Document OCR Parser (EC/CTO/DGMS)
│   ├── statutory_reports.py     # Form IV (Accident) & Form V (CPCB Statement)
│   ├── ai_copilot.py            # Bilingual Khanan Copilot (EN/HI)
│   ├── main.py                  # FastAPI REST Server
│   ├── test_suite.py            # Automated Validation Test Suite
│   └── requirements.txt         # Backend Python Dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Topbar.jsx               # Role Switcher & Modal Triggers
│   │   │   ├── NavigationTabs.jsx       # Global View Router Tabs
│   │   │   ├── GlobeVisualizer.jsx      # 3D Centered Spatial Globe
│   │   │   ├── KhananCopilotModal.jsx   # Bilingual AI Chat Assistant
│   │   │   ├── OCRDocumentModal.jsx     # Document Compliance Digitizer
│   │   │   └── StatutoryReportModal.jsx # DGMS Form IV & CPCB Form V Generator
│   │   ├── pages/
│   │   │   ├── OverviewDashboard.jsx    # National 3D Spatial Command Grid
│   │   │   ├── MineOfficialView.jsx     # Mine Safety Officer Hub
│   │   │   ├── AuthorityReportingView.jsx # Authority Dispatch & Escalation [NEW]
│   │   │   ├── CorporateExecutiveView.jsx # CIL Subsidiary Matrix (Recharts)
│   │   │   ├── RegulatoryAuditView.jsx  # DGMS / CPCB Audit & Directives
│   │   │   ├── FieldInspectionApp.jsx   # Mobile PWA Simulator (GPS Tagged)
│   │   │   ├── ContractorSupplyChain.jsx# Supply Chain Cascade Modeling
│   │   │   └── BlockchainAuditLedger.jsx# SHA-256 Immutable Block Explorer
│   │   ├── lib/
│   │   │   ├── api.js                   # Resilient API Client with Fallback
│   │   │   └── sampleData.js            # Offline Hydration Dataset
│   │   ├── App.jsx                      # App Router Root
│   │   ├── index.css                    # Sleek Mono Grain CSS Design System
│   │   └── main.jsx                     # React DOM Entry
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── start_all.bat                # 1-Click Launch (Backend + Frontend)
├── start_backend.bat            # Launch FastAPI Backend
└── start_frontend.bat           # Launch Vite Frontend
```

---

## ⚡ Quick Start Guide

### 1-Click Launch (Windows)
Double-click [**`start_all.bat`**](file:///c:/Users/monis/Downloads/coal-20260910T054515Z-1-001/coal/start_all.bat) in the project root.

- **Frontend Web Dashboard**: `http://localhost:5173`
- **FastAPI Backend**: `http://127.0.0.1:8000`
- **Interactive API Docs**: `http://127.0.0.1:8000/docs`
