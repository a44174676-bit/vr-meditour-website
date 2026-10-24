/**
 * B2B intake transport dry run – SYNTHETIC DATA ONLY.
 * Do not repurpose as a production lead endpoint.
 * It neither persists, notifies, nor returns a real submission receipt.
 */
'use strict';

const PREVIEW_HOST = 'deploy-preview-82--lustrous-otter-08f342.netlify.app';
const ALLOWED_FIELDS = ['mode', 'organization', 'city', 'institutionType', 'interest', 'meeting'];
const TYPE_VALUES = ['agency', 'university', 'travel', 'other'];
const INTEREST_VALUES = ['study', 'settlement', 'language', 'tour', 'other'];
const MEETING_VALUES = ['online', 'hanoi', 'busan', 'email'];

function response(statusCode, payload, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, private, max-age=0',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Referrer-Policy': 'no-referrer',
      ...extraHeaders,
    },
    body: JSON.stringify(payload),
  };
}
function fail(statusCode, code, message) {
  return response(statusCode, { ok: false, code, message, persisted: false, notified: false });
}
exports.handler = async (event) => {
  // Protect even if this file is mistakenly merged and deployed to production.
  // This is a preview-only proof of transport, not an intake endpoint.
  const host = (event.headers && (event.headers.host || event.headers.Host) || '').toLowerCase().split(':')[0];
  if (host !== PREVIEW_HOST || process.env.CONTEXT === 'production') {
    return fail(403, 'PREVIEW_ONLY', 'This synthetic test endpoint is disabled outside the approved Deploy Preview.');
  }
  if (event.httpMethod === 'GET') {
    return response(200, {
      ok: true,
      service: 'b2b-intake-dryrun',
      environment: 'preview-only',
      acceptingRealData: false,
      persisted: false,
      notified: false,
      allowedMode: 'synthetic-dryrun',
    });
  }
  if (event.httpMethod !== 'POST') {
    return fail(405, 'METHOD_NOT_ALLOWED', 'Only GET and POST are permitted.');
  }
  const contentType = (event.headers && (event.headers['content-type'] || event.headers['Content-Type']) || '').toLowerCase();
  if (!contentType.startsWith('application/json')) {
    return fail(415, 'CONTENT_TYPE', 'Only application/json is accepted.');
  }
  if (event.isBase64Encoded) {
    return fail(400, 'ENCODING', 'Base64 request payloads are not supported.');
  }
  const raw = event.body || '';
  if (typeof raw !== 'string' || Buffer.byteLength(raw, 'utf8') > 2048) {
    return fail(413, 'SIZE_LIMIT', 'Request must be a small synthetic test payload.');
  }
  let data;
  try {
    data = JSON.parse(raw);
  } catch (_) {
    return fail(400, 'INVALID_JSON', 'Invalid JSON.');
  }
  if (!data || Array.isArray(data) || typeof data !== 'object') {
    return fail(400, 'INVALID_SHAPE', 'A JSON object is required.');
  }
  if (Object.keys(data).length !== ALLOWED_FIELDS.length ||
      Object.keys(data).some(key => !ALLOWED_FIELDS.includes(key))) {
    return fail(422, 'UNEXPECTED_FIELDS', 'Only fixed synthetic test fields are accepted.');
  }
  if (data.mode !== 'synthetic-dryrun' ||
      data.organization !== 'TEST_COMPANY_01' ||
      data.city !== 'TEST_CITY' ||
      !TYPE_VALUES.includes(data.institutionType) ||
      !INTEREST_VALUES.includes(data.interest) ||
      !MEETING_VALUES.includes(data.meeting)) {
    return fail(422, 'SYNTHETIC_ONLY', 'Real contact details and arbitrary organization data are not accepted.');
  }

  // No console logging of request values; no database write, email or webhook.
  return response(200, {
    ok: true,
    code: 'DRYRUN_VALIDATED',
    message: 'Synthetic intake payload validated. This is NOT a submitted or received partnership inquiry.',
    persisted: false,
    notified: false,
    productionIntakeEnabled: false,
    nextRequirement: 'Approve privacy policy, authorized company mailbox, access and retention controls before production implementation.',
  });
};
