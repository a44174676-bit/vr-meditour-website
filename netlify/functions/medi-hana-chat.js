const MEDI_HANA_OPENAI_API_KEY = process.env.MEDI_HANA_OPENAI_API_KEY;
const MODEL = process.env.MEDI_HANA_MODEL || 'gpt-4o-mini';
const RATE_LIMIT_MS = 3000;
const rateMap = new Map();
const CORS_ORIGIN = process.env.URL || '';

const SYSTEM_PROMPT = `You are Medi Hana, the AI medical travel consultation assistant for VR MEDI TOUR & HOME Co., Ltd.

Your role:
- Help international patients prepare inquiries for Korea medical travel.
- Organize the user’s goals, language, location, preferred medical field, travel timeline, and support needs.
- Explain that VR MEDI TOUR & HOME is not a hospital.
- Explain that you do not diagnose, prescribe, determine treatment plans, confirm prices, select hospitals as a medical decision, or guarantee outcomes.
- Final diagnosis, treatment plans, prices, and medical decisions must be confirmed by licensed Korean medical institutions.
- Encourage human coordinator review before any hospital communication.
- Ask for consent before collecting or forwarding personal or medical information.

Tone:
- Warm, professional, calm, respectful.
- Use the user’s selected language when possible.
- Keep answers concise but helpful.
- Avoid frightening the user.
- Do not overpromise.

Always return a compact JSON object with keys: reply, summary, safetyNotice, handoffRecommended.`;

function json(statusCode, body, origin=''){return {statusCode,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':origin||CORS_ORIGIN,'Vary':'Origin'},body:JSON.stringify(body)};}

function hostFromUrl(value){try{return new URL(value).hostname.toLowerCase();}catch{return '';}}
function hostOnly(value=''){return String(value).split(':')[0].toLowerCase();}
function isAllowedOrigin(origin, event){
  if(!origin) return true;
  let originHost='';
  try{originHost=new URL(origin).hostname.toLowerCase();}catch{return false;}
  const reqHost=hostOnly(event.headers.host || event.headers['x-forwarded-host'] || '');
  const allow=new Set([
    reqHost,
    hostFromUrl(process.env.URL||''),
    hostFromUrl(process.env.DEPLOY_URL||''),
    hostFromUrl(process.env.DEPLOY_PRIME_URL||''),
    'vr-meditour.com',
    'www.vr-meditour.com'
  ].filter(Boolean));
  if(reqHost.endsWith('.netlify.app')) allow.add(reqHost);
  return allow.has(originHost);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return {statusCode: 204, headers:{'Access-Control-Allow-Origin': event.headers.origin || CORS_ORIGIN,'Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'}};
  if (event.httpMethod !== 'POST') return json(405,{error:'Method not allowed'}, event.headers.origin);
  const origin = event.headers.origin || '';
  if (!isAllowedOrigin(origin, event)) {
    console.error('[medi-hana-chat] status=403 error_type=forbidden_origin');
    return json(403,{errorType:'forbidden_origin',reply:'현재 접속 주소에서 메디하나 AI 연결이 허용되지 않았습니다. 담당자에게 문의해 주세요.',summary:{},handoffRecommended:true},origin);
  }

  const ip = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || 'anon';
  const now = Date.now();
  const prev = rateMap.get(ip) || 0;
  if (now - prev < RATE_LIMIT_MS) return json(429,{error:'Too many requests'},origin);
  rateMap.set(ip, now);

  let payload = {};
  try { payload = JSON.parse(event.body || '{}'); } catch { return json(400,{error:'Invalid JSON'},origin); }
  const message = String(payload.message || '').trim();
  const history = Array.isArray(payload.history) ? payload.history.slice(-12) : [];
  if (!message) return json(400,{error:'Empty message'},origin);
  if (message.length > 1200) return json(400,{error:'Message too long. Please summarize your request.'},origin);

  const piiDetected = /(passport|resident|ssn|diagnosis report|mri|ct|x-ray|credit card)/i.test(message);
  const safetyNotice = piiDetected ? 'Please avoid sharing sensitive personal or medical information before explicit consent.' : 'Medi Hana is for pre-consultation support only; not diagnosis or treatment.';

  if (!MEDI_HANA_OPENAI_API_KEY) {
    console.error('[medi-hana-chat] status=500 error_type=missing_medi_hana_api_key');
    return json(500,{errorType:'missing_medi_hana_api_key',reply:'메디하나 AI 연결 설정이 아직 완료되지 않았습니다.',summary:{},safetyNotice,handoffRecommended:true},origin);
  }

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Authorization':`Bearer ${MEDI_HANA_OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:MODEL,temperature:0.2,max_tokens:450,response_format:{type:'json_object'},messages:[{role:'system',content:SYSTEM_PROMPT},...history.map(m=>({role:m.role==='user'?'user':'assistant',content:String(m.text||'').slice(0,800)})),{role:'user',content:`User language: ${payload.language||'en'}\nUser message: ${message}\nReturn JSON schema {reply, summary:{inquiryType,language,country,city,field,timeline,supportNeeded,keyConcern,needsHumanReview}, safetyNotice, handoffRecommended}.`}]})});

    if (!resp.ok) {
      console.error(`[medi-hana-chat] status=${resp.status} error_type=upstream_api_error`);
      return json(502,{errorType:'upstream_api_error',reply:'AI 응답 서버 연결에 실패했습니다.',summary:{},safetyNotice,handoffRecommended:true},origin);
    }
    const data = await resp.json();
    let parsed;
    try { parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}'); }
    catch {
      console.error('[medi-hana-chat] status=502 error_type=response_parse_error');
      return json(502,{errorType:'response_parse_error',reply:'AI 응답 형식을 읽지 못했습니다.',summary:{},safetyNotice,handoffRecommended:true},origin);
    }
    return json(200,{reply:parsed.reply||'상담 준비를 도와드릴게요. 상담 목적과 희망 언어를 알려주세요.',summary:parsed.summary||{},safetyNotice:parsed.safetyNotice||safetyNotice,handoffRecommended:parsed.handoffRecommended ?? true},origin);
  } catch {
    console.error('[medi-hana-chat] status=502 error_type=function_runtime_error');
    return json(502,{errorType:'function_runtime_error',reply:'AI 응답 서버 연결에 실패했습니다.',summary:{},safetyNotice,handoffRecommended:true},origin);
  }
};
