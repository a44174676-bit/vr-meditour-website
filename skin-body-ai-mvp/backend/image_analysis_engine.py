"""
얼굴 이미지의 기본 색상/밝기 참고 분석 로직입니다.
의료 목적이 아닌 beauty wellness reference report용 보조 정보만 제공합니다.
"""

from PIL import Image


def _resize_for_analysis(image: Image.Image, max_size: int = 800) -> Image.Image:
    """너무 큰 이미지를 분석 효율을 위해 축소합니다."""
    img = image.copy()
    img.thumbnail((max_size, max_size))
    return img


def analyze_face_image(image_bytes: bytes) -> dict:
    """
    업로드된 이미지 바이트를 받아
    평균 밝기/평균 붉은기/피부톤 참고값/이미지 품질 안내를 계산합니다.
    """
    image = Image.open(__import__("io").BytesIO(image_bytes)).convert("RGB")

    original_width, original_height = image.size
    resized = _resize_for_analysis(image, max_size=800)
    width, height = resized.size

    pixels = list(resized.getdata())
    total = len(pixels)

    avg_r = sum(p[0] for p in pixels) / total
    avg_g = sum(p[1] for p in pixels) / total
    avg_b = sum(p[2] for p in pixels) / total

    average_brightness = (avg_r + avg_g + avg_b) / 3
    average_redness = avg_r - ((avg_g + avg_b) / 2)

    # 피부톤 참고값 (단순 기준)
    if average_brightness < 45:
        skin_tone_reference = "조명 확인 필요"
    elif average_brightness < 110:
        skin_tone_reference = "어두운 톤 참고값"
    elif average_brightness < 180:
        skin_tone_reference = "중간 톤 참고값"
    else:
        skin_tone_reference = "밝은 톤 참고값"

    quality_messages = []

    if average_brightness < 70:
        quality_messages.append("조명이 어둡습니다. 밝은 곳에서 다시 촬영하면 더 안정적입니다.")
    elif average_brightness > 210:
        quality_messages.append("조명이 강합니다. 빛 반사를 줄이면 더 안정적입니다.")
    else:
        quality_messages.append("조명이 적절한 편입니다.")

    # 원본 해상도 기준으로 추가 안내
    if original_width < 320 or original_height < 320:
        quality_messages.append("이미지 해상도가 낮아 참고 정확도가 낮을 수 있습니다.")

    return {
        "average_brightness": round(average_brightness, 2),
        "average_redness": round(average_redness, 2),
        "skin_tone_reference": skin_tone_reference,
        "image_quality_message": " ".join(quality_messages),
        "analysis_resolution": f"{width}x{height}",
        "disclaimer": "본 결과는 의료 진단이 아니며, 뷰티·웰니스 참고용입니다.",
    }
