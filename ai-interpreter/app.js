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

const state = {
  microphone: null,
  sessions: new Map(),
  activeDirection: null,
  replayUrl: null,
  replayAudio: null,
  ending: false,
};

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
    const listeningGuide = isVietnamese
      ? "Đang nghe — Thả nút khi nói xong"
      : "듣고 있습니다 — 말이 끝나면 손을 떼세요";
    button.innerHTML = `<strong>${buttonLabel}</strong><span>${listeningGuide} · ${direction.target.nativeLabel}</span>`;
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

function setCardCaption(card, selector, text, placeholder) {
  const element = card?.querySelector(selector);
  if (element) setCaption(element, text, placeholder);
}

function setStatus(message, mode = "") {
  ui.status.textContent = message;
  ui.status.className = `status${mode ? ` is-${mode}` : ""}`;
}

function showError(message) {
  ui.error.textContent = message;
  ui.error.hidden = false;
}

function clearError() {
  ui.error.textContent = "";
  ui.error.hidden = true;
}

function setCaption(element, text, placeholder) {
  element.textContent = text || placeholder;
  element.classList.toggle("placeholder", !text);
}

async function startConversation() {
  if (state.microphone || state.ending) return;
  clearError();
  ui.start.disabled = true;
  setStatus("마이크 연결 중", "busy");

  try {
    state.microphone = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: false,
    });

    await Promise.all(TRANSLATION_DIRECTIONS.map(createTranslationSession));
    ui.start.hidden = true;
    ui.controls.hidden = false;
    ui.end.disabled = false;
    ui.title.textContent = "버튼을 누르고 말씀하세요";
    setStatus("통역 준비 완료", "live");
  } catch (error) {
    await endConversation(false);
    ui.start.disabled = false;
    showError(error?.name === "NotAllowedError"
      ? "마이크 권한이 필요합니다. 브라우저 설정에서 권한을 허용해 주세요."
      : "통역 연결에 실패했습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.");
    setStatus("연결 실패");
  }
}

async function createTranslationSession(direction) {
  const tokenResponse = await fetch("/.netlify/functions/vr-medi-talk-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetLanguage: direction.target.code }),
  });
  if (!tokenResponse.ok) throw new Error("Client secret request failed");
  const tokenData = await tokenResponse.json();
  if (!tokenData.value) throw new Error("Missing client secret");

  const peer = new RTCPeerConnection();
  const sourceTrack = state.microphone.getAudioTracks()[0].clone();
  sourceTrack.enabled = false;
  peer.addTrack(sourceTrack, new MediaStream([sourceTrack]));

  const remoteAudio = new Audio();
  remoteAudio.autoplay = true;
  remoteAudio.playsInline = true;
  const session = { direction, peer, sourceTrack, remoteAudio, channel: null, transcript: { source: "", target: "" }, recorder: null, chunks: [], stopTimer: null };

  peer.ontrack = ({ streams }) => {
    remoteAudio.srcObject = streams[0];
    session.remoteStream = streams[0];
  };

  const channel = peer.createDataChannel("oai-events");
  session.channel = channel;
  channel.addEventListener("message", ({ data }) => handleRealtimeEvent(session, JSON.parse(data)));

  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  const answerResponse = await fetch("https://api.openai.com/v1/realtime/translations/calls", {
    method: "POST",
    headers: { Authorization: `Bearer ${tokenData.value}`, "Content-Type": "application/sdp" },
    body: offer.sdp,
  });
  if (!answerResponse.ok) throw new Error("Realtime connection failed");
  await peer.setRemoteDescription({ type: "answer", sdp: await answerResponse.text() });
  state.sessions.set(direction.source.code, session);
}

function handleRealtimeEvent(session, event) {
  if (event.type === "session.input_transcript.delta") {
    session.transcript.source += event.delta || "";
    const card = getDirectionCard(session.direction);
    setCardCaption(card, ".card-source-caption", session.transcript.source, "원문을 듣고 있습니다…");
    if (state.activeDirection?.source.code === session.direction.source.code) {
      setCaption(ui.sourceCaption, session.transcript.source, "원문을 듣고 있습니다…");
    }
  }
  if (event.type === "session.output_transcript.delta") {
    session.transcript.target += event.delta || "";
    const card = getDirectionCard(session.direction);
    setCardCaption(card, ".card-target-caption", session.transcript.target, "번역 중입니다…");
    if (state.activeDirection?.source.code === session.direction.source.code) {
      setCaption(ui.targetCaption, session.transcript.target, "번역 중입니다…");
    }
    scheduleReplayCaptureStop(session);
  }
  if (event.type === "error") showError("실시간 통역 중 오류가 발생했습니다. 다시 시도해 주세요.");
}

