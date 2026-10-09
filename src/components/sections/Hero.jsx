import { lazy, Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import useReducedMotion from "../../hooks/useReducedMotion.js";
import useWebGLSupport from "../../hooks/useWebGLSupport.js";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import CanvasFallback from "../scenes/CanvasFallback.jsx";
import { Button } from "../ui/Primitives.jsx";
import styles from "./hero.module.css";

const HeroScene = lazy(() => import("../scenes/HeroScene/HeroScene.jsx"));

/* â”€â”€ Typewriter hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
  }, [reduced]);  // eslint-disable-line

  return text;
}

export default function Hero() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const webglOk = useWebGLSupport();
  const wideViewport = useMediaQuery("(min-width: 960px)");
  const compactViewport = useMediaQuery("(max-width: 719px)");
  const twText = useTypewriter(PHRASES, reduced);

  return (
    <section id="top" className={styles.hero}>
      <div className={styles.grid}>
        {/* â”€â”€ Left: Copy â”€â”€ */}
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

        {/* â”€â”€ Right: 3D Scene / Fallback â”€â”€ */}
        <div
          className={styles.sceneCol}
          data-compact={compactViewport}
          aria-hidden={!webglOk}
        >
          {webglOk ? (
            <Suspense fallback={<div className={styles.sceneLoading} />}>
              <HeroScene compact={compactViewport} />
            </Suspense>
          ) : wideViewport ? (
            <CanvasFallback />
          ) : null}
        </div>
      </div>
    </section>
  );
}


