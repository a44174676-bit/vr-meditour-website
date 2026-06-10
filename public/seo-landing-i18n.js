(() => {
  const supported = ["en", "ko", "vi", "ja", "zh"];
  const page = window.VRMT_LANDING_PAGE || {};
  const common = page.common || {};
  const pageTitles = page.pageTitles || {};
  const commonFallbacks = {
    ko: {
      languageLabel: "언어",
      navHome: "홈",
      navCompanyProfile: "회사소개",
      navTrustCenter: "Trust Center",
      navFaq: "FAQ",
      navContact: "문의",
      navAiSkinMenu: "AI 피부분석",
      navAiConsult: "AI 상담",
      navAmisTour: "AMIS Travel Lounge",
      navAmisStore: "AMIS Goods Store",
    },
    en: {
      languageLabel: "Language",
      navHome: "Home",
      navCompanyProfile: "Company Profile",
      navTrustCenter: "Trust Center",
      navFaq: "FAQ",
      navContact: "Contact",
      navAiSkinMenu: "AI Skin Analysis",
      navAiConsult: "AI Consultation",
      navAmisTour: "AMIS Travel Lounge",
      navAmisStore: "AMIS Goods Store",
    },
    vi: {
      languageLabel: "Ngôn ngữ",
      navHome: "Trang chủ",
      navCompanyProfile: "Hồ sơ công ty",
      navTrustCenter: "Trung tâm tin cậy",
      navFaq: "FAQ",
      navContact: "Liên hệ",
      navAiSkinMenu: "Phân tích da AI",
      navAiConsult: "Tư vấn AI",
      navAmisTour: "AMIS Travel Lounge",
      navAmisStore: "AMIS Goods Store",
    },
    ja: {
      languageLabel: "言語",
      navHome: "ホーム",
      navCompanyProfile: "会社紹介",
      navTrustCenter: "Trust Center",
      navFaq: "FAQ",
      navContact: "問い合わせ",
      navAiSkinMenu: "AI肌分析",
      navAiConsult: "AI相談",
      navAmisTour: "AMIS Travel Lounge",
      navAmisStore: "AMIS Goods Store",
    },
    zh: {
      languageLabel: "语言",
      navHome: "首页",
      navCompanyProfile: "公司简介",
      navTrustCenter: "信任中心",
      navFaq: "FAQ",
      navContact: "咨询",
      navAiSkinMenu: "AI皮肤分析",
      navAiConsult: "AI咨询",
      navAmisTour: "AMIS Travel Lounge",
      navAmisStore: "AMIS Goods Store",
    },
  };
  const normalizeLang = (lang) => {
    const normalized = String(lang || "").toLowerCase();
    if (normalized === "jp") return "ja";
    if (normalized === "cn") return "zh";
    return supported.includes(normalized) ? normalized : null;
  };
  const getParamLang = () => {
    try { return normalizeLang(new URLSearchParams(window.location.search).get("lang")); } catch (_) { return null; }
  };
  const getSavedLang = () => {
    try { return normalizeLang(localStorage.getItem("vrMediTourLang")); } catch (_) { return null; }
  };
  const saveLang = (lang) => {
    try { localStorage.setItem("vrMediTourLang", lang); } catch (_) {}
  };
  const getText = (lang, key) => {
    const pageDict = page.translations?.[lang] || {};
    const commonDict = common[lang] || {};
    const fallbackDict = commonFallbacks[lang] || {};
    const fallbackPage = page.translations?.en || {};
    const fallbackCommon = common.en || {};
    const fallbackEnglish = commonFallbacks.en || {};
    return pageDict[key] ?? commonDict[key] ?? fallbackDict[key] ?? fallbackPage[key] ?? fallbackCommon[key] ?? fallbackEnglish[key] ?? null;
  };
  const applyLanguage = (lang) => {
    const active = normalizeLang(lang) || "ko";
    document.documentElement.lang = active;
    document.documentElement.dir = "ltr";
    document.body.classList.remove(...supported.map((code) => `lang-${code}`));
    document.body.classList.add(`lang-${active}`);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const translated = getText(active, el.dataset.i18n);
      if (translated !== null) el.textContent = translated;
    });
    document.querySelectorAll("[data-related-slug]").forEach((el) => {
      const title = pageTitles?.[active]?.[el.dataset.relatedSlug] || pageTitles?.en?.[el.dataset.relatedSlug];
      if (title) el.textContent = title;
    });
    document.querySelectorAll("#languageButtons button[data-lang]").forEach((button) => {
      const selected = normalizeLang(button.dataset.lang) === active;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    saveLang(active);
  };
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#languageButtons button[data-lang]").forEach((button) => {
      button.addEventListener("click", () => applyLanguage(button.dataset.lang));
    });
    applyLanguage(getParamLang() || getSavedLang() || "ko");
  });
})();
