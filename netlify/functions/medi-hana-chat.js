const ENNOIA_API_URL = process.env.ENNOIA_API_URL;
const ENNOIA_PROJECT = process.env.ENNOIA_PROJECT;
const ENNOIA_API_KEY = process.env.ENNOIA_API_KEY;
const CORS_ORIGIN = process.env.URL || '';
const MAX_INPUT_CHARS = 500;
const MIN_INTERVAL_MS = 10 * 1000;
const MAX_REQUESTS_PER_DAY = 120;
const ipRequestState = new Map();

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

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': CORS_ORIGIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST,OPTIONS'
    },
    body: JSON.stringify(body)
  };
}

function pickFinalReply(payload) {
  if (!payload || typeof payload !== 'object') return '';

  const candidates = [
    payload.finalAnswer,
    payload.final_answer,
    payload.answer,
    payload.reply,
    payload.output,
    payload.result,
    payload.message,
    payload?.data?.finalAnswer,
    payload?.data?.answer,
    payload?.data?.reply
  ];

  for (const v of candidates) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }

  const fromArray = (arr) => {
    if (!Array.isArray(arr)) return '';
    for (let i = arr.length - 1; i >= 0; i -= 1) {
      const item = arr[i];
      const role = (item?.agent || item?.name || item?.role || '').toString().toLowerCase();
      const content = item?.content || item?.text || item?.message || item?.answer;
      if (typeof content !== 'string' || !content.trim()) continue;
      if (/medi\s*hana|customer|guide|안내/.test(role)) return content.trim();
    }
    for (let i = arr.length - 1; i >= 0; i -= 1) {
      const content = arr[i]?.content || arr[i]?.text || arr[i]?.message || arr[i]?.answer;
      if (typeof content === 'string' && content.trim()) return content.trim();
    }
    return '';
  };

  return fromArray(payload.agentResponses) || fromArray(payload.messages) || fromArray(payload.data?.messages);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });

  if (!ENNOIA_API_URL || !ENNOIA_PROJECT || !ENNOIA_API_KEY) {
    return json(500, { error: 'ennoia_env_missing' });
  }

  try {
    const ip = getClientIp(event);
    const rate = checkAndUpdateRateLimit(ip);
    if (!rate.ok) {
      return json(429, { error: rate.error, retryAfterMs: rate.retryAfterMs || null });
    }

    const body = JSON.parse(event.body || '{}');
    const message = String(body.message || '').trim();
    if (!message) return json(400, { error: 'message_required' });
    if (message.length > MAX_INPUT_CHARS) return json(400, { error: 'message_too_long', maxChars: MAX_INPUT_CHARS });

    const upstreamPayload = {
      project: ENNOIA_PROJECT,
      message,
      history: Array.isArray(body.history) ? body.history : [],
      language: body.language || 'ko',
      metadata: {
        source: body.source || 'medi-hana-page'
      }
    };

    const upstream = await fetch(ENNOIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ENNOIA_API_KEY}`,
        'x-api-key': ENNOIA_API_KEY
      },
      body: JSON.stringify(upstreamPayload)
    });

    const raw = await upstream.text();
    let parsed;
    try {
      parsed = raw ? JSON.parse(raw) : {};
    } catch {
      parsed = { raw };
    }

    if (!upstream.ok) {
      return json(502, { error: 'ennoia_upstream_error' });
    }

    const replyRaw = pickFinalReply(parsed) || '죄송합니다. 현재 상담 결과를 정리 중입니다. 다시 시도해 주세요.';
    const reply = replyRaw.length > 700 ? `${replyRaw.slice(0, 700)}...` : replyRaw;

    return json(200, {
      reply,
      summary: parsed.summary || parsed.data?.summary || {}
    });
  } catch (error) {
    return json(500, { error: 'server_error' });
  }
};
