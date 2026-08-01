import { ENABLED_LANGUAGES, getInterpretationDirections, getLanguage, loadLanguageConfig } from "./language-config.js";
import { normalizeUILanguage, resolveUILanguage, translateUI } from "./ui-translations.js";

await loadLanguageConfig();

const UI_LANGUAGE_KEY = "vrMediTalkUiLanguage";
const PARTNER_LANGUAGE_KEY = "vrMediTalkPartnerLanguage";
const MIN_RECORDING_MS = 500;
const MAX_RECORDING_MS = 15000;
const MIN_AUDIO_LEVEL = 0.012;
const SUPPORTED_CODES = Object.freeze(ENABLED_LANGUAGES.map(({ code }) => code));
const PARTNER_CODES = Object.freeze(SUPPORTED_CODES.filter((code) => code !== "ko"));

const ui = {
  badges: document.querySelector("#language-badges"),
  partnerOptions: document.querySelector("#interpretation-language-options"),
  partnerTitle: document.querySelector("#interpretation-selector-title"),
  partnerGuide: document.querySelector("#interpretation-selector-guide"),
  start: document.querySelector("#start-session"),
  end: document.querySelector("#end-session"),
  replay: document.querySelector("#replay-button"),
  controls: document.querySelector("#talk-controls"),
  status: document.querySelector("#connection-status"),
  title: document.querySelector("#session-title"),
  sourceLabel: document.querySelector("#source-label"),
  targetLabel: document.querySelector("#target-label"),
  sourceCaption: document.querySelector("#source-caption"),
  targetCaption: document.querySelector("#target-caption"),
  error: document.querySelector("#error-message"),
  retry: document.querySelector("#retry-session"),
};

const state = {
  uiLanguage: "ko",
  partnerLanguage: "vi",
  directions: [],
  ready: false,
  processing: false,
  ending: false,
  activeDirection: null,
  stream: null,
  recorder: null,
  chunks: [],
  startedAt: 0,
  stopRequested: false,
  discardRecording: false,
  stopTimer: null,
  audioContext: null,
  analyserFrame: null,
  peakLevel: 0,
  replayUrl: null,
  replayAudio: null,
  requestController: null,
};

class PipelineError extends Error {
  constructor(name, messageKey, status = null) {
    super(messageKey);
    this.name = name;
    this.messageKey = messageKey;
    this.status = status;
  }
}

const t = (key, values) => translateUI(state.uiLanguage, key, values);

function safeStorageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function safeStorageSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* storage can be unavailable */ }
}

function normalizedLanguage(value) {
  return normalizeUILanguage(value, SUPPORTED_CODES);
}

function resolveInitialLanguage() {
  return resolveUILanguage({
    query: new URLSearchParams(location.search).get("lang"),
    stored: safeStorageGet(UI_LANGUAGE_KEY),
    browser: navigator.language,
    supportedCodes: SUPPORTED_CODES,
  });
}

