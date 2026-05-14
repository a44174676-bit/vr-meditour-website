(() => {
  "use strict";

  const LANGUAGES = {
    KO: {
      image: "/assets/medi-hana/medi-hana-ko.png",
      greeting: "안녕하세요. 저는 메디하나예요. 안전한 의료여행 상담을 위해 몇 가지만 여쭤볼게요."
    },
    EN: {
      image: "/assets/medi-hana/medi-hana-en.png",
      greeting: "Hello, I’m Medi Hana. I’ll help you prepare a safe medical travel consultation."
    },
    VI: {
      image: "/assets/medi-hana/medi-hana-vi.png",
      greeting: "Xin chào, tôi là Medi Hana. Tôi sẽ giúp bạn chuẩn bị tư vấn y tế an toàn."
    },
    JP: {
      image: "/assets/medi-hana/medi-hana-jp.png",
      greeting: "こんにちは。メディハナです。安心できる医療旅行相談のためにご案内します。"
    },
    CN: {
      image: "/assets/medi-hana/medi-hana-cn.png",
      greeting: "您好，我是 Medi Hana。我会帮助您准备安心的医疗旅行咨询。"
    },
    DEFAULT: {
      image: "/assets/medi-hana/medi-hana-default.png",
      greeting: "안녕하세요. 저는 메디하나예요. 안전한 의료여행 상담을 위해 몇 가지만 여쭤볼게요."
    }
  };

  const FIELD_CANDIDATES = {
    inquiryType: ["service", "type", "inquiryType", "consultType", "inquiry_type"],
    interest: ["interest", "category", "field", "treatment", "concern", "interested_field"],
    language: ["language", "preferredLanguage", "lang", "preferred_language"],
    name: ["name", "fullName", "customerName"],
    country: ["country", "nation"],
    email: ["email"],
    emailConfirm: ["emailConfirm", "confirmEmail", "email_confirm"],
    phone: ["phone", "tel", "mobile"],
    messenger: ["messenger", "contactMessenger", "zalo", "whatsapp", "kakao", "sns"],
    location: ["location", "currentLocation", "city"],
    message: ["message", "inquiry", "content", "details"],
    diagnosis: ["diagnosis", "diagnosed", "existingDiagnosis", "existing_diagnosis"],
    visitDate: ["visitDate", "preferredDate", "date", "preferred_visit_date"],
    budget: ["budget"],
    interpretation: ["interpretation", "interpreter", "translationSupport", "interpreter_support"],
    accommodation: ["accommodation", "transport", "stayTransport", "support", "hotel_transport_support"],
    documentLink: ["documentLink", "fileLink", "link", "url", "photo_document_link"],
    privacy: ["privacy", "consent", "agree", "privacyConsent", "privacy_agreement"]
  };

  const STEPS = [
    { key: "inquiryType", title: "문의 유형", question: "어떤 상담을 원하시나요?", type: "options", required: true, options: ["의료관광 상담", "K-뷰티 상담", "건강검진", "병원 연결", "기타 문의"] },
    { key: "interest", title: "관심 분야", question: "관심 있는 분야를 선택해 주세요.", type: "options", required: true, options: ["피부·성형", "치과", "건강검진", "한방·웰니스", "재활·치료", "기타"] },
    { key: "language", title: "선호 언어", question: "상담을 받고 싶은 언어를 선택해 주세요.", type: "options", required: true, options: ["한국어", "English", "Tiếng Việt", "日本語", "中文"] },
    { key: "name", title: "이름", question: "상담 내용을 정확히 정리하기 위해 성함을 알려주세요.", type: "text", required: true, autocomplete: "name" },
    { key: "country", title: "국가", question: "현재 거주 중인 국가는 어디인가요?", type: "text", required: true, autocomplete: "country-name" },
    { key: "email", title: "이메일", question: "답변을 받을 이메일 주소를 입력해 주세요.", type: "email", required: true, autocomplete: "email" },
    { key: "emailConfirm", title: "이메일 확인", question: "이메일 주소를 한 번 더 확인해 주세요.", type: "email", required: true, autocomplete: "email" },
    { key: "phone", title: "전화번호", question: "연락 가능한 전화번호를 알려주세요.", type: "tel", autocomplete: "tel" },
    { key: "messenger", title: "메신저 연락처", question: "Zalo, WhatsApp, KakaoTalk 등 메신저 연락처가 있다면 입력해 주세요.", type: "text", skip: true },
    { key: "location", title: "현재 위치", question: "현재 계신 도시를 알려주세요.", hint: "예시: 서울, 부산, 하노이, 호치민", type: "text", required: true },
    { key: "message", title: "문의 내용", question: "가장 궁금한 내용을 편하게 적어주세요.", type: "textarea", required: true },
    { key: "diagnosis", title: "기존 진단 여부", question: "이미 병원 진단이나 검사 결과가 있으신가요?", type: "options", options: ["있음", "없음", "상담 후 확인하고 싶음"] },
    { key: "visitDate", title: "희망 방문일", question: "희망 방문일이 있으신가요?", type: "date", skip: true },
    { key: "budget", title: "예산", question: "예상 예산 범위가 있으신가요?", type: "text", skip: true },
    { key: "interpretation", title: "통역 지원", question: "통역 지원이 필요하신가요?", type: "options", options: ["필요함", "필요 없음", "아직 모르겠음"] },
    { key: "accommodation", title: "숙박 또는 이동 지원", question: "숙박이나 공항 이동 지원이 필요하신가요?", type: "options", options: ["숙박 지원 필요", "이동 지원 필요", "둘 다 필요", "필요 없음"] },
    { key: "documentLink", title: "사전 문서 링크 및 개인정보 동의", question: "사진, 검사결과, 참고 문서 링크가 있다면 입력해 주세요. 마지막으로 개인정보 동의 후 제출해 주세요.", type: "url", skip: true, withConsent: true }
  ];

  const SUMMARY_KEYS = ["inquiryType", "interest", "language", "name", "country", "email", "phone", "messenger", "location", "message", "diagnosis", "visitDate", "budget", "interpretation", "accommodation", "documentLink"];
  const SUMMARY_LABELS = Object.fromEntries(STEPS.map((step) => [step.key, step.title.replace(" 및 개인정보 동의", "")]));

  document.addEventListener("DOMContentLoaded", () => {
    try {
      initMediHanaConsult();
    } catch (error) {
      console.warn("Medi Hana consultation UI failed to initialize. Showing the original quick form.", error);
      const form = document.querySelector('form[name="medical-consult"]');
      if (form) form.classList.remove("mh-consult-hidden");
    }
  });

  function initMediHanaConsult() {
    const root = document.querySelector("[data-mh-consult]");
    const form = document.querySelector('form[name="medical-consult"]');
    if (!root || !form) {
      console.warn("Medi Hana consultation UI skipped: target container or medical-consult form was not found.");
      return;
    }

    const state = {
      mode: "hana",
      language: "KO",
      currentStep: 0,
      summary: false,
      answers: readInitialAnswers(form),
      missingFields: [],
      imageFallbackUsed: false,
      defaultImageFailed: false
    };

    state.fields = mapFields(form, state);
    root.innerHTML = buildShell();
    root.hidden = false;
    root.addEventListener("click", (event) => handleRootClick(event, root, form, state));
    root.addEventListener("input", (event) => handleRootInput(event, form, state));
    root.addEventListener("change", (event) => handleRootChange(event, form, state));
    form.classList.add("mh-consult-hidden");
    render(root, form, state);
  }

  function buildShell() {
    return `
      <div class="mh-consult-mode-toggle" role="group" aria-label="상담 신청 방식 선택">
        <button type="button" class="mh-consult-mode-btn" data-mode="hana">메디하나와 상담 시작하기</button>
        <button type="button" class="mh-consult-mode-btn" data-mode="quick">빠른 신청서로 바로 작성하기</button>
      </div>
      <div class="mh-consult-panel" aria-live="polite"></div>
    `;
  }

  function render(root, form, state) {
    const panel = root.querySelector(".mh-consult-panel");
    root.querySelectorAll("[data-mode]").forEach((button) => {
      const active = button.dataset.mode === state.mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (state.mode === "quick") {
      form.classList.remove("mh-consult-hidden");
      panel.innerHTML = `<p class="mh-consult-quick-note">빠른 신청서 모드입니다. 아래 기존 상담신청서를 그대로 작성해 주세요.</p>`;
      return;
    }

    form.classList.add("mh-consult-hidden");
    panel.innerHTML = state.summary ? renderSummary(state) : renderStage(state);
    attachImageFallback(panel, state);
  }

  function renderStage(state) {
    const step = STEPS[state.currentStep];
    return `
      <div class="mh-consult-language" role="group" aria-label="Medi Hana language selector">
        ${Object.keys(LANGUAGES).filter((lang) => lang !== "DEFAULT").map((lang) => `
          <button type="button" class="mh-consult-lang-btn ${state.language === lang ? "is-active" : ""}" data-lang="${lang}" aria-pressed="${state.language === lang}">${lang}</button>
        `).join("")}
      </div>
      <div class="mh-consult-stage">
        <div class="mh-consult-character">
          <img class="mh-consult-character-img" src="${LANGUAGES[state.language].image}" alt="Medi Hana" />
          <div class="mh-consult-bubble">${escapeHtml(LANGUAGES[state.language].greeting)}</div>
        </div>
        <div class="mh-consult-card">
          <p class="mh-consult-step-label">Step ${state.currentStep + 1}. ${escapeHtml(step.title)}</p>
          <h3 class="mh-consult-question">${escapeHtml(step.question)}</h3>
          ${step.hint ? `<p class="mh-consult-hint">${escapeHtml(step.hint)}</p>` : ""}
          ${renderControl(step, state)}
          <p class="mh-consult-error" role="alert" data-error></p>
          ${renderMappingNotice(state)}
          <div class="mh-consult-progress" aria-label="진행률">${state.currentStep + 1} / ${STEPS.length} 단계</div>
          <div class="mh-consult-actions">
            <button type="button" class="btn mh-consult-action" data-prev ${state.currentStep === 0 ? "disabled" : ""}>이전</button>
            ${step.skip ? `<button type="button" class="btn mh-consult-action" data-skip>건너뛰기</button>` : ""}
            <button type="button" class="btn primary mh-consult-action" data-next>${state.currentStep === STEPS.length - 1 ? "요약 보기" : "다음"}</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderControl(step, state) {
    const value = state.answers[step.key] || "";
    if (step.type === "options") {
      return `<div class="mh-consult-options">${step.options.map((option) => `
        <button type="button" class="mh-consult-option ${value === option ? "is-selected" : ""}" data-option="${escapeAttr(option)}" aria-pressed="${value === option}">${escapeHtml(option)}</button>
      `).join("")}</div>`;
    }

    const common = `class="mh-consult-input" data-answer="${step.key}" ${step.autocomplete ? `autocomplete="${step.autocomplete}"` : ""} value="${escapeAttr(value)}"`;
    const placeholder = step.key === "documentLink" ? "https://" : "";
    const consent = step.withConsent ? `
      <label class="mh-consult-consent">
        <input type="checkbox" data-answer="privacy" ${state.answers.privacy ? "checked" : ""} />
        <span>상담 조회, 환자 동의 절차, 개인정보 보호 정책에 동의합니다.</span>
      </label>
    ` : "";

    if (step.type === "textarea") {
      return `<textarea class="mh-consult-input" data-answer="${step.key}" rows="5">${escapeHtml(value)}</textarea>${consent}`;
    }
    return `<input type="${step.type}" ${common} placeholder="${placeholder}" />${consent}`;
  }

  function renderSummary(state) {
    return `
      <div class="mh-consult-summary">
        <h3>상담 신청 내용 요약</h3>
        ${renderMappingNotice(state)}
        <div class="mh-consult-summary-grid">
          ${SUMMARY_KEYS.map((key) => `
            <article class="mh-consult-summary-card">
              <strong>${escapeHtml(SUMMARY_LABELS[key] || key)}</strong>
              <span>${escapeHtml(state.answers[key] || "미입력")}</span>
            </article>
          `).join("")}
        </div>
        <p class="mh-consult-error" role="alert" data-error></p>
        <div class="mh-consult-actions">
          <button type="button" class="btn mh-consult-action" data-edit>수정하기</button>
          <button type="button" class="btn primary mh-consult-action" data-submit-hana>상담 신청 제출</button>
        </div>
      </div>
    `;
  }

  function handleRootClick(event, root, form, state) {
    const target = event.target.closest("button");
    if (!target) return;

    if (target.dataset.mode) {
      state.mode = target.dataset.mode;
      render(root, form, state);
      return;
    }

    if (target.dataset.lang) {
      state.language = target.dataset.lang;
      state.imageFallbackUsed = false;
      state.defaultImageFailed = false;
      render(root, form, state);
      return;
    }

    if (target.dataset.option) {
      const step = STEPS[state.currentStep];
      state.answers[step.key] = target.dataset.option;
      if (step.key === "language") {
        state.language = languageCodeFromAnswer(target.dataset.option) || state.language;
        state.imageFallbackUsed = false;
        state.defaultImageFailed = false;
      }
      syncAnswerToField(form, state, step.key);
      render(root, form, state);
      return;
    }

    if (target.hasAttribute("data-prev")) {
      state.currentStep = Math.max(0, state.currentStep - 1);
      state.summary = false;
      render(root, form, state);
      return;
    }

    if (target.hasAttribute("data-skip")) {
      const step = STEPS[state.currentStep];
      if (!state.answers[step.key]) state.answers[step.key] = "";
      syncAnswerToField(form, state, step.key);
      goNext(root, form, state);
      return;
    }

    if (target.hasAttribute("data-next")) {
      if (validateStep(root, state)) goNext(root, form, state);
      return;
    }

    if (target.hasAttribute("data-edit")) {
      state.summary = false;
      state.currentStep = 0;
      render(root, form, state);
      return;
    }

    if (target.hasAttribute("data-submit-hana")) {
      submitViaExistingFlow(root, form, state);
    }
  }

  function handleRootInput(event, form, state) {
    const target = event.target;
    if (!target.matches("[data-answer]")) return;
    const key = target.dataset.answer;
    state.answers[key] = target.type === "checkbox" ? target.checked : target.value;
    syncAnswerToField(form, state, key);
  }

  function handleRootChange(event, form, state) {
    handleRootInput(event, form, state);
  }

  function goNext(root, form, state) {
    const step = STEPS[state.currentStep];
    syncAnswerToField(form, state, step.key);
    if (step.withConsent) syncAnswerToField(form, state, "privacy");
    if (state.currentStep >= STEPS.length - 1) {
      state.summary = true;
    } else {
      state.currentStep += 1;
    }
    render(root, form, state);
  }

  function validateStep(root, state) {
    const step = STEPS[state.currentStep];
    const error = root.querySelector("[data-error]");
    const value = (state.answers[step.key] || "").toString().trim();
    const setError = (message) => {
      if (error) error.textContent = message;
      return false;
    };

    if (step.required && !value) return setError("필수 항목입니다. 답변을 입력해 주세요.");
    if (step.key === "emailConfirm" && (state.answers.email || "").trim().toLowerCase() !== value.toLowerCase()) {
      return setError("이메일 주소가 서로 다릅니다. 다시 확인해 주세요.");
    }
    if (step.key === "messenger" && !hasPhoneOrMessenger(state)) {
      return setError("전화번호 또는 메신저 연락처 중 하나 이상 입력해 주세요.");
    }
    if (step.withConsent && !state.answers.privacy) {
      return setError("개인정보 동의 후 제출해 주세요.");
    }
    return true;
  }

  function hasPhoneOrMessenger(state) {
    return Boolean((state.answers.phone || "").trim() || (state.answers.messenger || "").trim());
  }

  function languageCodeFromAnswer(value) {
    const languageMap = {
      "한국어": "KO",
      English: "EN",
      "Tiếng Việt": "VI",
      "日本語": "JP",
      "中文": "CN"
    };
    return languageMap[value] || null;
  }

  function submitViaExistingFlow(root, form, state) {
    syncAllAnswers(form, state);
    const error = root.querySelector("[data-error]");
    if (!validateAllBeforeSubmit(state)) {
      if (error) error.textContent = "필수 항목을 확인해 주세요. 수정하기를 눌러 누락된 답변을 입력할 수 있습니다.";
      return;
    }
    if (state.missingFields.length && error) {
      error.textContent = "일부 필드 연결을 확인해 주세요. 기존 빠른 신청서 모드에서도 내용을 확인할 수 있습니다.";
    }
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitButton) {
      submitButton.click();
    } else if (typeof form.requestSubmit === "function") {
      form.requestSubmit();
    } else {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
  }

  function validateAllBeforeSubmit(state) {
    const requiredKeys = ["inquiryType", "interest", "language", "name", "country", "email", "emailConfirm", "location", "message"];
    if (!requiredKeys.every((key) => (state.answers[key] || "").toString().trim())) return false;
    if (!hasPhoneOrMessenger(state)) return false;
    if ((state.answers.email || "").trim().toLowerCase() !== (state.answers.emailConfirm || "").trim().toLowerCase()) return false;
    return Boolean(state.answers.privacy);
  }

  function mapFields(form, state) {
    const fields = {};
    Object.entries(FIELD_CANDIDATES).forEach(([key, candidates]) => {
      fields[key] = findField(form, candidates);
      if (!fields[key]) {
        state.missingFields.push(key);
        console.warn(`Medi Hana consultation field mapping not found for ${key}. Checked: ${candidates.join(", ")}`);
      }
    });
    return fields;
  }

  function findField(form, candidates) {
    for (const candidate of candidates) {
      const escaped = cssEscape(candidate);
      const field = form.querySelector(`[name="${escaped}"], #${escaped}`);
      if (field) return field;
    }
    return null;
  }

  function readInitialAnswers(form) {
    const answers = {};
    Object.entries(FIELD_CANDIDATES).forEach(([key, candidates]) => {
      const field = findField(form, candidates);
      if (!field) return;
      answers[key] = field.type === "checkbox" ? field.checked : field.value;
    });
    return answers;
  }

  function syncAllAnswers(form, state) {
    Object.keys(FIELD_CANDIDATES).forEach((key) => syncAnswerToField(form, state, key));
  }

  function syncAnswerToField(form, state, key) {
    const field = state.fields && state.fields[key] ? state.fields[key] : findField(form, FIELD_CANDIDATES[key] || []);
    if (!field) return;
    const value = state.answers[key] || "";

    if (field.type === "checkbox") {
      field.checked = Boolean(value);
    } else if (field.tagName === "SELECT") {
      setSelectValue(field, value);
    } else {
      field.value = value;
    }
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function setSelectValue(select, value) {
    const options = Array.from(select.options);
    const match = options.find((option) => option.value === value || option.textContent.trim() === value);
    if (match) {
      select.value = match.value;
      return;
    }
    if (value) {
      const option = new Option(value, value, true, true);
      select.add(option);
      select.value = value;
    }
  }

  function renderMappingNotice(state) {
    if (!state.missingFields.length) return "";
    return `<p class="mh-consult-warning">일부 필드 연결을 확인해 주세요: ${escapeHtml(state.missingFields.join(", "))}</p>`;
  }

  function attachImageFallback(panel, state) {
    const image = panel.querySelector(".mh-consult-character-img");
    if (!image) return;
    image.addEventListener("error", () => {
      if (!state.imageFallbackUsed) {
        state.imageFallbackUsed = true;
        image.src = LANGUAGES.DEFAULT.image;
        return;
      }
      state.defaultImageFailed = true;
      image.hidden = true;
      image.alt = "";
    });
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(value);
    return value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, "&#39;");
  }
})();
