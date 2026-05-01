"""
입력값 기반 추천 로직 파일입니다.
뷰티/웰니스 참고용 추천만 제공하며, 의료 목적이 아닙니다.
"""


def generate_recommendations(data: dict):
    """입력값 기준으로 화장품/웰니스 추천 목록 생성"""

    product_recommendations = []
    wellness_recommendations = []

    # 피부 수분 부족
    if data["moisture"] < 45:
        product_recommendations.extend(["보습 크림", "히알루론산 세럼"])

    # 홍반 높음
    if data["redness"] > 60:
        product_recommendations.extend(["저자극 진정 크림", "시카 케어 제품"])

    # 유분 높음
    if data["oiliness"] > 60:
        product_recommendations.extend(["유분 조절 세럼", "가벼운 수분 젤"])

    # 체수분 낮음
    if data["body_water"] < 45:
        wellness_recommendations.extend(["수분 보충 안내", "저당 수분 음료"])

    # 스트레스 높음
    if data["stress_level"] > 60:
        wellness_recommendations.extend(["릴랙스 티", "휴식 루틴 안내"])

    # 수면 상태 낮음
    if data["sleep_quality"] < 45:
        wellness_recommendations.append("수면 전 릴랙스 루틴 안내")

    # 아무 조건도 없을 때 기본 메시지
    if not product_recommendations:
        product_recommendations.append("현재 밸런스 유지용 기본 보습/진정 루틴")

    if not wellness_recommendations:
        wellness_recommendations.append("현재 생활 리듬 유지 + 가벼운 수분/수면 관리")

    # 중복 제거(순서 유지)
    product_recommendations = list(dict.fromkeys(product_recommendations))
    wellness_recommendations = list(dict.fromkeys(wellness_recommendations))

    return product_recommendations, wellness_recommendations
