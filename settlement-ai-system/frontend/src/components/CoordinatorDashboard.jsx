import React from "react";

export default function CoordinatorDashboard({ role, setRole, rows, stats }) {
  const roles=['운영자','의료관광 코디네이터','생활정착 담당자','한국어 교육 담당자','공동체 멘토','가족 보기'];
  return <div>
    <select value={role} onChange={e=>setRole(e.target.value)}>{roles.map(r=><option key={r}>{r}</option>)}</select>
    <div className='card'><b>전체 등록자 수</b>: {stats.totalUsers} / <b>이관 필요자 수</b>: {stats.handoffUsers} / <b>지연 과업 수</b>: {stats.delayedTasks} / <b>평균 진행률</b>: {stats.avgProgress}%</div>
    <div className='card'><b>고위험 사용자 목록</b>: {stats.highRiskUsers.join(', ') || '없음'}</div>
    {rows.map((r,i)=><div key={i} className='card'><b>{r.user}</b><p>이관상태:{r.handoff_status} | 커뮤니티:{r.community_status}</p><pre>{JSON.stringify(r.tasks, null, 2)}</pre></div>)}
  </div>;
}
