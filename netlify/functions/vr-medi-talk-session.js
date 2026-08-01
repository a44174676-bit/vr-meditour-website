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

function allowedOrigins() {
  return [process.env.URL, process.env.DEPLOY_URL, process.env.DEPLOY_PRIME_URL]
    .filter(Boolean)
    .map((value) => {
      try { return new URL(value).origin; } catch { return null; }
    })
    .filter(Boolean);
}

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: { Allow: "POST, OPTIONS" }, body: "" };
  if (event.httpMethod !== "POST") return json(405, { error: "method_not_allowed" }, { Allow: "POST, OPTIONS" });

  const origin = event.headers.origin || event.headers.Origin;
  const origins = allowedOrigins();
  if (origin && origins.length && !origins.includes(origin)) return json(403, { error: "origin_not_allowed" });
  if ((event.body || "").length > 1024) return json(413, { error: "request_too_large" });

  let request;
  try { request = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "invalid_json" }); }
  const target = ALLOWED_TARGETS[request.targetLanguage];
  if (!target || Object.keys(ALLOWED_TARGETS).length !== 2) return json(400, { error: "unsupported_language" });

  const apiKey = process.env.VR_MEDI_TALK_OPENAI_API_KEY;
  if (!apiKey) return json(503, { error: "service_unavailable" });

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
      console.error("[vr-medi-talk-session] client secret request failed", response.status);
      return json(502, { error: "realtime_session_unavailable" });
    }
    const secret = await response.json();
    return json(200, { value: secret.value, expires_at: secret.expires_at });
  } catch (error) {
    console.error("[vr-medi-talk-session] network failure", error?.name || "unknown");
    return json(502, { error: "realtime_session_unavailable" });
  }
};
