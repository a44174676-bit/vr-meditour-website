from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    nationality: str
    language: str
    visa_type: str
    entry_date: date
    region: str
    korean_level: str
    stay_purpose: str
    medical_tourism: bool = False
    international_marriage: bool = False
    housing_status: str
    community_status: str
    privacy_consent: bool
    counseling_note: str = ""


class UserOut(UserCreate):
    id: int
    handoff_status: str
    current_stage: str
    created_at: datetime

    class Config:
        from_attributes = True


class TaskOut(BaseModel):
    id: int
    user_id: int
    title: str
    category: str
    description: str
    deadline: date
    priority: str
    required_language_level: str
    support_level: str
    verification_method: str
    status: str
    risk_weight: float

    class Config:
        from_attributes = True


class TaskStatusUpdate(BaseModel):
    status: str


class PassportOut(BaseModel):
    user_name: str
    stay_purpose: str
    current_stage: str
    progress: float
    completed_tasks: int
    total_tasks: int
    pending_tasks: int
    delayed_tasks: int
    language_score: int
    community_status: str
    settlement_risk_score: int
    social_isolation_score: int
    handoff_status: str
    post_care_date: Optional[date]
    risk_level: str


class RiskOut(BaseModel):
    settlement_risk_score: int
    social_isolation_score: int
    risk_level: str
    handoff_status: str


class RoadmapResponse(BaseModel):
    stage: str
    generated_tasks: List[TaskOut]
    agent_logs: List[str]
