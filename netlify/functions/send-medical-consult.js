const N8N_WEBHOOK_URL = 'https://daltaning.app.n8n.cloud/webhook/medical-consult';
const ALLOWED_FIELDS = ['name', 'email', 'phone', 'service', 'language', 'message'];

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return response(405, { ok: false, error: 'Method Not Allowed' });
  }

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (_) {
    return response(400, { ok: false, error: 'Invalid JSON' });
  }

  const payload = ALLOWED_FIELDS.reduce((acc, field) => {
    acc[field] = typeof body[field] === 'string' ? body[field].trim() : '';
    return acc;
  }, {});

  try {
    const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      console.warn('n8n medical consult webhook returned a non-2xx response', webhookResponse.status);
      return response(202, { ok: false, forwarded: false });
    }

    return response(200, { ok: true, forwarded: true });
  } catch (error) {
    console.warn('n8n medical consult webhook delivery failed', error);
    return response(202, { ok: false, forwarded: false });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}
