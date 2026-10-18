import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useReducedMotion from "../../hooks/useReducedMotion.js";
import { Button } from "../ui/Primitives.jsx";
import portraitImg from "../../../asstes/portrait.jpg";
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
  const [minimized, setMinimized] = useState(false);
  const [scanlinesActive, setScanlinesActive] = useState(true);

  return (
    <section id="top" className={styles.hero}>
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.grid}>
        {/* ── Left: Copy ── */}
        <div className={styles.copy}>
          {/* Live system telemetry badge */}
          <div className={styles.telemetryPill}>
            <span className={styles.radarDot} aria-hidden="true" />
            <span className={styles.telemetryItem}>SYS: ONLINE</span>
            <span className={styles.divider}>//</span>
            <span className={styles.telemetryItem}>LOC: ALGERIA</span>
            <span className={styles.divider}>//</span>
            <span className={styles.telemetryItemActive}>STATUS: READY</span>
          </div>

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
          <div className={`${styles.portraitWindow} ${minimized ? styles.windowMinimized : ""}`}>
            <div className={styles.portraitTitlebar}>
              <span className={styles.portraitTitle}>PORTRAIT_01.JPG</span>
              <div className={styles.portraitControls}>
                <button
                  type="button"
                  className={styles.portraitBtn}
                  onClick={() => setMinimized((m) => !m)}
                  title={minimized ? "Restore" : "Minimize"}
                  aria-label={minimized ? "Restore window" : "Minimize window"}
                >
                  _
                </button>
                <button
                  type="button"
                  className={styles.portraitBtn}
                  onClick={() => setMinimized(false)}
                  title="Maximize"
                  aria-label="Maximize window"
                >
                  □
                </button>
                <button
                  type="button"
                  className={styles.portraitBtn}
                  onClick={() => setScanlinesActive((s) => !s)}
                  title="Toggle CRT Scanlines"
                  aria-label="Toggle CRT Scanlines"
                >
                  ✕
                </button>
              </div>
            </div>
            {!minimized && (
              <div className={styles.portraitBody}>
                <img
                  src={portraitImg}
                  alt="Mohamed Djebiri — Portrait"
                  className={styles.portraitImg}
                  loading="eager"
                  decoding="async"
                />
                {scanlinesActive && (
                  <div className={styles.portraitScanlines} aria-hidden="true" />
                )}
                <div className={styles.portraitCornerTL} aria-hidden="true" />
                <div className={styles.portraitCornerBR} aria-hidden="true" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
