const steps = [
  "준비 확인",
  "사용자 위치 확인",
  "수온 확인",
  "세척수 분사",
  "세정제 분사",
  "장갑세정 및 헹굼",
  "배수·오염수 확인",
  "건조·의복 교체·정리",
];

const mobileVoiceTestMessage = "존엄세정 AI 음성 안내를 시작합니다.";

const stepVoiceGuidance = {
  "준비 확인": {
    patient: "세정 준비를 확인하겠습니다. 편안한 자세인지 확인해주세요.",
    caregiver: "장비, 보호장구, 사용자 상태를 확인한 뒤 세정을 시작하세요.",
  },
  "사용자 위치 확인": {
    patient: "머리는 바깥 안면 지지부에 편안히 두고, 몸은 차폐된 상태로 보호됩니다.",
    caregiver: "머리가 바깥 안면 지지부에 놓였는지 확인하고 차폐 상태를 유지하세요.",
  },
  "수온 확인": {
    patient: "세정수 온도를 확인하고 있습니다. 안전한 온도에서만 세정을 시작합니다.",
    caregiver: "수온 센서 표시를 확인하고 설정 범위 안에서만 세척수 분사를 진행하세요.",
  },
  "세척수 분사": {
    patient: "이제 미온수를 부드럽게 분사합니다.",
    caregiver: "미온수를 낮은 압력으로 분사하며 사용자 표정과 불편 호소를 확인하세요.",
  },
  "세정제 분사": {
    patient: "세정제를 소량 분사합니다. 이후 충분히 헹굼을 진행합니다.",
    caregiver: "세정제를 소량만 분사하고 잔여물이 남지 않도록 헹굼 시간을 확보하세요.",
  },
  "장갑세정 및 헹굼": {
    patient: "요양보호사가 장갑세정 포트를 통해 부드럽게 세정합니다. 불편하면 바로 말씀해주세요.",
    caregiver: "장갑세정 포트를 사용해 부드럽게 세정하고 불편 신호가 있으면 즉시 멈추세요.",
  },
  "배수·오염수 확인": {
    patient: "배출수를 확인하고 있습니다. 필요하면 한 번 더 헹굼을 진행합니다.",
    caregiver: "배수 흐름과 배출수 오염도를 확인하고 기준보다 높으면 추가 헹굼을 진행하세요.",
  },
  "건조·의복 교체·정리": {
    patient: "이제 건조 단계입니다. 차폐 상태를 유지한 채 깨끗한 속옷 착의를 도와드립니다.",
    caregiver: "차폐 상태를 유지하며 건조, 의복 교체, 주변 정리를 순서대로 진행하세요.",
  },
};

const scenarioMessages = {
  normal: {
    message: "현재 상태는 안정적입니다. 헹굼을 마무리하고 건조 단계로 이동할 수 있습니다.",
    patientVoice: "현재 상태는 안정적입니다. 헹굼을 마무리하고 건조 단계로 이동할 수 있습니다.",
    caregiverVoice: "수온, 배수, 오염수 상태가 안정적입니다. 헹굼을 마무리하고 건조 단계로 이동하세요.",
    temperature: "적정 범위",
    waste: "낮음",
    drain: "정상 배수",
    recommendation: "헹굼을 마무리하고 건조 단계로 이동하세요.",
  },
  waste: {
    message: "배출수 오염도가 아직 높습니다. 추가 장갑세정과 헹굼을 권장합니다.",
    patientVoice: "배출수 오염도가 아직 높습니다. 한 번 더 부드럽게 헹굼을 진행하겠습니다.",
    caregiverVoice: "배출수 오염도가 아직 높습니다. 추가 장갑세정과 헹굼 후 오염수 상태를 다시 확인하세요.",
    temperature: "적정 범위",
    waste: "높음",
    drain: "배수 확인 필요",
    recommendation: "추가 장갑세정과 헹굼 후 배출수 상태를 다시 확인하세요.",
  },
  temperature: {
    message: "세정수 온도가 설정 범위를 벗어났습니다. 안전을 위해 세정을 일시 중지하고 온도를 조정해주세요.",
    patientVoice: "물이 조금 뜨거울 수 있어 잠시 멈추겠습니다. 안전하게 온도를 맞춘 뒤 다시 진행하겠습니다.",
    caregiverVoice: "세정수 온도가 설정 범위를 벗어났습니다. 즉시 세정을 일시 중지하고 온도를 조정하세요.",
    temperature: "위험",
    waste: "확인 대기",
    drain: "일시 중지",
    recommendation: "세정을 멈추고 보호자 또는 요양보호사가 수온을 조정해야 합니다.",
  },
};

