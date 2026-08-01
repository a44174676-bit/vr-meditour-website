export let LANGUAGE_CONFIG = Object.freeze({});
export let ENABLED_LANGUAGES = Object.freeze([]);

export async function loadLanguageConfig() {
  const response = await fetch("./language-config.json", { cache: "no-store" });
  if (!response.ok) throw new Error("language_config_failed");
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
  if (ENABLED_LANGUAGES.length !== 5 || !LANGUAGE_CONFIG.ko) throw new Error("language_config_invalid");
  return LANGUAGE_CONFIG;
}

export function getLanguage(code) {
  const language = LANGUAGE_CONFIG[code];
  if (!language?.enabled || !language.medicallyVerified || language.translationMode !== "staged-pipeline") {
    throw new Error("unsupported_language");
  }
  return language;
}

export function getInterpretationDirections(partnerCode) {
  const korean = getLanguage("ko");
  const partner = getLanguage(partnerCode);
  if (partner.code === korean.code) throw new Error("unsupported_direction");
  return Object.freeze([
    Object.freeze({ source: korean, target: partner }),
    Object.freeze({ source: partner, target: korean }),
  ]);
}
