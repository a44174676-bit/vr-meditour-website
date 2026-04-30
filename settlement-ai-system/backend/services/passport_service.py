def calculate_progress(tasks):
    total_weight = sum(t.risk_weight for t in tasks) or 1
    done_weight = sum(t.risk_weight for t in tasks if t.status == "최종 완료")
    return round(done_weight / total_weight * 100, 2)
