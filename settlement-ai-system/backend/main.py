import os
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Task, User
from schemas import PassportOut, RiskOut, RoadmapResponse, TaskOut, TaskStatusUpdate, UserCreate, UserOut
from services.agent_orchestrator import run_agent_orchestration
from services.handoff_service import should_handoff
from services.language_mapper import phrases_for_category
from services.passport_service import calculate_progress
from services.risk_engine import compute_risk
from services.task_generator import determine_stage, generate_tasks_for_user

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Integrated AI System for Foreign Resident Settlement Management")
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"])


@app.get("/")
def health_root():
    return {"status": "ok", "service": "settlement-ai-mvp"}


@app.get("/health")
def health():
    return {"status": "ok", "service": "settlement-ai-system", "version": "0.1.0"}


@app.post("/users", response_model=UserOut)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    user = User(**payload.model_dump())
    user.current_stage = determine_stage(user)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.get("/users", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@app.get("/users/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return user


@app.post("/users/{user_id}/generate-roadmap", response_model=RoadmapResponse)
def generate_roadmap(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    if user.tasks:
        for t in list(user.tasks):
            db.delete(t)
    user.current_stage = determine_stage(user)
    task_dicts = generate_tasks_for_user(user)
    for td in task_dicts:
        db.add(Task(user_id=user.id, **td))
    db.commit()
    db.refresh(user)
    settlement, isolation, _ = compute_risk(user, user.tasks)
    logs = run_agent_orchestration(user, max(settlement, isolation))
    return {"stage": user.current_stage, "generated_tasks": user.tasks, "agent_logs": logs}


@app.get("/users/{user_id}/tasks", response_model=list[TaskOut])
def list_tasks(user_id: int, db: Session = Depends(get_db)):
    return db.query(Task).filter(Task.user_id == user_id).all()


@app.patch("/tasks/{task_id}/status", response_model=TaskOut)
def update_task(task_id: int, payload: TaskStatusUpdate, db: Session = Depends(get_db)):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    task.status = payload.status
    db.commit()
    db.refresh(task)
    return task


@app.get("/users/{user_id}/passport", response_model=PassportOut)
def get_passport(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    settlement, isolation, risk_level = compute_risk(user, user.tasks)
    user.handoff_status = should_handoff(risk_level)
    db.commit()
    progress = calculate_progress(user.tasks)
    completed = sum(1 for t in user.tasks if t.status == "최종 완료")
    delayed = sum(1 for t in user.tasks if t.status == "지연")
    return {
        "user_name": user.name,
        "stay_purpose": user.stay_purpose,
        "current_stage": user.current_stage,
        "progress": progress,
        "completed_tasks": completed,
        "total_tasks": len(user.tasks),
        "pending_tasks": len(user.tasks) - completed,
        "delayed_tasks": delayed,
        "language_score": 55 if user.korean_level in ["없음", "초급"] else 80,
        "community_status": user.community_status,
        "settlement_risk_score": settlement,
        "social_isolation_score": isolation,
        "handoff_status": user.handoff_status,
        "post_care_date": None,
        "risk_level": risk_level,
    }


@app.post("/users/{user_id}/risk", response_model=RiskOut)
def recalc_risk(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    settlement, isolation, risk_level = compute_risk(user, user.tasks)
    user.handoff_status = should_handoff(risk_level)
    db.commit()
    return {"settlement_risk_score": settlement, "social_isolation_score": isolation, "risk_level": risk_level, "handoff_status": user.handoff_status}


@app.get("/handoffs")
def handoffs(db: Session = Depends(get_db)):
    return db.query(User).filter(User.handoff_status == "이관 필요").all()


@app.get("/dashboard/{role}")
def dashboard(role: str, db: Session = Depends(get_db)):
    role_alias = {"operator": "운영자", "medical": "의료관광 코디네이터", "settlement": "생활정착 담당자", "korean": "한국어 교육 담당자", "mentor": "공동체 멘토", "admin": "행정 담당자", "family": "가족 보기"}
    role = role_alias.get(role, role)
    users = db.query(User).all()
    data = []
    for u in users:
        tasks = [{"title": t.title, "category": t.category, "status": t.status} for t in u.tasks]
        if role == "의료관광 코디네이터":
            tasks = [t for t in tasks if t["category"] in ["의료", "사후관리"]]
        elif role == "생활정착 담당자":
            tasks = [t for t in tasks if t["category"] in ["주거", "통신", "금융", "행정"]]
        elif role == "한국어 교육 담당자":
            tasks = [t for t in tasks if t["category"] == "한국어"]
        elif role == "공동체 멘토":
            tasks = [t for t in tasks if t["category"] == "커뮤니티"]
        elif role == "행정 담당자":
            tasks = [t for t in tasks if t["category"] == "행정"]
        elif role == "가족 보기":
            tasks = []
        data.append({"user": u.name, "role": role, "entry_date": u.entry_date, "handoff_status": u.handoff_status, "community_status": u.community_status, "tasks": tasks, "phrases": phrases_for_category("의료") if role == "가족 보기" else []})
    return data
