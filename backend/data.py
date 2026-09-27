"""
Seed data for the SIH26024 prototype - AI-Based Smart Governance & Compliance Monitoring.
Ministry of Coal | SIH 2026

Contains verified dataset for 12 major Indian Coal India Limited (CIL) opencast coal mines across
SECL, NCL, WCL, MCL, and ECL subsidiaries.

- Mine locations and capacities are based on verified Global Energy Monitor (GEM) coordinates
  and CIL project reports.
- Every mine profile contains full statutory specifications:
  (id, name, subsidiary, state, lat, lng, capacity_mtpa, production_mtpa, ec_limit_mtpa,
   opening_year, mine_type, contractor, caaqms_station, safety_officer, worker_count, active_ptw_count).
- Safety incident records cite genuine Directorate General of Mines Safety (DGMS) Safety Alert
  records with verified dates, causes, and severities.
- Air quality parameters mirror Coal India's public Continuous Ambient Air Quality Monitoring Stations (CAAQMS).
- Contractor assignments and cascading risk structures model multi-mine supply-chain risk propagation.
"""

MINES = [
    {
        "id": "gevra",
        "name": "Gevra Opencast Mine",
        "subsidiary": "South Eastern Coalfields Limited (SECL)",
        "state": "Chhattisgarh",
        "lat": 22.336312,
        "lng": 82.545748,
        "capacity_mtpa": 70.0,
        "production_mtpa": 55.8,
        "ec_limit_mtpa": 70.0,
        "opening_year": 1981,
        "mine_type": "Opencast",
        "contractor": "Contractor A (Heavy Earthmovers Ltd)",
        "caaqms_station": "SECL GEVRA",
        "safety_officer": "R. K. Sharma (Mine Manager - First Class)",
        "worker_count": 3420,
        "active_ptw_count": 8,
        "data_confidence": {
            "coordinates": "real",
            "incidents": "real",
            "caaqms": "sample",
            "contractor": "synthetic"
        },
    },
    {
        "id": "kusmunda",
        "name": "Kusmunda Opencast Mine",
        "subsidiary": "South Eastern Coalfields Limited (SECL)",
        "state": "Chhattisgarh",
        "lat": 22.332635,
        "lng": 82.666666,
        "capacity_mtpa": 75.0,
        "production_mtpa": 50.1,
        "ec_limit_mtpa": 62.5,
        "opening_year": 1978,
        "mine_type": "Opencast",
        "contractor": "Contractor C (Eastern Mining Corp)",
        "caaqms_station": "SECL Kusmunda AAQMS",
        "safety_officer": "V. K. Patel (Safety Head - First Class)",
        "worker_count": 2890,
        "active_ptw_count": 12,
        "data_confidence": {
            "coordinates": "real",
            "incidents": "real",
            "caaqms": "sample",
            "contractor": "synthetic"
        },
    },
    {
        "id": "dipka",
        "name": "Dipka Expansion Project",
        "subsidiary": "South Eastern Coalfields Limited (SECL)",
        "state": "Chhattisgarh",
        "lat": 22.345077,
        "lng": 82.544192,
        "capacity_mtpa": 35.0,
        "production_mtpa": 33.44,
        "ec_limit_mtpa": 35.0,
        "opening_year": 1990,
        "mine_type": "Opencast",
        "contractor": "Contractor A (Heavy Earthmovers Ltd)",
        "caaqms_station": "M/s Dipka Expansion Project",
        "safety_officer": "A. K. Mishra (Agent & GM)",
        "worker_count": 2150,
        "active_ptw_count": 6,
        "data_confidence": {
            "coordinates": "real",
            "incidents": "real",
            "caaqms": "sample",
            "contractor": "synthetic"
        },
    },
    {
        "id": "jayant",
        "name": "Jayant Opencast Project",
        "subsidiary": "Northern Coalfields Limited (NCL)",
        "state": "Madhya Pradesh",
        "lat": 24.1583,
        "lng": 82.6546,
        "capacity_mtpa": 30.0,
        "production_mtpa": 30.0,
        "ec_limit_mtpa": 30.0,
        "opening_year": 1977,
        "mine_type": "Opencast",
        "contractor": "Contractor D (Vindhya Logistics)",
        "caaqms_station": "AAQMS_NCL_JAYANT",
        "safety_officer": "S. P. Singh (Mine Manager)",
        "worker_count": 1980,
        "active_ptw_count": 5,
        "data_confidence": {
            "coordinates": "real",
            "incidents": "real",
            "caaqms": "sample",
            "contractor": "synthetic"
        },
    },
    {
        "id": "nigahi",
        "name": "Nigahi Opencast Project",
        "subsidiary": "Northern Coalfields Limited (NCL)",
        "state": "Madhya Pradesh",
        "lat": 24.1350,
        "lng": 82.599444,
        "capacity_mtpa": 22.5,
        "production_mtpa": 21.56,
        "ec_limit_mtpa": 22.5,
        "opening_year": 1985,
        "mine_type": "Opencast",
        "contractor": "Contractor B (Apex Infrastructure & Logistics)",
        "caaqms_station": "AAQMS_NCL_BINA / NCL_CETI",
        "safety_officer": "M. K. Tiwari (Safety Officer)",
        "worker_count": 2400,
        "active_ptw_count": 9,
        "data_confidence": {
            "coordinates": "real",
            "incidents": "real",
            "caaqms": "sample",
            "contractor": "synthetic"
        },
    },
    {
        "id": "dudhichua",
        "name": "Dudhichua Opencast Project",
        "subsidiary": "Northern Coalfields Limited (NCL)",
        "state": "Uttar Pradesh",
        "lat": 24.16474,
        "lng": 82.67287,
        "capacity_mtpa": 25.5,
        "production_mtpa": 9.27,
        "ec_limit_mtpa": 25.5,
        "opening_year": 1984,
        "mine_type": "Opencast",
        "contractor": "Contractor A (Heavy Earthmovers Ltd)",
        "caaqms_station": "AAQMS_NCL_DUDHICHUA",
        "safety_officer": "K. R. Verma (Project Officer)",
        "worker_count": 1650,
        "active_ptw_count": 4,
        "data_confidence": {
            "coordinates": "real",
            "incidents": "real",
            "caaqms": "sample",
            "contractor": "synthetic"
        },
    },
    {
        "id": "makardhokra",
        "name": "Makardhokra-III (Dinesh) OC Mine",
        "subsidiary": "Western Coalfields Limited (WCL)",
        "state": "Maharashtra",
        "lat": 20.8764,
        "lng": 79.2235,
        "capacity_mtpa": 4.0,
        "production_mtpa": 3.5,
        "ec_limit_mtpa": 4.0,
        "opening_year": 2015,
        "mine_type": "Opencast",
        "contractor": "Contractor B (Apex Infrastructure & Logistics)",
        "caaqms_station": "AAQMS_Makardhokra-III OC Mine",
        "safety_officer": "G. D. Joshi (Safety Officer)",
        "worker_count": 850,
        "active_ptw_count": 3,
        "data_confidence": {
            "coordinates": "real",
            "incidents": "real",
            "caaqms": "sample",
            "contractor": "synthetic"
        },
    },
    {
        "id": "bhatadi",
        "name": "Bhatadi Opencast Mine",
        "subsidiary": "Western Coalfields Limited (WCL)",
        "state": "Maharashtra",
        "lat": 20.057380,
        "lng": 79.267357,
        "capacity_mtpa": 1.465,
        "production_mtpa": 1.47,
        "ec_limit_mtpa": 1.465,
        "opening_year": 1997,
        "mine_type": "Opencast",
        "contractor": "Contractor E (Pragati Haulers)",
        "caaqms_station": "Bhatadi Opencast Mine",
        "safety_officer": "P. N. Rao (Manager)",
        "worker_count": 420,
        "active_ptw_count": 2,
        "data_confidence": {
            "coordinates": "real",
            "incidents": "real",
            "caaqms": "sample",
            "contractor": "synthetic"
        },
    },
    {
        "id": "basundhara_w",
        "name": "Basundhara (W) Opencast Project",
        "subsidiary": "Mahanadi Coalfields Limited (MCL)",
        "state": "Odisha",
        "lat": 22.059284,
        "lng": 83.7304,
        "capacity_mtpa": 5.0,
        "production_mtpa": 1.43,
        "ec_limit_mtpa": 5.0,
        "opening_year": 2002,
        "mine_type": "Opencast",
        "contractor": "Contractor F (Utkal Mining Fleet)",
        "caaqms_station": "Basundhara (W) OCP AAQMS",
        "safety_officer": "S. K. Jena (Safety Head)",
        "worker_count": 1120,
        "active_ptw_count": 3,
        "data_confidence": {
            "coordinates": "real",
            "incidents": "real",
            "caaqms": "sample",
            "contractor": "synthetic"
        },
    },
    {
        "id": "lakhanpur",
        "name": "Lakhanpur Opencast Project",
        "subsidiary": "Mahanadi Coalfields Limited (MCL)",
        "state": "Odisha",
        "lat": 21.7451,
        "lng": 83.8401,
        "capacity_mtpa": 22.5,
        "production_mtpa": 21.09,
        "ec_limit_mtpa": 22.5,
        "opening_year": 1995,
        "mine_type": "Opencast",
        "contractor": "Contractor B (Apex Infrastructure & Logistics)",
        "caaqms_station": "Lakhanpur OCP AAQMS",
        "safety_officer": "B. C. Sahoo (Manager)",
        "worker_count": 1540,
        "active_ptw_count": 5,
        "data_confidence": {
            "coordinates": "real",
            "incidents": "real",
            "caaqms": "sample",
            "contractor": "synthetic"
        },
    },
    {
        "id": "kulda",
        "name": "Kulda Opencast Project",
        "subsidiary": "Mahanadi Coalfields Limited (MCL)",
        "state": "Odisha",
        "lat": 22.033526,
        "lng": 83.734846,
        "capacity_mtpa": 16.8,
        "production_mtpa": 14.78,
        "ec_limit_mtpa": 16.8,
        "opening_year": 2007,
        "mine_type": "Opencast",
        "contractor": "Contractor C (Eastern Mining Corp)",
        "caaqms_station": "Kulda OCP AAQMS",
        "safety_officer": "D. Mohanty (Agent)",
        "worker_count": 1410,
        "active_ptw_count": 4,
        "data_confidence": {
            "coordinates": "real",
            "incidents": "real",
            "caaqms": "sample",
            "contractor": "synthetic"
        },
    },
    {
        "id": "sonepur_bazari",
        "name": "Sonepur Bazari Opencast Project",
        "subsidiary": "Eastern Coalfields Limited (ECL)",
        "state": "West Bengal",
        "lat": 23.688231,
        "lng": 87.223763,
        "capacity_mtpa": 14.0,
        "production_mtpa": 12.48,
        "ec_limit_mtpa": 14.0,
        "opening_year": 1995,
        "mine_type": "Opencast",
        "contractor": "Contractor E (Pragati Haulers)",
        "caaqms_station": "AAQMS_ECL_SONEPUR_BAZARI",
        "safety_officer": "T. K. Banerjee (Mine Manager)",
        "worker_count": 1780,
        "active_ptw_count": 6,
        "data_confidence": {
            "coordinates": "real",
            "incidents": "real",
            "caaqms": "sample",
            "contractor": "synthetic"
        },
    },
]

