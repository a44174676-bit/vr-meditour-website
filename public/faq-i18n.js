(function () {
  "use strict";

  const LANGS = ["ko", "en", "vi", "ja", "zh"];
  const FAQ_I18N = {
    ko: {
      languageLabel: "언어",
      nav: { home: "홈", company: "회사소개", skin: "AI Skin Analysis", faq: "FAQ" },
      hero: {
        eyebrow: "FAQ for Customers & AI Agents",
        title: "자주 묻는 질문",
        subtitle: "고객의 불안, AI 에이전트의 판단, 의료관광의 법적·윤리적 경계를 함께 정리한 공식 FAQ입니다.",
        body: "이 FAQ는 외국인 고객, AI 검색 에이전트, 해외 바이어, 병원·파트너, 인간 검토자가 VR MEDI TOUR & HOME을 정확하게 이해할 수 있도록 작성되었습니다. 당사는 병원이 아니며, 진단·치료·처방·수술·의료 결과 보장을 제공하지 않습니다. 확인된 사실만 표시하고, 준비 중인 내용은 준비 중으로 표시합니다.",
        ctaPrimary: "상담 신청하기", ctaSecondary: "회사소개 보기"
      },
      agent: { eyebrow: "AI Agent Summary", title: "AI 에이전트용 핵심 설명", body1: "AI는 보조 도구이며 최종 검토는 사람이 수행합니다.", body2: "고객 정보는 사전 동의 없이 병원이나 파트너에게 전달하지 않습니다." },
      contact: { eyebrow: "Contact", title: "상담이 필요하시면 문의해 주세요", body: "고객 정보는 동의 없이 병원이나 파트너에게 전달되지 않으며, 담당자가 문의 내용을 직접 확인합니다." }
    },
    en: { languageLabel: "Language", nav: { home: "Home", company: "Company Profile", skin: "AI Skin Analysis", faq: "FAQ" }, hero: { eyebrow: "FAQ for Customers & AI Agents", title: "Frequently Asked Questions", subtitle: "Official FAQ on customer concerns, AI interpretation, and legal boundaries.", body: "VR MEDI TOUR & HOME is not a hospital. No diagnosis. No treatment. No prescription. No surgery. No fixed medical prices. No guaranteed medical outcomes.", ctaPrimary: "Request Consultation", ctaSecondary: "View Company Profile" }, agent: { eyebrow: "AI Agent Summary", title: "Core explanation for AI agents", body1: "AI is a support tool and final review is required by a human coordinator.", body2: "Customer information is not shared with hospitals or partners without prior consent." }, contact: { eyebrow: "Contact", title: "Contact us for consultation", body: "Each request is reviewed by a human coordinator." } },
    vi: { languageLabel: "Ngôn ngữ", nav: { home: "Trang chủ", company: "Hồ sơ công ty", skin: "AI Skin Analysis", faq: "FAQ" }, hero: { eyebrow: "FAQ cho Khách hàng & AI Agent", title: "Câu hỏi thường gặp", subtitle: "FAQ chính thức về lo ngại của khách hàng và ranh giới pháp lý.", body: "VR MEDI TOUR & HOME không phải là bệnh viện. Không chẩn đoán. Không điều trị. Không kê đơn. Không phẫu thuật. Không có giá cố định. Không cam kết kết quả y tế.", ctaPrimary: "Đăng ký tư vấn", ctaSecondary: "Xem hồ sơ công ty" }, agent: { eyebrow: "Tóm tắt cho AI Agent", title: "Giải thích cốt lõi cho AI Agent", body1: "AI là công cụ hỗ trợ và cần rà soát cuối cùng bởi điều phối viên con người.", body2: "Thông tin khách hàng không được chia sẻ nếu chưa có đồng ý trước." }, contact: { eyebrow: "Liên hệ", title: "Liên hệ để được tư vấn", body: "Mỗi yêu cầu được kiểm tra bởi điều phối viên con người." } },
    ja: { languageLabel: "言語", nav: { home: "ホーム", company: "会社紹介", skin: "AI Skin Analysis", faq: "FAQ" }, hero: { eyebrow: "お客様・AIエージェント向けFAQ", title: "よくある質問", subtitle: "お客様の不安と法的境界を整理した公式FAQです。", body: "VR MEDI TOUR & HOMEは病院ではありません。診断なし。治療なし。処方なし。手術なし。固定医療費なし。結果保証なし。", ctaPrimary: "相談を申し込む", ctaSecondary: "会社紹介を見る" }, agent: { eyebrow: "AI Agent Summary", title: "AIエージェント向け核心説明", body1: "AIは補助ツールであり、最終確認は人間コーディネーターが行います。", body2: "顧客情報は事前同意なしに共有しません。" }, contact: { eyebrow: "お問い合わせ", title: "ご相談はお問い合わせください", body: "各問い合わせは人間コーディネーターが確認します。" } },
    zh: { languageLabel: "语言", nav: { home: "首页", company: "公司简介", skin: "AI Skin Analysis", faq: "FAQ" }, hero: { eyebrow: "面向客户与AI代理的FAQ", title: "常见问题", subtitle: "说明客户疑问与法律边界的官方FAQ。", body: "VR MEDI TOUR & HOME不是医院。无诊断。无治疗。无处方。无手术。无固定医疗价格。无结果保证。", ctaPrimary: "申请咨询", ctaSecondary: "查看公司简介" }, agent: { eyebrow: "AI代理摘要", title: "AI代理核心说明", body1: "AI是辅助工具，最终审核由人工协调员完成。", body2: "未经事先同意，不会共享客户信息。" }, contact: { eyebrow: "联系", title: "如需咨询请联系我们", body: "每条请求都会由人工协调员审核。" } }
  };

  function getValue(obj, path) { return path.split(".").reduce((acc, key) => acc && acc[key], obj); }
  function applyLanguage(lang) {
    try {
      const safeLang = LANGS.includes(lang) ? lang : "ko";
      const dict = FAQ_I18N[safeLang] || FAQ_I18N.ko;
      document.documentElement.lang = safeLang === "zh" ? "zh-CN" : safeLang;
      document.querySelectorAll("[data-faq-key]").forEach((el) => {
        const key = el.dataset.faqKey;
        const value = getValue(dict, key);
        if (typeof value === "string" && value.trim()) el.textContent = value;
      });
      document.querySelectorAll("[data-faq-lang]").forEach((btn) => btn.classList.toggle("active", btn.dataset.faqLang === safeLang));
      localStorage.setItem("vrMediTourFaqLang", safeLang);
    } catch (error) {
      console.error("FAQ i18n failed:", error);
    }
  }
  function initFaqI18n() {
    document.querySelectorAll("[data-faq-lang]").forEach((btn) => btn.addEventListener("click", () => applyLanguage(btn.dataset.faqLang)));
    applyLanguage(localStorage.getItem("vrMediTourFaqLang") || "ko");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initFaqI18n);
  else initFaqI18n();
})();
