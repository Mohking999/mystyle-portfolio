import { useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "./projectCard.module.css";

export default function ProjectCard({ project, onOpen }) {
  const { t } = useTranslation();
  const ref = useRef(null);

  function handleMove(e) {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    // Deliberately small rotation range — readable, not gimmicky.
    el.style.transform = `perspective(700px) rotateX(${py * -4}deg) rotateY(${px * 4}deg)`;
  }
  function handleLeave() {
    if (ref.current) ref.current.style.transform = "none";
  }

  return (
    <article
      ref={ref}
      className={styles.card}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className={styles.top}>
        <span className={styles.status} data-status={project.status}>
          {t(`projects.status.${project.status}`)}
        </span>
      </div>

      <h3 className={styles.title}>{t(`projects.${project.id}.title`)}</h3>
      <p className={styles.problem}>{t(`projects.${project.id}.problem`)}</p>
      <p className={styles.desc}>{t(`projects.${project.id}.description`)}</p>

      <div className={styles.stack}>
        {project.stack.map((s) => (
          <span key={s} className={styles.tag}>{s}</span>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.detailsBtn} onClick={() => onOpen(project.id)}>
          {t("projects.view_details")}
        </button>
        <div className={styles.linkRow}>
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {t("projects.live_link")}
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {t("projects.github_link")}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
