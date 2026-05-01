import React, { useEffect, useMemo, useState } from 'react';
import { api } from './api';
import UserIntakeForm from './components/UserIntakeForm';
import SettlementRoadmap from './components/SettlementRoadmap';
import DigitalPassport from './components/DigitalPassport';
import RiskPanel from './components/RiskPanel';
import CoordinatorDashboard from './components/CoordinatorDashboard';

export default function App(){
  const [tab,setTab]=useState('등록');
  const [users,setUsers]=useState([]);
  const [uid,setUid]=useState('');
  const [tasks,setTasks]=useState([]);
  const [passport,setPassport]=useState(null);
  const [role,setRole]=useState('운영자');
  const [rows,setRows]=useState([]);
  const [logs,setLogs]=useState([]);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');

  const selectedUser = users.find(u => String(u.id)===String(uid));

  const loadUsers = async () => { try { setError(''); const d=await api.users(); setUsers(d||[]); if(d?.length && !uid) setUid(String(d[0].id)); } catch { setError('백엔드 서버 연결을 확인해 주세요.'); } };
  useEffect(()=>{ loadUsers(); },[]);
  useEffect(()=>{ if(role){ api.dashboard(role).then(setRows).catch(()=>setError('대시보드 조회에 실패했습니다.')); } },[role]);

  const refreshPassport = async (targetUid=uid, latestTasks=null) => {
    if(!targetUid) return;
    const p = await api.passport(targetUid);
    await api.risk(targetUid);
    setPassport(p);
    if (latestTasks) setTasks(latestTasks);
  };

  const onCreateUser = async (f) => {
    try { setError(''); await api.createUser(f); await loadUsers(); setMessage('사용자가 등록되었습니다. 이제 로드맵 탭에서 정착 로드맵을 생성하세요.'); setTab('로드맵'); }
    catch { setError('사용자 등록에 실패했습니다. 필수 입력값을 확인해 주세요.'); }
  };

  const onGenerateRoadmap = async () => {
    try { setError(''); const r=await api.roadmap(uid); setTasks(r.generated_tasks||[]); setLogs(r.agent_logs||[]); await refreshPassport(uid, r.generated_tasks||[]); setMessage('정착 로드맵이 생성되었습니다. 각 과업의 상태를 변경하면 패스포트와 위험도가 갱신됩니다.'); }
    catch { setError('로드맵 생성에 실패했습니다. 백엔드 서버 연결을 확인해 주세요.'); }
  };

  const onStatusChange = async (taskId,status) => {
    try { setError(''); await api.updateTask(taskId,status); const latestTasks = await api.tasks(uid); setTasks(latestTasks); await refreshPassport(uid, latestTasks); }
    catch { setError('과업 상태 변경에 실패했습니다.'); }
  };

  const stats = useMemo(()=>{
    const totalUsers = rows.length;
    const handoffUsers = rows.filter(r=>r.handoff_status==='이관 필요').length;
    const delayedTasks = rows.reduce((acc,r)=>acc+(r.tasks||[]).filter(t=>t.status==='지연').length,0);
    const avgProgress = passport?.progress ? Math.round(passport.progress) : 0;
    const highRiskUsers = rows.filter(r=>r.handoff_status==='이관 필요' || (r.tasks||[]).some(t=>t.status==='이관 필요')).map(r=>r.user);
    return {totalUsers, handoffUsers, delayedTasks, avgProgress, highRiskUsers};
  },[rows,passport]);

  return <div>
    <h1>Integrated AI System for Foreign Resident Settlement Management</h1>
    <p>외국인의 입국 전후 정착 과업을 자동 생성하고, 진행률·위험도·담당자 이관 상태를 관리하는 MVP 시스템입니다.</p>
    {message && <div className='card'>{message}</div>}
    {error && <div className='card' style={{borderColor:'#ff7a7a', color:'#ffb3b3'}}>{error}</div>}
    <nav>{['등록','로드맵','패스포트','대시보드','에이전트'].map(t=><button key={t} onClick={()=>setTab(t)}>{t}</button>)}</nav>

    {tab==='등록' && <UserIntakeForm onSubmit={onCreateUser} />}

    {tab!=='등록' && <select value={uid} onChange={e=>setUid(e.target.value)}>{users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select>}

    {tab==='로드맵' && <><button onClick={onGenerateRoadmap}>정착 로드맵 생성</button><SettlementRoadmap tasks={tasks} onStatusChange={onStatusChange} /></>}
    {tab==='패스포트' && <><button onClick={()=>refreshPassport(uid)}>패스포트/위험도 갱신</button><DigitalPassport passport={passport} user={selectedUser} tasks={tasks} /><RiskPanel passport={passport} user={selectedUser} tasks={tasks} /></>}
    {tab==='대시보드' && <CoordinatorDashboard role={role} setRole={setRole} rows={rows} stats={stats} />}
    {tab==='에이전트' && <div className='card'>{logs.length?logs.map((l,i)=><p key={i}>- {l}</p>):'에이전트 로그가 없습니다.'}</div>}

    <footer>본 시스템은 참고용 정착지원 도구이며, 의료·법률·비자 판단은 전문가 확인이 필요합니다.</footer>
  </div>
}