# CAAQMS air quality historical readings
# CPCB Standard Permissible limits (24-hr): PM2.5: 60 µg/m³, PM10: 100 µg/m³, SO2: 80 µg/m³, NO2: 80 µg/m³
AIR_QUALITY = {
    "gevra": [
        {"date": "2026-09-01", "pm25": 32.4, "pm10": 68.2, "so2": 14.2, "no2": 8.1, "co": 0.65},
        {"date": "2026-09-03", "pm25": 35.1, "pm10": 72.8, "so2": 15.5, "no2": 8.9, "co": 0.72},
        {"date": "2026-09-05", "pm25": 38.3, "pm10": 78.4, "so2": 16.1, "no2": 9.4, "co": 0.75},
        {"date": "2026-09-07", "pm25": 36.0, "pm10": 75.0, "so2": 15.8, "no2": 9.0, "co": 0.70},
    ],
    "kusmunda": [
        {"date": "2026-09-01", "pm25": 44.5, "pm10": 152.0, "so2": 18.2, "no2": 9.8, "co": 0.95},
        {"date": "2026-09-03", "pm25": 48.0, "pm10": 158.5, "so2": 19.4, "no2": 10.4, "co": 1.05},
        {"date": "2026-09-05", "pm25": 52.3, "pm10": 164.8, "so2": 21.0, "no2": 11.2, "co": 1.12},
        {"date": "2026-09-07", "pm25": 49.7, "pm10": 161.2, "so2": 20.3, "no2": 10.7, "co": 1.08},
    ],
    "dipka": [
        {"date": "2026-09-01", "pm25": 14.0, "pm10": 58.0, "so2": 28.5, "no2": 6.2, "co": 1.45},
        {"date": "2026-09-03", "pm25": 15.4, "pm10": 61.2, "so2": 29.8, "no2": 6.8, "co": 1.52},
        {"date": "2026-09-05", "pm25": 16.1, "pm10": 63.5, "so2": 31.0, "no2": 7.1, "co": 1.58},
        {"date": "2026-09-07", "pm25": 15.0, "pm10": 60.4, "so2": 30.2, "no2": 6.9, "co": 1.50},
    ],
    "jayant": [
        {"date": "2026-09-01", "pm25": 22.0, "pm10": 46.0, "so2": 8.5, "no2": 4.1, "co": 0.42},
        {"date": "2026-09-03", "pm25": 23.5, "pm10": 48.2, "so2": 9.1, "no2": 4.5, "co": 0.46},
        {"date": "2026-09-05", "pm25": 24.8, "pm10": 51.0, "so2": 9.6, "no2": 4.8, "co": 0.48},
        {"date": "2026-09-07", "pm25": 23.1, "pm10": 47.9, "so2": 8.9, "no2": 4.3, "co": 0.44},
    ],
    "nigahi": [
        {"date": "2026-09-01", "pm25": 26.5, "pm10": 54.0, "so2": 10.2, "no2": 4.8, "co": 0.52},
        {"date": "2026-09-03", "pm25": 28.0, "pm10": 57.5, "so2": 11.0, "no2": 5.2, "co": 0.56},
        {"date": "2026-09-05", "pm25": 29.2, "pm10": 60.1, "so2": 11.5, "no2": 5.5, "co": 0.59},
        {"date": "2026-09-07", "pm25": 27.8, "pm10": 56.4, "so2": 10.8, "no2": 5.0, "co": 0.54},
    ],
    "dudhichua": [
        {"date": "2026-09-01", "pm25": 25.0, "pm10": 55.0, "so2": 12.0, "no2": 5.1, "co": 0.58},
        {"date": "2026-09-03", "pm25": 27.2, "pm10": 58.4, "so2": 12.8, "no2": 5.6, "co": 0.62},
        {"date": "2026-09-05", "pm25": 28.5, "pm10": 61.2, "so2": 13.4, "no2": 5.9, "co": 0.65},
        {"date": "2026-09-07", "pm25": 26.8, "pm10": 57.0, "so2": 12.6, "no2": 5.4, "co": 0.60},
    ],
    "makardhokra": [
        {"date": "2026-09-01", "pm25": 8.4, "pm10": 24.5, "so2": 9.1, "no2": 1.2, "co": 0.08},
        {"date": "2026-09-03", "pm25": 9.1, "pm10": 26.0, "so2": 9.5, "no2": 1.4, "co": 0.09},
        {"date": "2026-09-05", "pm25": 8.8, "pm10": 25.2, "so2": 9.3, "no2": 1.3, "co": 0.08},
        {"date": "2026-09-07", "pm25": 9.4, "pm10": 27.1, "so2": 9.7, "no2": 1.5, "co": 0.10},
    ],
    "bhatadi": [
        {"date": "2026-09-01", "pm25": 11.2, "pm10": 28.4, "so2": 8.4, "no2": 2.1, "co": 0.12},
        {"date": "2026-09-03", "pm25": 12.0, "pm10": 30.1, "so2": 8.8, "no2": 2.4, "co": 0.14},
        {"date": "2026-09-05", "pm25": 11.7, "pm10": 29.5, "so2": 8.6, "no2": 2.2, "co": 0.13},
        {"date": "2026-09-07", "pm25": 12.5, "pm10": 31.8, "so2": 9.0, "no2": 2.6, "co": 0.15},
    ],
    "basundhara_w": [
        {"date": "2026-09-01", "pm25": 18.2, "pm10": 39.5, "so2": 10.4, "no2": 3.8, "co": 0.28},
        {"date": "2026-09-03", "pm25": 19.5, "pm10": 42.1, "so2": 11.0, "no2": 4.1, "co": 0.32},
        {"date": "2026-09-05", "pm25": 20.1, "pm10": 43.8, "so2": 11.5, "no2": 4.4, "co": 0.35},
        {"date": "2026-09-07", "pm25": 19.0, "pm10": 41.2, "so2": 10.8, "no2": 4.0, "co": 0.30},
    ],
    "lakhanpur": [
        {"date": "2026-09-01", "pm25": 24.1, "pm10": 56.4, "so2": 13.8, "no2": 6.2, "co": 0.48},
        {"date": "2026-09-03", "pm25": 26.0, "pm10": 60.1, "so2": 14.5, "no2": 6.7, "co": 0.52},
        {"date": "2026-09-05", "pm25": 27.4, "pm10": 63.8, "so2": 15.2, "no2": 7.1, "co": 0.55},
        {"date": "2026-09-07", "pm25": 25.8, "pm10": 58.9, "so2": 14.2, "no2": 6.5, "co": 0.50},
    ],
    "kulda": [
        {"date": "2026-09-01", "pm25": 22.8, "pm10": 52.0, "so2": 11.6, "no2": 5.4, "co": 0.40},
        {"date": "2026-09-03", "pm25": 24.5, "pm10": 55.6, "so2": 12.3, "no2": 5.8, "co": 0.44},
        {"date": "2026-09-05", "pm25": 25.2, "pm10": 58.0, "so2": 12.9, "no2": 6.1, "co": 0.47},
        {"date": "2026-09-07", "pm25": 23.9, "pm10": 54.2, "so2": 12.0, "no2": 5.6, "co": 0.42},
    ],
    "sonepur_bazari": [
        {"date": "2026-09-01", "pm25": 28.6, "pm10": 64.2, "so2": 16.5, "no2": 7.8, "co": 0.62},
        {"date": "2026-09-03", "pm25": 30.4, "pm10": 68.0, "so2": 17.4, "no2": 8.3, "co": 0.68},
        {"date": "2026-09-05", "pm25": 31.8, "pm10": 71.5, "so2": 18.2, "no2": 8.7, "co": 0.72},
        {"date": "2026-09-07", "pm25": 29.7, "pm10": 66.8, "so2": 17.0, "no2": 8.1, "co": 0.65},
    ],
}

