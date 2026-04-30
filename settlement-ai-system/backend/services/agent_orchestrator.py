def run_agent_orchestration(user, risk_score: int):
    logs = []
    if user.medical_tourism:
        logs.append("의료관광 에이전트가 병원 일정 점검을 수행했습니다.")
    if user.korean_level in ["없음", "초급"]:
        logs.append("한국어교육 에이전트가 필수 표현 학습 과업을 배정했습니다.")
    if user.housing_status == "미정":
        logs.append("생활정착 에이전트가 주거 과업 우선순위를 상향했습니다.")
    if user.community_status == "없음":
        logs.append("공동체연결 에이전트가 커뮤니티 연결 과업을 생성했습니다.")
    if user.stay_purpose == "국제결혼":
        logs.append("국제결혼정착 에이전트가 가족관계 지원 과업을 생성했습니다.")
    logs.append("문서해석 에이전트가 행정 문서 설명 과업을 점검했습니다.")
    if risk_score >= 70:
        logs.append("위험감지 에이전트가 이관 필요 신호를 감지했습니다.")
    logs.append("사후관리 에이전트가 후속 점검 일정을 갱신했습니다.")
    return logs
