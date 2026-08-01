export let LANGUAGE_CONFIG = Object.freeze({});
export let ENABLED_LANGUAGES = Object.freeze([]);
export let TRANSLATION_DIRECTIONS = Object.freeze([]);

export async function loadLanguageConfig() {
  const response = await fetch("./language-config.json", { cache: "no-store" });
  if (!response.ok) throw new Error("언어 설정을 불러오지 못했습니다.");
  const rawConfig = await response.json();
  LANGUAGE_CONFIG = Object.freeze(Object.fromEntries(
    Object.entries(rawConfig).map(([key, value]) => [key, Object.freeze(value)]),
  ));
  ENABLED_LANGUAGES = Object.freeze(
    Object.values(LANGUAGE_CONFIG).filter(
      ({ enabled, medicallyVerified, translationMode }) =>
        enabled && medicallyVerified && translationMode === "staged-pipeline",
    ),
  );
  if (ENABLED_LANGUAGES.length !== 2) throw new Error("MVP 언어 설정이 올바르지 않습니다.");
  TRANSLATION_DIRECTIONS = Object.freeze(
    ENABLED_LANGUAGES.map((source, index, languages) => ({
      source,
      target: languages[(index + 1) % languages.length],
    })),
  );
  return LANGUAGE_CONFIG;
}

export function getLanguage(code) {
  const language = LANGUAGE_CONFIG[code];
  if (!language?.enabled || !language.medicallyVerified) {
    throw new Error("지원되지 않는 언어입니다.");
  }
  return language;
}
