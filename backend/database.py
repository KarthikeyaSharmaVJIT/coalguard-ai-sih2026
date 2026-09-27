from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
import os

db_path = os.path.join(os.path.dirname(__file__), "coalguard.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Mine(Base):
    __tablename__ = "mines"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    subsidiary = Column(String)
    state = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    capacity_mtpa = Column(Float)
    production_mtpa = Column(Float)
    ec_limit_mtpa = Column(Float)
    opening_year = Column(Integer)
    mine_type = Column(String)
    contractor = Column(String)
    caaqms_station = Column(String)
    safety_officer = Column(String)
    worker_count = Column(Integer)
    active_ptw_count = Column(Integer)
    data_confidence = Column(JSON)
    
    contractor_assignments = relationship("ContractorMineAssignment", back_populates="mine")
    air_quality_readings = relationship("AirQualityReading", back_populates="mine")
    safety_incidents = relationship("SafetyIncident", back_populates="mine")
    inspection = relationship("Inspection", back_populates="mine", uselist=False)
    field_observations = relationship("FieldObservation", back_populates="mine")

class Contractor(Base):
    __tablename__ = "contractors"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    category = Column(String)
    fleet_size = Column(Integer)
    status = Column(String)
    blacklisted = Column(Boolean)

    mine_assignments = relationship("ContractorMineAssignment", back_populates="contractor")

class ContractorMineAssignment(Base):
    __tablename__ = "contractor_mine_assignments"
    id = Column(Integer, primary_key=True, index=True)
    contractor_id = Column(String, ForeignKey("contractors.id"))
    mine_id = Column(String, ForeignKey("mines.id"))

    contractor = relationship("Contractor", back_populates="mine_assignments")
    mine = relationship("Mine", back_populates="contractor_assignments")

class AirQualityReading(Base):
    __tablename__ = "air_quality_readings"
    id = Column(Integer, primary_key=True, index=True)
    mine_id = Column(String, ForeignKey("mines.id"))
    date = Column(String)
    pm25 = Column(Float)
    pm10 = Column(Float)
    so2 = Column(Float)
    no2 = Column(Float)
    co = Column(Float)

    mine = relationship("Mine", back_populates="air_quality_readings")

class SafetyIncident(Base):
    __tablename__ = "safety_incidents"
    id = Column(Integer, primary_key=True, index=True)
    mine_id = Column(String, ForeignKey("mines.id"))
    date = Column(String)
    cause = Column(String)
    severity = Column(String)
    fatalities = Column(Integer)
    alert_no = Column(String)
    status = Column(String)

    mine = relationship("Mine", back_populates="safety_incidents")

class Inspection(Base):
    __tablename__ = "inspections"
    id = Column(Integer, primary_key=True, index=True)
    mine_id = Column(String, ForeignKey("mines.id"), unique=True)
    last_inspection_days_ago = Column(Integer)
    open_violations = Column(Integer)
    pending_notices = Column(Integer)
    cto_valid_until = Column(String)

    mine = relationship("Mine", back_populates="inspection")

class FieldObservation(Base):
    __tablename__ = "field_observations"
    id = Column(String, primary_key=True, index=True)
    mine_id = Column(String, ForeignKey("mines.id"))
    mine_name = Column(String)
    inspector = Column(String)
    timestamp = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    hazard_type = Column(String)
    severity = Column(String)
    description = Column(String)
    action_required = Column(String)
    status = Column(String)
    deadline_hours = Column(Integer)

    mine = relationship("Mine", back_populates="field_observations")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
