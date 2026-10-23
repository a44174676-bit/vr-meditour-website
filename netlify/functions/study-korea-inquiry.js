'use strict';
const { validate } = require('../../study-korea/validation.js');
// Disabled by default. No existing medical webhook is reused.
// Receiver contract and approval checklist: docs/study-korea.md.
const reply = (statusCode, body) => ({ statusCode, headers: {
  'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff'
}, body: JSON.stringify(body) });
function configuration() {
  const e = process.env;
  if (e.STUDY_KOREA_INTAKE_SCOPE_APPROVED !== 'true' || e.STUDY_KOREA_ENABLED !== 'true' || e.STUDY_KOREA_RECEIVER_VERIFIED !== 'true' ||
      !e.STUDY_KOREA_RECEIVER_TOKEN || !e.STUDY_KOREA_POLICY_VERSION ||
      !e.STUDY_KOREA_POLICY_KO || !e.STUDY_KOREA_POLICY_VI) return null;
  try {
    const url = new URL(e.STUDY_KOREA_RECEIVER_URL);
    const origin = new URL(e.STUDY_KOREA_SITE_ORIGIN);
    if (url.protocol !== 'https:' || url.username || url.password || origin.protocol !== 'https:' || origin.origin !== e.STUDY_KOREA_SITE_ORIGIN) return null;
    return { url: url.href, origin: origin.origin, token: e.STUDY_KOREA_RECEIVER_TOKEN,
      marketing: e.STUDY_KOREA_MARKETING_VERSION && e.STUDY_KOREA_MARKETING_KO && e.STUDY_KOREA_MARKETING_VI ? { version: e.STUDY_KOREA_MARKETING_VERSION, ko: e.STUDY_KOREA_MARKETING_KO, vi: e.STUDY_KOREA_MARKETING_VI } : null,
      version: e.STUDY_KOREA_POLICY_VERSION, policy: { ko: e.STUDY_KOREA_POLICY_KO, vi: e.STUDY_KOREA_POLICY_VI } };
  } catch { return null; }
}
exports.handler = async event => {
  if (!['GET', 'POST'].includes(event.httpMethod)) return reply(405, { accepted: false });
  const config = configuration();
  if (event.httpMethod === 'GET') return reply(200, config ? { enabled: true, version: config.version, policy: config.policy, marketing: config.marketing } : { enabled: false });
  if (!config) return reply(503, { accepted: false });
  const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([k,v]) => [k.toLowerCase(), v]));
  if (headers.origin !== config.origin) return reply(403, { accepted: false });
  if (!/^application\/json(?:;|$)/i.test(headers['content-type'] || '')) return reply(415, { accepted: false });
  if (event.isBase64Encoded || Buffer.byteLength(event.body || '', 'utf8') > 24000) return reply(413, { accepted: false });
  let data;
  try { data = JSON.parse(event.body || ''); } catch { return reply(400, { accepted: false }); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return reply(400, { accepted: false });
  if (data.policyVersion !== config.version || !['ko','vi'].includes(data.lang) ||
      typeof data.submissionId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.submissionId)) return reply(400,{accepted:false});
  const { errors, payload } = validate(data);
  if (Object.keys(errors).length) return reply(400,{accepted:false,errors});
  if (payload.marketing_opt_in && (!config.marketing || data.marketingVersion !== config.marketing.version)) return reply(400,{accepted:false,errors:{marketing_opt_in:'invalid'}});
  const now = new Date().toISOString();
  Object.assign(payload, { service:'vr-student-korea', lang:data.lang, submissionId:data.submissionId,
    status:'NEW', created_at:now,
    consent_record:{ policy_version:config.version, required_ack:true, marketing_opt_in:payload.marketing_opt_in,
      marketing_version:payload.marketing_opt_in ? config.marketing.version : null, timestamp:now } });
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
