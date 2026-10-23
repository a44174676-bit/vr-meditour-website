(() => {
  'use strict';
  const endpoint = '/.netlify/functions/study-korea-inquiry';
  let config = null;
  let lang = 'ko';
  const messages = {
    ko: { invalid: '필수 항목과 입력 형식을 확인해 주세요. 공백만 입력할 수 없습니다.', consent: '개인정보 수집·이용에 동의해 주세요.', closed: '현재 온라인 접수가 준비 중입니다. 입력 내용은 전송·저장되지 않았습니다.', pending: '접수 확인 중입니다. 잠시 기다려 주세요.', failed: '접수를 확인하지 못했습니다. 입력 내용은 유지됩니다. 같은 내용으로 다시 시도해 주세요.', success: '접수가 완료되었습니다. 접수번호: ', ready: '온라인 상담 신청이 가능합니다. 아래 개인정보 처리 안내를 확인해 주세요.' },
    vi: { invalid: 'Vui lòng kiểm tra các mục bắt buộc và định dạng. Không được chỉ nhập khoảng trắng.', consent: 'Vui lòng đồng ý thu thập và sử dụng dữ liệu cá nhân.', closed: 'Tiếp nhận trực tuyến đang được chuẩn bị. Nội dung chưa được gửi hoặc lưu.', pending: 'Đang xác nhận tiếp nhận. Vui lòng chờ.', failed: 'Chưa xác nhận được tiếp nhận. Nội dung vẫn được giữ. Vui lòng thử lại với cùng nội dung.', success: 'Đã tiếp nhận. Mã yêu cầu: ', ready: 'Có thể gửi yêu cầu trực tuyến. Vui lòng đọc thông báo dữ liệu cá nhân bên dưới.' }
  };
  const forms = [...document.querySelectorAll('form')];
  const states = new WeakMap();
  const setStatus = (form, key, receipt = '') => {
    states.set(form, { key, receipt });
    form.querySelector('.form-status').textContent = messages[lang][key] + receipt;
  };
  function applyLanguage(value) {
    lang = value === 'vi' ? 'vi' : 'ko';
    document.documentElement.lang = lang;
    document.title = lang === 'vi' ? 'VR STUDENT KOREA | Hướng dẫn du học Hàn Quốc' : 'VR STUDENT KOREA | 한국 유학 안내';
    document.querySelector('meta[name="description"]').content = lang === 'vi' ? 'Hướng dẫn chọn trường, nhập học, xuất nhập cảnh và cuộc sống tại Busan cùng VR MEDI TOUR & HOME.' : 'VR MEDI TOUR & HOME의 한국 유학 안내. 대학·학과 선택, 입학 준비, 출입국과 부산 생활적응 상담.';
    document.querySelector('meta[property="og:description"]').content = lang === 'vi' ? 'Du học Hàn Quốc bắt đầu từ thông tin đáng tin cậy.' : '한국 유학, 정확한 정보에서 시작합니다.';
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
    document.querySelectorAll('option[data-ko]').forEach(option => { option.textContent = option.dataset[lang]; });
    document.querySelector('#home-link').href = '/?lang=' + lang;
    if (config) {
      document.querySelector('#policy-text').textContent = config.policy[lang];
      document.querySelector('.availability').textContent = messages[lang].ready;
    }
    forms.forEach(form => { const state = states.get(form); if (state) setStatus(form, state.key, state.receipt); });
    try { localStorage.setItem('vrMediTourLang', lang); } catch { /* Private browsing can disable storage. */ }
  }
  let saved;
  try { saved = localStorage.getItem('vrMediTourLang'); } catch { /* Use Korean by default. */ }
  applyLanguage(new URLSearchParams(location.search).get('lang') || saved);
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => {
    applyLanguage(button.dataset.lang);
    const url = new URL(location.href); url.searchParams.set('lang', lang); history.replaceState(null, '', url);
  }));
  window.addEventListener('popstate', () => applyLanguage(new URLSearchParams(location.search).get('lang')));
  forms.forEach(form => {
    let busy = false;
    let submissionId;
    let previousPayload;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (busy) return;
      const controls = [...form.querySelectorAll('input[required],select[required],textarea[required]')];
      const invalid = controls.filter(input => !input.checkValidity() || (input.type !== 'checkbox' && !input.value.trim()));
      controls.forEach(input => input.setAttribute('aria-invalid', String(invalid.includes(input))));
      if (invalid.length) {
        setStatus(form, invalid[0].name === 'consent' ? 'consent' : 'invalid');
        invalid[0].setAttribute('aria-describedby', form.id + '-status');
        invalid[0].focus(); return;
      }
      if (!config) { setStatus(form, 'closed'); return; }
      const payload = Object.fromEntries(new FormData(form));
      Object.keys(payload).forEach(key => { payload[key] = payload[key].trim(); });
      payload.kind = form.dataset.kind; payload.lang = lang; payload.consent = true; payload.policyVersion = config.version;
      const serialized = JSON.stringify(payload);
      if (serialized !== previousPayload) { submissionId = crypto.randomUUID(); previousPayload = serialized; }
      payload.submissionId = submissionId;
      busy = true; form.querySelector('button[type=submit]').disabled = true; form.setAttribute('aria-busy', 'true'); setStatus(form, 'pending');
      try {
        const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15000) });
        const result = await response.json();
        if (!response.ok || result.accepted !== true || typeof result.receiptId !== 'string' || !result.receiptId.trim()) throw new Error('Unconfirmed');
        form.reset(); previousPayload = null; submissionId = null; setStatus(form, 'success', result.receiptId);
      } catch { setStatus(form, 'failed'); }
      finally { busy = false; form.removeAttribute('aria-busy'); form.querySelector('button[type=submit]').disabled = false; }
    });
    form.querySelector('.form-status').id = form.id + '-status';
  });
  fetch(endpoint, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) }).then(async response => {
    if (!response.ok) return;
    const result = await response.json();
    if (result.enabled !== true || !result.version || !result.policy?.ko || !result.policy?.vi) return;
    config = result; applyLanguage(lang);
    forms.forEach(form => { form.querySelector('button[type=submit]').disabled = false; });
  }).catch(() => { /* Fail closed: no successful storage is implied. */ });
})();
