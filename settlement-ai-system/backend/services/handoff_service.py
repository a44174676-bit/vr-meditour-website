def should_handoff(risk_level: str):
    return "이관 필요" if risk_level == "이관 필요" else "정상"