function beginTalking(event, direction) {
  if (!state.microphone || state.activeDirection || state.ending) return;
  const session = state.sessions.get(direction.source.code);
  if (!session) return;
  clearError();
  state.activeDirection = direction;
  session.transcript = { source: "", target: "" };
  const card = getDirectionCard(direction);
  card?.classList.add("is-listening");
  const cardStatus = card?.querySelector(".card-status");
  if (cardStatus) cardStatus.textContent = direction.source.locale === "vi-VN" ? "Đang nghe" : "듣는 중";
  setCardCaption(card, ".card-source-caption", "", direction.source.locale === "vi-VN" ? "Đang nghe…" : "듣고 있습니다…");
  setCardCaption(card, ".card-target-caption", "", direction.source.locale === "vi-VN" ? "Đang dịch sang tiếng Hàn…" : "베트남어로 번역 중…");
  ui.sourceLabel.textContent = `${direction.source.nativeLabel} 원문`;
  ui.targetLabel.textContent = `${direction.target.nativeLabel} 번역`;
  setCaption(ui.sourceCaption, "", "듣고 있습니다…");
  setCaption(ui.targetCaption, "", "번역을 기다리고 있습니다…");
  session.sourceTrack.enabled = true;
  event.currentTarget.setPointerCapture(event.pointerId);
  event.currentTarget.classList.add("is-pressed");
  document.querySelectorAll(".talk-button").forEach((button) => { button.disabled = button !== event.currentTarget; });
  startReplayCapture(session);
  setStatus(`${direction.source.nativeLabel} 듣는 중`, "busy");
}

function stopTalking(direction) {
  if (state.activeDirection?.source.code !== direction.source.code) return;
  const session = state.sessions.get(direction.source.code);
  if (session) {
    session.sourceTrack.enabled = false;
    scheduleReplayCaptureStop(session);
  }
  const card = getDirectionCard(direction);
  card?.classList.remove("is-listening");
  const cardStatus = card?.querySelector(".card-status");
  if (cardStatus) cardStatus.textContent = direction.source.locale === "vi-VN" ? "Đang phiên dịch" : "번역 출력 중";
  document.querySelectorAll(".talk-button").forEach((button) => { button.disabled = false; button.classList.remove("is-pressed"); });
  setStatus("번역 출력 중", "busy");
}

function startReplayCapture(session) {
  if (!session.remoteStream || !window.MediaRecorder) return;
  if (session.recorder?.state === "recording") session.recorder.stop();
  session.chunks = [];
  try {
    session.recorder = new MediaRecorder(session.remoteStream);
    session.recorder.ondataavailable = ({ data }) => { if (data.size) session.chunks.push(data); };
    session.recorder.onstop = () => storeReplay(session);
    session.recorder.start(200);
  } catch { /* 다시 듣기를 지원하지 않는 브라우저에서도 통역은 계속한다. */ }
}

function scheduleReplayCaptureStop(session) {
  clearTimeout(session.stopTimer);
  session.stopTimer = setTimeout(() => {
    if (session.recorder?.state === "recording") session.recorder.stop();
    if (state.activeDirection?.source.code === session.direction.source.code) {
      state.activeDirection = null;
      setStatus("통역 준비 완료", "live");
    }
    const card = getDirectionCard(session.direction);
    card?.classList.remove("is-listening");
    const cardStatus = card?.querySelector(".card-status");
    if (cardStatus) cardStatus.textContent = session.direction.source.locale === "vi-VN" ? "Sẵn sàng" : "말하기 대기";
  }, 1400);
}

function storeReplay(session) {
  if (!session.chunks.length) return;
  clearReplay();
  const blob = new Blob(session.chunks, { type: session.recorder.mimeType || "audio/webm" });
  state.replayUrl = URL.createObjectURL(blob);
  ui.replay.disabled = false;
  document.querySelectorAll(".card-replay").forEach((button) => { button.disabled = false; });
}

function replayLastTranslation() {
  if (!state.replayUrl) return;
  state.replayAudio?.pause();
  state.replayAudio = new Audio(state.replayUrl);
  state.replayAudio.play().catch(() => showError("브라우저가 재생을 차단했습니다. 버튼을 다시 눌러 주세요."));
}

function clearReplay() {
  state.replayAudio?.pause();
  state.replayAudio = null;
  if (state.replayUrl) URL.revokeObjectURL(state.replayUrl);
  state.replayUrl = null;
  ui.replay.disabled = true;
  document.querySelectorAll(".card-replay").forEach((button) => { button.disabled = true; });
}

async function endConversation(resetUI = true) {
  if (state.ending) return;
  state.ending = true;
  state.activeDirection = null;
  for (const session of state.sessions.values()) {
    clearTimeout(session.stopTimer);
    if (session.recorder?.state === "recording") session.recorder.stop();
    session.sourceTrack.stop();
    session.channel?.close();
    session.peer.close();
    session.remoteAudio.pause();
    session.remoteAudio.srcObject = null;
    session.transcript = { source: "", target: "" };
  }
  state.sessions.clear();
  state.microphone?.getTracks().forEach((track) => track.stop());
  state.microphone = null;
  clearReplay();

  if (resetUI) {
    setCaption(ui.sourceCaption, "", "말을 시작하면 원문 자막이 표시됩니다.");
    setCaption(ui.targetCaption, "", "번역 자막이 여기에 표시됩니다.");
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

// Validate the public MVP configuration at startup.
ENABLED_LANGUAGES.forEach(({ code }) => getLanguage(code));
