(() => {
  const supported = ["en", "ko", "vi", "ja", "zh"];
  const page = window.VRMT_LANDING_PAGE || {};
  const common = page.common || {};
  const pageTitles = page.pageTitles || {};
  const getParamLang = () => {
    try { return new URLSearchParams(window.location.search).get("lang"); } catch (_) { return null; }
  };
  const getSavedLang = () => {
    try { return localStorage.getItem("vrMediTourLang"); } catch (_) { return null; }
  };
  const saveLang = (lang) => {
    try { localStorage.setItem("vrMediTourLang", lang); } catch (_) {}
  };
  const getText = (lang, key) => {
    const pageDict = page.translations?.[lang] || {};
    const commonDict = common[lang] || {};
    const fallbackPage = page.translations?.en || {};
    const fallbackCommon = common.en || {};
    return pageDict[key] ?? commonDict[key] ?? fallbackPage[key] ?? fallbackCommon[key] ?? null;
  };
  const applyLanguage = (lang) => {
    const active = supported.includes(lang) ? lang : "en";
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
      const selected = button.dataset.lang === active;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    saveLang(active);
  };
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#languageButtons button[data-lang]").forEach((button) => {
      button.addEventListener("click", () => applyLanguage(button.dataset.lang));
    });
    applyLanguage(getParamLang() || getSavedLang() || "en");
  });
})();
