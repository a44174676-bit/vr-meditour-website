const { json, guardRequest, getApiKey, getLanguage } = require("./_vr-medi-talk-common");

const MAX_TEXT_LENGTH = 2000;

exports.handler = async function handler(event) {
  const guard = guardRequest(event, { maxBodyLength: 8192 });
  if (guard.response) return guard.response;

  let request;
  try { request = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "invalid_json" }); }
  const language = getLanguage(request.targetLanguage);
  const text = typeof request.translation === "string" ? request.translation.trim() : "";
  if (!language) return json(400, { error: "unsupported_language" });
  if (!text || request.safe_to_speak !== true) return json(400, { error: "unverified_translation" });
  if (text.length > MAX_TEXT_LENGTH) return json(413, { error: "text_too_long" });

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("[vr-medi-talk-speech] missing_environment status=503");
    return json(503, { error: "missing_environment" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "tts-1-hd", voice: "alloy", input: text, response_format: "mp3" }),
    });
    if (!response.ok) {
      console.error(`[vr-medi-talk-speech] openai_rejected status=${response.status}`);
      return json(502, { error: "speech_failed" });
    }
    const audio = Buffer.from(await response.arrayBuffer());
    if (!audio.length) return json(502, { error: "speech_missing" });
    console.info(`[vr-medi-talk-speech] completed status=${response.status}`);
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store, private", "X-Content-Type-Options": "nosniff" },
      body: audio.toString("base64"),
    };
  } catch {
    console.error("[vr-medi-talk-speech] network_failure");
    return json(502, { error: "speech_failed" });
  }
};
