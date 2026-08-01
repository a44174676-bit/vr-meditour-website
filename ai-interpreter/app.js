import { ENABLED_LANGUAGES, TRANSLATION_DIRECTIONS, getLanguage, loadLanguageConfig } from "./language-config.js";

await loadLanguageConfig();

const ui = {
  badges: document.querySelector("#language-badges"),
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

const MIN_RECORDING_MS = 500;
const MAX_RECORDING_MS = 15000;
const MIN_AUDIO_LEVEL = 0.012;

const state = {
  ready: false,
  processing: false,
  ending: false,
  activeDirection: null,
  stream: null,
  recorder: null,
  chunks: [],
  startedAt: 0,
  stopRequested: false,
  stopTimer: null,
  audioContext: null,
  analyserFrame: null,
  peakLevel: 0,
  replayUrl: null,
  replayAudio: null,
  requestController: null,
};

const MESSAGES = Object.freeze({
  listening: "듣고 있습니다 — 말이 끝나면 손을 떼세요",
  transcribing: "음성을 정확히 인식하고 있습니다.",
  translating: "원문을 확인했습니다. 번역하고 있습니다.",
  unclear: "음성을 정확히 인식하지 못했습니다. 천천히 다시 말씀해 주세요.",
  verify: "중요한 단어나 숫자를 확인하지 못했습니다. 원문을 확인한 후 다시 시도해 주세요.",
  failed: "통역 처리에 실패했습니다. 잠시 후 다시 말씀해 주세요.",
});

class PipelineError extends Error {
  constructor(name, message, status = null) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

function renderLanguageUI() {
  ui.badges.replaceChildren(...ENABLED_LANGUAGES.map((language) => {
    const badge = document.createElement("span");
    badge.className = "language-badge";
    badge.textContent = language.nativeLabel;
    badge.lang = language.locale;
    return badge;
  }));

  ui.controls.replaceChildren(...TRANSLATION_DIRECTIONS.map((direction) => {
    const isVietnamese = direction.source.locale === "vi-VN";
    const card = document.createElement("article");
    card.className = `language-card${isVietnamese ? " is-vietnamese" : " is-korean"}`;
    card.dataset.direction = direction.source.code;
    card.setAttribute("aria-live", "polite");

    const header = document.createElement("header");
    header.className = "language-card-header";
    header.innerHTML = `<div><p class="language-kicker">${isVietnamese ? "VIETNAMESE" : "KOREAN"}</p><h3>${isVietnamese ? "Người dùng tiếng Việt" : "한국어 사용자"}</h3></div><span class="card-status">${isVietnamese ? "Sẵn sàng" : "말하기 대기"}</span>`;

    const sourcePanel = document.createElement("div");
    sourcePanel.className = "card-caption is-source";
    sourcePanel.innerHTML = `<span class="card-caption-label">${isVietnamese ? "Phụ đề gốc" : "원문 자막"}</span><p class="card-source-caption placeholder">${isVietnamese ? "Lời nói gốc sẽ hiển thị ở đây." : "말한 내용이 여기에 표시됩니다."}</p>`;

    const targetPanel = document.createElement("div");
    targetPanel.className = "card-caption is-translation";
    targetPanel.innerHTML = `<span class="card-caption-label">${isVietnamese ? "Bản dịch tiếng Hàn" : "베트남어 번역"}</span><p class="card-target-caption placeholder">${isVietnamese ? "Bản dịch tiếng Hàn sẽ hiển thị ở đây." : "베트남어 번역이 여기에 표시됩니다."}</p>`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "talk-button";
    button.dataset.direction = direction.source.code;
    button.lang = direction.source.locale;
    const buttonLabel = isVietnamese ? "Nhấn và nói tiếng Việt" : "누르고 한국어로 말하기";
    const guide = isVietnamese ? "Thả nút khi nói xong" : "말이 끝나면 손을 떼세요";
    button.innerHTML = `<strong>${buttonLabel}</strong><span>${guide} · ${direction.target.nativeLabel}</span>`;
    button.addEventListener("pointerdown", (event) => beginTalking(event, direction));
    button.addEventListener("pointerup", () => stopTalking(direction));
    button.addEventListener("pointercancel", () => stopTalking(direction));
    button.addEventListener("lostpointercapture", () => stopTalking(direction));

    const replay = document.createElement("button");
    replay.type = "button";
    replay.className = "card-replay";
    replay.disabled = true;
    replay.innerHTML = isVietnamese ? "↻ Nghe lại bản dịch" : "↻ 번역 다시 듣기";
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

function showError(message) {
  ui.error.textContent = message;
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
  setStatus("마이크 권한 확인 중", "busy");
  try {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) throw new PipelineError("MEDIA_UNSUPPORTED", "이 브라우저에서는 음성 녹음을 사용할 수 없습니다.");
    const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    permissionStream.getTracks().forEach((track) => track.stop());
    state.ready = true;
    ui.start.hidden = true;
    ui.controls.hidden = false;
    ui.end.disabled = false;
    ui.title.textContent = "버튼을 누르고 말씀해 주세요";
    setStatus("통역 준비 완료", "live");
  } catch (error) {
    const denied = error?.name === "NotAllowedError";
    console.error(denied ? "MICROPHONE_PERMISSION_DENIED" : (error?.name || "SESSION_START_FAILED"));
    showError(denied ? "마이크 권한이 거부되었습니다. 브라우저 설정에서 마이크를 허용해 주세요." : error.message || MESSAGES.failed);
    ui.start.disabled = false;
    setStatus("연결을 확인해 주세요");
  }
}

function preferredMimeType() {
  return ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"]
    .find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function monitorAudio(stream) {
  state.peakLevel = 0;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    state.peakLevel = 1;
    return;
  }
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
  state.chunks = [];
  setTalkButtonsDisabled(true);
  event.currentTarget.disabled = false;
  event.currentTarget.setPointerCapture?.(event.pointerId);
  event.currentTarget.classList.add("is-pressed");

  const card = getDirectionCard(direction);
  card?.classList.add("is-listening");
  const cardStatus = card?.querySelector(".card-status");
  if (cardStatus) cardStatus.textContent = MESSAGES.listening;
  setCardCaption(card, ".card-source-caption", "", MESSAGES.listening);
  setCardCaption(card, ".card-target-caption", "", "원문이 확정된 뒤 번역합니다.");
  ui.sourceLabel.textContent = `${direction.source.nativeLabel} 원문`;
  ui.targetLabel.textContent = `${direction.target.nativeLabel} 번역`;
  setCaption(ui.sourceCaption, "", MESSAGES.listening);
  setCaption(ui.targetCaption, "", "원문이 확정된 뒤 번역합니다.");
  setStatus(MESSAGES.listening, "busy");

  try {
    state.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: false,
    });
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
    showError(error?.name === "NotAllowedError" ? "마이크 권한이 거부되었습니다. 브라우저 설정에서 마이크를 허용해 주세요." : MESSAGES.failed);
    resetCardState(direction);
  }
}

function stopTalking(direction) {
  if (state.activeDirection?.source.code !== direction.source.code) return;
  if (!state.recorder || state.recorder.state !== "recording") {
    state.stopRequested = true;
    return;
  }
  clearTimeout(state.stopTimer);
  state.recorder.stop();
  state.stream?.getTracks().forEach((track) => track.stop());
  const card = getDirectionCard(direction);
  card?.classList.remove("is-listening");
  const cardStatus = card?.querySelector(".card-status");
  if (cardStatus) cardStatus.textContent = MESSAGES.transcribing;
  setStatus(MESSAGES.transcribing, "busy");
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

async function fetchJson(url, options, errorName) {
  let response;
  try { response = await fetch(url, options); } catch { throw new PipelineError(errorName, MESSAGES.failed); }
  if (!response.ok) throw new PipelineError(errorName, response.status === 422 ? MESSAGES.unclear : MESSAGES.failed, response.status);
  try { return await response.json(); } catch { throw new PipelineError(errorName, MESSAGES.failed); }
}

async function processRecording(direction) {
  if (state.ending) return;
  const duration = performance.now() - state.startedAt;
  const mimeType = state.recorder?.mimeType || "audio/webm";
  const chunks = state.chunks.slice();
  const peakLevel = state.peakLevel;
  cleanupRecording();
  state.processing = true;
  state.requestController = new AbortController();
  const card = getDirectionCard(direction);

  try {
    if (duration < MIN_RECORDING_MS || !chunks.length || peakLevel < MIN_AUDIO_LEVEL) {
      throw new PipelineError("AUDIO_TOO_SHORT_OR_SILENT", MESSAGES.unclear);
    }
    const audioBlob = new Blob(chunks, { type: mimeType });
    const transcription = await fetchJson("/.netlify/functions/vr-medi-talk-transcribe", {
      method: "POST",
      headers: { "Content-Type": mimeType, "X-VR-Medi-Talk-Language": direction.source.code },
      body: audioBlob,
      signal: state.requestController.signal,
    }, "TRANSCRIPTION_FAILED");
    const sourceText = transcription.source_text?.trim();
    if (!sourceText || [...sourceText.replace(/\s/g, "")].length < 2) throw new PipelineError("TRANSCRIPT_TOO_SHORT", MESSAGES.unclear);

    setCardCaption(card, ".card-source-caption", sourceText, "");
    setCaption(ui.sourceCaption, sourceText, "");
    setStatus(MESSAGES.translating, "busy");
    const cardStatus = card?.querySelector(".card-status");
    if (cardStatus) cardStatus.textContent = MESSAGES.translating;

    const translation = await fetchJson("/.netlify/functions/vr-medi-talk-translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceLanguage: direction.source.code, targetLanguage: direction.target.code, sourceText }),
      signal: state.requestController.signal,
    }, "TRANSLATION_FAILED");
    if (!translation.translation || translation.source_text !== sourceText || translation.safe_to_speak !== true) {
      throw new PipelineError("TRANSLATION_VERIFICATION_FAILED", MESSAGES.verify);
    }

    setCardCaption(card, ".card-target-caption", translation.translation, "");
    setCaption(ui.targetCaption, translation.translation, "");

    let speechResponse;
    try {
      speechResponse = await fetch("/.netlify/functions/vr-medi-talk-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetLanguage: direction.target.code, translation: translation.translation, safe_to_speak: true }),
        signal: state.requestController.signal,
      });
    } catch { throw new PipelineError("SPEECH_FAILED", MESSAGES.failed); }
    if (!speechResponse.ok) throw new PipelineError("SPEECH_FAILED", MESSAGES.failed, speechResponse.status);
    storeReplay(await speechResponse.blob());
    await state.replayAudio.play().catch(() => {});
    if (cardStatus) cardStatus.textContent = direction.source.locale === "vi-VN" ? "Hoàn tất" : "통역 완료";
    setStatus("통역 완료", "live");
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.error(error?.name || "PIPELINE_FAILED", Number.isInteger(error?.status) ? error.status : "");
      showError(error?.message || MESSAGES.failed);
      setCardCaption(card, ".card-target-caption", "", "번역을 표시하지 않았습니다. 다시 말씀해 주세요.");
      setCaption(ui.targetCaption, "", "번역을 표시하지 않았습니다. 다시 말씀해 주세요.");
      const cardStatus = card?.querySelector(".card-status");
      if (cardStatus) cardStatus.textContent = "다시 말하기";
      setStatus("다시 말씀해 주세요");
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
  state.replayAudio.play().catch(() => showError("브라우저가 재생을 차단했습니다. 다시 듣기 버튼을 눌러 주세요."));
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
  if (cardStatus) cardStatus.textContent = direction.source.locale === "vi-VN" ? "Sẵn sàng" : "말하기 대기";
}

async function endConversation(resetUI = true) {
  if (state.ending) return;
  state.ending = true;
  state.requestController?.abort();
  if (state.recorder?.state === "recording") state.recorder.stop();
  cleanupRecording();
  state.chunks = [];
  state.activeDirection = null;
  state.processing = false;
  state.ready = false;
  clearReplay();

  if (resetUI) {
    setCaption(ui.sourceCaption, "", "말을 시작하면 확정 원문이 표시됩니다.");
    setCaption(ui.targetCaption, "", "검증된 번역문이 여기에 표시됩니다.");
    ui.sourceLabel.textContent = "원문";
    ui.targetLabel.textContent = "번역";
    ui.controls.hidden = true;
    ui.start.hidden = false;
    ui.start.disabled = false;
    ui.end.disabled = true;
    ui.title.textContent = "대화를 시작하세요";
    setStatus("세션 및 메모리 삭제 완료");
    renderLanguageUI();
  }
  state.ending = false;
}

ui.start.addEventListener("click", startConversation);
ui.end.addEventListener("click", () => endConversation(true));
ui.replay.addEventListener("click", replayLastTranslation);
ui.retry.addEventListener("click", startConversation);
window.addEventListener("pagehide", () => endConversation(false));
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") endConversation(false); });
renderLanguageUI();
ENABLED_LANGUAGES.forEach(({ code }) => getLanguage(code));
