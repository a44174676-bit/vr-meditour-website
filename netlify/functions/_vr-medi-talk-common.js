const LANGUAGE_CONFIG = require("../../ai-interpreter/language-config.json");
const { createHmac, timingSafeEqual } = require("crypto");

const LANGUAGES = Object.freeze(Object.fromEntries(
  Object.values(LANGUAGE_CONFIG)
    .filter(({ enabled, medicallyVerified, translationMode, transcriptionLanguage, ttsLanguage }) =>
      enabled && medicallyVerified && translationMode === "staged-pipeline" && transcriptionLanguage && ttsLanguage)
    .map((language) => [language.code, language]),
));

const ALLOWED_DIRECTIONS = Object.freeze(new Set(
  Object.keys(LANGUAGES)
    .filter((code) => code !== "ko")
    .flatMap((code) => [`ko:${code}`, `${code}:ko`]),
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

function isAllowedDirection(sourceCode, targetCode) {
  return ALLOWED_DIRECTIONS.has(`${sourceCode}:${targetCode}`);
}

function speechSignature(apiKey, timestamp, sourceCode, targetCode, translation) {
  return createHmac("sha256", apiKey)
    .update(`${timestamp}\n${sourceCode}\n${targetCode}\n${translation}`)
    .digest("base64url");
}

function createSpeechToken(apiKey, sourceCode, targetCode, translation) {
  const timestamp = Date.now();
  return `${timestamp}.${speechSignature(apiKey, timestamp, sourceCode, targetCode, translation)}`;
}

function verifySpeechToken(apiKey, token, sourceCode, targetCode, translation) {
  if (typeof token !== "string") return false;
  const [timestampText, signature, ...extra] = token.split(".");
  const timestamp = Number(timestampText);
  if (extra.length || !Number.isFinite(timestamp) || Math.abs(Date.now() - timestamp) > 120000) return false;
  const expected = speechSignature(apiKey, timestamp, sourceCode, targetCode, translation);
  const actualBuffer = Buffer.from(signature || "");
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

module.exports = {
  LANGUAGES, ALLOWED_DIRECTIONS, json, guardRequest, getApiKey, getLanguage,
  isAllowedDirection, createSpeechToken, verifySpeechToken,
};
