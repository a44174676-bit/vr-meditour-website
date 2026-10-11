const playButton = document.getElementById('play-video');
playButton.addEventListener('click', () => {
  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube-nocookie.com/embed/kitjPWWoaTg';
  iframe.title = '옴니볼 스키 제품 소개 영상';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.allowFullscreen = true;
  document.getElementById('video-shell').replaceChildren(iframe);
  iframe.focus();
});

const config = window.OMNIBALL_CONFIG;
const form = document.getElementById('inquiry-form');
const status = document.getElementById('form-status');
const submit = document.getElementById('submit-inquiry');
const canCollect = Boolean(config?.collectionEnabled && config.retentionPeriod);
if (canCollect) {
  document.getElementById('form-availability').textContent = '제품·도입·협력 문의를 담당 수신처로 전달합니다.';
  document.getElementById('retention-period').textContent = config.retentionPeriod;
  submit.textContent = '문의 접수';
}
let submitting = false;
let completed = false;
let submissionId = null;
let lastPayload = '';
form.addEventListener('input', () => {
  completed = false;
  submit.disabled = false;
});
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (submitting || completed) return;
  for (const field of form.querySelectorAll('[required]:not([type=checkbox])')) {
    field.value = field.value.trim();
  }
  if (!form.reportValidity()) return;
  if (!canCollect) {
    status.textContent = '필수 항목을 확인했습니다. 미리보기에서는 접수하지 않습니다. 제품 문의는 info@vr-meditour.com으로 보내 주세요.';
    return;
  }
  const payload = Object.fromEntries(new FormData(form));
  payload.consent = form.elements.consent.checked;
  const signature = JSON.stringify(payload);
  if (signature !== lastPayload) {
    submissionId = crypto.randomUUID();
    lastPayload = signature;
  }
  submitting = true;
  submit.disabled = true;
  status.textContent = '문의 전달 중입니다…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, submissionId }),
      signal: controller.signal
    });
    const result = await response.json();
    if (!response.ok || result.accepted !== true || typeof result.receiptId !== 'string' || !result.receiptId.trim()) {
      throw new Error('Receipt not confirmed');
    }
    status.textContent = '문의가 접수되었습니다. 입력하신 이메일로 회신드리겠습니다.';
    completed = true;
  } catch {
    status.textContent = '접수를 확인하지 못했습니다. 입력 내용은 유지됩니다. 다시 시도하거나 info@vr-meditour.com으로 문의해 주세요.';
  } finally {
    clearTimeout(timeout);
    submitting = false;
    submit.disabled = completed;
  }
});
