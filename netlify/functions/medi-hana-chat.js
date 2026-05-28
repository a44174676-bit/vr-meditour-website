const ENNOIA_API_URL = process.env.ENNOIA_API_URL;
const ENNOIA_PROJECT = process.env.ENNOIA_PROJECT;
const ENNOIA_API_KEY = process.env.ENNOIA_API_KEY;
const CORS_ORIGIN = process.env.URL || '';

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
    const body = JSON.parse(event.body || '{}');
    const message = String(body.message || '').trim();
    if (!message) return json(400, { error: 'message_required' });

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

    const reply = pickFinalReply(parsed) || '죄송합니다. 현재 상담 결과를 정리 중입니다. 다시 시도해 주세요.';

    return json(200, {
      reply,
      summary: parsed.summary || parsed.data?.summary || {}
    });
  } catch (error) {
    return json(500, { error: 'server_error' });
  }
};
