import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";

const STORAGE_KEY = "portfolio-lang";
const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: saved || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Keep <html lang> / dir and localStorage in sync with the active language.
export function applyLanguage(lang) {
  i18n.changeLanguage(lang);
  window.localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

applyLanguage(i18n.language);

export default i18n;
