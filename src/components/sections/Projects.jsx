import { lazy, Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Reveal from "../ui/Reveal.jsx";
import ProjectCard from "./ProjectCard.jsx";
import ProjectModal from "./ProjectModal.jsx";
import useWebGLSupport from "../../hooks/useWebGLSupport.js";
import { PROJECTS, FILTERS } from "../../data/projects.js";
import styles from "./projects.module.css";

const ProjectsScene = lazy(() => import("../scenes/ProjectsScene/ProjectsScene.jsx"));

export default function Projects() {
  const { t } = useTranslation();
  const webglOk = useWebGLSupport();
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [show3d, setShow3d] = useState(false);

  const visible = useMemo(
    () => (filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category.includes(filter))),
    [filter]
  );

  return (
    <section id="work" className={styles.section}>
      <Reveal className={styles.head}>
        <span className={styles.num}>03</span>
        <h2 className={styles.heading}>{t("projects.heading")}</h2>
      </Reveal>

      <Reveal className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label={t("projects.heading")}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={styles.filterBtn}
              data-active={filter === f}
              onClick={() => setFilter(f)}
            >
              {t(`projects.filters.${f}`)}
            </button>
          ))}
        </div>
        {webglOk && (
          <button className={styles.toggle3d} onClick={() => setShow3d((v) => !v)}>
            {show3d ? "2D" : "3D"}
          </button>
        )}
      </Reveal>

      {show3d && webglOk && (
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
