'use strict';
// Disabled by default. No existing medical webhook is reused.
// Receiver contract and approval checklist: docs/study-korea.md.
const reply = (statusCode, body) => ({ statusCode, headers: {
  'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff'
}, body: JSON.stringify(body) });
function configuration() {
  const e = process.env;
  if (e.STUDY_KOREA_ENABLED !== 'true' || e.STUDY_KOREA_RECEIVER_VERIFIED !== 'true' ||
      !e.STUDY_KOREA_RECEIVER_TOKEN || !e.STUDY_KOREA_POLICY_VERSION ||
      !e.STUDY_KOREA_POLICY_KO || !e.STUDY_KOREA_POLICY_VI) return null;
  try {
    const url = new URL(e.STUDY_KOREA_RECEIVER_URL);
    const origin = new URL(e.STUDY_KOREA_SITE_ORIGIN);
    if (url.protocol !== 'https:' || url.username || url.password || origin.protocol !== 'https:' || origin.origin !== e.STUDY_KOREA_SITE_ORIGIN) return null;
    return { url: url.href, origin: origin.origin, token: e.STUDY_KOREA_RECEIVER_TOKEN,
      version: e.STUDY_KOREA_POLICY_VERSION, policy: { ko: e.STUDY_KOREA_POLICY_KO, vi: e.STUDY_KOREA_POLICY_VI } };
  } catch { return null; }
}
exports.handler = async event => {
  if (!['GET', 'POST'].includes(event.httpMethod)) return reply(405, { accepted: false });
  const config = configuration();
  if (event.httpMethod === 'GET') return reply(200, config ? { enabled: true, version: config.version, policy: config.policy } : { enabled: false });
  if (!config) return reply(503, { accepted: false });
  const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([k,v]) => [k.toLowerCase(), v]));
  if (headers.origin !== config.origin) return reply(403, { accepted: false });
  if (!/^application\/json(?:;|$)/i.test(headers['content-type'] || '')) return reply(415, { accepted: false });
  if (event.isBase64Encoded || Buffer.byteLength(event.body || '', 'utf8') > 24000) return reply(413, { accepted: false });
  let data;
  try { data = JSON.parse(event.body || ''); } catch { return reply(400, { accepted: false }); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return reply(400, { accepted: false });
  const fields = data.kind === 'student' ? { name: 80, contact: 80, country: 80, message: 3000 } :
    data.kind === 'partner' ? { organization: 120, name: 80, email: 254, contact: 80, message: 3000 } : null;
  if (!fields || data.website || data.consent !== true || data.policyVersion !== config.version ||
      !['ko', 'vi'].includes(data.lang) || typeof data.submissionId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.submissionId)) return reply(400, { accepted: false });
  const interests = data.kind === 'student' ? ['language', 'undergraduate', 'graduate', 'undecided'] : ['agency', 'university', 'settlement', 'other'];
  if (!interests.includes(data.interest)) return reply(400, { accepted: false });
  const payload = {};
  for (const [key, max] of Object.entries(fields)) {
    if (typeof data[key] !== 'string' || !data[key].trim() || data[key].length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(data[key])) return reply(400, { accepted: false });
    payload[key] = data[key].trim();
  }
  if (data.kind === 'partner' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return reply(400, { accepted: false });
  Object.assign(payload, { service: 'vr-student-korea', kind: data.kind, interest: data.interest, lang: data.lang,
    submissionId: data.submissionId, consent: true, policyVersion: config.version, receivedAt: new Date().toISOString() });
  try {
    const response = await fetch(config.url, { method: 'POST', redirect: 'error',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.token}`, 'Idempotency-Key': data.submissionId },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(10000) });
    if (response.status === 429) return reply(429, { accepted: false });
    const result = await response.json();
    if (!response.ok || result.accepted !== true || typeof result.receiptId !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(result.receiptId)) return reply(502, { accepted: false });
    return reply(200, { accepted: true, receiptId: result.receiptId });
  } catch { return reply(502, { accepted: false }); }
};
