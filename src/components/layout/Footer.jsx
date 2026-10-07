import { useTranslation } from "react-i18next";
import styles from "./footer.module.css";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <a className={styles.brand} href="#top" aria-label={t("footer.home_link")}>
            MD<span>//</span>dev
          </a>
          <nav className={styles.links} aria-label={t("footer.navigation")}>
            <a href="#about">{t("nav.about")}</a>
            <a href="#work">{t("nav.work")}</a>
            <a href="#skills">{t("nav.skills")}</a>
            <a href="#contact">{t("nav.contact")}</a>
          </nav>
          <nav className={styles.social} aria-label={t("footer.social")}>
            <a href="https://github.com/Mohking999" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/djebiri-mohamed-abdrazak-6789aa336" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </nav>
        </div>
        <div className={styles.bottom}>
          <p>© {year} Mohamed Djebiri. {t("footer.rights")}</p>
          <p>{t("footer.built_with")}</p>
          <a className={styles.backToTop} href="#top">
            <span aria-hidden="true">↑</span>
            {t("footer.back_to_top")}
          </a>
        </div>
      </div>
    </footer>
  );
}