function resolvePartnerLanguage(uiLanguage) {
  if (uiLanguage !== "ko") return uiLanguage;
  const stored = normalizedLanguage(safeStorageGet(PARTNER_LANGUAGE_KEY));
  return PARTNER_CODES.includes(stored) ? stored : "vi";
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function setMultiline(selector, value) {
  const element = document.querySelector(selector);
  if (!element) return;
  const lines = value.split("|");
  element.replaceChildren(...lines.flatMap((line, index) => {
    const nodes = [document.createTextNode(line)];
    if (index < lines.length - 1) nodes.push(document.createElement("br"));
    return nodes;
  }));
}

function updateLanguageUrl(languageCode) {
  const url = new URL(location.href);
  url.searchParams.set("lang", languageCode);
  history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function renderCharacterSelector() {
  ui.badges.replaceChildren(...ENABLED_LANGUAGES.map((language) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "language-character-button";
    button.dataset.lang = language.code;
    button.setAttribute("aria-label", language.nativeLabel);
    button.setAttribute("aria-pressed", language.code === state.uiLanguage ? "true" : "false");
    button.title = language.nativeLabel;
    button.innerHTML = `<span class="character-frame"><img src="${language.characterImage}" alt="" /><span class="character-fallback" aria-hidden="true">${language.code.toUpperCase()}</span></span><span class="character-name">${language.nativeLabel}</span>`;
    const image = button.querySelector("img");
    image.addEventListener("error", () => button.classList.add("image-failed"));
    button.addEventListener("click", () => changeUILanguage(language.code));
    return button;
  }));
}

function renderPartnerSelector() {
  const codes = state.uiLanguage === "ko" ? PARTNER_CODES : ["ko"];
  ui.partnerOptions.replaceChildren(...codes.map((code) => {
    const language = getLanguage(code);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "interpretation-option";
    button.dataset.interpretationLang = code;
    button.textContent = language.nativeLabel;
    const selected = state.uiLanguage === "ko" ? code === state.partnerLanguage : true;
    button.setAttribute("aria-pressed", selected ? "true" : "false");
    button.setAttribute("aria-label", language.nativeLabel);
    button.title = language.nativeLabel;
    button.disabled = state.uiLanguage !== "ko" || state.ready || state.processing;
    if (state.uiLanguage === "ko") button.addEventListener("click", () => changePartnerLanguage(code));
    return button;
  }));
}

function applyUITranslations() {
  const language = getLanguage(state.uiLanguage);
  document.documentElement.lang = language.locale;
  document.title = t("pageTitle");
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("metaDescription"));
  setText("#skip-link", t("skipLink"));
  document.querySelector("#brand-link")?.setAttribute("aria-label", t("brandHomeLabel"));
  document.querySelector(".brand-logo")?.setAttribute("alt", t("logoAlt"));
  document.querySelector("#header-navigation")?.setAttribute("aria-label", t("navigationLabel"));
  setText("#company-home-link", t("companyHome"));
  setText("#privacy-link", t("privacyPolicy"));
  ui.badges.setAttribute("aria-label", t("selectLanguage"));
  setText(".service-label", t("serviceLabel"));
  setMultiline("#page-title", t("heroTitle"));
  setMultiline("#hero-description", t("heroDescription"));
  setText("#hero-sub", t("heroSub"));
  setText("#trust-voice", t("trustVoice"));
  setText("#trust-privacy", t("trustPrivacy"));
  setText("#trust-medical", t("trustMedical"));
  setText("#section-label", t("sectionLabel"));
  setText("#session-guide", t("sessionGuide"));
  ui.partnerTitle.textContent = t("selectInterpretationLanguage");
  ui.partnerGuide.textContent = t("partnerGuide");
  ui.partnerOptions.setAttribute("aria-label", t("selectInterpretationLanguage"));
  setText("#start-session-label", t("start"));
  setText("#data-processing-notice", t("dataProcessingNotice"));
  ui.controls.setAttribute("aria-label", t("speakingLanguageSelection"));
  document.querySelector(".canonical-captions")?.setAttribute("aria-label", t("currentCaptions"));
  setText("#replay-label", t("replay"));
  setText("#speak-again-label", t("speakAgain"));
  setText("#large-captions-label", t("largeCaptions"));
  setText("#end-session-label", t("endAndDelete"));
  setText("#connection-error-title", t("errorTitle"));
  setText("#error-guide", t("errorGuide"));
  setText("#retry-label", t("retry"));
  setText("#safety-notice-text", t("safetyNotice"));
  setText("#safety-details-label", t("details"));
  setText("#safety-detail-1", t("safetyDetail1"));
  setText("#safety-detail-2", t("safetyDetail2"));
  setText("#safety-detail-3", t("safetyDetail3"));
  setText("#footer-description", t("footerDescription"));
  document.querySelector("#footer-links")?.setAttribute("aria-label", t("footerLinks"));
  setText("#footer-privacy-link", t("privacyPolicy"));
  setText("#footer-home-link", t("companyHome"));
  setCaption(ui.sourceCaption, "", t("sourcePlaceholder"));
  setCaption(ui.targetCaption, "", t("translationPlaceholder"));
  ui.sourceLabel.textContent = t("sourceCaption");
  ui.targetLabel.textContent = t("translationCaption");
  if (!state.ready && !state.processing) setStatus(t("waiting"));
  renderCharacterSelector();
  renderPartnerSelector();
  renderSessionForPair();
}

