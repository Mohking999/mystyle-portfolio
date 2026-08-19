import { useTranslation } from "react-i18next";
import styles from "./footer.module.css";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <span>© {year} Mohamed Djebiri</span>
      <nav className={styles.links} aria-label="Footer">
        <a href="#about">{t("nav.about")}</a>
        <a href="#work">{t("nav.work")}</a>
        <a href="#skills">{t("nav.skills")}</a>
        <a href="#contact">{t("nav.contact")}</a>
      </nav>
      <div className={styles.social}>
        <a href="https://github.com/Mohking999" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/djebiri-mohamed-abdrazak-6789aa336" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
      <span>{t("footer.built_with")}</span>
    </footer>
  );
}
