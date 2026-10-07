import { lazy, Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Primitives.jsx";
import Reveal from "../ui/Reveal.jsx";
import ProjectCard from "./ProjectCard.jsx";
import ProjectModal from "./ProjectModal.jsx";
import useReducedMotion from "../../hooks/useReducedMotion.js";
import useWebGLSupport from "../../hooks/useWebGLSupport.js";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import { PROJECTS, FILTERS } from "../../data/projects.js";
import styles from "./projects.module.css";

const projectsVideo = new URL("../../../asstes/4151303-hd_1920_1080_25fps.mp4", import.meta.url).href;

const ProjectsScene = lazy(() => import("../scenes/ProjectsScene/ProjectsScene.jsx"));
const MotionButton = motion.create(Button);

export default function Projects() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const webglOk = useWebGLSupport();
  const wideViewport = useMediaQuery("(min-width: 960px)");
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [show3d, setShow3d] = useState(false);

  const visible = useMemo(
    () => (filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category.includes(filter))),
    [filter]
  );

  return (
    <section id="work" className={styles.section}>
      <div className={styles.videoBg}>
        <video className={styles.video} src={projectsVideo} autoPlay muted loop playsInline />
      </div>
      <div className={styles.videoOverlay} />
      <Reveal className={styles.head}>
        <span className={styles.num}>03</span>
        <h2 className={styles.heading}>{t("projects.heading")}</h2>
      </Reveal>

      <Reveal className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label={t("projects.heading")}>
          {FILTERS.map((f) => (
            <MotionButton
              key={f}
              className={styles.filterBtn}
              variant={filter === f ? "default" : "secondary"}
              size="sm"
              data-active={filter === f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {t(`projects.filters.${f}`)}
            </MotionButton>
          ))}
        </div>
        {wideViewport && webglOk && (
          <MotionButton
            className={styles.toggle3d}
            variant={show3d ? "default" : "secondary"}
            size="sm"
            onClick={() => setShow3d((v) => !v)}
            aria-pressed={show3d}
          >
            {show3d ? "2D" : "3D"}
          </MotionButton>
        )}
      </Reveal>

      {show3d && wideViewport && webglOk && (
        <Reveal className={styles.sceneWrap}>
          <Suspense fallback={<div className={styles.sceneLoading} />}>
            <ProjectsScene onSelect={setOpenId} activeId={openId} />
          </Suspense>
        </Reveal>
      )}

      <div className={styles.grid}>
        {visible.map((p) => (
          <Reveal key={p.id}>
            <ProjectCard project={p} onOpen={setOpenId} />
          </Reveal>
        ))}
      </div>

      <ProjectModal projectId={openId} onClose={() => setOpenId(null)} />
    </section>
  );
}
