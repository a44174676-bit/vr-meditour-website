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

const scenarioMessages = {
  normal: {
    message: "현재 상태는 안정적입니다. 헹굼을 마무리하고 건조 단계로 이동할 수 있습니다.",
    temperature: "적정 범위",
    waste: "낮음",
    drain: "정상 배수",
    recommendation: "헹굼을 마무리하고 건조 단계로 이동하세요.",
  },
  waste: {
    message: "배출수 오염도가 아직 높습니다. 추가 장갑세정과 헹굼을 권장합니다.",
    temperature: "적정 범위",
    waste: "높음",
    drain: "배수 확인 필요",
    recommendation: "추가 장갑세정과 헹굼 후 배출수 상태를 다시 확인하세요.",
  },
  temperature: {
    message: "세정수 온도가 설정 범위를 벗어났습니다. 안전을 위해 세정을 일시 중지하고 온도를 조정해주세요.",
    temperature: "위험",
    waste: "확인 대기",
    drain: "일시 중지",
    recommendation: "세정을 멈추고 보호자 또는 요양보호사가 수온을 조정해야 합니다.",
  },
};

let currentStepIndex = 0;

const stepList = document.querySelector("#stepList");
const nextStepBtn = document.querySelector("#nextStepBtn");
const aiMessage = document.querySelector("#aiMessage");
const logList = document.querySelector("#logList");
const currentStep = document.querySelector("#currentStep");
const temperatureStatus = document.querySelector("#temperatureStatus");
const wasteStatus = document.querySelector("#wasteStatus");
const drainStatus = document.querySelector("#drainStatus");
const recommendation = document.querySelector("#recommendation");

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
  addLog(scenario.message);
}

nextStepBtn.addEventListener("click", moveToNextStep);

document.querySelectorAll("[data-scenario]").forEach((button) => {
  button.addEventListener("click", () => runScenario(button.dataset.scenario));
});

renderSteps();
addLog("준비 확인을 시작합니다. 장비, 보호장구, 사용자 상태를 확인해주세요.");
