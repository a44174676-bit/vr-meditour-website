const PAIRS_PER_STAGE = 5;

const MODE_CONFIG = {
  words: {
    label: "기본 단어",
    title: "한국어 의료관광 단어·문장 학습",
    description: "베트남어권 학습자를 위한 한국어 기본 단어와 의료관광 실무 문장을 단계별로 학습합니다.",
    sets: window.WORD_SETS || [],
    itemsKey: "words",
    expectedStages: 20,
    expectedItems: 100,
  },
  sentences: {
    label: "의료관광 문장",
    title: "한국어 의료관광 단어·문장 학습",
    description: "베트남어권 학습자를 위한 한국어 기본 단어와 의료관광 실무 문장을 단계별로 학습합니다.",
    sets: window.SENTENCE_SETS || [],
    itemsKey: "items",
    expectedStages: 10,
    expectedItems: 50,
  },
};

const state = {
  mode: "words",
  currentStage: 0,
  cards: [],
  openCards: [],
  attempts: 0,
  matchedPairs: 0,
  isLocked: false,
  lastPronunciationCard: null,
  currentAudio: null,
};

const els = {
  appTitle: document.querySelector(".app__title"),
  modeDescription: document.getElementById("mode-description"),
  modeSelect: document.getElementById("mode-select"),
  board: document.getElementById("board"),
  stageSelect: document.getElementById("stage-select"),
  stageLabel: document.getElementById("stage-label"),
  attempts: document.getElementById("attempts"),
  matchedPairs: document.getElementById("matched-pairs"),
  restartBtn: document.getElementById("restart-btn"),
  replayBtn: document.getElementById("replay-btn"),
  testVoiceBtn: document.getElementById("test-voice-btn"),
  audioStatus: document.getElementById("audio-status"),
  winModal: document.getElementById("win-modal"),
  winTitle: document.getElementById("win-title"),
  winMessage: document.getElementById("win-message"),
  finalAttempts: document.getElementById("final-attempts"),
  nextStageBtn: document.getElementById("next-stage-btn"),
  modalRestartBtn: document.getElementById("modal-restart-btn"),
};

function getModeConfig() {
  return MODE_CONFIG[state.mode];
}

function getActiveSets() {
  return getModeConfig().sets;
}

function getStageItems(stage) {
  const config = getModeConfig();
  return stage[config.itemsKey] || [];
}

function getCurrentSet() {
  return getActiveSets()[state.currentStage];
}

function getDisplayText(card) {
  return {
    korean: card.korean || card.word || "",
    vietnamese: card.vietnamese || card.vi || "",
    english: card.english || card.en || "",
    pronunciation: card.pronunciation || "",
  };
}

function setAudioStatus(message, isWarning = false) {
  els.audioStatus.textContent = message;
  els.audioStatus.classList.toggle("is-warning", isWarning);
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function createCards(items) {
  return shuffle(items.flatMap((item, index) => [
    { ...item, id: `${state.mode}-${state.currentStage}-${index}-a` },
    { ...item, id: `${state.mode}-${state.currentStage}-${index}-b` },
  ]));
}

function playPronunciation(card) {
  const text = getDisplayText(card).korean;

  if (!card || !card.audio) {
    setAudioStatus("음성 파일이 아직 준비되지 않았습니다.", true);
    return;
  }

  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio.currentTime = 0;
  }

  const audio = new Audio(card.audio);
  state.currentAudio = audio;
  state.lastPronunciationCard = card;
  els.replayBtn.disabled = false;

  audio.addEventListener("playing", () => {
    setAudioStatus(`재생 중: ${text}`);
  });
  audio.addEventListener("ended", () => {
    setAudioStatus("한국어 MP3 발음을 재생했습니다.");
  });
  audio.addEventListener("error", () => {
    setAudioStatus("음성 파일이 아직 준비되지 않았습니다.", true);
  });

  audio.play().catch(() => {
    setAudioStatus("음성 파일이 아직 준비되지 않았습니다.", true);
  });
}

function createCardElement(card) {
  const text = getDisplayText(card);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "card";
  button.dataset.id = card.id;
  button.dataset.korean = text.korean;
  button.setAttribute("aria-label", "뒤집힌 카드, 클릭해서 열기");
  button.innerHTML = `
    <span class="card__inner">
      <span class="card__face card__back" aria-hidden="true"></span>
      <span class="card__face card__front">
        <span class="card__word">${text.korean}</span>
        <span class="card__vi">${text.vietnamese}</span>
        <span class="card__en">${text.english}</span>
        <span class="card__pron">${text.pronunciation}</span>
      </span>
    </span>
  `;
  button.addEventListener("click", () => handleCardClick(button, card));
  return button;
}

function openCard(button, card) {
  const text = getDisplayText(card);
  button.classList.add("is-open");
  button.setAttribute("aria-label", `${text.korean}, ${text.vietnamese}, ${text.english}, ${text.pronunciation}`);
  state.openCards.push({ button, card });
  playPronunciation(card);
}

function closeCard(button) {
  button.classList.remove("is-open");
  button.setAttribute("aria-label", "뒤집힌 카드, 클릭해서 열기");
}

function markAsMatched(button) {
  button.classList.remove("is-open");
  button.classList.add("is-matched");
  button.setAttribute("aria-label", `${button.dataset.korean}, 맞춤 완료`);
}

