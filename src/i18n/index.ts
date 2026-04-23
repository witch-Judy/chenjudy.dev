import { en } from "./en";
import { zh } from "./zh";

export type Lang = "en" | "zh";
export type TranslationKey = keyof typeof en;

const translations = { en, zh } as const;

export function t(key: TranslationKey, lang: Lang = "en"): string {
  return translations[lang][key] ?? translations.en[key] ?? key;
}

export function getLang(): Lang {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("lang") as Lang) || "en";
  }
  return "en";
}

export function setLang(lang: Lang): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("lang", lang);
  }
}

export { en, zh };