let currentStepIndex = 0;
let voiceEnabled = false;
let currentPatientVoiceText = stepVoiceGuidance[steps[0]].patient;
let currentCaregiverVoiceText = stepVoiceGuidance[steps[0]].caregiver;
let availableVoices = [];
let preferredKoreanVoice = null;

const speechCapability = {
  hasSynthesis: Boolean(window.speechSynthesis),
  hasUtterance: Boolean(window.SpeechSynthesisUtterance),
};
speechCapability.hasApi = speechCapability.hasSynthesis && speechCapability.hasUtterance;

const stepList = document.querySelector("#stepList");
const nextStepBtn = document.querySelector("#nextStepBtn");
const aiMessage = document.querySelector("#aiMessage");
const logList = document.querySelector("#logList");
const currentStep = document.querySelector("#currentStep");
const temperatureStatus = document.querySelector("#temperatureStatus");
const wasteStatus = document.querySelector("#wasteStatus");
const drainStatus = document.querySelector("#drainStatus");
const recommendation = document.querySelector("#recommendation");
const voiceOnBtn = document.querySelector("#voiceOnBtn");
const voiceOffBtn = document.querySelector("#voiceOffBtn");
const replayVoiceBtn = document.querySelector("#replayVoiceBtn");
const mobileVoiceTestBtn = document.querySelector("#mobileVoiceTestBtn");
const largeTextModeBtn = document.querySelector("#largeTextModeBtn");
const voiceStatus = document.querySelector("#voiceStatus");
const voiceSupportMessage = document.querySelector("#voiceSupportMessage");
const patientVoiceText = document.querySelector("#patientVoiceText");
const caregiverVoiceText = document.querySelector("#caregiverVoiceText");
const largeGuidancePanel = document.querySelector("#largeGuidancePanel");
const largeGuidanceText = document.querySelector("#largeGuidanceText");
const closeLargeGuidanceBtn = document.querySelector("#closeLargeGuidanceBtn");

function renderSteps() {
  stepList.innerHTML = steps
    .map((step, index) => {
      const activeClass = index === currentStepIndex ? " active" : "";
      return `
        <li class="step-item${activeClass}" aria-current="${index === currentStepIndex ? "step" : "false"}">
          <span class="step-number">${index + 1}</span>
          <span>${step}</span>
        </li>
      `;
    })
    .join("");
}

function addLog(text) {
  const now = new Date();
  const time = now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const logItem = document.createElement("li");
  logItem.textContent = `[${time}] ${text}`;
  logList.prepend(logItem);
}

function updateSummary({ temperature, waste, drain, recommendationText }) {
  currentStep.textContent = steps[currentStepIndex];
  temperatureStatus.textContent = temperature;
  wasteStatus.textContent = waste;
  drainStatus.textContent = drain;
  recommendation.textContent = recommendationText;
}

function updateVoiceTexts({ patient, caregiver }) {
  currentPatientVoiceText = patient;
  currentCaregiverVoiceText = caregiver;
  patientVoiceText.textContent = patient;
  caregiverVoiceText.textContent = caregiver;

  if (!largeGuidancePanel.hidden) {
    largeGuidanceText.textContent = patient;
  }
}

function showLargeGuidance(text = currentPatientVoiceText) {
  largeGuidanceText.textContent = text;
  largeGuidancePanel.hidden = false;
}

function hideLargeGuidance() {
  largeGuidancePanel.hidden = true;
}

function showVoiceLimitMessage() {
  voiceSupportMessage.hidden = false;
}

function refreshVoiceStatus() {
  if (!speechCapability.hasApi) {
    voiceStatus.textContent = "제한됨";
    voiceStatus.classList.remove("on");
    showVoiceLimitMessage();
    return;
  }

  voiceStatus.classList.toggle("on", voiceEnabled);

  if (voiceEnabled) {
    voiceStatus.textContent = preferredKoreanVoice ? "켜짐" : "켜짐 · 기본음성";
    return;
  }

  voiceStatus.textContent = preferredKoreanVoice ? "꺼짐" : "꺼짐 · 테스트 권장";
}

function findPreferredKoreanVoice(voices) {
  return voices.find((voice) => voice.lang === "ko-KR")
    || voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith("ko"))
    || voices.find((voice) => /korean|한국|ko-kr/i.test(`${voice.name} ${voice.lang}`));
}

function loadVoices() {
  if (!speechCapability.hasApi || typeof window.speechSynthesis.getVoices !== "function") {
    refreshVoiceStatus();
    return;
  }

  availableVoices = window.speechSynthesis.getVoices();
  preferredKoreanVoice = findPreferredKoreanVoice(availableVoices);

  if (!preferredKoreanVoice && availableVoices.length === 0) {
    showVoiceLimitMessage();
  }

  refreshVoiceStatus();
}

