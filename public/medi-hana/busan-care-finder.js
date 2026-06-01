// public/medi-hana/busan-care-finder.js
// Medi Hana Busan Care Finder
// 공공데이터 기반 부산 외국인환자 유치 등록기관 안내 UI

(function () {
  "use strict";

  const API_URL = "/.netlify/functions/busanMedicalInstitutions";
  const MAX_INITIAL_ITEMS = 6;

  const COPY = {
    ko: {
      title: "부산 외국인환자 유치 등록기관 정보",
      desc: "공공데이터 기준 등록기관 정보입니다. 실제 진료 가능 여부와 비용은 상담 후 확인됩니다.",
      loading: "부산 등록 의료기관 정보를 불러오는 중입니다.",
      empty: "표시할 등록기관 정보를 찾지 못했습니다. 상담 신청은 계속 가능합니다.",
      error: "현재 등록기관 정보를 불러오지 못했습니다. 상담 신청은 계속 가능합니다.",
      select: "이 기관으로 상담 요청",
      selected: "선택기관",
      more: "더 보기",
      less: "접기",
      institutionType: "기관구분",
      address: "주소",
      targetCountry: "타겟국가",
      source: "자료 출처: 부산 외국인환자 유치기관 공공데이터",
      disclaimer: "본 서비스는 공공데이터 기반 등록기관 정보를 안내하며, 의료적 진단·처방·치료 결과를 보장하지 않습니다. 최종 진료 여부와 비용은 의료기관 확인 후 확정됩니다."
    },
    en: {
      title: "Registered Medical Tourism Institutions in Busan",
      desc: "This information is based on public data. Availability and treatment cost will be confirmed after consultation.",
      loading: "Loading registered institutions in Busan.",
      empty: "No registered institutions were found. You can still submit a consultation request.",
      error: "Institution data is currently unavailable. You can still submit a consultation request.",
      select: "Request consultation with this institution",
      selected: "Selected institution",
      more: "Show more",
      less: "Show less",
      institutionType: "Type",
      address: "Address",
      targetCountry: "Target countries",
      source: "Source: Busan foreign patient attraction institution public data",
      disclaimer: "This service provides public-data-based registered institution information and does not guarantee diagnosis, prescription, treatment, outcome, availability, or cost. Final details are confirmed after institution review."
    },
    vi: {
      title: "Cơ sở y tế đăng ký tiếp nhận bệnh nhân nước ngoài tại Busan",
      desc: "Thông tin dựa trên dữ liệu công khai. Khả năng đặt lịch và chi phí sẽ được xác nhận sau khi tư vấn.",
      loading: "Đang tải danh sách cơ sở đăng ký tại Busan.",
      empty: "Không tìm thấy cơ sở phù hợp. Bạn vẫn có thể gửi yêu cầu tư vấn.",
      error: "Hiện chưa thể tải thông tin cơ sở. Bạn vẫn có thể gửi yêu cầu tư vấn.",
      select: "Yêu cầu tư vấn với cơ sở này",
      selected: "Cơ sở đã chọn",
      more: "Xem thêm",
      less: "Thu gọn",
      institutionType: "Loại cơ sở",
      address: "Địa chỉ",
      targetCountry: "Quốc gia mục tiêu",
      source: "Nguồn: Dữ liệu công khai về cơ sở tiếp nhận bệnh nhân nước ngoài tại Busan",
      disclaimer: "Dịch vụ này chỉ cung cấp thông tin cơ sở đăng ký dựa trên dữ liệu công khai và không bảo đảm chẩn đoán, kê đơn, kết quả điều trị, khả năng đặt lịch hoặc chi phí. Thông tin cuối cùng sẽ được xác nhận sau khi liên hệ cơ sở y tế."
    },
    ja: {
      title: "釜山外国人患者誘致登録機関",
      desc: "この情報は公共データに基づいています。診療可否と費用は相談後に確認されます。",
      loading: "釜山の登録機関情報を読み込んでいます。",
      empty: "表示できる登録機関情報が見つかりません。相談申請は可能です。",
      error: "現在、登録機関情報を読み込めません。相談申請は可能です。",
      select: "この機関で相談を依頼",
      selected: "選択機関",
      more: "もっと見る",
      less: "閉じる",
      institutionType: "機関区分",
      address: "住所",
      targetCountry: "対象国",
      source: "出典: 釜山外国人患者誘致機関公共データ",
      disclaimer: "本サービスは公共データに基づく登録機関情報を案内するものであり、診断・処方・治療結果を保証しません。最終的な診療可否と費用は医療機関確認後に確定されます。"
    },
    zh: {
      title: "釜山外国患者接收注册机构",
      desc: "该信息基于公共数据。实际就诊可否和费用将在咨询后确认。",
      loading: "正在加载釜山注册机构信息。",
      empty: "未找到可显示的注册机构信息。仍可提交咨询。",
      error: "当前无法加载注册机构信息。仍可提交咨询。",
      select: "申请该机构咨询",
      selected: "已选机构",
      more: "查看更多",
      less: "收起",
      institutionType: "机构类型",
      address: "地址",
      targetCountry: "目标国家",
      source: "来源：釜山外国患者接收机构公共数据",
      disclaimer: "本服务仅提供基于公共数据的注册机构信息，不保证诊断、处方、治疗结果、可预约性或费用。最终信息将在医疗机构确认后确定。"
    }
  };

  const COUNTRY_BY_LANG = {
    ko: "베트남",
    en: "베트남",
    vi: "베트남",
    ja: "일본",
    zh: "중국"
  };

  let expanded = false;
  let loadedItems = [];
  let selectedItem = null;

  function currentLang() {
    const htmlLang = (document.documentElement.lang || "en").toLowerCase();
    if (htmlLang.startsWith("ko")) return "ko";
    if (htmlLang.startsWith("vi")) return "vi";
    if (htmlLang.startsWith("ja") || htmlLang.startsWith("jp")) return "ja";
    if (htmlLang.startsWith("zh") || htmlLang.startsWith("cn")) return "zh";
    return "en";
  }

  function t() {
    return COPY[currentLang()] || COPY.en;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>\"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char];
    });
  }

  function ensureHiddenInput(form, name, value) {
    let input = form.querySelector(`input[name="${name}"]`);
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      form.appendChild(input);
    }
    input.value = value || "";
  }

  function installStyles() {
    if (document.getElementById("busan-care-finder-style")) return;
    const style = document.createElement("style");
    style.id = "busan-care-finder-style";
    style.textContent = `
      .busan-care-finder{margin:18px 0;padding:16px;border:1px solid rgba(255,255,255,.14);border-radius:18px;background:linear-gradient(145deg,rgba(11,24,38,.92),rgba(13,31,50,.78));box-shadow:0 18px 50px rgba(0,0,0,.18)}
      .busan-care-finder h3{margin:0 0 8px;font-size:1rem;line-height:1.35;color:#f7fbff}.busan-care-finder .finder-desc,.busan-care-finder .finder-source,.busan-care-finder .finder-disclaimer{margin:0 0 10px;color:rgba(235,245,255,.78);font-size:.86rem;line-height:1.55}.busan-care-finder .finder-disclaimer{padding-top:10px;border-top:1px solid rgba(255,255,255,.1)}
      .finder-status{margin:10px 0;color:#9ee7ff;font-size:.9rem}.finder-grid{display:grid;gap:10px;margin-top:12px}.finder-card{padding:13px;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:rgba(255,255,255,.055)}.finder-card h4{margin:0 0 8px;font-size:.96rem;color:#fff}.finder-card p{margin:4px 0;color:rgba(235,245,255,.75);font-size:.82rem;line-height:1.45}.finder-card strong{color:#d7f7ff}.finder-card.is-selected{border-color:rgba(109,229,255,.75);box-shadow:0 0 0 1px rgba(109,229,255,.2),0 14px 32px rgba(109,229,255,.12)}
      .finder-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.finder-btn{border:0;border-radius:999px;padding:9px 12px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#67e8f9,#a7f3d0);color:#06202b}.finder-btn.secondary{background:rgba(255,255,255,.09);color:#f7fbff;border:1px solid rgba(255,255,255,.14)}.finder-selected{margin-top:12px;padding:10px 12px;border-radius:12px;background:rgba(103,232,249,.1);color:#eafcff;font-size:.86rem;line-height:1.45}
    `;
    document.head.appendChild(style);
  }

  function render(container) {
    const copy = t();
    const itemsToShow = expanded ? loadedItems : loadedItems.slice(0, MAX_INITIAL_ITEMS);
    const selectedRegNo = selectedItem?.regNo || "";

    container.querySelector(".finder-list").innerHTML = loadedItems.length
      ? itemsToShow.map((item) => `
        <article class="finder-card ${selectedRegNo && selectedRegNo === item.regNo ? "is-selected" : ""}">
          <h4>${escapeHtml(item.businessNm || "-")}</h4>
          <p><strong>${escapeHtml(copy.institutionType)}</strong> ${escapeHtml(item.instiGubun || "-")}</p>
          <p><strong>${escapeHtml(copy.address)}</strong> ${escapeHtml(item.addr || "-")}</p>
          <p><strong>${escapeHtml(copy.targetCountry)}</strong> ${escapeHtml(item.targetCountry || "-")}</p>
          <div class="finder-actions"><button type="button" class="finder-btn" data-select-reg-no="${escapeHtml(item.regNo || "")}">${escapeHtml(copy.select)}</button></div>
        </article>
      `).join("")
      : `<p class="finder-status">${escapeHtml(copy.empty)}</p>`;

    const moreWrap = container.querySelector(".finder-more-wrap");
    moreWrap.innerHTML = loadedItems.length > MAX_INITIAL_ITEMS
      ? `<button type="button" class="finder-btn secondary" data-toggle-more>${escapeHtml(expanded ? copy.less : copy.more)}</button>`
      : "";

    const selectedBox = container.querySelector(".finder-selected");
    if (selectedItem) {
      selectedBox.hidden = false;
      selectedBox.innerHTML = `<strong>${escapeHtml(copy.selected)}:</strong> ${escapeHtml(selectedItem.businessNm)}<br>${escapeHtml(selectedItem.addr || "")}`;
    } else {
      selectedBox.hidden = true;
      selectedBox.innerHTML = "";
    }
  }

  async function loadInstitutions(container) {
    const copy = t();
    const status = container.querySelector(".finder-status");
    const country = COUNTRY_BY_LANG[currentLang()] || "베트남";
    status.textContent = copy.loading;

    try {
      const params = new URLSearchParams({ country, numOfRows: "100", pageNo: "1" });
      const response = await fetch(`${API_URL}?${params.toString()}`);
      const data = await response.json();
      if (!data.ok) throw new Error(data.message || copy.error);
      loadedItems = data.items || [];
      status.textContent = "";
      render(container);
    } catch (error) {
      console.warn("Busan Care Finder:", error);
      loadedItems = [];
      status.textContent = copy.error;
      render(container);
    }
  }

  function selectInstitution(form, container, regNo) {
    selectedItem = loadedItems.find((item) => String(item.regNo || "") === String(regNo || ""));
    if (!selectedItem) return;

    ensureHiddenInput(form, "selectedHospitalName", selectedItem.businessNm);
    ensureHiddenInput(form, "selectedHospitalRegNo", selectedItem.regNo);
    ensureHiddenInput(form, "selectedHospitalAddress", selectedItem.addr);
    ensureHiddenInput(form, "selectedHospitalType", selectedItem.instiGubun);
    ensureHiddenInput(form, "selectedHospitalTargetCountry", selectedItem.targetCountry);
    ensureHiddenInput(form, "publicDataSource", "부산 외국인환자 유치기관 공공데이터");

    const leadSummary = form.querySelector("#lead_summary");
    if (leadSummary) {
      const previous = leadSummary.value || "";
      const hospitalSummary = `\n\n[Selected Busan registered institution]\nName: ${selectedItem.businessNm || ""}\nReg No: ${selectedItem.regNo || ""}\nType: ${selectedItem.instiGubun || ""}\nAddress: ${selectedItem.addr || ""}\nTarget countries: ${selectedItem.targetCountry || ""}`;
      if (!previous.includes("[Selected Busan registered institution]")) leadSummary.value = previous + hospitalSummary;
    }

    render(container);
  }

  function mount() {
    const form = document.getElementById("mediHanaLeadForm");
    if (!form || document.getElementById("busanCareFinder")) return;

    installStyles();
    const copy = t();
    const section = document.createElement("section");
    section.id = "busanCareFinder";
    section.className = "busan-care-finder";
    section.innerHTML = `
      <h3>${escapeHtml(copy.title)}</h3>
      <p class="finder-desc">${escapeHtml(copy.desc)}</p>
      <p class="finder-status" aria-live="polite"></p>
      <div class="finder-list"></div>
      <div class="finder-more-wrap finder-actions"></div>
      <div class="finder-selected" hidden></div>
      <p class="finder-source">${escapeHtml(copy.source)}</p>
      <p class="finder-disclaimer">${escapeHtml(copy.disclaimer)}</p>
    `;

    const contactFields = form.querySelector(".contact-fields");
    form.insertBefore(section, contactFields || form.firstChild);

    section.addEventListener("click", (event) => {
      const selectButton = event.target.closest("[data-select-reg-no]");
      if (selectButton) selectInstitution(form, section, selectButton.dataset.selectRegNo);

      const moreButton = event.target.closest("[data-toggle-more]");
      if (moreButton) {
        expanded = !expanded;
        render(section);
      }
    });

    loadInstitutions(section);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
