export default function RiskPanel({ passport }) { if(!passport) return null; return <div className='card'><h4>Risk Panel</h4><p>이관 상태: {passport.handoff_status}</p></div>; }
