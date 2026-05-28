const ENNOIA_API_URL = process.env.ENNOIA_API_URL;
const ENNOIA_PROJECT = process.env.ENNOIA_PROJECT;
const ENNOIA_API_KEY = process.env.ENNOIA_API_KEY;
const MAX_INPUT_CHARS = 500;
const MIN_INTERVAL_MS = 10 * 1000;
const MAX_REQUESTS_PER_DAY = 120;
const ipRequestState = new Map();

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (origin === 'https://vr-meditour.com') return true;
  if (/^https:\/\/deploy-preview-\d+--[a-z0-9-]+\.netlify\.app$/i.test(origin)) return true;
  if (/^http:\/\/localhost(:\d+)?$/i.test(origin)) return true;
  if (/^http:\/\/127\.0\.0\.1(:\d+)?$/i.test(origin)) return true;
  return false;
}

function baseHeaders(origin) {
  const allowOrigin = isAllowedOrigin(origin) ? origin : 'https://vr-meditour.com';
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, x-requested-with',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    Vary: 'Origin'
  };
}

function json(statusCode, body, origin) {
  return {
    statusCode,
    headers: baseHeaders(origin),
    body: JSON.stringify(body)
  };
}

function getClientIp(event) {
  const forwarded = event.headers?.['x-forwarded-for'] || event.headers?.['X-Forwarded-For'] || '';
  return String(forwarded).split(',')[0].trim() || event.headers?.['client-ip'] || 'unknown';
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function checkAndUpdateRateLimit(ip) {
  const now = Date.now();
  const today = getTodayKey();
  const prev = ipRequestState.get(ip) || { lastRequestAt: 0, dayKey: today, dayCount: 0 };

  const sameDayCount = prev.dayKey === today ? prev.dayCount : 0;
  if (sameDayCount >= MAX_REQUESTS_PER_DAY) {
    return { ok: false, error: 'daily_limit_exceeded' };
  }

  if (prev.lastRequestAt && now - prev.lastRequestAt < MIN_INTERVAL_MS) {
    return { ok: false, error: 'too_many_requests', retryAfterMs: MIN_INTERVAL_MS - (now - prev.lastRequestAt) };
  }

  ipRequestState.set(ip, { lastRequestAt: now, dayKey: today, dayCount: sameDayCount + 1 });
  return { ok: true };
}


function envDebugInfo() {
  return {
    hasKey: Boolean(ENNOIA_API_KEY),
    keyLength: ENNOIA_API_KEY ? ENNOIA_API_KEY.length : 0,
    project: ENNOIA_PROJECT || ''
  };
}

function pickFinalAnswer(payload) {
  if (!payload || typeof payload !== 'object') return '';
  const candidates = [
    payload.answer,
    payload.finalAnswer,
    payload.final_answer,
    payload.reply,
    payload.output,
    payload.result,
    payload.message,
    payload?.data?.answer,
    payload?.data?.finalAnswer,
    payload?.data?.reply
  ];

  for (const v of candidates) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }

  const fromArray = (arr) => {
    if (!Array.isArray(arr)) return '';
    for (let i = arr.length - 1; i >= 0; i -= 1) {
      const content = arr[i]?.content || arr[i]?.text || arr[i]?.message || arr[i]?.answer;
      if (typeof content === 'string' && content.trim()) return content.trim();
    }
    return '';
  };

  return fromArray(payload.agentResponses) || fromArray(payload.messages) || fromArray(payload.data?.messages);
}

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: baseHeaders(origin), body: '' };
  }

  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' }, origin);

  try {
    if (!ENNOIA_API_URL || !ENNOIA_PROJECT || !ENNOIA_API_KEY) {
      return json(500, { error: 'ennoia_env_missing', debug: envDebugInfo() }, origin);
    }

    const ip = getClientIp(event);
    const rate = checkAndUpdateRateLimit(ip);
    if (!rate.ok) return json(429, { error: rate.error, retryAfterMs: rate.retryAfterMs || null }, origin);

    const body = JSON.parse(event.body || '{}');
    const message = String(body.message || '').trim();

    if (!message) return json(400, { error: 'message_required' }, origin);
    if (message.length > MAX_INPUT_CHARS) return json(400, { error: 'message_too_long', maxChars: MAX_INPUT_CHARS }, origin);

    const upstream = await fetch(ENNOIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        project: ENNOIA_PROJECT,
        apiKey: ENNOIA_API_KEY
      },
      body: JSON.stringify({
        project: ENNOIA_PROJECT,
        message,
        history: Array.isArray(body.history) ? body.history : [],
        language: body.language || 'ko',
        metadata: { source: body.source || 'medi-hana-page' }
      })
    });

    const raw = await upstream.text();
    let parsed = {};
    try {
      parsed = raw ? JSON.parse(raw) : {};
    } catch {
      parsed = { raw };
    }

    if (!upstream.ok) {
      const detail = typeof raw === 'string' ? raw.slice(0, 500) : '';
      return json(500, { error: 'ennoia_upstream_error', status: upstream.status, detail, debug: envDebugInfo() }, origin);
    }

    const answerRaw = pickFinalAnswer(parsed) || '죄송합니다. 현재 상담 결과를 정리 중입니다. 다시 시도해 주세요.';
    const answer = answerRaw.length > 700 ? `${answerRaw.slice(0, 700)}...` : answerRaw;
    return json(200, { answer }, origin);
  } catch (error) {
    return json(500, { error: 'server_error', debug: envDebugInfo() }, origin);
  }
};
