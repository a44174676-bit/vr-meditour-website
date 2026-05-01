"""
FastAPI 백엔드 진입점입니다.
초보자도 이해하기 쉽도록 최소한의 구조로 작성했습니다.
"""

import os

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from analysis_engine import calculate_scores, evaluate_grade
from recommendation_engine import generate_recommendations
from image_analysis_engine import analyze_face_image


# FastAPI 앱 생성
app = FastAPI(
    title="AI Skin & Body Balance Analyzer API",
    description="beauty wellness reference report를 위한 간단한 분석 API",
    version="1.0.0",
)

# 프론트엔드(다른 주소)에서 API를 호출할 수 있도록 CORS 허용
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    # 기본값은 전체 허용(*), 배포 시 ALLOWED_ORIGINS 환경변수로 제한 가능
    allow_origins=allowed_origins if allowed_origins else ["*"],
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


# 수치 분석(1단계) API는 유지
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


# 이미지 분석(2단계) API는 유지
@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """얼굴 이미지 업로드/촬영 파일을 받아 기본 색상 분석 결과를 반환합니다."""
    if not file:
        raise HTTPException(status_code=400, detail="이미지 파일이 필요합니다.")

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="이미지 파일만 업로드할 수 있습니다.")

    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="빈 파일은 분석할 수 없습니다.")

        image_result = analyze_face_image(contents)

        return {
            "image_analysis": {
                "average_brightness": image_result["average_brightness"],
                "average_redness": image_result["average_redness"],
                "skin_tone_reference": image_result["skin_tone_reference"],
                "image_quality_message": image_result["image_quality_message"],
            },
            "report_type": "beauty wellness reference report",
            "disclaimer": "본 결과는 의료 진단이 아니며, 뷰티·웰니스 참고용입니다.",
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="이미지 분석에 실패했습니다. 다른 이미지를 시도해 주세요.")