async function changeUILanguage(languageCode) {
  if (languageCode === state.uiLanguage) return;
  if (state.ready || state.processing || state.activeDirection) await endConversation(false);
  state.uiLanguage = languageCode;
  state.partnerLanguage = resolvePartnerLanguage(languageCode);
  state.directions = getInterpretationDirections(state.partnerLanguage);
  safeStorageSet(UI_LANGUAGE_KEY, languageCode);
  updateLanguageUrl(languageCode);
  applyUITranslations();
  resetSessionUI();
}

async function changePartnerLanguage(languageCode) {
  if (!PARTNER_CODES.includes(languageCode) || languageCode === state.partnerLanguage) return;
  if (state.ready || state.processing || state.activeDirection) await endConversation(false);
  state.partnerLanguage = languageCode;
  state.directions = getInterpretationDirections(languageCode);
  safeStorageSet(PARTNER_LANGUAGE_KEY, languageCode);
  renderPartnerSelector();
  renderSessionForPair();
  resetSessionUI();
}

function renderSessionForPair() {
  const korean = getLanguage("ko");
  const partner = getLanguage(state.partnerLanguage);
  ui.title.replaceChildren(document.createTextNode(`${korean.nativeLabel} `), Object.assign(document.createElement("span"), { textContent: "↔" }), document.createTextNode(` ${partner.nativeLabel}`));
  ui.title.querySelector("span")?.setAttribute("aria-hidden", "true");
  renderLanguageCards();
}

function renderLanguageCards() {
  ui.controls.replaceChildren(...state.directions.map((direction) => {
    const isPartner = direction.source.code !== "ko";
    const card = document.createElement("article");
    card.className = `language-card ${isPartner ? "is-foreign" : "is-korean"}`;
    card.dataset.direction = direction.source.code;
    card.setAttribute("aria-live", "polite");

    const header = document.createElement("header");
    header.className = "language-card-header";
    header.innerHTML = `<div><p class="language-kicker">${direction.source.label.toUpperCase()}</p><h3>${direction.source.nativeLabel}</h3></div><span class="card-status">${t("ready")}</span>`;
    const sourcePanel = document.createElement("div");
    sourcePanel.className = "card-caption is-source";
    sourcePanel.innerHTML = `<span class="card-caption-label">${t("sourceCaption")}</span><p class="card-source-caption placeholder">${t("sourcePlaceholder")}</p>`;
    const targetPanel = document.createElement("div");
    targetPanel.className = "card-caption is-translation";
    targetPanel.innerHTML = `<span class="card-caption-label">${t("translationFor", { language: direction.target.nativeLabel })}</span><p class="card-target-caption placeholder">${t("translationPlaceholder")}</p>`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "talk-button";
    button.dataset.direction = direction.source.code;
    button.lang = direction.source.locale;
    button.innerHTML = `<strong>${t("pressToSpeak", { language: direction.source.nativeLabel })}</strong><span>${t("releaseGuide", { target: direction.target.nativeLabel })}</span>`;
    button.addEventListener("pointerdown", (event) => beginTalking(event, direction));
    button.addEventListener("pointerup", () => stopTalking(direction));
    button.addEventListener("pointercancel", () => stopTalking(direction));
    button.addEventListener("lostpointercapture", () => stopTalking(direction));
    const replay = document.createElement("button");
    replay.type = "button";
    replay.className = "card-replay";
    replay.disabled = true;
    replay.textContent = `↻ ${t("replay")}`;
    replay.addEventListener("click", replayLastTranslation);
    card.append(header, sourcePanel, targetPanel, button, replay);
    return card;
  }));
}

function getDirectionCard(direction) {
  return ui.controls.querySelector(`.language-card[data-direction="${direction.source.code}"]`);
}

function setCaption(element, text, placeholder) {
  element.textContent = text || placeholder;
  element.classList.toggle("placeholder", !text);
}

function setCardCaption(card, selector, text, placeholder) {
  const element = card?.querySelector(selector);
  if (element) setCaption(element, text, placeholder);
}

function setStatus(message, mode = "") {
  ui.status.textContent = message;
  ui.status.className = `status${mode ? ` is-${mode}` : ""}`;
}

function setTalkButtonsDisabled(disabled) {
  document.querySelectorAll(".talk-button").forEach((button) => { button.disabled = disabled; });
}

