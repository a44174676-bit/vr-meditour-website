import React from "react";

const STATUS_ACTIONS = ["수행 예정", "임시 완료", "최종 완료", "지연", "이관 필요", "사후관리"];

export default function SettlementRoadmap({ tasks, onStatusChange }) {
  if (!tasks?.length) return <p>생성된 과업이 없습니다.</p>;
  return (
    <div>
      {tasks.map((t) => (
        <div key={t.id} className="card">
          <h4>{t.title}</h4>
          <p>카테고리: {t.category} | 우선순위: {t.priority}</p>
          <p>현재 상태: {t.status}</p>
          <p>인증 방식: {t.verification_method}</p>
          <p>지원 수준: {t.support_level}</p>
          <p>위험 가중치: {t.risk_weight}</p>
          <div>
            {STATUS_ACTIONS.map((status) => (
              <button key={status} onClick={() => onStatusChange(t.id, status)}>{status}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
