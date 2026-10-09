import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useReducedMotion from "../../hooks/useReducedMotion.js";
import { Button } from "../ui/Primitives.jsx";
import portraitImg from "../../../asstes/Picsart_26-10-04_20-22-38-416.jpg";
import styles from "./hero.module.css";

/* ── Typewriter hook ─────────────────────────────────────────── */
const PHRASES = [
  "[ INITIALIZING PROTOCOL... ]",
  "[ LOADING PORTFOLIO_SYS... ]",
  "[ WELCOME, EXPLORER ]",
];

function useTypewriter(phrases, reduced) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (reduced) { setText(phrases[0]); return; }
    let phraseIdx = 0, charIdx = 0, deleting = false;
    let raf;

    function tick() {
      const phrase = phrases[phraseIdx];
      if (!deleting) {
        setText(phrase.slice(0, ++charIdx));
        if (charIdx === phrase.length) {
          deleting = true;
          raf = setTimeout(tick, 2200);
          return;
        }
      } else {
        setText(phrase.slice(0, --charIdx));
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
        }
      }
      raf = setTimeout(tick, deleting ? 40 : 70);
    }
    tick();
    return () => clearTimeout(raf);
  }, [reduced]); // eslint-disable-line

  return text;
}

export default function Hero() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const twText = useTypewriter(PHRASES, reduced);

  return (
    <section id="top" className={styles.hero}>
      <div className={styles.grid}>
        {/* ── Left: Copy ── */}
        <div className={styles.copy}>
          {/* Typewriter label */}
          <span className={styles.eyebrow} aria-label="Initializing protocol">
            {twText}
            <span className="cursor-blink" aria-hidden="true" />
          </span>

          {/* Three-line headline */}
          <h1 className={styles.title}>
            <span style={{ color: "var(--ink)", display: "block" }}>CREATIVE</span>
            <span className={styles.em}>DEVELOPER</span>
            <span style={{ color: "var(--ink)", display: "block" }}>&amp; DESIGNER</span>
          </h1>

          {/* Bio */}
          <p className={styles.subtitle}>
            {t("hero.subtitle")}
          </p>

          {/* CTA */}
          <div className={styles.cta}>
            <Button as="a" href="#work" variant="default" size="lg">
              {t("hero.cta_work")}
            </Button>
            <Button as="a" href="#contact" variant="outline" size="lg">
              {t("hero.cta_contact")}
            </Button>
          </div>

          <p className={styles.focus}>{t("hero.focus")}</p>
        </div>

        {/* ── Right: Portrait Window (PORTRAIT_01.JPG) ── */}
        <div className={styles.portraitCol}>
          <div className={styles.portraitWindow}>
            <div className={styles.portraitTitlebar}>
              <span className={styles.portraitTitle}>PORTRAIT_01.JPG</span>
              <div className={styles.portraitControls} aria-hidden="true">
                <span className={styles.portraitBtn}>_</span>
                <span className={styles.portraitBtn}>□</span>
                <span className={styles.portraitBtn}>✕</span>
              </div>
            </div>
            <div className={styles.portraitBody}>
              <img
                src={portraitImg}
                alt="Mohamed Djebiri — Portrait"
                className={styles.portraitImg}
                loading="eager"
                decoding="async"
              />
              <div className={styles.portraitScanlines} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
