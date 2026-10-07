import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../ui/LanguageSwitcher.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";
import { Button } from "../ui/Primitives.jsx";
import MobileMenu from "./MobileMenu.jsx";
import styles from "./navbar.module.css";

const LINKS = ["about", "work", "skills", "contact"];

export default function Navbar({ theme, onToggleTheme }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className={styles.nav}>
        <a href="#top" className={styles.brand} aria-label="Mohamed Djebiri — home">
          MD<span className={styles.brandAccent}>//</span>dev
        </a>

        <nav className={styles.linksDesktop} aria-label="Primary">
          {LINKS.map((key) => (
            <a key={key} href={`#${key}`} className={styles.link}>
              {t(`nav.${key}`)}
            </a>
          ))}
        </nav>

        <div className={styles.controls}>
          <LanguageSwitcher />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <Button
            className={styles.burger}
            aria-label={t("nav.menu")}
            aria-expanded={open}
            variant="secondary"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <span className={styles.burgerBar} />
            <span className={styles.burgerBar} />
            <span className={styles.burgerBar} />
          </Button>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} links={LINKS} />
    </>
  );
}
