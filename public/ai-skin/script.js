(function(){
const $=id=>document.getElementById(id);
const startBtn=$('vrmtStartCameraBtn'),captureBtn=$('vrmtCaptureBtn'),video=$('vrmtCameraVideo'),canvas=$('vrmtSnapshotCanvas'),statusEl=$('vrmtStatus'),analysis=$('vrmtAnalysis'),guide=$('vrmtFaceGuide');
let stream=null; const defaultBtn='AI 판별 촬영';
const setStatus=(t,l=false)=>{statusEl.textContent=t;statusEl.classList.toggle('loading',l)};
const setLoading=v=>{captureBtn.disabled=v;captureBtn.textContent=v?'AI가 이미지를 분석 중입니다...':defaultBtn};
async function startCamera(){
 if(!navigator.mediaDevices?.getUserMedia){setStatus('이 브라우저는 카메라를 지원하지 않습니다.');return;}
 try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});video.srcObject=stream;setStatus('카메라가 시작되었습니다. 가이드에 맞춘 뒤 촬영해 주세요.');setTimeout(()=>guide?.classList.add('vrmt-aligned'),2000);}catch(e){setStatus('카메라 권한을 확인해 주세요.');}
}
function captureResized(){const w=video.videoWidth||640,h=video.videoHeight||480,tw=Math.min(w,1024),th=Math.round(h/w*tw);canvas.width=tw;canvas.height=th;canvas.getContext('2d').drawImage(video,0,0,tw,th);return canvas.toDataURL('image/jpeg',0.82)}
async function capture(){if(!stream){setStatus('먼저 카메라를 시작해 주세요.');return;}setLoading(true);try{await analyze(captureResized());}finally{setLoading(false)}}
function mapMessage(msg=''){if(msg.includes('OPENAI_API_KEY'))return 'AI 분석 서버 설정이 아직 완료되지 않았습니다. 관리자에게 문의해 주세요.';if(/quota|rate limit|insufficient/i.test(msg))return 'AI 분석 서버 사용 한도가 일시적으로 제한되어 있습니다. 관리자 확인 후 다시 이용해 주세요.';return msg||'분석 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'}
async function analyze(imageBase64){
 setStatus('AI가 이미지를 분석 중입니다...',true);
 try{const res=await fetch('/.netlify/functions/analyze-skin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({imageBase64,language:'ko'})});const json=await res.json();
 if(!res.ok||json.ok===false){const m=mapMessage(json.error||json.message);setStatus(m);renderError(m,json);return;}renderReport(json.analysis);setStatus('AI 분석이 완료되었습니다.');}
 catch(e){const m='서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';setStatus(m);renderError(m,{ok:false});}
 finally{statusEl.classList.remove('loading');}
}
function renderError(message,payload){analysis.innerHTML=`<h2>AI 피부 분석 리포트</h2><div class="report-item"><strong>${esc(message)}</strong></div><details><summary>개발자용 JSON</summary><pre>${esc(JSON.stringify(payload,null,2))}</pre></details><p class="safety">본 서비스는 의료 진단이 아닌 피부·뷰티 참고 분석입니다. 통증, 가려움, 급격한 변화 또는 지속 증상이 있는 경우 피부과 전문의 상담을 권장합니다.</p>`}
function li(arr){return (arr||[]).map(v=>`<li>${esc(v)}</li>`).join('')}
function renderReport(a={}){analysis.innerHTML=`<h2>AI 피부 분석 리포트</h2><div class="report-grid">
<div class="report-item"><strong>피부 컨디션 요약</strong><p>${esc(a.summary||'-')}</p></div>
<div class="report-item"><strong>이미지 품질</strong><p>${esc(String(a.confidence??'-'))}</p></div>
<div class="report-item"><strong>피부톤 참고</strong><p>${esc((a.observations||[])[0]||'-')}</p></div>
<div class="report-item"><strong>붉은기 참고</strong><p>${esc((a.observations||[])[1]||'-')}</p></div>
<div class="report-item"><strong>수분/건조 참고</strong><p>${esc((a.observations||[])[2]||'-')}</p></div>
<div class="report-item"><strong>피부과 상담 권고</strong><p>${esc(a.dermatology_consult_recommendation||'-')}</p></div>
<div class="report-item"><strong>케어 우선순위</strong><ul>${li(a.care_priority)}</ul></div>
<div class="report-item"><strong>추천 제품 방향</strong><ul>${li(a.recommended_product_direction)}</ul></div>
</div><details><summary>개발자용 JSON</summary><pre>${esc(JSON.stringify(a,null,2))}</pre></details><p class="safety">본 서비스는 의료 진단이 아닌 피부·뷰티 참고 분석입니다. 통증, 가려움, 급격한 변화 또는 지속 증상이 있는 경우 피부과 전문의 상담을 권장합니다.</p>`}
const esc=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
document.addEventListener('DOMContentLoaded',()=>{startBtn?.addEventListener('click',startCamera);captureBtn?.addEventListener('click',capture);});
})();