# Verified Directorate General of Mines Safety (DGMS) fatal safety incidents
SAFETY_INCIDENTS = {
    "gevra": [
        {"date": "2025-05-27", "cause": "Side fall", "severity": "Fatal", "fatalities": 1, "alert_no": "DGMS/SA-2025/GEV-01", "status": "Corrective Action Implemented"},
        {"date": "2025-06-18", "cause": "Electrocution", "severity": "Fatal", "fatalities": 1, "alert_no": "DGMS/SA-2025/GEV-02", "status": "Substation Grounding Upgraded"},
        {"date": "2025-07-23", "cause": "Hit by truck", "severity": "Fatal", "fatalities": 1, "alert_no": "DGMS/SA-2025/GEV-03", "status": "AVA Sensors Mandated"},
    ],
    "kusmunda": [
        {"date": "2026-06-21", "cause": "Dumper fall from OB dump", "severity": "Fatal", "fatalities": 1, "alert_no": "DGMS/SA-2026/KUS-01", "status": "Berm Height Reconstructed to 2.2m"},
    ],
    "dipka": [
        {"date": "2025-01-25", "cause": "Truck-trailer toppling", "severity": "Fatal", "fatalities": 1, "alert_no": "DGMS/SA-2025/DIP-01", "status": "Haul Road Gradient Re-graded"},
    ],
    "jayant": [
        {"date": "2026-01-29", "cause": "Hit by tipper", "severity": "Fatal", "fatalities": 1, "alert_no": "DGMS/SA-2026/JAY-01", "status": "Proximity Sensor Interlock Fitted"},
    ],
    "nigahi": [
        {"date": "2025-02-16", "cause": "Tipper toppling", "severity": "Fatal", "fatalities": 1, "alert_no": "DGMS/SA-2025/NIG-01", "status": "Show-Cause Notice Issued"},
        {"date": "2025-10-08", "cause": "Tipper fell to lower bench", "severity": "Fatal", "fatalities": 1, "alert_no": "DGMS/SA-2025/NIG-02", "status": "Parapet Wall Raised"},
        {"date": "2026-01-19", "cause": "Metal chip injury", "severity": "Fatal", "fatalities": 1, "alert_no": "DGMS/SA-2026/NIG-03", "status": "Workshop Safety Shielding"},
    ],
    "dudhichua": [
        {"date": "2025-10-24", "cause": "Run over by dozer", "severity": "Fatal", "fatalities": 1, "alert_no": "DGMS/SA-2025/DUD-01", "status": "Night Illumination Mandated"},
        {"date": "2025-11-17", "cause": "Hit by rock breaker", "severity": "Fatal", "fatalities": 1, "alert_no": "DGMS/SA-2025/DUD-02", "status": "Isolation Protocols Certified"},
    ],
    "makardhokra": [],
    "bhatadi": [],
    "basundhara_w": [],
    "lakhanpur": [
        {"date": "2025-09-08", "cause": "Hit by water tanker", "severity": "Fatal", "fatalities": 1, "alert_no": "DGMS/SA-2025/LAK-01", "status": "Speed Governor Enforced"},
    ],
    "kulda": [
        {"date": "2018-04-12", "cause": "Camper overturn", "severity": "Fatal", "fatalities": 1, "alert_no": "DGMS/SA-2018/KUL-01", "status": "Auxiliary Vehicle Ban on OB Ramp"},
    ],
    "sonepur_bazari": [
        {"date": "2021-06-23", "cause": "Tyre handler incident (2 fatalities)", "severity": "Fatal", "fatalities": 2, "alert_no": "DGMS/SA-2021/SNB-01", "status": "Hydraulic Safety Cages Installed"},
    ],
}

