import React from "react";
const STATUS=['수행 예정','임시 완료','최종 완료','지연','이관 필요'];
export default function TaskDetailModal({ task, onClose, onChange }) { if(!task) return null; return <div className='modal'><div className='panel'><h3>{task.title}</h3><p>{task.description}</p><p>인증:{task.verification_method}</p>{STATUS.map(s=><button key={s} onClick={()=>onChange(task.id,s)}>{s}</button>)}<button onClick={onClose}>닫기</button></div></div>; }
