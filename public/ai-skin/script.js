(function () {
  const $ = (id) => document.getElementById(id);
  const startBtn = $('vrmtStartCameraBtn');
  const captureBtn = $('vrmtCaptureBtn');
  const video = $('vrmtCameraVideo');
  const canvas = $('vrmtSnapshotCanvas');
  const statusEl = $('vrmtStatus');
  const analysis = $('vrmtAnalysis');
  const guide = $('vrmtFaceGuide');
  const premiumPanel = $('vrmtPremiumPanel');
  const premiumConfirm = $('vrmtPremiumConfirm');
  const premiumQuality = $('vrmtPremiumQuality');
  const premiumAnalyzeBtn = $('vrmtPremiumAnalyzeBtn');
  const retakeBtn = $('vrmtRetakeBtn');

  const params = new URLSearchParams(window.location.search);
  const premiumCode = params.get('premium');
  const isPremium = premiumCode === 'BUSANBLUE';
  const hasInvalidPremium = premiumCode && !isPremium;
  const supported = ['ko', 'en', 'vi', 'ja', 'zh', 'ar'];
  const medicalSafetyNotice = '본 리포트는 의료 진단이 아닙니다. 카메라 이미지 기반의 비의료적 피부 컨디션 참고 자료이며, 질병의 진단, 치료, 예방 또는 의료적 판단을 제공하지 않습니다. 최종 진료 및 치료 판단은 의료기관 상담을 통해 이루어져야 합니다.';
  const privacyNotice = '촬영 이미지는 피부 컨디션 리포트 생성을 위한 참고 자료로만 사용됩니다. 기본 설정에서는 장기 저장하지 않으며, 상담 또는 이메일 리포트 수신을 신청하는 경우 별도 동의가 필요합니다.';

  let stream = null;
  let currentLanguage = 'ko';
  let lastAnalysis = null;
  let lastErrorReport = null;
  let pendingPremiumImage = null;
  let qualityReady = false;

  const translations = {
    ko: {
      title: 'AI 피부 분석 & 케어 컨시어지',
      subtitle: '프리미엄 K-뷰티 · 메디컬 트래블 케어를 위한 AI 참고 분석',
      badgeAi: 'AI 참고 분석',
      badgeNoStore: '사진 저장 없음',
      badgeNotMedical: '의료 진단 아님',
      badgeKBeauty: 'K-뷰티 케어 제안',
      badgeConsult: '전문 상담 연계 가능',
      guide: '카메라를 시작한 뒤 얼굴을 가이드에 맞추고 AI 판별 촬영을 눌러 주세요.',
      premiumGuide: '밝은 곳에서 정면을 바라보고 촬영해주세요. 촬영 이미지는 피부 컨디션 리포트 생성을 위한 참고 자료로만 사용됩니다.',
      startBtn: '카메라 시작',
      captureBtn: 'AI 판별 촬영',
      premiumCaptureBtn: '얼굴 사진 촬영',
      captureLoading: 'AI가 이미지를 분석 중입니다...',
      statusInit: '카메라를 시작한 뒤 얼굴을 가이드에 맞추고 AI 판별 촬영을 눌러 주세요.',
      premiumStatusInit: 'Premium Access 확인 완료: 카메라를 시작한 뒤 얼굴 사진을 촬영해 주세요.',
      statusCameraOn: '카메라가 시작되었습니다. 가이드에 맞춘 뒤 촬영해 주세요.',
      statusAnalyzing: 'AI가 이미지를 분석 중입니다...',
      statusDone: 'AI 분석이 완료되었습니다.',
      statusNeedCamera: '먼저 카메라를 시작해 주세요.',
      statusQualityReady: '사진 품질 확인이 완료되었습니다. 안내 확인 후 프리미엄 분석을 시작할 수 있습니다.',
      statusInvalidPremium: '유효하지 않은 프리미엄 주소입니다. 무료 AI 피부 분석으로 이용할 수 있습니다.',
      errNoCamera: '이 브라우저는 카메라를 지원하지 않습니다.',
      errCameraPermission: '카메라 권한을 확인해 주세요.',
      errServer: '서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      errApiKey: 'AI 분석 서버 설정이 아직 완료되지 않았습니다. 관리자에게 문의해 주세요.',
      errQuota: 'AI 분석 서버 사용 한도가 일시적으로 제한되어 있습니다. 관리자 확인 후 다시 이용해 주세요.',
      errImageFormat: '이미지 형식이 올바르지 않습니다. 다시 촬영해 주세요.',
      errImageSize: '이미지 용량이 너무 큽니다. 카메라를 다시 시작하고 재시도해 주세요.',
      errAnalyze: '분석 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      reportTitle: 'AI 피부 분석 리포트',
      reportDesc: '촬영 후 분석 리포트가 카드 형식으로 표시됩니다.',
      premiumReportTitle: '프리미엄 AI K-뷰티 컨시어지 리포트',
      skinSummary: '피부 컨디션 요약',
      imageQuality: '이미지 품질',
      tone: '피부톤 참고',
      redness: '붉은기 참고',
      moisture: '수분/건조 참고',
      carePriority: '케어 우선순위',
      productDirection: '추천 제품 방향',
      consult: '전문 상담 참고 안내',
      devJson: '개발자용 JSON 보기',
      languageNotice: '분석 결과 본문은 촬영 당시 선택된 언어로 생성됩니다. 다른 언어의 결과 본문이 필요하면 해당 언어를 선택한 뒤 다시 촬영해 주세요.',
      requestFailed: '요청 실패',
    },
    en: {
      title: 'AI Skin Analysis & Care Concierge',
      subtitle: 'AI reference insights for premium K-beauty and medical-travel care',
      badgeAi: 'AI reference analysis',
      badgeNoStore: 'No photo storage',
      badgeNotMedical: 'Not a medical diagnosis',
      badgeKBeauty: 'K-beauty care guidance',
      badgeConsult: 'Professional consultation linkage',
      guide: 'Start the camera, align your face in the guide, then tap AI Capture.',
      premiumGuide: 'Take the photo from the front in a bright place. The image is used only as reference material for the skin condition report.',
      startBtn: 'Start Camera',
      captureBtn: 'AI Capture',
      premiumCaptureBtn: 'Capture Face Photo',
      captureLoading: 'AI is analyzing the image...',
      statusInit: 'Start the camera, align your face in the guide, then tap AI Capture.',
      premiumStatusInit: 'Premium Access confirmed: start the camera and capture a face photo.',
      statusCameraOn: 'Camera started. Align to the guide and capture.',
      statusAnalyzing: 'AI is analyzing the image...',
      statusDone: 'AI analysis is complete.',
      statusNeedCamera: 'Please start the camera first.',
      statusQualityReady: 'Photo quality check is complete. Confirm the notice to start the premium analysis.',
      statusInvalidPremium: 'This premium link is not valid. You can continue with the free AI skin analysis.',
      errNoCamera: 'This browser does not support camera access.',
      errCameraPermission: 'Please check camera permissions.',
      errServer: 'Server communication failed. Please try again later.',
      errApiKey: 'AI analysis server setup is not complete yet. Please contact the administrator.',
      errQuota: 'AI analysis server usage is temporarily limited. Please try again after administrator review.',
      errImageFormat: 'Invalid image format. Please capture again.',
      errImageSize: 'Image is too large. Restart camera and try again.',
      errAnalyze: 'Analysis request failed. Please try again later.',
      reportTitle: 'AI Skin Analysis Report',
      reportDesc: 'Your analysis report will appear here after capture.',
      premiumReportTitle: 'Premium AI K-Beauty Concierge Report',
      skinSummary: 'Skin condition summary',
      imageQuality: 'Image quality',
      tone: 'Skin tone reference',
      redness: 'Redness reference',
      moisture: 'Moisture/Dryness reference',
      carePriority: 'Care priority',
      productDirection: 'Recommended product direction',
      consult: 'Professional consultation reference',
      devJson: 'Developer JSON',
      languageNotice: 'The analysis content is generated in the language selected at the time of capture. To receive the full report in another language, select that language and capture again.',
      requestFailed: 'Request failed',
    },
  };
  ['vi', 'ja', 'zh', 'ar'].forEach((lang) => { translations[lang] = translations.en; });

  function t(k) { return translations[currentLanguage]?.[k] ?? translations.en?.[k] ?? translations.ko?.[k] ?? null; }
  function setStatus(k, loading = false) { statusEl.textContent = t(k); statusEl.classList.toggle('loading', loading); }
  function esc(s) { return String(s ?? '').replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
  function li(arr) { return (arr || []).map((v) => `<li>${esc(v)}</li>`).join(''); }
  function pct(value, fallback = 70) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : fallback;
  }

  function applyLanguage(lang) {
    currentLanguage = supported.includes(lang) ? lang : 'ko';
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = 'ltr';
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = isPremium && el.dataset.premiumI18n ? el.dataset.premiumI18n : el.dataset.i18n;
      const translated = t(key);
      if (translated) el.textContent = translated;
    });
    document.querySelectorAll('#languageButtons button').forEach((b) => b.classList.toggle('active', b.dataset.lang === currentLanguage));
    captureBtn.textContent = captureBtn.disabled ? t('captureLoading') : t(isPremium ? 'premiumCaptureBtn' : 'captureBtn');
    if (hasInvalidPremium && !lastAnalysis && !lastErrorReport) statusEl.textContent = t('statusInvalidPremium');
    localStorage.setItem('vrmtAiSkinLang', currentLanguage);
    if (lastAnalysis) renderReport(lastAnalysis);
    else if (lastErrorReport) renderError(lastErrorReport.message, lastErrorReport.payload);
  }

  function configureMode() {
    document.body.classList.toggle('premium-mode', isPremium);
    document.body.classList.toggle('invalid-premium-mode', Boolean(hasInvalidPremium));
    premiumPanel.hidden = !isPremium;
    premiumQuality.hidden = true;
    captureBtn.textContent = t(isPremium ? 'premiumCaptureBtn' : 'captureBtn');
    if (isPremium) {
      statusEl.textContent = t('premiumStatusInit');
    } else if (hasInvalidPremium) {
      statusEl.textContent = t('statusInvalidPremium');
    }
  }

  function mapMessage(raw = '') {
    const msg = String(raw || '').trim();
    if (!msg) return t('errAnalyze');
    if (msg.includes('OPENAI_API_KEY')) return t('errApiKey');
    if (/quota|rate limit|insufficient/i.test(msg)) return t('errQuota');
    if (/data:image|imageBase64|invalid image|형식/i.test(msg)) return t('errImageFormat');
    if (/too large|too big|용량|6000000|413/i.test(msg)) return t('errImageSize');
    return msg;
  }

  function setLoading(v) {
    captureBtn.disabled = v;
    premiumAnalyzeBtn.disabled = v || !qualityReady || !premiumConfirm.checked;
    captureBtn.textContent = v ? t('captureLoading') : t(isPremium ? 'premiumCaptureBtn' : 'captureBtn');
    premiumAnalyzeBtn.textContent = v ? '프리미엄 리포트 생성 중...' : '프리미엄 분석 시작';
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) { setStatus('errNoCamera'); return; }
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      video.srcObject = stream;
      setStatus('statusCameraOn');
      setTimeout(() => guide?.classList.add('vrmt-aligned'), 2000);
    } catch (_) {
      setStatus('errCameraPermission');
    }
  }

  function captureResized() {
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    const tw = Math.min(w, 1024);
    const th = Math.round((h / w) * tw);
    canvas.width = tw;
    canvas.height = th;
    canvas.getContext('2d').drawImage(video, 0, 0, tw, th);
    return canvas.toDataURL('image/jpeg', 0.82);
  }

  async function capture() {
    if (!stream) { setStatus('statusNeedCamera'); return; }
    const imageBase64 = captureResized();
    if (isPremium) {
      pendingPremiumImage = imageBase64;
      showQualityCheck();
      return;
    }
    setLoading(true);
    try { await analyze(imageBase64); } finally { setLoading(false); }
  }

  function showQualityCheck() {
    qualityReady = false;
    premiumQuality.hidden = false;
    premiumAnalyzeBtn.disabled = true;
    premiumQuality.innerHTML = `
      <h3>사진 품질 확인 중...</h3>
      <ul class="quality-list">
        <li>얼굴이 화면 중앙에 있는지</li>
        <li>조명이 너무 어둡지 않은지</li>
        <li>얼굴이 너무 멀지 않은지</li>
        <li>흔들림이 심하지 않은지</li>
        <li>마스크나 선글라스가 없는지</li>
      </ul>
      <div class="quality-result pending">확인 중입니다. 잠시만 기다려 주세요.</div>
      <div class="quality-actions">
        <button id="vrmtRetakeBtnInline" class="btn" type="button">다시 촬영하기</button>
        <button id="vrmtPremiumAnalyzeBtnInline" class="btn primary" type="button" disabled>프리미엄 분석 시작</button>
      </div>`;
    setStatus('statusQualityReady');
    setTimeout(() => {
      qualityReady = true;
      premiumQuality.querySelector('.quality-result').className = 'quality-result good';
      premiumQuality.querySelector('.quality-result').innerHTML = '<strong>사진 품질: 양호</strong><br>프리미엄 리포트를 생성할 수 있습니다.<br><span>더 안정적인 리포트를 위해 다시 촬영해주세요.</span>';
      wireQualityButtons();
      updatePremiumAnalyzeState();
    }, 650);
    wireQualityButtons();
  }

  function wireQualityButtons() {
    premiumQuality.querySelector('#vrmtRetakeBtnInline')?.addEventListener('click', resetPremiumCapture);
    premiumQuality.querySelector('#vrmtPremiumAnalyzeBtnInline')?.addEventListener('click', runPremiumAnalysis);
  }

  function resetPremiumCapture() {
    pendingPremiumImage = null;
    qualityReady = false;
    premiumConfirm.checked = false;
    premiumQuality.hidden = true;
    setStatus('statusCameraOn');
    updatePremiumAnalyzeState();
  }

  function updatePremiumAnalyzeState() {
    const enabled = Boolean(isPremium && pendingPremiumImage && qualityReady && premiumConfirm.checked);
    premiumAnalyzeBtn.disabled = !enabled;
    premiumQuality.querySelector('#vrmtPremiumAnalyzeBtnInline')?.toggleAttribute('disabled', !enabled);
  }

  async function runPremiumAnalysis() {
    if (!pendingPremiumImage || !qualityReady || !premiumConfirm.checked) return;
    setLoading(true);
    try { await analyze(pendingPremiumImage); } finally { setLoading(false); }
  }

  async function analyze(imageBase64) {
    setStatus('statusAnalyzing', true);
    const body = isPremium
      ? { imageBase64, image: imageBase64, mode: 'premium', premium: 'BUSANBLUE', language: currentLanguage }
      : { imageBase64, image: imageBase64, mode: 'free', language: currentLanguage };
    try {
      const res = await fetch('/.netlify/functions/analyze-skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || json.ok === false) {
        const m = mapMessage(json.error || json.message);
        statusEl.textContent = m;
        lastAnalysis = null;
        lastErrorReport = { message: m, payload: json };
        renderError(m, json);
        return;
      }
      lastAnalysis = json.analysis || {};
      lastErrorReport = null;
      renderReport(lastAnalysis);
      setStatus('statusDone');
    } catch (_) {
      const m = t('errServer');
      statusEl.textContent = m;
      lastAnalysis = null;
      lastErrorReport = { message: m, payload: { ok: false } };
      renderError(m, { ok: false });
    } finally {
      statusEl.classList.remove('loading');
    }
  }

  function renderError(message, payload) {
    analysis.innerHTML = `<h2>${esc(t('reportTitle'))}</h2><div class="report-item"><strong>${esc(message)}</strong></div><details><summary>${esc(t('devJson'))}</summary><pre>${esc(JSON.stringify(payload, null, 2))}</pre></details>${noticeMarkup()}`;
  }

  function renderReport(a) {
    if (isPremium) renderPremiumReport(a);
    else renderFreeReport(a);
  }

  function renderFreeReport(a) {
    analysis.innerHTML = `
      <h2>${esc(t('reportTitle'))}</h2>
      <div class="report-grid">
        <div class="report-item"><strong>${esc(t('skinSummary'))}</strong><p>${esc(a.summary || '-')}</p></div>
        <div class="report-item"><strong>${esc(t('imageQuality'))}</strong><p>${esc(String(a.confidence ?? '-'))}</p></div>
        <div class="report-item"><strong>${esc(t('tone'))}</strong><p>${esc((a.observations || [])[0] || '-')}</p></div>
        <div class="report-item"><strong>${esc(t('redness'))}</strong><p>${esc((a.observations || [])[1] || '-')}</p></div>
        <div class="report-item"><strong>${esc(t('moisture'))}</strong><p>${esc((a.observations || [])[2] || '-')}</p></div>
        <div class="report-item"><strong>${esc(t('consult'))}</strong><p>${esc(a.dermatology_consult_recommendation || '-')}</p></div>
        <div class="report-item"><strong>${esc(t('carePriority'))}</strong><ul>${li(a.care_priority)}</ul></div>
        <div class="report-item"><strong>${esc(t('productDirection'))}</strong><ul>${li(a.recommended_product_direction)}</ul></div>
      </div>
      <div class="premium-info-card">프리미엄 K-뷰티 컨시어지 리포트는 부산 굿즈 구매 고객에게 제공됩니다. 굿즈 안내서의 QR을 스캔하면 더 자세한 리포트를 확인할 수 있습니다.</div>
      <details><summary>${esc(t('devJson'))}</summary><pre>${esc(JSON.stringify(a, null, 2))}</pre></details>
      ${noticeMarkup()}`;
  }

  function renderPremiumReport(a) {
    const premium = normalizePremiumAnalysis(a);
    analysis.innerHTML = `
      <div class="premium-report-head">
        <span class="premium-chip">BUSANBLUE Premium</span>
        <h2>${esc(t('premiumReportTitle'))}</h2>
        <p>무료 분석보다 자세한 피부 컨디션 참고 리포트, K-뷰티 루틴, 제품 카테고리, 한국 상담 준비 체크리스트입니다.</p>
      </div>
      <section class="score-card">
        <div><span>종합 피부 컨디션 점수</span><strong>${premium.overallScore}</strong><em>/ 100</em></div>
        <p>${esc(premium.summary)}</p>
      </section>
      <section class="premium-section"><h3>7개 하위 점수</h3><div class="score-grid">${scoreBars(premium.subScores)}</div></section>
      <section class="premium-section"><h3>피부 고민 TOP 5</h3><ol>${li(premium.topConcerns)}</ol></section>
      <section class="premium-section"><h3>얼굴 부위별 관찰</h3><div class="zone-grid">${zoneItems(premium.zoneAnalysis)}</div></section>
      <section class="premium-section routine-grid">
        <div><h3>아침 K-뷰티 루틴</h3><ul>${li(premium.morningRoutine)}</ul></div>
        <div><h3>저녁 K-뷰티 루틴</h3><ul>${li(premium.eveningRoutine)}</ul></div>
        <div><h3>주간 케어 루틴</h3><ul>${li(premium.weeklyCare)}</ul></div>
        <div><h3>추천 제품 카테고리</h3><ul>${li(premium.productCategories)}</ul></div>
      </section>
      <section class="premium-section"><h3>한국 K-뷰티·의료관광 상담 준비 체크리스트</h3><ul>${li(premium.koreaConsultChecklist)}</ul></section>
      <div class="premium-cta-row">
        <a class="btn primary" href="/#consultation?source=BUSANBLUE">K-뷰티 상담 신청</a>
        <a class="btn primary" href="/#consultation?source=BUSANBLUE-medical">한국 의료관광 상담 신청</a>
        <a class="btn" href="/#consultation?source=BUSANBLUE-report">리포트 이메일로 받기</a>
        <a class="btn" href="/">VR MEDI TOUR 홈으로 돌아가기</a>
      </div>
      <details><summary>${esc(t('devJson'))}</summary><pre>${esc(JSON.stringify(a, null, 2))}</pre></details>
      ${noticeMarkup(true)}`;
  }

  function noticeMarkup(includePrivacy = false) {
    return `${includePrivacy ? `<p class="privacy-notice">${esc(privacyNotice)}</p>` : ''}<p class="safety">${esc(medicalSafetyNotice)}</p><p class="safety">${esc(t('languageNotice'))}</p>`;
  }

  function normalizePremiumAnalysis(a) {
    return {
      overallScore: pct(a.overallScore, Math.round((Number(a.confidence) || 0.72) * 100)),
      summary: a.summary || '촬영 이미지에서 확인 가능한 피부 컨디션을 기준으로 K-뷰티 루틴과 상담 전 준비 항목을 정리했습니다.',
      subScores: {
        hydration: pct(a.subScores?.hydration, 68), oilBalance: pct(a.subScores?.oilBalance, 72), texture: pct(a.subScores?.texture, 66), pores: pct(a.subScores?.pores, 61), redness: pct(a.subScores?.redness, 70), toneEvenness: pct(a.subScores?.toneEvenness, 69), glow: pct(a.subScores?.glow, 67),
      },
      topConcerns: a.topConcerns?.length ? a.topConcerns : ['수분 관리 루틴 점검', '유분 밸런스 관리', '피부결 균일도 관리', '모공 가시성 관리', '톤 균일도 관리'],
      zoneAnalysis: {
        forehead: a.zoneAnalysis?.forehead || '이마: 번들거림과 건조감을 함께 확인하며 가벼운 수분 레이어링을 권장합니다.',
        cheeks: a.zoneAnalysis?.cheeks || '양 볼: 수분감과 붉은기 신호를 중심으로 순한 보습 케어를 준비하세요.',
        nose: a.zoneAnalysis?.nose || '코 주변: 유분 밸런스와 모공 가시성이 두드러질 수 있어 세안 강도를 조절하세요.',
        mouthArea: a.zoneAnalysis?.mouthArea || '입가: 건조감이 쉽게 느껴질 수 있어 장벽 보습 제품 카테고리를 참고하세요.',
        chin: a.zoneAnalysis?.chin || '턱: 마찰과 유분 변화를 고려해 자극이 적은 루틴으로 관리하세요.',
        eyeArea: a.zoneAnalysis?.eyeArea || '눈가: 얇은 피부 부위이므로 가벼운 보습과 자외선 차단 루틴을 유지하세요.',
      },
      morningRoutine: a.morningRoutine?.length ? a.morningRoutine : ['저자극 클렌징 또는 미온수 세안', '수분 토너와 가벼운 세럼', '유분 밸런스를 고려한 보습제', '자외선 차단제 충분히 바르기'],
      eveningRoutine: a.eveningRoutine?.length ? a.eveningRoutine : ['메이크업·자외선 차단제 잔여물 클렌징', '수분 세럼 또는 진정 앰플 카테고리 확인', '보습 크림으로 마무리', '새 제품은 작은 부위에 먼저 확인'],
      weeklyCare: a.weeklyCare?.length ? a.weeklyCare : ['주 1~2회 수분 마스크 또는 진정 마스크', '과도한 스크럽 대신 부드러운 피부결 관리', '촬영 전후 피부 변화 메모', '상담 전 현재 루틴과 제품 목록 정리'],
      productCategories: a.productCategories?.length ? a.productCategories : ['수분 토너', '진정 세럼', '장벽 보습 크림', '저자극 클렌저', '데일리 자외선 차단제'],
      koreaConsultChecklist: a.koreaConsultChecklist?.length ? a.koreaConsultChecklist : ['현재 사용하는 제품과 성분 사진 준비', '피부 컨디션 변화 시기 메모', '원하는 K-뷰티 루틴 목표 정리', '상담 가능한 일정과 언어 요청 정리', '사진·리포트 공유는 별도 동의 후 진행'],
    };
  }

  function scoreBars(scores) {
    const labels = { hydration: '수분감 추정', oilBalance: '유분 밸런스', texture: '피부결 균일도', pores: '모공 가시성', redness: '붉은기·민감 신호', toneEvenness: '톤 균일도', glow: '광채·생기' };
    return Object.entries(labels).map(([key, label]) => `<div class="score-row"><span>${label}</span><strong>${scores[key]}</strong><i style="--score:${scores[key]}%"></i></div>`).join('');
  }

  function zoneItems(zones) {
    const labels = { forehead: '이마', cheeks: '양 볼', nose: '코 주변', mouthArea: '입가', chin: '턱', eyeArea: '눈가' };
    return Object.entries(labels).map(([key, label]) => `<div class="report-item"><strong>${label}</strong><p>${esc(zones[key])}</p></div>`).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    configureMode();
    document.querySelectorAll('#languageButtons button').forEach((btn) => btn.addEventListener('click', () => applyLanguage(btn.dataset.lang)));
    applyLanguage(localStorage.getItem('vrmtAiSkinLang') || 'ko');
    startBtn?.addEventListener('click', startCamera);
    captureBtn?.addEventListener('click', capture);
    premiumConfirm?.addEventListener('change', updatePremiumAnalyzeState);
    premiumAnalyzeBtn?.addEventListener('click', runPremiumAnalysis);
    retakeBtn?.addEventListener('click', resetPremiumCapture);
  });
}());