function showError(messageKey) {
  ui.error.textContent = t(messageKey);
  ui.error.hidden = false;
}

function clearError() {
  ui.error.textContent = "";
  ui.error.hidden = true;
}

async function startConversation() {
  if (state.ready || state.processing || state.ending) return;
  clearError();
  ui.start.disabled = true;
  setStatus(t("microphoneChecking"), "busy");
  try {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) throw new PipelineError("MEDIA_UNSUPPORTED", "mediaUnsupported");
    const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    permissionStream.getTracks().forEach((track) => track.stop());
    state.ready = true;
    ui.start.hidden = true;
    ui.controls.hidden = false;
    ui.end.disabled = false;
    renderPartnerSelector();
    setStatus(t("sessionReady"), "live");
  } catch (error) {
    const denied = error?.name === "NotAllowedError";
    console.error(denied ? "MICROPHONE_PERMISSION_DENIED" : (error?.name || "SESSION_START_FAILED"));
    showError(denied ? "microphonePermissionDenied" : (error.messageKey || "genericFailed"));
    ui.start.disabled = false;
    setStatus(t("genericFailed"));
  }
}

function preferredMimeType() {
  return ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"]
    .find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function monitorAudio(stream) {
  state.peakLevel = 0;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) { state.peakLevel = 1; return; }
  state.audioContext = new AudioContext();
  const source = state.audioContext.createMediaStreamSource(stream);
  const analyser = state.audioContext.createAnalyser();
  analyser.fftSize = 1024;
  source.connect(analyser);
  const samples = new Uint8Array(analyser.fftSize);
  const sample = () => {
    analyser.getByteTimeDomainData(samples);
    let sum = 0;
    for (const value of samples) {
      const centered = (value - 128) / 128;
      sum += centered * centered;
    }
    state.peakLevel = Math.max(state.peakLevel, Math.sqrt(sum / samples.length));
    state.analyserFrame = requestAnimationFrame(sample);
  };
  sample();
}

async function beginTalking(event, direction) {
  if (!state.ready || state.processing || state.activeDirection || state.ending) return;
  event.preventDefault();
  clearError();
  clearReplay();
  state.activeDirection = direction;
  state.stopRequested = false;
  state.discardRecording = false;
  state.chunks = [];
  setTalkButtonsDisabled(true);
  event.currentTarget.disabled = false;
  event.currentTarget.setPointerCapture?.(event.pointerId);
  event.currentTarget.classList.add("is-pressed");
  const card = getDirectionCard(direction);
  card?.classList.add("is-listening");
  const cardStatus = card?.querySelector(".card-status");
  if (cardStatus) cardStatus.textContent = t("listening");
  setCardCaption(card, ".card-source-caption", "", t("listening"));
  setCardCaption(card, ".card-target-caption", "", t("awaitingFinal"));
  ui.sourceLabel.textContent = t("originalFor", { language: direction.source.nativeLabel });
  ui.targetLabel.textContent = t("translationFor", { language: direction.target.nativeLabel });
  setCaption(ui.sourceCaption, "", t("listening"));
  setCaption(ui.targetCaption, "", t("awaitingFinal"));
  setStatus(t("listening"), "busy");

  try {
    state.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: false });
    const mimeType = preferredMimeType();
    state.recorder = new MediaRecorder(state.stream, mimeType ? { mimeType } : undefined);
    state.recorder.addEventListener("dataavailable", ({ data }) => { if (data.size) state.chunks.push(data); });
    state.recorder.addEventListener("stop", () => processRecording(direction));
    state.startedAt = performance.now();
    monitorAudio(state.stream);
    state.recorder.start();
    state.stopTimer = setTimeout(() => stopTalking(direction), MAX_RECORDING_MS);
    if (state.stopRequested) stopTalking(direction);
  } catch (error) {
    cleanupRecording();
    state.activeDirection = null;
    setTalkButtonsDisabled(false);
    console.error(error?.name === "NotAllowedError" ? "MICROPHONE_PERMISSION_DENIED" : "MEDIA_RECORDER_START_FAILED");
    showError(error?.name === "NotAllowedError" ? "microphonePermissionDenied" : "genericFailed");
    resetCardState(direction);
  }
}

