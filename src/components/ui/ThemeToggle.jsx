import { useTranslation } from "react-i18next";
import { Button } from "./Primitives.jsx";
import styles from "./themeToggle.module.css";

export default function ThemeToggle({ theme, onToggle }) {
  const { t } = useTranslation();
  return (
    <Button className={styles.btn} variant="secondary" size="sm" onClick={onToggle} aria-label={t("theme.toggle")}>
      {theme === "dark" ? t("theme.light") : t("theme.dark")}
    </Button>
  );
}
