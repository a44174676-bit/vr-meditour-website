const { Blob } = require("buffer");
const { json, guardRequest, getApiKey, getLanguage } = require("./_vr-medi-talk-common");

const MAX_AUDIO_BYTES = 4 * 1024 * 1024;

exports.handler = async function handler(event) {
  const guard = guardRequest(event, { maxBodyLength: Math.ceil(MAX_AUDIO_BYTES * 4 / 3) + 16 });
  if (guard.response) return guard.response;

  const languageCode = guard.headers["x-vr-medi-talk-language"] || guard.headers["X-VR-Medi-Talk-Language"];
  const language = getLanguage(languageCode);
  if (!language) return json(400, { error: "unsupported_language" });

  const contentType = (guard.headers["content-type"] || guard.headers["Content-Type"] || "audio/webm").split(";")[0];
  if (!contentType.startsWith("audio/")) return json(415, { error: "unsupported_media_type" });

  let audio;
  try {
    audio = Buffer.from(event.body || "", event.isBase64Encoded ? "base64" : "binary");
  } catch {
    return json(400, { error: "invalid_audio" });
  }
  if (!audio.length) return json(400, { error: "empty_audio" });
  if (audio.length > MAX_AUDIO_BYTES) return json(413, { error: "request_too_large" });

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("[vr-medi-talk-transcribe] missing_environment status=503");
    return json(503, { error: "missing_environment" });
  }

  const form = new FormData();
  const extension = contentType.includes("ogg") ? "ogg" : contentType.includes("mp4") ? "mp4" : "webm";
  form.append("file", new Blob([audio], { type: contentType }), `utterance.${extension}`);
  form.append("model", "gpt-4o-transcribe");
  form.append("language", language.transcriptionLanguage);
  form.append("response_format", "json");

  try {
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    if (!response.ok) {
      console.error(`[vr-medi-talk-transcribe] openai_rejected status=${response.status}`);
      return json(502, { error: "transcription_failed" });
    }
    const result = await response.json();
    const text = typeof result.text === "string" ? result.text.trim() : "";
    if (!text) return json(422, { error: "speech_not_recognized" });
    console.info(`[vr-medi-talk-transcribe] completed status=${response.status}`);
    return json(200, { source_text: text });
  } catch {
    console.error("[vr-medi-talk-transcribe] network_failure");
    return json(502, { error: "transcription_failed" });
  }
};
