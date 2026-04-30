const API_BASE = "http://127.0.0.1:8000";

const fields = [
  "moisture", "redness", "oiliness", "texture",
  "body_water", "muscle_level", "body_fat_rate", "stress_level", "sleep_quality"
];

function getSafeNumber(id) {
  // 값이 비어있거나 숫자가 아니면 기본값 50을 사용
  const raw = document.getElementById(id)?.value;
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) return 50;
  return Math.max(0, Math.min(100, parsed));
}

function renderList(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function renderResult(data) {
  const section = document.getElementById("resultSection");
  section.classList.remove("hidden");

  section.innerHTML = `
    <article class="result-card">
      <h3>통합 요약 (Beauty Wellness Reference Report)</h3>
      <p><strong>Health-Derma Score:</strong> <span class="score">${data.health_derma_score}</span> <span class="grade">(${data.total_grade})</span></p>
      <p><strong>피부 점수:</strong> ${data.skin_score} / 100 <span class="grade">(${data.skin_grade})</span></p>
      <p><strong>체성분 점수:</strong> ${data.body_score} / 100 <span class="grade">(${data.body_grade})</span></p>
    </article>

    <article class="result-card">
      <h3>추천 화장품</h3>
      ${renderList(data.product_recommendations)}
    </article>

    <article class="result-card">
      <h3>추천 웰니스 제품/루틴</h3>
      ${renderList(data.wellness_recommendations)}
    </article>

    <article class="result-card">
      <h3>주의 문구</h3>
      <p>${data.disclaimer}</p>
    </article>
  `;
}

async function analyze() {
  const payload = {};
  fields.forEach((field) => {
    payload[field] = getSafeNumber(field);
  });

  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("API error");
    }

    const result = await response.json();
    renderResult(result);
  } catch (error) {
    const section = document.getElementById("resultSection");
    section.classList.remove("hidden");
    section.innerHTML = `<article class="result-card"><p>분석 중 오류가 발생했습니다</p></article>`;
  }
}

document.getElementById("analyzeBtn").addEventListener("click", analyze);
