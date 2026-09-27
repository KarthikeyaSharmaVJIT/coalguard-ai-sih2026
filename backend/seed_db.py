try:
    from .database import Base, engine, SessionLocal, Mine, Contractor, ContractorMineAssignment, AirQualityReading, SafetyIncident, Inspection, FieldObservation
    from .data import MINES, AIR_QUALITY, SAFETY_INCIDENTS, INSPECTIONS, FIELD_OBSERVATIONS, CONTRACTOR_PROFILES
except (ImportError, ValueError):
    from database import Base, engine, SessionLocal, Mine, Contractor, ContractorMineAssignment, AirQualityReading, SafetyIncident, Inspection, FieldObservation
    from data import MINES, AIR_QUALITY, SAFETY_INCIDENTS, INSPECTIONS, FIELD_OBSERVATIONS, CONTRACTOR_PROFILES

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing data (if any)
    db.query(FieldObservation).delete()
    db.query(Inspection).delete()
    db.query(SafetyIncident).delete()
    db.query(AirQualityReading).delete()
    db.query(ContractorMineAssignment).delete()
    db.query(Contractor).delete()
    db.query(Mine).delete()

    # Insert Mines
    for m in MINES:
        mine = Mine(
            id=m["id"],
            name=m["name"],
            subsidiary=m["subsidiary"],
            state=m["state"],
            lat=m["lat"],
            lng=m["lng"],
            capacity_mtpa=m["capacity_mtpa"],
            production_mtpa=m["production_mtpa"],
            ec_limit_mtpa=m["ec_limit_mtpa"],
            opening_year=m["opening_year"],
            mine_type=m["mine_type"],
            contractor=m["contractor"],
            caaqms_station=m["caaqms_station"],
            safety_officer=m["safety_officer"],
            worker_count=m["worker_count"],
            active_ptw_count=m["active_ptw_count"],
            data_confidence=m["data_confidence"]
        )
        db.add(mine)
    
    # Insert Contractors
    for c_id, c_data in CONTRACTOR_PROFILES.items():
        contractor = Contractor(
            id=c_id,
            name=c_data["name"],
            category=c_data["category"],
            fleet_size=c_data.get("fleet_size", 0),
            status=c_data["status"],
            blacklisted=c_data.get("blacklisted", False)
        )
        db.add(contractor)
        
        # Calculate assignments based on keywords from cascade_engine.py logic
        normalized_id = c_id.replace("_", " ").lower()
        custom_kw_map = {
            "contractor_a": ["earthmovers", "heavy earthmovers"],
            "contractor_b": ["apex", "apex infrastructure"],
            "contractor_c": ["eastern", "eastern mining"],
            "contractor_d": ["vindhya", "vindhya logistics"],
            "contractor_e": ["pragati", "pragati haulers"],
            "contractor_f": ["utkal", "utkal mining"],
        }
        keywords = custom_kw_map.get(c_id, [])
        
        for m in MINES:
            # Check if this contractor is assigned to this mine based on the exact same logic
            mine_contractor_str = m.get("contractor", "").lower()
            if normalized_id in mine_contractor_str or any(k in mine_contractor_str for k in keywords):
                assignment = ContractorMineAssignment(
                    contractor_id=c_id,
                    mine_id=m["id"]
                )
                db.add(assignment)

    # Insert Air Quality
    for mine_id, readings in AIR_QUALITY.items():
        for r in readings:
            reading = AirQualityReading(
                mine_id=mine_id,
                date=r["date"],
                pm25=r["pm25"],
                pm10=r["pm10"],
                so2=r["so2"],
                no2=r["no2"],
                co=r["co"]
            )
            db.add(reading)
    
    # Insert Safety Incidents
    for mine_id, incidents in SAFETY_INCIDENTS.items():
        for i in incidents:
            incident = SafetyIncident(
                mine_id=mine_id,
                date=i["date"],
                cause=i["cause"],
                severity=i["severity"],
                fatalities=i.get("fatalities", 1),
                alert_no=i.get("alert_no"),
                status=i.get("status")
            )
            db.add(incident)
            
    # Insert Inspections
    for mine_id, insp in INSPECTIONS.items():
        inspection = Inspection(
            mine_id=mine_id,
            last_inspection_days_ago=insp.get("last_inspection_days_ago", 30),
            open_violations=insp.get("open_violations", 0),
            pending_notices=insp.get("pending_notices", 0),
            cto_valid_until=insp.get("cto_valid_until")
        )
        db.add(inspection)
        
    # Insert Field Observations
    for obs in FIELD_OBSERVATIONS:
        observation = FieldObservation(
            id=obs["id"],
            mine_id=obs["mine_id"],
            mine_name=obs["mine_name"],
            inspector=obs["inspector"],
            timestamp=obs["timestamp"],
            lat=obs["lat"],
            lng=obs["lng"],
            hazard_type=obs["hazard_type"],
            severity=obs["severity"],
            description=obs["description"],
            action_required=obs["action_required"],
            status=obs["status"],
            deadline_hours=obs["deadline_hours"]
        )
        db.add(observation)

    db.commit()
    db.close()
    print("Database seeded successfully.")

if __name__ == "__main__":
    seed()
