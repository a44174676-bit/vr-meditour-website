from datetime import date

RISK_KEYWORDS = ["불안", "외로움", "갈등", "아프다", "무섭다", "집이 없다", "돈이 없다", "계약을 이해하지 못했다", "병원에 못 갔다", "연락이 안 된다"]


def grade(score: int):
    if score >= 70:
        return "이관 필요"
    if score >= 40:
        return "주의"
    return "낮음"


def compute_risk(user, tasks):
    total = len(tasks) or 1
    incomplete = sum(1 for t in tasks if t.status not in ["최종 완료", "사후관리"])
    overdue = sum(1 for t in tasks if t.deadline < date.today() and t.status not in ["최종 완료", "사후관리"])
    handoff_tasks = sum(1 for t in tasks if t.status == "이관 필요")
    language_gap = 20 if user.korean_level in ["없음", "초급"] else 5

    settlement = min(100, int(incomplete / total * 35 + overdue * 8 + user.schedule_miss_count * 5 + user.doc_risk_count * 6 + language_gap + handoff_tasks * 7))

    kw_hits = sum(1 for k in RISK_KEYWORDS if k in (user.counseling_note or ""))
    isolation = min(100, int((20 if user.community_status == "없음" else 5) + 10 + kw_hits * 8 + (20 if user.housing_status == "미정" else 5) + (20 if not user.mentor_connected else 0)))
    risk_level = grade(max(settlement, isolation))

    reasons = []
    actions = []
    if overdue:
        reasons.append("지연 과업 존재")
        actions.append("생활정착 담당자 확인 필요")
    if user.housing_status == "미정":
        reasons.append("주거 상태 미정")
        actions.append("생활정착 담당자 확인 필요")
    if user.community_status == "없음":
        reasons.append("커뮤니티 미참여")
        actions.append("공동체 멘토 연결 필요")
    if user.korean_level in ["없음", "초급"]:
        reasons.append("한국어 수준 낮음")
        actions.append("한국어 교육 과업 우선 배정")
    if kw_hits:
        reasons.append("상담 메모에 위험 키워드 포함")
        actions.append("전화 또는 대면 확인 권장")
    if handoff_tasks:
        reasons.append("이관 필요 과업 존재")
        actions.append("운영자/담당자 즉시 검토 필요")
    if user.medical_tourism:
        actions.append("의료관광 코디네이터 확인 필요")

    return settlement, isolation, risk_level, sorted(set(reasons)), sorted(set(actions))
