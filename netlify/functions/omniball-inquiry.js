// A dedicated receiver must validate, persist and deduplicate by submissionId.
// It must return {accepted:true, receiptId:"..."} ONLY after durable acceptance.
const TYPES = ['제품·호환', '기관 도입', '유통', '제조·개발 협력', '기타'];
const LIMITS = { name: 80, email: 254, organization: 120, phone: 40, model: 120, message: 5000 };
const reply = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body)
});
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return reply(405, { accepted: false });
  if (!process.env.OMNIBALL_INQUIRY_ENABLED || process.env.OMNIBALL_INQUIRY_ENABLED !== 'true' ||
      !process.env.OMNIBALL_RETENTION_PERIOD || !process.env.OMNIBALL_INQUIRY_WEBHOOK_URL) {
    return reply(503, { accepted: false, error: 'Inquiry collection is not enabled' });
  }
  if ((event.body || '').length > 24000) return reply(413, { accepted: false });
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return reply(400, { accepted: false }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400, { accepted: false });
  if (body.website) return reply(400, { accepted: false });
  if (body.consent !== true || !TYPES.includes(body.type) ||
      typeof body.submissionId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.submissionId)) {
    return reply(400, { accepted: false });
  }
  const payload = {};
  for (const [key, limit] of Object.entries(LIMITS)) {
    if (body[key] != null && typeof body[key] !== 'string') return reply(400, { accepted: false });
    payload[key] = (body[key] || '').trim();
    if (payload[key].length > limit) return reply(400, { accepted: false });
  }
  if (!payload.name || !payload.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return reply(400, { accepted: false });
  }
  payload.service = '옴니볼 스키 문의';
  payload.type = body.type;
  payload.submissionId = body.submissionId;
  payload.consent = true;
  payload.retentionPeriod = process.env.OMNIBALL_RETENTION_PERIOD;
  payload.receivedAt = new Date().toISOString();
  try {
    const url = new URL(process.env.OMNIBALL_INQUIRY_WEBHOOK_URL);
    if (url.protocol !== 'https:') return reply(503, { accepted: false });
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': body.submissionId },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });
    const result = await response.json();
    if (!response.ok || result.accepted !== true || typeof result.receiptId !== 'string' || !result.receiptId.trim()) {
      return reply(502, { accepted: false });
    }
    return reply(200, { accepted: true, receiptId: result.receiptId });
  } catch {
    return reply(502, { accepted: false });
  }
};
