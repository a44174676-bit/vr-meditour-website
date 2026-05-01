import React from "react";

const label = (p) => p < 40 ? "초기" : p < 70 ? "진행 중" : p < 100 ? "안정화 중" : "완료";

export default function DigitalPassport({ passport, user, tasks }) {
  if (!passport || !user) return <p>패스포트 데이터가 없습니다.</p>;
  const total = tasks?.length || passport.total_tasks || 0;
  const done = tasks ? tasks.filter(t => ["최종 완료", "사후관리"].includes(t.status)).length : passport.completed_tasks;
  const fallbackProgress = total ? Math.round((done / total) * 100) : 0;
  const progress = Number.isFinite(passport.progress) ? passport.progress : fallbackProgress;
  const delayed = tasks?.filter(t => t.status === "지연").length ?? passport.delayed_tasks;
  const handoffTaskCount = tasks?.filter(t => t.status === "이관 필요").length ?? passport.handoff_task_count ?? 0;

  return <div className='card'>
    <h3>Digital Passport</h3>
    <p>이름: {passport.user_name}</p><p>국적: {passport.nationality || user.nationality}</p><p>사용 언어: {passport.language || user.language}</p>
    <p>체류 목적: {passport.stay_purpose}</p><p>현재 정착 단계: {passport.current_stage}</p>
    <div style={{background:'#20344f', borderRadius:8, overflow:'hidden'}}><div style={{width:`${Math.max(0,Math.min(100,progress))}%`, background:'#54d3c2', padding:'6px 0'}} /></div>
    <p>진행률: {progress}% ({label(progress)})</p>
    <p>완료 과업 수 / 전체 과업 수: {done} / {total}</p>
    <p>지연 과업 수: {delayed}</p>
    <p>이관 필요 과업 수: {handoffTaskCount}</p>
    <p>정착 위험도: {passport.settlement_risk_score}</p>
    <p>사회적 고립 위험도: {passport.social_isolation_score}</p>
    <p>종합 상태: {passport.risk_level}</p>
    <p>사후관리 필요 여부: {done < total ? '예' : '아니오'}</p>
  </div>;
}