function handleCardClick(button, card) {
  if (state.isLocked || button.classList.contains("is-open") || button.classList.contains("is-matched")) {
    return;
  }

  openCard(button, card);

  if (state.openCards.length === 2) {
    state.attempts += 1;
    updateStatus();
    checkForMatch();
  }
}

function checkForMatch() {
  const [first, second] = state.openCards;
  state.isLocked = true;

  if (getDisplayText(first.card).korean === getDisplayText(second.card).korean) {
    markAsMatched(first.button);
    markAsMatched(second.button);
    state.matchedPairs += 1;
    state.openCards = [];
    state.isLocked = false;
    updateStatus();
    checkForStageComplete();
    return;
  }

  setTimeout(() => {
    closeCard(first.button);
    closeCard(second.button);
    state.openCards = [];
    state.isLocked = false;
  }, 850);
}

function updateStatus() {
  const totalStages = getActiveSets().length;
  els.stageLabel.textContent = `${state.currentStage + 1} / ${totalStages}`;
  els.attempts.textContent = state.attempts;
  els.matchedPairs.textContent = `${state.matchedPairs} / ${PAIRS_PER_STAGE}쌍`;
  els.stageSelect.value = String(state.currentStage);
  els.modeSelect.value = state.mode;
}

function checkForStageComplete() {
  if (state.matchedPairs !== PAIRS_PER_STAGE) return;

  const totalStages = getActiveSets().length;
  const isFinalStage = state.currentStage === totalStages - 1;
  const config = getModeConfig();
  els.finalAttempts.textContent = state.attempts;
  els.winTitle.textContent = isFinalStage ? "학습 완료" : `${state.currentStage + 1}단계 완료`;
  els.winMessage.textContent = isFinalStage
    ? `${totalStages}단계의 ${config.label} 학습을 완료했습니다.`
    : "5쌍을 모두 맞췄습니다. 다음 단계로 이동해 보세요.";
  els.nextStageBtn.hidden = isFinalStage;

  setTimeout(() => {
    els.winModal.hidden = false;
  }, 450);
}

function updateModeCopy() {
  const config = getModeConfig();
  els.appTitle.textContent = config.title;
  els.modeDescription.textContent = config.description;
}

function updateBoardModeClass() {
  const isSentenceMode = state.mode === "sentences";
  els.board.classList.toggle("sentence-mode", isSentenceMode);
  els.board.classList.toggle("word-mode", !isSentenceMode);
}

function startStage(stageIndex) {
  const activeSets = getActiveSets();
  const nextIndex = Math.min(Math.max(stageIndex, 0), activeSets.length - 1);
  const set = activeSets[nextIndex];

  state.currentStage = nextIndex;
  state.cards = createCards(getStageItems(set));
  state.openCards = [];
  state.attempts = 0;
  state.matchedPairs = 0;
  state.isLocked = false;
  state.lastPronunciationCard = null;

  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio.currentTime = 0;
  }

  els.board.innerHTML = "";
  updateBoardModeClass();
  state.cards.forEach((card) => els.board.appendChild(createCardElement(card)));
  els.replayBtn.disabled = true;
  els.winModal.hidden = true;
  setAudioStatus("카드를 클릭하면 한국어 MP3 발음이 재생됩니다.");
  updateModeCopy();
  updateStatus();
}

function resetFromBeginning() {
  startStage(0);
}

function fillStageSelect() {
  els.stageSelect.innerHTML = "";
  getActiveSets().forEach((set, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${index + 1}단계: ${set.title}`;
    els.stageSelect.appendChild(option);
  });
}

function changeMode(mode) {
  if (!MODE_CONFIG[mode]) return;
  state.mode = mode;
  fillStageSelect();
  startStage(0);
}

function validateSet(mode, config) {
  if (!config.sets.length) throw new Error(`${config.label} 데이터가 없습니다.`);
  if (config.sets.length !== config.expectedStages) {
    console.warn(`${config.label} 단계 수가 ${config.expectedStages}이 아닙니다: ${config.sets.length}`);
  }

  const items = config.sets.flatMap((set) => set[config.itemsKey] || []);
  if (items.length !== config.expectedItems) {
    console.warn(`${config.label} 항목 수가 ${config.expectedItems}이 아닙니다: ${items.length}`);
  }

  config.sets.forEach((set, index) => {
    if ((set[config.itemsKey] || []).length !== PAIRS_PER_STAGE) {
      console.warn(`${config.label} ${index + 1}단계 항목 수가 5개가 아닙니다.`);
    }
  });
}

function validateData() {
  Object.entries(MODE_CONFIG).forEach(([mode, config]) => validateSet(mode, config));
}

els.restartBtn.addEventListener("click", resetFromBeginning);
els.modalRestartBtn.addEventListener("click", resetFromBeginning);
els.nextStageBtn.addEventListener("click", () => startStage(state.currentStage + 1));
els.stageSelect.addEventListener("change", (event) => startStage(Number(event.target.value)));
els.modeSelect.addEventListener("change", (event) => changeMode(event.target.value));
els.testVoiceBtn.addEventListener("click", () => {
  const firstItem = getStageItems(getCurrentSet())[0];
  playPronunciation(firstItem);
});
els.replayBtn.addEventListener("click", () => {
  if (state.lastPronunciationCard) playPronunciation(state.lastPronunciationCard);
});

validateData();
fillStageSelect();
startStage(0);
