(function () {
  const startBtn = document.getElementById('vrmtStartCameraBtn');
  const captureBtn = document.getElementById('vrmtCaptureBtn');
  const videoEl = document.getElementById('vrmtCameraVideo');
  const canvasEl = document.getElementById('vrmtSnapshotCanvas');
  const statusEl = document.getElementById('vrmtStatus');
  const analysisEl = document.getElementById('vrmtAnalysis');
  const faceGuide = document.getElementById('vrmtFaceGuide');

  let stream = null;
  const CAPTURE_BTN_DEFAULT_TEXT = 'AI 판별 촬영';

  function setStatus(text, isLoading = false) {
    statusEl.textContent = text;
    statusEl.classList.toggle('vrmt-status-loading', isLoading);
  }

  function setCaptureLoading(loading) {
    if (!captureBtn) return;
    captureBtn.disabled = loading;
    captureBtn.textContent = loading ? 'AI 분석 중...' : CAPTURE_BTN_DEFAULT_TEXT;
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('이 브라우저에서는 카메라를 지원하지 않습니다.');
      return;
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      videoEl.srcObject = stream;
      setStatus('카메라가 켜졌습니다. 얼굴을 가운데에 맞춘 뒤 AI 판별 촬영을 눌러주세요.');
      setTimeout(() => faceGuide?.classList.add('vrmt-aligned'), 2000);
    } catch (error) {
      console.error(error);
      setStatus('카메라 접근에 실패했습니다. 브라우저 권한을 확인해 주세요.');
    }
  }

  async function capture() {
    if (!stream) {
      setStatus('먼저 카메라를 시작해 주세요.');
      return;
    }

    try {
      setCaptureLoading(true);
      const dataUrl = await captureResizedJpeg(videoEl, canvasEl, 1024, 0.82);
      await analyzeByServer(dataUrl);
    } catch (error) {
      console.error(error);
      setStatus('이미지 캡처 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setCaptureLoading(false);
    }
  }

  async function captureResizedJpeg(video, canvas, maxWidth, quality) {
    const srcW = video.videoWidth || 640;
    const srcH = video.videoHeight || 480;
    const targetW = Math.min(srcW, maxWidth);
    const targetH = Math.round((srcH / srcW) * targetW);

    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, targetW, targetH);

    return canvas.toDataURL('image/jpeg', quality);
  }

  async function analyzeByServer(dataUrl) {
    try {
      setStatus('AI가 촬영 이미지를 분석 중입니다...', true);
      const res = await fetch('/.netlify/functions/analyze-skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: dataUrl, language: 'ko' })
      });
      const json = await res.json();

      if (!res.ok || json.ok === false) {
        const msg = (json.error || json.message || '분석 요청 중 오류가 발생했습니다.').includes('OPENAI_API_KEY')
          ? 'AI 분석 서버 설정이 아직 완료되지 않았습니다. 관리자에게 OPENAI_API_KEY 설정을 요청해 주세요.'
          : (json.message || json.error || '분석 요청 중 오류가 발생했습니다.');
        setStatus(msg);
        renderError(msg, json);
        return;
      }

      renderAnalysis(json.analysis);
      setStatus('AI 분석이 완료되었습니다.');
    } catch (error) {
      console.error(error);
      setStatus('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      statusEl.classList.remove('vrmt-status-loading');
    }
  }

  function renderError(message, payload) {
    analysisEl.innerHTML = `
      <h2 class="vrmt-card-title">AI 피부 분석 결과</h2>
      <p class="vrmt-muted">요청 실패</p>\n      <p><strong>${escapeHtml(message || '오류')}</strong></p>
      <div class="vrmt-json"><pre>${escapeHtml(JSON.stringify(payload, null, 2))}</pre></div>
      <p class="vrmt-disclaimer">※ 본 서비스는 의료 진단이 아닌 피부·뷰티 참고 분석입니다.</p>
    `;
  }

  function renderAnalysis(analysis) {
    const observations = (analysis.observations || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
    const carePriority = (analysis.care_priority || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
    const productDirections = (analysis.recommended_product_direction || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');

    analysisEl.innerHTML = `
      <h2 class="vrmt-card-title">AI 피부 분석 결과</h2>
      <p><strong>전체 요약:</strong> ${escapeHtml(analysis.summary || '')}</p>
      <p><strong>신뢰도:</strong> ${escapeHtml(String(analysis.confidence ?? ''))}</p>
      <p><strong>관찰 항목:</strong></p><ul>${observations}</ul>
      <p><strong>케어 우선순위:</strong></p><ul>${carePriority}</ul>
      <p><strong>추천 제품 방향:</strong></p><ul>${productDirections}</ul>
      <p><strong>피부과 상담 권고:</strong> ${escapeHtml(analysis.dermatology_consult_recommendation || '')}</p>
      <p class="vrmt-disclaimer">※ 본 서비스는 의료 진단이 아닌 피부·뷰티 참고 분석입니다.</p>
    `;
  }

  function escapeHtml(v) {
    return String(v).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  }

  document.addEventListener('DOMContentLoaded', () => {
    startBtn?.addEventListener('click', startCamera);
    captureBtn?.addEventListener('click', capture);
  });
})();
