(function () {
  "use strict";

  const LANGS = ["ko", "en", "vi", "ja", "zh"];
  const IMAGE_BY_LANG = {
    ko: "/public/assets/medi-hana/medi-hana-ko.png?v=3",
    en: "/public/assets/medi-hana/medi-hana-en.png?v=3",
    vi: "/public/assets/medi-hana/medi-hana-vi.png?v=3",
    ja: "/public/assets/medi-hana/medi-hana-jp.png?v=3",
    zh: "/public/assets/medi-hana/medi-hana-cn.png?v=3",
    default: "/public/assets/medi-hana/medi-hana-default.png?v=3"
  };

  const LANGUAGE_VALUES = {
    ko: "한국어",
    en: "English",
    vi: "Tiếng Việt",
    ja: "日本語",
    zh: "中文"
  };

  const COPY = {
    ko: {
      start: "메디하나와 상담 시작하기",
      quick: "빠른 신청서로 바로 작성하기",
      progress: "STEP {step} / 5",
      prev: "이전",
      next: "다음",
      submit: "상담 신청 제출",
      required: "필수 항목을 입력해 주세요.",
      selectRequired: "항목을 선택해 주세요.",
      contactRequired: "전화번호 또는 메신저 연락처 중 하나 이상을 입력해 주세요.",
      emailInvalid: "이메일 형식을 확인해 주세요.",
      agreeRequired: "개인정보 동의가 필요합니다.",
      submitting: "상담 신청을 준비하고 있습니다. 잠시만 기다려 주세요.",
      summaryLabels: { type: "문의 유형", interest: "관심 분야", language: "선호 언어", contact: "연락처" },
      placeholders: { name: "이름", email: "you@example.com", contact: "전화번호 또는 카카오톡/WhatsApp/Zalo", message: "증상, 희망 일정, 궁금한 점을 편하게 적어주세요." },
      steps: [{ title: "문의 유형", question: "어떤 상담을 원하시나요?" }, { title: "관심 분야", question: "어떤 분야가 궁금하세요?" }, { title: "선호 언어", question: "어떤 언어로 상담받고 싶으세요?" }, { title: "연락처", question: "답변을 받을 연락처를 알려주세요." }, { title: "문의 내용 및 동의", question: "궁금한 내용을 편하게 적어주세요." }],
      consultTypes: ["의료관광", "K-뷰티", "건강검진", "병원 연결", "기타"],
      interestAreas: ["피부·성형", "치과", "건강검진", "한방·웰니스", "재활·치료", "아직 모르겠어요"],
      languages: ["한국어", "English", "Tiếng Việt", "日本語", "中文"],
      labels: { name: "이름", email: "이메일", contact: "전화번호 또는 메신저 연락처", message: "문의 내용", agree: "개인정보 수집 및 상담 준비 활용에 동의합니다." }
    },
    en: {
      start: "Start with Medi Hana", quick: "Use quick form instead", progress: "STEP {step} / 5", prev: "Back", next: "Next", submit: "Submit consultation", required: "Please complete the required field.", selectRequired: "Please choose an option.", contactRequired: "Please enter either a phone number or messenger contact.", emailInvalid: "Please check the email format.", agreeRequired: "Please agree to the privacy consent.", submitting: "Preparing your consultation request. Please wait a moment.", summaryLabels: { type: "Inquiry type", interest: "Interest area", language: "Preferred language", contact: "Contact" },
      placeholders: { name: "Full name", email: "you@example.com", contact: "Phone, KakaoTalk, WhatsApp, or Zalo", message: "Share symptoms, timing, goals, or questions." },
      steps: [{ title: "Inquiry type", question: "What consultation do you need?" }, { title: "Interest area", question: "Which area are you curious about?" }, { title: "Preferred language", question: "Which language would you like for consultation?" }, { title: "Contact", question: "Please share where we can reply." }, { title: "Message & consent", question: "Please write your questions freely." }],
      consultTypes: ["Medical travel", "K-Beauty", "Health check-up", "Hospital connection", "Other"], interestAreas: ["Skin · Plastic surgery", "Dentistry", "Health check-up", "Korean medicine · Wellness", "Rehab · Treatment", "Not sure yet"], languages: ["한국어", "English", "Tiếng Việt", "日本語", "中文"], labels: { name: "Name", email: "Email", contact: "Phone or messenger contact", message: "Message", agree: "I agree to privacy collection and use for consultation preparation." }
    },
    vi: {
      start: "Bắt đầu với Medi Hana", quick: "Viết mẫu nhanh", progress: "BƯỚC {step} / 5", prev: "Trước", next: "Tiếp", submit: "Gửi yêu cầu tư vấn", required: "Vui lòng nhập thông tin bắt buộc.", selectRequired: "Vui lòng chọn một mục.", contactRequired: "Vui lòng nhập số điện thoại hoặc liên hệ messenger.", emailInvalid: "Vui lòng kiểm tra định dạng email.", agreeRequired: "Vui lòng đồng ý với điều khoản bảo mật.", submitting: "Đang chuẩn bị yêu cầu tư vấn. Vui lòng chờ trong giây lát.", summaryLabels: { type: "Loại tư vấn", interest: "Lĩnh vực quan tâm", language: "Ngôn ngữ ưu tiên", contact: "Liên hệ" },
      placeholders: { name: "Họ tên", email: "you@example.com", contact: "Điện thoại, KakaoTalk, WhatsApp hoặc Zalo", message: "Hãy viết triệu chứng, thời gian mong muốn hoặc câu hỏi." },
      steps: [{ title: "Loại tư vấn", question: "Bạn muốn tư vấn về điều gì?" }, { title: "Lĩnh vực quan tâm", question: "Bạn muốn biết về lĩnh vực nào?" }, { title: "Ngôn ngữ ưu tiên", question: "Bạn muốn được tư vấn bằng ngôn ngữ nào?" }, { title: "Liên hệ", question: "Vui lòng cho biết cách chúng tôi trả lời bạn." }, { title: "Nội dung & đồng ý", question: "Hãy viết câu hỏi của bạn một cách thoải mái." }],
      consultTypes: ["Du lịch y tế", "K-Beauty", "Khám sức khỏe", "Kết nối bệnh viện", "Khác"], interestAreas: ["Da · Thẩm mỹ", "Nha khoa", "Khám sức khỏe", "Y học Hàn Quốc · Wellness", "Phục hồi · Điều trị", "Chưa rõ"], languages: ["한국어", "English", "Tiếng Việt", "日本語", "中文"], labels: { name: "Tên", email: "Email", contact: "Điện thoại hoặc messenger", message: "Nội dung", agree: "Tôi đồng ý thu thập và sử dụng thông tin để chuẩn bị tư vấn." }
    },
    ja: {
      start: "メディハナと相談を始める", quick: "クイック申請書を使う", progress: "STEP {step} / 5", prev: "戻る", next: "次へ", submit: "相談を送信", required: "必須項目を入力してください。", selectRequired: "項目を選択してください。", contactRequired: "電話番号またはメッセンジャー連絡先のいずれかを入力してください。", emailInvalid: "メール形式を確認してください。", agreeRequired: "個人情報同意が必要です。", submitting: "相談申請を準備しています。少々お待ちください。", summaryLabels: { type: "相談タイプ", interest: "関心分野", language: "希望言語", contact: "連絡先" },
      placeholders: { name: "お名前", email: "you@example.com", contact: "電話番号、KakaoTalk、WhatsApp、Zalo", message: "症状、希望時期、質問を自由にご記入ください。" },
      steps: [{ title: "相談タイプ", question: "どのような相談をご希望ですか？" }, { title: "関心分野", question: "どの分野が気になりますか？" }, { title: "希望言語", question: "どの言語で相談したいですか？" }, { title: "連絡先", question: "返信を受け取る連絡先を教えてください。" }, { title: "相談内容と同意", question: "気になる内容を自由に書いてください。" }],
      consultTypes: ["医療観光", "K-ビューティー", "健康診断", "病院連携", "その他"], interestAreas: ["皮膚・美容整形", "歯科", "健康診断", "韓方・ウェルネス", "リハビリ・治療", "まだ分かりません"], languages: ["한국어", "English", "Tiếng Việt", "日本語", "中文"], labels: { name: "名前", email: "メール", contact: "電話番号またはメッセンジャー", message: "お問い合わせ内容", agree: "相談準備のための個人情報収集・利用に同意します。" }
    },
    zh: {
      start: "与 Medi Hana 开始咨询", quick: "直接填写快速表单", progress: "第 {step} / 5 步", prev: "上一步", next: "下一步", submit: "提交咨询", required: "请填写必填项。", selectRequired: "请选择一个项目。", contactRequired: "请至少填写电话或即时通讯联系方式。", emailInvalid: "请检查邮箱格式。", agreeRequired: "请同意个人信息条款。", submitting: "正在准备咨询申请，请稍候。", summaryLabels: { type: "咨询类型", interest: "关注领域", language: "偏好语言", contact: "联系方式" },
      placeholders: { name: "姓名", email: "you@example.com", contact: "电话、KakaoTalk、WhatsApp 或 Zalo", message: "请填写症状、期望时间或问题。" },
      steps: [{ title: "咨询类型", question: "您需要哪种咨询？" }, { title: "关注领域", question: "您想了解哪个领域？" }, { title: "偏好语言", question: "您希望用哪种语言咨询？" }, { title: "联系方式", question: "请留下可回复的联系方式。" }, { title: "咨询内容与同意", question: "请自由填写您的问题。" }],
      consultTypes: ["医疗旅游", "K-Beauty", "健康体检", "医院连接", "其他"], interestAreas: ["皮肤·整形", "牙科", "健康体检", "韩方·康养", "康复·治疗", "还不确定"], languages: ["한국어", "English", "Tiếng Việt", "日本語", "中文"], labels: { name: "姓名", email: "邮箱", contact: "电话或即时通讯", message: "咨询内容", agree: "我同意为准备咨询而收集和使用个人信息。" }
    }
  };

  const VALUE_MAP = {
    consultTypes: ["의료관광", "K-뷰티", "건강검진", "병원 연결", "기타"],
    interestAreas: ["피부·성형", "치과", "건강검진", "한방·웰니스", "재활·치료", "아직 모르겠어요"],
    existingInterest: ["Plastic Surgery", "Dentistry", "Health Check-up", "Wellness & Recovery", "Wellness & Recovery", "Wellness & Recovery"]
  };

  const state = { lang: "en", step: 0, mode: "medi", answers: { consultType: "", interestArea: "", language: "", name: "", email: "", contact: "", message: "", agree: false } };

  const $ = (selector) => document.querySelector(selector);

  function insertHeaderLayoutFix() {
    if (document.getElementById("vrmt-header-layout-fix")) return;
    const style = document.createElement("style");
    style.id = "vrmt-header-layout-fix";
    style.textContent = `.topbar,.topbar *{writing-mode:horizontal-tb;word-break:keep-all;overflow-wrap:normal}.topbar{display:grid;grid-template-columns:minmax(190px,auto) minmax(260px,1fr) auto;grid-template-areas:"brand nav tools";align-items:center;gap:16px 18px}.topbar .brand{grid-area:brand;min-width:190px;white-space:nowrap}.topbar .brand-text,.topbar .brand-text strong,.topbar .brand-text span{white-space:nowrap;line-height:1.25}.topbar .top-nav-main{grid-area:nav;min-width:0;justify-content:center;gap:18px;flex-wrap:nowrap}.topbar .top-tools{grid-area:tools;min-width:0;justify-content:flex-end;flex-wrap:nowrap}.topbar .top-nav-main a,.topbar .top-nav-cta a,.topbar .language-select>span{display:inline-flex;align-items:center;white-space:nowrap;line-height:1.2}.topbar .top-nav-cta{flex-wrap:nowrap}.topbar .language-select{flex-wrap:nowrap}.topbar .language-buttons{flex-wrap:nowrap;gap:10px}.topbar .language-buttons button,.topbar .lang-btn{width:58px;height:58px;min-width:58px;min-height:58px}.topbar .language-buttons button img,.topbar .lang-btn img{width:48px;height:48px}@media(max-width:1180px){.topbar{grid-template-columns:minmax(190px,auto) 1fr;grid-template-areas:"brand nav" "tools tools";row-gap:14px}.topbar .top-nav-main{justify-content:flex-end;flex-wrap:wrap;gap:14px 18px}.topbar .top-tools{width:100%;justify-content:center;flex-wrap:wrap}.topbar .top-nav-cta{justify-content:center;flex-wrap:wrap}.topbar .language-select{justify-content:center}}@media(max-width:760px){.topbar{display:flex;flex-direction:column;align-items:stretch;gap:12px}.topbar .brand{justify-content:center;min-width:0}.topbar .top-nav-main,.topbar .top-nav-cta,.topbar .language-select,.topbar .language-buttons{width:100%;justify-content:flex-start;flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px;scrollbar-width:thin}.topbar .top-tools{width:100%;flex-direction:column;align-items:stretch;gap:10px}.topbar .top-nav .nav-ai-link{height:auto;min-height:38px;padding:7px 11px}.topbar .language-buttons button,.topbar .lang-btn{width:52px;height:52px;min-width:52px;min-height:52px}.topbar .language-buttons button img,.topbar .lang-btn img{width:42px;height:42px}}`;
    document.head.appendChild(style);
  }

  insertHeaderLayoutFix();

  function insertMainFaqLink() {
    const topbar = document.querySelector(".topbar");
    if (!topbar || topbar.querySelector('a[href="/faq.html"]')) return;
    const companyLink = topbar.querySelector('a[href="/company-profile.html"]');
    if (!companyLink) return;
    const faqLink = document.createElement("a");
    faqLink.href = "/faq.html";
    faqLink.className = companyLink.className || "btn secondary";
    faqLink.setAttribute("aria-label", "View FAQ");
    faqLink.textContent = "FAQ";
    companyLink.insertAdjacentElement("afterend", faqLink);
  }

  insertMainFaqLink();

  const form = $('form[name="medical-consult"]');
  const wizard = $("#mediHanaConsult");
  if (!form || !wizard) return;

  const els = {
    image: $("#mediHanaImage"), progress: $("#mediHanaProgress"), question: $("#mediHanaQuestion"), count: $("#mediHanaStepCount"), title: $("#mediHanaStepTitle"), body: $("#mediHanaStepBody"), error: $("#mediHanaError"), prev: $("#mediHanaPrev"), next: $("#mediHanaNext"), submit: $("#mediHanaSubmit"), modeButtons: document.querySelectorAll("[data-consult-mode]")
  };

  function activeCopy() { return COPY[state.lang] || COPY.en; }
  function normalizeLang(lang) { return LANGS.includes(lang) ? lang : "en"; }
  function setError(message) { els.error.textContent = message || ""; }
  function getField(name) { return form.elements[name]; }
  function setFormValue(name, value) { const field = getField(name); if (field) field.value = value; }
  function setCheckbox(name, checked) { const field = getField(name); if (field) field.checked = checked; }

  function currentLangFromPage() {
    return normalizeLang(document.documentElement.lang || localStorage.getItem("vrMediTourLang") || "en");
  }

  function renderChoiceGroup(key, values, labels) {
    return `<div class="medi-choice-grid" role="group">${labels.map((label, index) => {
      const value = values[index];
      const selected = state.answers[key] === value ? " is-selected" : "";
      return `<button type="button" class="medi-choice${selected}" data-answer-key="${key}" data-answer-value="${escapeAttr(value)}">${escapeHtml(label)}</button>`;
    }).join("")}</div>`;
  }

  function renderInputs(copy) {
    return `
      <div class="medi-input-grid">
        <label><span>${escapeHtml(copy.labels.name)}</span><input type="text" data-medi-input="name" autocomplete="name" value="${escapeAttr(state.answers.name)}" placeholder="${escapeAttr(copy.placeholders.name)}" required></label>
        <label><span>${escapeHtml(copy.labels.email)}</span><input type="email" data-medi-input="email" autocomplete="email" dir="ltr" value="${escapeAttr(state.answers.email)}" placeholder="${escapeAttr(copy.placeholders.email)}" required></label>
        <label class="full"><span>${escapeHtml(copy.labels.contact)}</span><input type="text" data-medi-input="contact" dir="ltr" value="${escapeAttr(state.answers.contact)}" placeholder="${escapeAttr(copy.placeholders.contact)}" required></label>
      </div>`;
  }

  function renderMessage(copy) {
    return `
      <div class="medi-input-grid">
        <label class="full"><span>${escapeHtml(copy.labels.message)}</span><textarea data-medi-input="message" rows="5" placeholder="${escapeAttr(copy.placeholders.message)}" required>${escapeHtml(state.answers.message)}</textarea></label>
        <label class="medi-agree full"><input type="checkbox" data-medi-input="agree" ${state.answers.agree ? "checked" : ""}><span>${escapeHtml(copy.labels.agree)}</span></label>
      </div>`;
  }

  function renderStep() {
    const copy = activeCopy();
    const current = copy.steps[state.step];
    els.image.src = IMAGE_BY_LANG[state.lang] || IMAGE_BY_LANG.default;
    els.progress.textContent = copy.progress.replace("{step}", String(state.step + 1));
    els.question.textContent = current.question;
    els.count.textContent = copy.progress.replace("{step}", String(state.step + 1));
    els.title.textContent = current.title;
    els.prev.textContent = copy.prev;
    els.next.textContent = copy.next;
    els.submit.textContent = copy.submit;
    els.prev.hidden = state.step === 0;
    els.next.hidden = state.step === 4;
    els.submit.hidden = state.step !== 4;
    setError("");

    if (state.step === 0) els.body.innerHTML = renderChoiceGroup("consultType", VALUE_MAP.consultTypes, copy.consultTypes);
    if (state.step === 1) els.body.innerHTML = renderChoiceGroup("interestArea", VALUE_MAP.interestAreas, copy.interestAreas);
    if (state.step === 2) els.body.innerHTML = renderChoiceGroup("language", copy.languages, copy.languages);
    if (state.step === 3) els.body.innerHTML = renderInputs(copy);
    if (state.step === 4) els.body.innerHTML = renderMessage(copy);
  }

  function renderMode() {
    document.body.classList.add("medi-hana-js");
    wizard.hidden = state.mode !== "medi";
    form.classList.toggle("medi-quick-hidden", state.mode === "medi");
    els.modeButtons.forEach((button) => {
      const isActive = button.dataset.consultMode === state.mode;
      button.classList.toggle("primary", isActive);
      button.classList.toggle("secondary", !isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    setFormValue("medi_hana_mode", state.mode === "medi" ? "Medi Hana 5-step" : "Quick form");
  }

  function renderStaticLabels() {
    const copy = activeCopy();
    document.querySelectorAll("[data-medi-label]").forEach((el) => {
      const key = el.dataset.mediLabel;
      if (copy[key]) el.textContent = copy[key];
    });
  }

  function saveCurrentInputs() {
    wizard.querySelectorAll("[data-medi-input]").forEach((input) => {
      const key = input.dataset.mediInput;
      state.answers[key] = input.type === "checkbox" ? input.checked : input.value.trim();
    });
  }

  function validateStep() {
    saveCurrentInputs();
    const copy = activeCopy();
    if (state.step === 0 && !state.answers.consultType) return setError(copy.selectRequired), false;
    if (state.step === 1 && !state.answers.interestArea) return setError(copy.selectRequired), false;
    if (state.step === 2 && !state.answers.language) return setError(copy.selectRequired), false;
    if (state.step === 3) {
      if (!state.answers.name || !state.answers.email) return setError(copy.required), false;
      if (!isValidEmail(state.answers.email)) return setError(copy.emailInvalid), false;
      if (!state.answers.contact) return setError(copy.contactRequired), false;
    }
    if (state.step === 4) {
      if (!state.answers.message) return setError(copy.required), false;
      if (!state.answers.agree) return setError(copy.agreeRequired), false;
    }
    setError("");
    return true;
  }

  function syncToForm() {
    const copy = activeCopy();
    const interestIndex = VALUE_MAP.interestAreas.indexOf(state.answers.interestArea);
    const existingInterest = VALUE_MAP.existingInterest[interestIndex] || "Wellness & Recovery";
    const isHospital = state.answers.consultType === "병원 연결";

    setFormValue("medi_hana_mode", "Medi Hana 5-step");
    setFormValue("medi_hana_consult_type", state.answers.consultType);
    setFormValue("medi_hana_interest_area", state.answers.interestArea);
    setFormValue("inquiry_type", isHospital ? "Hospital Partnership Inquiry" : "Patient Inquiry");
    setFormValue("preferred_language", state.answers.language || LANGUAGE_VALUES[state.lang]);
    setFormValue("name", state.answers.name);
    setFormValue("country", "Medi Hana 5-step");
    setFormValue("email", state.answers.email);
    setFormValue("emailConfirm", state.answers.email);
    setFormValue("phone", state.answers.contact);
    setFormValue("messenger", state.answers.contact);
    setFormValue("interested_field", existingInterest);
    const summary = copy.summaryLabels || COPY.en.summaryLabels;
    setFormValue("message", `[Medi Hana 5-step]\n${summary.type}: ${state.answers.consultType}\n${summary.interest}: ${state.answers.interestArea}\n${summary.language}: ${state.answers.language}\n${summary.contact}: ${state.answers.contact}\n\n${state.answers.message}`);
    setCheckbox("privacy_agreement", state.answers.agree);
  }

  function validateQuickContact(event) {
    if (state.mode !== "quick") return;
    const phone = (getField("phone")?.value || "").trim();
    const messenger = (getField("messenger")?.value || "").trim();
    if (!phone && !messenger) {
      event.preventDefault();
      alert(activeCopy().contactRequired);
      (getField("phone") || getField("messenger"))?.focus();
    }
  }

  function setLanguage(lang) {
    const previousLanguage = state.answers.language;
    const wasAutoLanguage = !previousLanguage || Object.values(LANGUAGE_VALUES).includes(previousLanguage);
    state.lang = normalizeLang(lang);
    if (wasAutoLanguage) state.answers.language = LANGUAGE_VALUES[state.lang];
    renderStaticLabels();
    renderMode();
    renderStep();
  }

  function isValidEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char])); }
  function escapeAttr(value) { return escapeHtml(value); }

  wizard.addEventListener("click", (event) => {
    const choice = event.target.closest("[data-answer-key]");
    if (!choice) return;
    state.answers[choice.dataset.answerKey] = choice.dataset.answerValue;
    renderStep();
  });

  wizard.addEventListener("input", saveCurrentInputs);
  wizard.addEventListener("change", saveCurrentInputs);
  els.prev.addEventListener("click", () => { saveCurrentInputs(); state.step = Math.max(0, state.step - 1); renderStep(); });
  els.next.addEventListener("click", () => { if (!validateStep()) return; state.step = Math.min(4, state.step + 1); renderStep(); });
  els.submit.addEventListener("click", () => { if (!validateStep()) return; syncToForm(); setError(activeCopy().submitting || ""); form.requestSubmit(); });
  els.modeButtons.forEach((button) => { button.addEventListener("click", () => { state.mode = button.dataset.consultMode === "quick" ? "quick" : "medi"; renderMode(); }); });

  const languageButtons = document.getElementById("languageButtons");
  if (languageButtons) {
    languageButtons.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-lang]");
      if (button) window.setTimeout(() => setLanguage(button.dataset.lang), 0);
    });
  }

  window.addEventListener("vrmt:language-change", (event) => { if (event.detail?.lang) setLanguage(event.detail.lang); });
  form.addEventListener("submit", validateQuickContact, true);
  setLanguage(currentLangFromPage());
  renderMode();
})();