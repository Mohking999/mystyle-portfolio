import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../ui/LanguageSwitcher.jsx";
import { Button } from "../ui/Primitives.jsx";
import MobileMenu from "./MobileMenu.jsx";
import styles from "./navbar.module.css";

const LINKS = ["about", "work", "skills", "certificates", "contact"];

function pad(n) { return String(n).padStart(2, "0"); }

export default function Navbar({ theme, onToggleTheme }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("SYS_UP: 00:00:00 | CPU: 12%");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const startRef = useRef(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      const h = pad(Math.floor(elapsed / 3600));
      const m = pad(Math.floor((elapsed % 3600) / 60));
      const s = pad(elapsed % 60);
      const cpu = Math.floor(Math.random() * 28 + 8);
      setStatus(`SYS_UP: ${h}:${m}:${s} | CPU: ${cpu}%`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function handleScroll() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      const progress = total > 0 ? (current / total) * 100 : 0;
      setScrollProgress(progress);

      // Detect active section
      const scrollPos = window.scrollY + 120;
      for (let i = LINKS.length - 1; i >= 0; i--) {
        const el = document.getElementById(LINKS[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(LINKS[i]);
          return;
        }
      }
      setActiveSection("");
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={styles.nav}>
        <div
          className={styles.progressBar}
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />
        <a href="#top" className={styles.brand} aria-label="Mohamed Djebiri — home">
          MD<span className={styles.brandAccent}>//</span>dev<span className={styles.brandAccent}>.REF</span>
        </a>

        <nav className={styles.linksDesktop} aria-label="Primary">
          {LINKS.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              className={styles.link}
              data-active={activeSection === key}
            >
              {t(`nav.${key}`)}
            </a>
          ))}
        </nav>

        <div className={styles.controls}>
          <span
            className={styles.sysStatus}
            aria-live="polite"
            aria-label="System status"
          >
            {status}
          </span>
          <LanguageSwitcher />
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
