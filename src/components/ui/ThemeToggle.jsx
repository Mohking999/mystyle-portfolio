import { useTranslation } from "react-i18next";
import styles from "./themeToggle.module.css";

export default function ThemeToggle({ theme, onToggle }) {
  const { t } = useTranslation();
  return (
    <button className={styles.btn} onClick={onToggle} aria-label={t("theme.toggle")}>
      {theme === "dark" ? t("theme.light") : t("theme.dark")}
    </button>
  );
}
