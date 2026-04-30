"""
FastAPI 백엔드 진입점입니다.
초보자도 이해하기 쉽도록 최소한의 구조로 작성했습니다.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from analysis_engine import calculate_scores, evaluate_grade
from recommendation_engine import generate_recommendations


# FastAPI 앱 생성
app = FastAPI(
    title="AI Skin & Body Balance Analyzer API",
    description="beauty wellness reference report를 위한 간단한 분석 API",
    version="1.0.0",
)

# 프론트엔드(다른 주소)에서 API를 호출할 수 있도록 CORS 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # MVP 단계에서는 전체 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeInput(BaseModel):
    """사용자 입력 모델(0~100 범위)"""

    moisture: float = Field(50, ge=0, le=100)
    redness: float = Field(50, ge=0, le=100)
    oiliness: float = Field(50, ge=0, le=100)
    texture: float = Field(50, ge=0, le=100)

    body_water: float = Field(50, ge=0, le=100)
    muscle_level: float = Field(50, ge=0, le=100)
    body_fat_rate: float = Field(50, ge=0, le=100)
    stress_level: float = Field(50, ge=0, le=100)
    sleep_quality: float = Field(50, ge=0, le=100)


@app.get("/")
def health_check():
    """서버 동작 확인용 엔드포인트"""
    return {
        "message": "AI Skin & Body Balance Analyzer API is running.",
        "notice": "본 결과는 의료 진단이 아니며, 참고용입니다.",
    }


@app.post("/analyze")
def analyze(payload: AnalyzeInput):
    """
    입력값을 받아 점수 계산 + 추천 생성 후 JSON으로 반환합니다.
    """

    # 1) 점수 계산
    skin_score, body_score, health_derma_score, score_details = calculate_scores(payload.dict())

    # 2) 쉬운 등급 문구(좋음/관리 필요/주의 필요)
    skin_grade = evaluate_grade(skin_score)
    body_grade = evaluate_grade(body_score)
    total_grade = evaluate_grade(health_derma_score)

    # 3) 추천 생성
    product_recommendations, wellness_recommendations = generate_recommendations(payload.dict())

    # 4) 최종 결과 반환
    return {
        "skin_score": skin_score,
        "skin_grade": skin_grade,
        "body_score": body_score,
        "body_grade": body_grade,
        "health_derma_score": health_derma_score,
        "total_grade": total_grade,
        "score_details": score_details,
        "product_recommendations": product_recommendations,
        "wellness_recommendations": wellness_recommendations,
        "disclaimer": "본 결과는 의료 진단이 아니며, 참고용입니다.",
        "report_type": "beauty wellness reference report",
    }