function stopTalking(direction) {
  if (state.activeDirection?.source.code !== direction.source.code) return;
  if (!state.recorder || state.recorder.state !== "recording") { state.stopRequested = true; return; }
  clearTimeout(state.stopTimer);
  state.recorder.stop();
  state.stream?.getTracks().forEach((track) => track.stop());
  const card = getDirectionCard(direction);
  card?.classList.remove("is-listening");
  const cardStatus = card?.querySelector(".card-status");
  if (cardStatus) cardStatus.textContent = t("transcribing");
  setStatus(t("transcribing"), "busy");
}

function cleanupRecording() {
  clearTimeout(state.stopTimer);
  if (state.analyserFrame) cancelAnimationFrame(state.analyserFrame);
  state.analyserFrame = null;
  state.audioContext?.close().catch(() => {});
  state.audioContext = null;
  state.stream?.getTracks().forEach((track) => track.stop());
  state.stream = null;
  state.recorder = null;
}

async function fetchJson(url, options, errorName, messageKey) {
  let response;
  try { response = await fetch(url, options); } catch { throw new PipelineError(errorName, messageKey); }
  if (!response.ok) throw new PipelineError(errorName, response.status === 422 ? "transcriptionFailed" : messageKey, response.status);
  try {
    const data = await response.json();
    const speechToken = response.headers.get("X-VR-Medi-Talk-Speech-Token");
    if (speechToken) Object.defineProperty(data, "speechToken", { value: speechToken, enumerable: false });
    return data;
  } catch { throw new PipelineError(errorName, messageKey); }
}

async function processRecording(direction) {
  if (state.ending || state.discardRecording) {
    state.discardRecording = false;
    return;
  }
  const duration = performance.now() - state.startedAt;
  const mimeType = state.recorder?.mimeType || "audio/webm";
  const chunks = state.chunks.slice();
  const peakLevel = state.peakLevel;
  cleanupRecording();
  state.processing = true;
  state.requestController = new AbortController();
  const card = getDirectionCard(direction);
  try {
    if (duration < MIN_RECORDING_MS || !chunks.length || peakLevel < MIN_AUDIO_LEVEL) throw new PipelineError("AUDIO_TOO_SHORT_OR_SILENT", "transcriptionFailed");
    const transcription = await fetchJson("/.netlify/functions/vr-medi-talk-transcribe", {
      method: "POST",
      headers: { "Content-Type": mimeType, "X-VR-Medi-Talk-Language": direction.source.code },
      body: new Blob(chunks, { type: mimeType }),
      signal: state.requestController.signal,
    }, "TRANSCRIPTION_FAILED", "transcriptionFailed");
    const sourceText = transcription.source_text?.trim();
    if (!sourceText || [...sourceText.replace(/\s/g, "")].length < 2) throw new PipelineError("TRANSCRIPT_TOO_SHORT", "transcriptionFailed");
    setCardCaption(card, ".card-source-caption", sourceText, "");
    setCaption(ui.sourceCaption, sourceText, "");
    setStatus(t("translating"), "busy");
    const cardStatus = card?.querySelector(".card-status");
    if (cardStatus) cardStatus.textContent = t("checkingTranslation");
    const translation = await fetchJson("/.netlify/functions/vr-medi-talk-translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceLanguage: direction.source.code, targetLanguage: direction.target.code, sourceText }),
      signal: state.requestController.signal,
    }, "TRANSLATION_FAILED", "translationFailed");
    if (!translation.translation || translation.source_text !== sourceText || translation.safe_to_speak !== true) throw new PipelineError("TRANSLATION_VERIFICATION_FAILED", "verificationFailed");
    setCardCaption(card, ".card-target-caption", translation.translation, "");
    setCaption(ui.targetCaption, translation.translation, "");
    let speechResponse;
    try {
      speechResponse = await fetch("/.netlify/functions/vr-medi-talk-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-VR-Medi-Talk-Speech-Token": translation.speechToken },
        body: JSON.stringify({ sourceLanguage: direction.source.code, targetLanguage: direction.target.code, translation: translation.translation, safe_to_speak: true }),
        signal: state.requestController.signal,
      });
    } catch { throw new PipelineError("SPEECH_FAILED", "speechFailed"); }
    if (!speechResponse.ok) throw new PipelineError("SPEECH_FAILED", "speechFailed", speechResponse.status);
    storeReplay(await speechResponse.blob());
    await state.replayAudio.play().catch(() => {});
    if (cardStatus) cardStatus.textContent = t("completed");
    setStatus(t("completed"), "live");
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.error(error?.name || "PIPELINE_FAILED", Number.isInteger(error?.status) ? error.status : "");
      showError(error?.messageKey || "genericFailed");
      setCardCaption(card, ".card-target-caption", "", t("noTranslation"));
      setCaption(ui.targetCaption, "", t("noTranslation"));
      const cardStatus = card?.querySelector(".card-status");
      if (cardStatus) cardStatus.textContent = t("speakAgain");
      setStatus(t("speakAgain"));
    }
  } finally {
    state.processing = false;
    state.activeDirection = null;
    state.requestController = null;
    setTalkButtonsDisabled(false);
    document.querySelectorAll(".talk-button").forEach((button) => button.classList.remove("is-pressed"));
  }
}

