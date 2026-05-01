"""
분석 점수 계산 로직 파일입니다.
점수 계산 규칙을 함수로 분리해 유지보수하기 쉽게 구성했습니다.
"""


def _clamp_score(score: float) -> float:
    """점수가 0~100 범위를 벗어나지 않도록 제한"""
    return max(0.0, min(100.0, round(score, 2)))


def evaluate_grade(score: float) -> str:
    """
    숫자 점수를 쉬운 문구로 변환
    - 80 이상: 좋음
    - 50 이상 80 미만: 관리 필요
    - 50 미만: 주의 필요
    """
    if score >= 80:
        return "좋음"
    if score >= 50:
        return "관리 필요"
    return "주의 필요"


def calculate_scores(data: dict):
    """
    피부 점수, 체성분 점수, 통합 점수를 계산합니다.

    통합 공식:
    Health-Derma Score = 피부 점수 60% + 체성분 점수 40%
    """

    # -----------------------
    # 1) 피부 점수 계산
    # -----------------------
    skin_score = 100.0

    # 수분 부족(moisture가 낮을수록 감점)
    skin_score -= (100 - data["moisture"]) * 0.25
    # 홍반(redness가 높을수록 감점)
    skin_score -= data["redness"] * 0.20
    # 유분(oiliness가 높을수록 감점)
    skin_score -= data["oiliness"] * 0.15
    # 피부결 거칠기(texture가 높을수록 감점)
    skin_score -= data["texture"] * 0.20

    skin_score = _clamp_score(skin_score)

    # -----------------------
    # 2) 체성분 점수 계산
    # -----------------------
    body_score = 100.0

    # 체수분이 낮을수록 감점
    body_score -= (100 - data["body_water"]) * 0.20
    # 근육 상태가 낮을수록 감점
    body_score -= (100 - data["muscle_level"]) * 0.20
    # 체지방률이 높을수록 감점
    body_score -= data["body_fat_rate"] * 0.20
    # 스트레스가 높을수록 감점
    body_score -= data["stress_level"] * 0.20
    # 수면 상태가 낮을수록 감점
    body_score -= (100 - data["sleep_quality"]) * 0.20

    body_score = _clamp_score(body_score)

    # -----------------------
    # 3) 통합 점수 계산
    # -----------------------
    health_derma_score = _clamp_score(skin_score * 0.6 + body_score * 0.4)

    score_details = {
        "skin_formula": "100 - (100-moisture)*0.25 - redness*0.20 - oiliness*0.15 - texture*0.20",
        "body_formula": "100 - (100-body_water)*0.20 - (100-muscle_level)*0.20 - body_fat_rate*0.20 - stress_level*0.20 - (100-sleep_quality)*0.20",
        "total_formula": "skin_score*0.6 + body_score*0.4",
    }

    return skin_score, body_score, health_derma_score, score_details
