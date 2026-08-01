const { json, guardRequest, getApiKey, getLanguage, isAllowedDirection, createSpeechToken } = require("./_vr-medi-talk-common");

const MAX_SOURCE_LENGTH = 2000;
const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    source_text: { type: "string" },
    translation: { type: "string" },
    numbers: { type: "array", items: { type: "string" } },
    dates_times: { type: "array", items: { type: "string" } },
    negations: { type: "array", items: { type: "string" } },
    medical_terms: { type: "array", items: { type: "string" } },
    uncertain_terms: { type: "array", items: { type: "string" } },
    safe_to_speak: { type: "boolean" },
  },
  required: ["source_text", "translation", "numbers", "dates_times", "negations", "medical_terms", "uncertain_terms", "safe_to_speak"],
};

const normalize = (value) => value.normalize("NFKC").replace(/\s+/g, " ").trim();
function digitTokens(value) {
  const normalized = normalize(value);
  const tokens = [];
  const matches = normalized.matchAll(/\d+(?:[.,]\d+)*(?:만|万)?/gu);
  for (const match of matches) {
    let token = match[0];
    const tenThousands = /(?:만|万)$/u.test(token);
    token = token.replace(/(?:만|万)$/u, "");
    if (/^\d{1,3}(?:[.,]\d{3})+$/u.test(token)) token = token.replace(/[.,]/g, "");
    if (tenThousands) token = String(Number(token.replace(/,/g, "")) * 10000);
    tokens.push(token);
  }
  return tokens;
}
const NEGATIONS = Object.freeze({
  ko: /(?:않|없|아니|금지|(?:^|[\s,])(안|못)(?=[\s,.!?]|$))/u,
  en: /(?:\b(?:no|not|never|without|cannot|can't|don't|doesn't|didn't)\b)/iu,
  vi: /(?:không|chưa|chẳng|chả|đừng)/iu,
  ja: /(?:ない|ありません|ません|なし|無し|無い)/u,
  zh: /(?:没有|不是|不能|不会|不|无|未)/u,
});
const DIRECTION_TERMS = Object.freeze({
  ko: { left: /왼쪽/u, right: /오른쪽/u },
  en: { left: /\bleft\b/iu, right: /\bright\b/iu },
  vi: { left: /(?:trái|bên trái)/iu, right: /(?:phải|bên phải)/iu },
  ja: { left: /(?:左|ひだり)/u, right: /(?:右|みぎ)/u },
  zh: { left: /(?:左边|左侧|左)/u, right: /(?:右边|右侧|右)/u },
});

function extractOutputText(response) {
  if (typeof response.output_text === "string") return response.output_text;
  for (const item of response.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  return "";
}

function validateResult(result, sourceText, sourceCode, targetCode) {
  if (!result || normalize(result.source_text || "") !== normalize(sourceText)) return false;
  if (!normalize(result.translation || "") || !Array.isArray(result.uncertain_terms) || result.uncertain_terms.length) return false;
  const sourceDigits = digitTokens(sourceText);
  const translatedDigits = digitTokens(result.translation);
  if (sourceDigits.some((token) => !translatedDigits.includes(token))) return false;
  if (NEGATIONS[sourceCode]?.test(sourceText) && !NEGATIONS[targetCode]?.test(result.translation)) return false;
  for (const side of ["left", "right"]) {
    if (DIRECTION_TERMS[sourceCode]?.[side].test(sourceText) && !DIRECTION_TERMS[targetCode]?.[side].test(result.translation)) return false;
  }
  return result.safe_to_speak === true;
}

async function requestStructuredResponse(apiKey, instructions, input) {
  return fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-5.6-terra",
      reasoning: { effort: "low" },
      store: false,
      instructions,
      input,
      text: { format: { type: "json_schema", name: "medical_translation", strict: true, schema: RESULT_SCHEMA } },
    }),
  });
}

exports.handler = async function handler(event) {
  const guard = guardRequest(event, { maxBodyLength: 8192 });
  if (guard.response) return guard.response;

  let request;
  try { request = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "invalid_json" }); }
  const source = getLanguage(request.sourceLanguage);
  const target = getLanguage(request.targetLanguage);
  const sourceText = typeof request.sourceText === "string" ? request.sourceText.trim() : "";
  if (!source || !target || !isAllowedDirection(source.code, target.code)) return json(400, { error: "unsupported_direction" });
  if (!sourceText) return json(400, { error: "source_text_required" });
  if (sourceText.length > MAX_SOURCE_LENGTH) return json(413, { error: "source_text_too_long" });

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("[vr-medi-talk-translate] missing_environment status=503");
    return json(503, { error: "missing_environment" });
  }

  const instructions = `You are a strict medical communication translator from ${source.nativeLabel} (${source.locale}) to ${target.nativeLabel} (${target.locale}). Translate only the user's exact sentence. Never answer a question; translate the question itself. Never add, infer, explain, diagnose, prescribe, or omit information. Preserve numbers, dates, times, money, units, proper nouns, medicine names, left/right directions, and negation. If any word is unclear, list it in uncertain_terms and set safe_to_speak false. Set safe_to_speak false if source_text or translation is empty, if anything was added, or if any number or negation was not preserved. Copy the input exactly into source_text. Return only the required JSON schema.`;

  try {
    const response = await requestStructuredResponse(apiKey, instructions, sourceText);
    if (!response.ok) {
      console.error(`[vr-medi-talk-translate] openai_rejected status=${response.status}`);
      return json(502, { error: "translation_failed" });
    }
    const payload = await response.json();
    let proposed;
    try { proposed = JSON.parse(extractOutputText(payload)); } catch { return json(502, { error: "invalid_translation_result" }); }
    if (!proposed.translation || proposed.uncertain_terms?.length) {
      proposed.safe_to_speak = false;
      return json(200, proposed);
    }

    const verificationInstructions = `Verify a proposed medical translation from ${source.nativeLabel} (${source.locale}) to ${target.nativeLabel} (${target.locale}). Compare it strictly with source_text. Do not improve, expand, answer, diagnose, or infer. Preserve the exact source_text. Return the proposed translation unchanged only when it contains no addition or omission and preserves every number, date, time, amount, unit, proper noun, medicine, left/right direction, and negation. List ambiguity in uncertain_terms. Set safe_to_speak false for any uncertainty or preservation failure. Return only the required JSON schema.`;
    const verificationResponse = await requestStructuredResponse(apiKey, verificationInstructions, JSON.stringify({
      source_text: sourceText,
      proposed_translation: proposed.translation,
    }));
    if (!verificationResponse.ok) {
      console.error(`[vr-medi-talk-translate] verification_rejected status=${verificationResponse.status}`);
      return json(502, { error: "translation_verification_failed" });
    }
    const verificationPayload = await verificationResponse.json();
    let result;
    try { result = JSON.parse(extractOutputText(verificationPayload)); } catch { return json(502, { error: "invalid_verification_result" }); }
    if (result.translation !== proposed.translation) result.safe_to_speak = false;
    result.safe_to_speak = validateResult(result, sourceText, source.code, target.code);
    console.info(`[vr-medi-talk-translate] completed status=${verificationResponse.status} safe_to_speak=${result.safe_to_speak}`);
    if (!result.safe_to_speak) return json(200, result);
    const speechToken = createSpeechToken(apiKey, source.code, target.code, result.translation);
    return json(200, result, { "X-VR-Medi-Talk-Speech-Token": speechToken });
  } catch {
    console.error("[vr-medi-talk-translate] network_failure");
    return json(502, { error: "translation_failed" });
  }
};

exports._test = { validateResult, digitTokens, extractOutputText };