function storeReplay(blob) {
  clearReplay();
  state.replayUrl = URL.createObjectURL(blob);
  state.replayAudio = new Audio(state.replayUrl);
  ui.replay.disabled = false;
  document.querySelectorAll(".card-replay").forEach((button) => { button.disabled = false; });
}

function replayLastTranslation() {
  if (!state.replayUrl) return;
  state.replayAudio?.pause();
  state.replayAudio = new Audio(state.replayUrl);
  state.replayAudio.play().catch(() => showError("playbackBlocked"));
}

function clearReplay() {
  state.replayAudio?.pause();
  state.replayAudio = null;
  if (state.replayUrl) URL.revokeObjectURL(state.replayUrl);
  state.replayUrl = null;
  ui.replay.disabled = true;
  document.querySelectorAll(".card-replay").forEach((button) => { button.disabled = true; });
}

function resetCardState(direction) {
  const card = getDirectionCard(direction);
  card?.classList.remove("is-listening");
  const cardStatus = card?.querySelector(".card-status");
  if (cardStatus) cardStatus.textContent = t("ready");
}

function resetSessionUI() {
  setCaption(ui.sourceCaption, "", t("sourcePlaceholder"));
  setCaption(ui.targetCaption, "", t("translationPlaceholder"));
  ui.sourceLabel.textContent = t("sourceCaption");
  ui.targetLabel.textContent = t("translationCaption");
  ui.controls.hidden = true;
  ui.start.hidden = false;
  ui.start.disabled = false;
  ui.end.disabled = true;
  clearError();
  setStatus(t("waiting"));
  renderPartnerSelector();
}

async function endConversation(resetUI = true) {
  if (state.ending) return;
  state.ending = true;
  state.requestController?.abort();
  if (state.recorder?.state === "recording") {
    state.discardRecording = true;
    state.recorder.stop();
  }
  cleanupRecording();
  state.chunks = [];
  state.activeDirection = null;
  state.processing = false;
  state.ready = false;
  clearReplay();
  if (resetUI) {
    resetSessionUI();
    setStatus(t("sessionDeleted"));
    renderLanguageCards();
  }
  state.ending = false;
}

state.uiLanguage = resolveInitialLanguage();
state.partnerLanguage = resolvePartnerLanguage(state.uiLanguage);
state.directions = getInterpretationDirections(state.partnerLanguage);
safeStorageSet(UI_LANGUAGE_KEY, state.uiLanguage);
updateLanguageUrl(state.uiLanguage);
applyUITranslations();
resetSessionUI();

ui.start.addEventListener("click", startConversation);
ui.end.addEventListener("click", () => endConversation(true));
ui.replay.addEventListener("click", replayLastTranslation);
ui.retry.addEventListener("click", () => {
  if (state.ready) {
    clearError();
    setStatus(t("sessionReady"), "live");
    setTalkButtonsDisabled(false);
  } else {
    startConversation();
  }
});
window.addEventListener("pagehide", () => endConversation(false));
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") endConversation(false); });

export const __test = Object.freeze({ normalizedLanguage, resolvePartnerLanguage });
