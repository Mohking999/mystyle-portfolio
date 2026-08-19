import { useTranslation } from "react-i18next";
import styles from "./canvasFallback.module.css";

export default function CanvasFallback() {
  const { t } = useTranslation();
  return (
    <div className={styles.fallback} role="img" aria-label={t("scene.fallback_title")}>
      <div className={styles.glow} />
      <p className={styles.title}>{t("scene.fallback_title")}</p>
      <p className={styles.body}>{t("scene.fallback_body")}</p>
    </div>
  );
}
