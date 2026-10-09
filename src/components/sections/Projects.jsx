import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Primitives.jsx";
import Reveal from "../ui/Reveal.jsx";
import ProjectCard from "./ProjectCard.jsx";
import ProjectModal from "./ProjectModal.jsx";
import { PROJECTS, FILTERS } from "../../data/projects.js";
import styles from "./projects.module.css";

const MotionButton = motion.create(Button);

export default function Projects() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [previewOnOpen, setPreviewOnOpen] = useState(false);

  function openProject(id, preview = false) {
    setOpenId(id);
    setPreviewOnOpen(preview);
  }

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
      </Reveal>

      <div className={styles.grid}>
        {visible.map((p) => (
          <Reveal key={p.id}>
            <ProjectCard
              project={p}
              onOpen={(id) => openProject(id)}
              onPreview={(id) => openProject(id, true)}
            />
          </Reveal>
        ))}
      </div>

      <ProjectModal
        projectId={openId}
        previewOnOpen={previewOnOpen}
        onPreviewChange={setPreviewOnOpen}
        onClose={() => setOpenId(null)}
      />
    </section>
  );
}