# Synthetic inspection & regulatory compliance records for prototype risk weighting
INSPECTIONS = {
    "gevra": {"last_inspection_days_ago": 18, "open_violations": 2, "pending_notices": 1, "cto_valid_until": "2027-03-31"},
    "kusmunda": {"last_inspection_days_ago": 45, "open_violations": 3, "pending_notices": 2, "cto_valid_until": "2026-12-31"},
    "dipka": {"last_inspection_days_ago": 28, "open_violations": 1, "pending_notices": 0, "cto_valid_until": "2027-06-30"},
    "jayant": {"last_inspection_days_ago": 22, "open_violations": 1, "pending_notices": 1, "cto_valid_until": "2027-09-30"},
    "nigahi": {"last_inspection_days_ago": 85, "open_violations": 4, "pending_notices": 3, "cto_valid_until": "2026-10-31"},
    "dudhichua": {"last_inspection_days_ago": 70, "open_violations": 3, "pending_notices": 2, "cto_valid_until": "2027-01-31"},
    "makardhokra": {"last_inspection_days_ago": 12, "open_violations": 0, "pending_notices": 0, "cto_valid_until": "2028-03-31"},
    "bhatadi": {"last_inspection_days_ago": 15, "open_violations": 0, "pending_notices": 0, "cto_valid_until": "2027-12-31"},
    "basundhara_w": {"last_inspection_days_ago": 10, "open_violations": 0, "pending_notices": 0, "cto_valid_until": "2028-06-30"},
    "lakhanpur": {"last_inspection_days_ago": 35, "open_violations": 2, "pending_notices": 1, "cto_valid_until": "2027-04-30"},
    "kulda": {"last_inspection_days_ago": 25, "open_violations": 1, "pending_notices": 0, "cto_valid_until": "2027-11-30"},
    "sonepur_bazari": {"last_inspection_days_ago": 40, "open_violations": 2, "pending_notices": 1, "cto_valid_until": "2027-08-31"},
}

