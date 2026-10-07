import { useTranslation } from "react-i18next";
import { applyLanguage } from "../../i18n/index.js";
import { Button } from "./Primitives.jsx";
import styles from "./languageSwitcher.module.css";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className={styles.wrap} role="group" aria-label="Language">
      {LANGS.map((l) => (
        <Button
          key={l.code}
          className={styles.btn}
          variant={i18n.language === l.code ? "default" : "secondary"}
          size="sm"
          data-active={i18n.language === l.code}
          onClick={() => applyLanguage(l.code)}
          aria-pressed={i18n.language === l.code}
        >
          {l.label}
        </Button>
      ))}
    </div>
  );
}
