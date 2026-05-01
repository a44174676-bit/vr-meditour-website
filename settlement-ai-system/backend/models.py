from sqlalchemy import Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    nationality = Column(String, nullable=False)
    language = Column(String, nullable=False)
    visa_type = Column(String, default="N/A")
    entry_date = Column(Date, nullable=False)
    region = Column(String, nullable=False)
    korean_level = Column(String, nullable=False)
    stay_purpose = Column(String, nullable=False)
    medical_tourism = Column(Boolean, default=False)
    international_marriage = Column(Boolean, default=False)
    housing_status = Column(String, nullable=False)
    community_status = Column(String, nullable=False)
    privacy_consent = Column(Boolean, default=False)
    counseling_note = Column(Text, default="")
    schedule_miss_count = Column(Integer, default=0)
    doc_risk_count = Column(Integer, default=0)
    mentor_connected = Column(Boolean, default=False)
    handoff_status = Column(String, default="정상")
    current_stage = Column(String, default="입국 전 단계")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    deadline = Column(Date, nullable=False)
    priority = Column(String, default="보통")
    required_language_level = Column(String, default="초급")
    support_level = Column(String, default="단독 수행 가능")
    verification_method = Column(String, default="사용자 확인")
    status = Column(String, default="생성됨")
    risk_weight = Column(Float, default=1.0)

    user = relationship("User", back_populates="tasks")