function speakGuidanceText(text, { force = false, fallbackToLargeText = true } = {}) {
  if (!speechCapability.hasApi) {
    showVoiceLimitMessage();
    if (fallbackToLargeText) {
      showLargeGuidance(text);
    }
    return false;
  }

  if (!voiceEnabled && !force) {
    return false;
  }

  loadVoices();

  window.speechSynthesis.cancel();

  if (typeof window.speechSynthesis.resume === "function") {
    window.speechSynthesis.resume();
  }

  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.92;
  utterance.pitch = 1.02;

  if (preferredKoreanVoice) {
    utterance.voice = preferredKoreanVoice;
  }

  utterance.onerror = () => {
    showVoiceLimitMessage();
    if (fallbackToLargeText) {
      showLargeGuidance(text);
    }
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

function speakCurrentGuidance({ force = false, fallbackToLargeText = true } = {}) {
  return speakGuidanceText(currentPatientVoiceText, { force, fallbackToLargeText });
}

function setVoiceEnabled(enabled) {
  voiceEnabled = enabled;

  if (!enabled && speechCapability.hasApi) {
    window.speechSynthesis.cancel();
  }

  refreshVoiceStatus();

  if (enabled) {
    const spoke = speakCurrentGuidance({ force: true, fallbackToLargeText: true });

    if (!spoke) {
      showLargeGuidance();
    }
  }
}

function applyStepVoiceGuidance(step) {
  const guidance = stepVoiceGuidance[step];
  updateVoiceTexts({
    patient: guidance.patient,
    caregiver: guidance.caregiver,
  });
  speakCurrentGuidance({ fallbackToLargeText: voiceEnabled });
}

function moveToNextStep() {
  currentStepIndex = (currentStepIndex + 1) % steps.length;
  const step = steps[currentStepIndex];
  const message = `현재 단계는 '${step}'입니다. 절차 체크리스트를 확인하고 안전하게 진행하세요.`;

  aiMessage.textContent = message;
  renderSteps();
  updateSummary({
    temperature: temperatureStatus.textContent,
    waste: wasteStatus.textContent,
    drain: drainStatus.textContent,
    recommendationText: `${step} 단계에 필요한 안전 확인을 진행하세요.`,
  });
  applyStepVoiceGuidance(step);
  addLog(message);
}

function runScenario(scenarioName) {
  const scenario = scenarioMessages[scenarioName];

  aiMessage.textContent = scenario.message;
  updateSummary({
    temperature: scenario.temperature,
    waste: scenario.waste,
    drain: scenario.drain,
    recommendationText: scenario.recommendation,
  });
  updateVoiceTexts({
    patient: scenario.patientVoice,
    caregiver: scenario.caregiverVoice,
  });
  speakCurrentGuidance({ fallbackToLargeText: voiceEnabled });
  addLog(scenario.message);
}

function runMobileVoiceTest() {
  const spoke = speakGuidanceText(mobileVoiceTestMessage, { force: true, fallbackToLargeText: true });

  if (!spoke) {
    showLargeGuidance(mobileVoiceTestMessage);
  }
}

function initializeVoiceControls() {
  if (!speechCapability.hasApi) {
    showVoiceLimitMessage();
  }

  if (speechCapability.hasApi && typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
  } else if (speechCapability.hasApi) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  loadVoices();

  voiceOnBtn.addEventListener("click", () => setVoiceEnabled(true));
  voiceOffBtn.addEventListener("click", () => setVoiceEnabled(false));
  replayVoiceBtn.addEventListener("click", () => {
    const spoke = speakCurrentGuidance({ force: true, fallbackToLargeText: true });

    if (!spoke) {
      showLargeGuidance();
    }
  });
  mobileVoiceTestBtn.addEventListener("click", runMobileVoiceTest);
  largeTextModeBtn.addEventListener("click", () => showLargeGuidance());
  closeLargeGuidanceBtn.addEventListener("click", hideLargeGuidance);
  largeGuidancePanel.addEventListener("click", (event) => {
    if (event.target === largeGuidancePanel) {
      hideLargeGuidance();
    }
  });
}

nextStepBtn.addEventListener("click", moveToNextStep);

document.querySelectorAll("[data-scenario]").forEach((button) => {
  button.addEventListener("click", () => runScenario(button.dataset.scenario));
});

renderSteps();
initializeVoiceControls();
updateVoiceTexts({
  patient: currentPatientVoiceText,
  caregiver: currentCaregiverVoiceText,
});
addLog("준비 확인을 시작합니다. 장비, 보호장구, 사용자 상태를 확인해주세요.");