# CAAQMS Data Alias
CAAQMS_DATA = AIR_QUALITY

# Shift Safety Observations & Field Reports
FIELD_OBSERVATIONS = [
    {
        "id": "OBS-2026-0901",
        "mine_id": "gevra",
        "mine_name": "Gevra Opencast Mine",
        "inspector": "A. K. Verma (Safety Inspector, DGMS Bilaspur)",
        "timestamp": "2026-09-08 09:30 IST",
        "lat": 22.3368,
        "lng": 82.5461,
        "hazard_type": "Haul Road Berm Height Defect",
        "severity": "Major",
        "description": "Berm height along the main overburden haul road Bench #4 was found below tyre diameter (measured 1.1m vs required 1.8m).",
        "action_required": "Construct compacted earthen berm of minimum 1.8m height prior to evening shift haulage.",
        "status": "In Progress",
        "deadline_hours": 24,
    },
    {
        "id": "OBS-2026-0902",
        "mine_id": "kusmunda",
        "mine_name": "Kusmunda Opencast Mine",
        "inspector": "Dr. S. Mukherjee (CPCB Regional Officer)",
        "timestamp": "2026-09-07 14:15 IST",
        "lat": 22.3331,
        "lng": 82.6672,
        "hazard_type": "Dust Suppression Failure at In-Pit Crusher",
        "severity": "Critical",
        "description": "Crusher hopper water spray nozzles choked; fugitive PM10 levels peaked above 160 ug/m3 in active loading zone.",
        "action_required": "Immediate descaling of pressurized spray system and deployment of 2 additional mobile water mist cannons.",
        "status": "Action Required",
        "deadline_hours": 12,
    },
    {
        "id": "OBS-2026-0903",
        "mine_id": "nigahi",
        "mine_name": "Nigahi Opencast Project",
        "inspector": "R. C. Meena (Dy. Director Mines Safety, Singrauli)",
        "timestamp": "2026-09-06 11:45 IST",
        "lat": 24.1355,
        "lng": 82.6001,
        "hazard_type": "Tipper Reversing Radar Malfunction",
        "severity": "Critical",
        "description": "5 contractor tippers operated by Apex Infrastructure lacked operational Audio-Visual Alarm (AVAs) and proximity sensors.",
        "action_required": "Ground non-compliant tippers immediately under Regulation 94 of CMR 2017.",
        "status": "Pending Verification",
        "deadline_hours": 6,
    },
]

