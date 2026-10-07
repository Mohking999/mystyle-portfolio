import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import useReducedMotion from "../../hooks/useReducedMotion.js";
import useWebGLSupport from "../../hooks/useWebGLSupport.js";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import CanvasFallback from "../scenes/CanvasFallback.jsx";
import { Button } from "../ui/Primitives.jsx";
import styles from "./hero.module.css";

// Lazy-loaded so the 3D scene (and three.js/@react-three/fiber) is only
// pulled into the bundle and mounted once it's actually needed — keeps the
// initial page weight down, especially on mobile.
const HeroScene = lazy(() => import("../scenes/HeroScene/HeroScene.jsx"));
const heroVideo = new URL("../../../asstes/4153410-hd_1920_1080_25fps.mp4", import.meta.url).href;

export default function Hero() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const webglOk = useWebGLSupport();
  const wideViewport = useMediaQuery("(min-width: 960px)");

  return (
    <section id="top" className={styles.hero}>
      <div className={styles.videoBg}>
        <video className={styles.video} src={heroVideo} autoPlay muted loop playsInline />
      </div>
      <div className={styles.videoOverlay} />
      <div className={styles.grid}>
        <div className={styles.copy}>
          <motion.span
            className={styles.eyebrow}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t("hero.eyebrow")}
          </motion.span>

          <motion.h1
            className={styles.title}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {t("hero.title_pre")}
            <em className={styles.em}>{t("hero.title_em")}</em>
            {t("hero.title_post")}
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            className={styles.cta}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Button as="a" href="#work" variant="default" size="lg">
              {t("hero.cta_work")}
            </Button>
            <Button as="a" href="#contact" variant="outline" size="lg">
              {t("hero.cta_contact")}
            </Button>
          </motion.div>

          <p className={styles.focus}>{t("hero.focus")}</p>
        </div>

        {wideViewport && (
          <div className={styles.sceneCol} aria-hidden={!webglOk}>
            {webglOk ? (
              <Suspense fallback={<div className={styles.sceneLoading} />}>
                <HeroScene />
              </Suspense>
            ) : (
              <CanvasFallback />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
