import React from "react";

export default function RiskPanel({ passport, user, tasks }) {
  if (!passport) return null;
  const reasons = [...(passport.risk_reasons || [])];
  if (tasks?.some(t => t.status === "지연")) reasons.push("지연 과업 존재");
  if (user?.housing_status === "미정") reasons.push("주거 상태 미정");
  if (user?.community_status === "없음") reasons.push("커뮤니티 미참여");
  if (["없음","초급"].includes(user?.korean_level)) reasons.push("한국어 수준 낮음");
  if (user?.counseling_note) reasons.push("상담 메모 확인 필요");
  if (tasks?.some(t => t.status === "이관 필요")) reasons.push("이관 필요 과업 존재");
  const actions = passport.recommended_actions?.length ? passport.recommended_actions : ["생활정착 담당자 확인 필요", "공동체 멘토 연결 필요", "전화 또는 대면 확인 권장"];

  return <div className='card'><h4>Risk Panel</h4>
    <p>Settlement Risk: {passport.settlement_risk_score}</p>
    <p>Social Isolation Risk: {passport.social_isolation_score}</p>
    <p>위험 등급: {passport.risk_level}</p>
    <p>위험 원인 요약: {[...new Set(reasons)].join(', ') || '없음'}</p>
    <p>추천 조치: {[...new Set(actions)].join(', ')}</p>
  </div>;
}