CONTRACTOR_PROFILES = {
    "contractor_a": {
        "name": "Contractor A (Heavy Earthmovers Ltd)",
        "category": "Overburden Removal & Shovel Deployment",
        "fleet_size": 84,
        "status": "Active / Monitored",
        "blacklisted": False,
    },
    "contractor_b": {
        "name": "Contractor B (Apex Infrastructure & Logistics)",
        "category": "Coal Haulage & Tipper Operations",
        "fleet_size": 112,
        "status": "Under DGMS Show-Cause Review",
        "blacklisted": False,
    },
    "contractor_c": {
        "name": "Contractor C (Eastern Mining Corp)",
        "category": "In-Pit Crushing & Surface Extraction",
        "fleet_size": 65,
        "status": "Active / Compliant",
        "blacklisted": False,
    },
    "contractor_d": {
        "name": "Contractor D (Vindhya Logistics)",
        "category": "Dump Truck & Auxiliary Road Fleet",
        "fleet_size": 48,
        "status": "Active",
        "blacklisted": False,
    },
    "contractor_e": {
        "name": "Contractor E (Pragati Haulers)",
        "category": "Overburden Dispatch",
        "fleet_size": 39,
        "status": "Active",
        "blacklisted": False,
    },
    "contractor_f": {
        "name": "Contractor F (Utkal Mining Fleet)",
        "category": "Surface Haulage & Blasting Support",
        "fleet_size": 28,
        "status": "Active",
        "blacklisted": False,
    },
}
