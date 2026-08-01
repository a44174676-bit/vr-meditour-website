const LANGUAGE_CONFIG = require("../../ai-interpreter/language-config.json");
const ALLOWED_TARGETS = Object.freeze(Object.fromEntries(
  Object.values(LANGUAGE_CONFIG)
    .filter(({ enabled, medicallyVerified, translationMode }) =>
      enabled && medicallyVerified && translationMode === "direct-realtime")
    .map((language) => [language.code, language]),
));

const json = (statusCode, body, extraHeaders = {}) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, private",
    "X-Content-Type-Options": "nosniff",
    ...extraHeaders,
  },
  body: JSON.stringify(body),
});

function invocationOrigin(event) {
  if (event.rawUrl) {
    try { return new URL(event.rawUrl).origin; } catch { /* use forwarded headers */ }
  }

  const headers = event.headers || {};
  const host = headers["x-forwarded-host"] || headers["X-Forwarded-Host"] || headers.host || headers.Host;
  const protocol = headers["x-forwarded-proto"] || headers["X-Forwarded-Proto"] || "https";
  if (!host) return null;

  try { return new URL(`${protocol}://${host}`).origin; } catch { return null; }
}

function allowedOrigins(event) {
  const origins = new Set();
  const currentOrigin = invocationOrigin(event);
  if (currentOrigin) origins.add(currentOrigin);

  if (process.env.URL) {
    try { origins.add(new URL(process.env.URL).origin); } catch { /* ignore invalid configuration */ }
  }

  return origins;
}

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: { Allow: "POST, OPTIONS" }, body: "" };
  if (event.httpMethod !== "POST") return json(405, { error: "method_not_allowed" }, { Allow: "POST, OPTIONS" });

  const headers = event.headers || {};
  const origin = headers.origin || headers.Origin;
  const origins = allowedOrigins(event);
  if (origin && !origins.has(origin)) {
    console.error("[vr-medi-talk-session] origin_not_allowed status=403");
    return json(403, { error: "origin_not_allowed" });
  }
  if ((event.body || "").length > 1024) return json(413, { error: "request_too_large" });

  let request;
  try { request = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "invalid_json" }); }
  const target = ALLOWED_TARGETS[request.targetLanguage];
  if (!target || Object.keys(ALLOWED_TARGETS).length !== 2) return json(400, { error: "unsupported_language" });

  const apiKey = process.env.VR_MEDI_TALK_OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[vr-medi-talk-session] missing_environment status=503");
    return json(503, { error: "missing_environment" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/realtime/translations/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session: {
          model: "gpt-realtime-translate",
          audio: { output: { language: target.code } },
        },
      }),
    });

    if (!response.ok) {
      console.error(`[vr-medi-talk-session] openai_client_secret_rejected status=${response.status}`);
      return json(502, { error: "openai_client_secret_rejected" });
    }

    let secret;
    try {
      secret = await response.json();
    } catch {
      console.error(`[vr-medi-talk-session] client_secret_missing status=${response.status}`);
      return json(502, { error: "client_secret_missing" });
    }
    if (!secret?.value) {
      console.error(`[vr-medi-talk-session] client_secret_missing status=${response.status}`);
      return json(502, { error: "client_secret_missing" });
    }

    console.info(`[vr-medi-talk-session] client_secret_issued status=${response.status}`);
    return json(200, { value: secret.value, expires_at: secret.expires_at });
  } catch {
    console.error("[vr-medi-talk-session] openai_client_secret_network_failure");
    return json(502, { error: "openai_client_secret_network_failure" });
  }
};
