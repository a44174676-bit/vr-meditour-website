const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.MEDI_HANA_MODEL || 'gpt-4o-mini';
const CORS_ORIGIN = process.env.URL || '';

const INSTRUCTIONS = `You are Medi Hana, the official AI consultation assistant for VR MEDI TOUR & HOME Co., Ltd.

Core company position:
- VR MEDI TOUR & HOME is not a hospital and does not provide diagnosis, prescription, or medical treatment.
- Medical decisions are made only by licensed medical professionals at partner medical institutions.
- You provide secure medical tourism pre-consultation, foreign patient coordination, medical document preparation, multilingual coordination, hospital review support, Korea visit scheduling, transportation/accommodation coordination, K-beauty and wellness coordination, and after-care guidance.

Response policy:
1) Summarize customer intent first.
2) Organize already provided information from customerState/history; do not ask again for known fields.
3) Ask only for missing details needed for next coordination step.
4) Clearly explain what VR MEDI TOUR & HOME can do next.
5) For medical-tourism context, include a short non-diagnostic notice.
6) For product/tourism/goods-only context, do not repeatedly add medical notice.
7) Never use handoff phrases like "contact another agency/institution"; keep ownership and coordinator follow-up.
8) Support Korean, English, Vietnamese, Japanese, Chinese based on lang.

Return strict JSON with keys:
{
  "reply": "string",
  "summary": {
    "inquiryType":"", "language":"", "country":"", "city":"", "field":"", "timeline":"", "supportNeeded":[], "keyConcern":"", "needsHumanReview":true
  }
}`;

function json(statusCode, body, origin = '') {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin || CORS_ORIGIN,
      Vary: 'Origin'
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': event.headers.origin || CORS_ORIGIN,
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' }, event.headers.origin);
  if (!OPENAI_API_KEY) return json(500, { error: 'missing_openai_api_key' }, event.headers.origin);

  let payload = {};
  try { payload = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'Invalid JSON' }, event.headers.origin); }

  const latestMessage = String(payload.latestMessage || '').trim();
  if (!latestMessage) return json(400, { error: 'Empty message' }, event.headers.origin);

  const inputEnvelope = {
    source: payload.source || 'default',
    lang: payload.lang || 'ko',
    customerState: payload.customerState || {},
    history: Array.isArray(payload.history) ? payload.history.slice(-12) : [],
    latestMessage
  };

  try {
    const resp = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        instructions: INSTRUCTIONS,
        input: JSON.stringify(inputEnvelope),
        max_output_tokens: 600
      })
    });

    if (!resp.ok) return json(502, { error: 'upstream_api_error' }, event.headers.origin);
    const data = await resp.json();
    const text = data.output_text || '';
    let parsed = {};
    try { parsed = JSON.parse(text || '{}'); } catch { parsed = {}; }
    if (!parsed.reply) return json(502, { error: 'response_parse_error' }, event.headers.origin);
    return json(200, { reply: parsed.reply, summary: parsed.summary || {} }, event.headers.origin);
  } catch {
    return json(502, { error: 'function_runtime_error' }, event.headers.origin);
  }
};
