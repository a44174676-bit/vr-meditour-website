import json
from datetime import date, timedelta
from pathlib import Path


TEMPLATE_PATH = Path(__file__).resolve().parent.parent / "data" / "settlement_templates.json"


def determine_stage(user):
    today = date.today()
    if user.entry_date > today:
        return "입국 전 단계"
    if user.medical_tourism:
        return "의료관리 단계"
    if user.community_status == "없음":
        return "공동체 연결 단계"
    if user.housing_status == "미정":
        return "초기 정착 단계"
    return "생활 안정화 단계"


def generate_tasks_for_user(user):
    templates = json.loads(TEMPLATE_PATH.read_text(encoding="utf-8"))
    selected = templates.get(user.stay_purpose, templates["장기체류"])
    tasks = []
    for i, (title, category, desc) in enumerate(selected):
        priority = "보통"
        if user.housing_status == "미정" and category == "주거":
            priority = "높음"
        if user.medical_tourism and category == "의료":
            priority = "높음"
        status = "학습 필요" if user.korean_level in ["없음", "초급"] and category == "한국어" else "생성됨"
        if user.community_status == "없음" and category == "커뮤니티":
            priority = "높음"
        tasks.append({
            "title": title,
            "category": category,
            "description": desc,
            "deadline": user.entry_date + timedelta(days=7 * (i + 1)),
            "priority": priority,
            "required_language_level": "초급",
            "support_level": "담당자 동행 필요" if priority == "높음" else "단독 수행 가능",
            "verification_method": "사용자 확인",
            "status": status,
            "risk_weight": 2.0 if priority in ["높음", "긴급"] else 1.0,
        })
    return tasks
