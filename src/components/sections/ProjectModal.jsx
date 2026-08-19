import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { PROJECTS } from "../../data/projects.js";
import useReducedMotion from "../../hooks/useReducedMotion.js";
import styles from "./projectModal.module.css";

export default function ProjectModal({ projectId, onClose }) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const closeRef = useRef(null);
  const project = PROJECTS.find((p) => p.id === projectId);

  useEffect(() => {
    if (project && closeRef.current) closeRef.current.focus();
  }, [project]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (project) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className={styles.panel}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          >
            <button ref={closeRef} className={styles.close} onClick={onClose} aria-label={t("projects.close")}>
              ×
            </button>

            <span className={styles.status} data-status={project.status}>
              {t(`projects.status.${project.status}`)}
            </span>
            <h3 id="project-modal-title" className={styles.title}>
              {t(`projects.${project.id}.title`)}
            </h3>
            <p className={styles.problem}>{t(`projects.${project.id}.problem`)}</p>
            <p className={styles.desc}>{t(`projects.${project.id}.description`)}</p>

            <div className={styles.row}>
              <span className={styles.label}>{t("projects.role_label")}</span>
              <span className={styles.value}>{t(`projects.${project.id}.role`)}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>{t("projects.stack_label")}</span>
              <span className={styles.value}>{project.stack.join(", ")}</span>
            </div>

            <div className={styles.links}>
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                  {t("projects.live_link")}
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.linkBtnOutline}>
                  {t("projects.github_link")}
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
