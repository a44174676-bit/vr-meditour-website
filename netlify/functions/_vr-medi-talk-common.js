const LANGUAGE_CONFIG = require("../../ai-interpreter/language-config.json");

const LANGUAGES = Object.freeze(Object.fromEntries(
  Object.values(LANGUAGE_CONFIG)
    .filter(({ enabled, medicallyVerified }) => enabled && medicallyVerified)
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

function guardRequest(event, { maxBodyLength = 1024 } = {}) {
  if (event.httpMethod === "OPTIONS") {
    return { response: { statusCode: 204, headers: { Allow: "POST, OPTIONS" }, body: "" } };
  }
  if (event.httpMethod !== "POST") {
    return { response: json(405, { error: "method_not_allowed" }, { Allow: "POST, OPTIONS" }) };
  }

  const headers = event.headers || {};
  const origin = headers.origin || headers.Origin;
  if (origin && !allowedOrigins(event).has(origin)) {
    return { response: json(403, { error: "origin_not_allowed" }) };
  }
  if ((event.body || "").length > maxBodyLength) {
    return { response: json(413, { error: "request_too_large" }) };
  }
  return { headers };
}

function getApiKey() {
  return process.env.VR_MEDI_TALK_OPENAI_API_KEY || null;
}

function getLanguage(code) {
  return LANGUAGES[code] || null;
}

module.exports = { LANGUAGES, json, guardRequest, getApiKey, getLanguage };
