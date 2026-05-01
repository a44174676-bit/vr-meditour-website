// 배포 후 이 값만 Render/Railway 백엔드 URL로 바꾸면 됩니다.
const API_BASE_URL = "http://127.0.0.1:8000";
const fields = ["moisture", "redness", "oiliness", "texture", "body_water", "muscle_level", "body_fat_rate", "stress_level", "sleep_quality"];

function getSafeNumber(id) {
  const raw = document.getElementById(id)?.value;
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) return 50;
  return Math.max(0, Math.min(100, parsed));
}
function renderList(items) { return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`; }

function renderScoreResult(data) {
  const section = document.getElementById("scoreResult");
  section.classList.remove("hidden");
  section.innerHTML = `
  <article class="result-card">
    <h3>통합 요약 (Beauty Wellness Reference Report)</h3>
    <p><strong>Health-Derma Score:</strong> <span class="score">${data.health_derma_score}</span> <span class="grade">(${data.total_grade})</span></p>
    <p><strong>피부 점수:</strong> ${data.skin_score} / 100 <span class="grade">(${data.skin_grade})</span></p>
    <p><strong>체성분 점수:</strong> ${data.body_score} / 100 <span class="grade">(${data.body_grade})</span></p>
  </article>
  <article class="result-card"><h3>추천 화장품</h3>${renderList(data.product_recommendations)}</article>
  <article class="result-card"><h3>추천 웰니스 제품/루틴</h3>${renderList(data.wellness_recommendations)}</article>
  <article class="result-card"><h3>주의 문구</h3><p>${data.disclaimer}</p></article>`;
}

async function analyzeNumbers() {
  const payload = {};
  fields.forEach((field) => (payload[field] = getSafeNumber(field)));
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error("API error");
    renderScoreResult(await response.json());
  } catch {
    const section = document.getElementById("scoreResult");
    section.classList.remove("hidden");
    section.innerHTML = `<article class="result-card"><p>분석 중 오류가 발생했습니다</p></article>`;
  }
}

function bindImagePreview() {
  const input = document.getElementById("faceImageInput");
  const preview = document.getElementById("imagePreview");
  const placeholder = document.getElementById("previewPlaceholder");

  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) {
      preview.src = "";
      preview.classList.add("hidden");
      placeholder.classList.remove("hidden");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.classList.remove("hidden");
      placeholder.classList.add("hidden");
    };
    reader.readAsDataURL(file);
  });
}

function renderImageResult(data) {
  const section = document.getElementById("imageResult");
  section.classList.remove("hidden");
  const result = data.image_analysis;
  section.innerHTML = `
  <article class="result-card">
    <h3>이미지 분석 결과 (Beauty Wellness Reference Report)</h3>
    <p><strong>평균 밝기:</strong> ${result.average_brightness} (숫자가 낮을수록 어둡게 촬영되었을 수 있어요)</p>
    <p><strong>평균 붉은기:</strong> ${result.average_redness} (얼굴 색감 기준의 붉은기 참고값)</p>
    <p><strong>피부톤 참고값:</strong> ${result.skin_tone_reference}</p>
    <p><strong>이미지 품질 안내:</strong> ${result.image_quality_message}</p>
    <p><strong>참고 문구:</strong> ${data.disclaimer}</p>
  </article>`;
}

async function analyzeImage() {
  const input = document.getElementById("faceImageInput");
  const file = input.files?.[0];
  const button = document.getElementById("analyzeImageBtn");
  const section = document.getElementById("imageResult");

  if (!file) {
    section.classList.remove("hidden");
    section.innerHTML = `<article class="result-card"><p>먼저 얼굴 이미지를 선택해 주세요.</p></article>`;
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    button.textContent = "분석 중...";
    button.disabled = true;
    const response = await fetch(`${API_BASE_URL}/analyze-image`, { method: "POST", body: formData });
    if (!response.ok) throw new Error("image analyze failed");
    renderImageResult(await response.json());
  } catch {
    section.classList.remove("hidden");
    section.innerHTML = `<article class="result-card"><p>이미지 분석 중 오류가 발생했습니다.</p></article>`;
  } finally {
    button.textContent = "이미지 분석하기";
    button.disabled = false;
  }
}

document.getElementById("analyzeBtn").addEventListener("click", analyzeNumbers);
document.getElementById("analyzeImageBtn").addEventListener("click", analyzeImage);
bindImagePreview();
