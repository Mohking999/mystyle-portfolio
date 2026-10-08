import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { PROJECTS } from "../../data/projects.js";
import useReducedMotion from "../../hooks/useReducedMotion.js";
import { Badge, Button } from "../ui/Primitives.jsx";
import styles from "./projectModal.module.css";

function ProjectScreenshotGallery({ screenshots, projectId, t }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeScreenshot = screenshots[activeIndex];

  function selectScreenshot(index) {
    setActiveIndex((index + screenshots.length) % screenshots.length);
  }

  return (
    <section className={styles.gallery} aria-labelledby="project-gallery-title">
      <div className={styles.galleryHeading}>
        <h4 id="project-gallery-title">{t("projects.gallery_title")}</h4>
        <span aria-live="polite">
          {activeIndex + 1} / {screenshots.length}
        </span>
      </div>

      <figure className={styles.galleryFigure}>
        <a
          className={styles.galleryImageLink}
          href={activeScreenshot.src}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("projects.gallery_open_full", {
            title: t(`projects.${projectId}.screenshots.${activeScreenshot.title}`),
          })}
        >
          <img
            className={styles.galleryImage}
            src={activeScreenshot.src}
            alt={t(`projects.${projectId}.screenshots.${activeScreenshot.title}`)}
            width="1920"
            height="1080"
            loading="eager"
            decoding="async"
          />
        </a>
        <figcaption>
          {t(`projects.${projectId}.screenshots.${activeScreenshot.title}`)}
        </figcaption>
      </figure>

      {screenshots.length > 1 && (
        <>
          <div className={styles.galleryControls}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectScreenshot(activeIndex - 1)}
              aria-label={t("projects.gallery_previous")}
            >
              <span aria-hidden="true">←</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectScreenshot(activeIndex + 1)}
              aria-label={t("projects.gallery_next")}
            >
              <span aria-hidden="true">→</span>
            </Button>
          </div>
          <div className={styles.galleryThumbnails} aria-label={t("projects.gallery_title")}>
            {screenshots.map((screenshot, index) => {
              const title = t(`projects.${projectId}.screenshots.${screenshot.title}`);
              return (
                <button
                  key={screenshot.title}
                  type="button"
                  className={styles.galleryThumbnail}
                  data-active={index === activeIndex}
                  aria-label={t("projects.gallery_select", {
                    number: index + 1,
                    title,
                  })}
                  aria-pressed={index === activeIndex}
                  onClick={() => selectScreenshot(index)}
                >
                  <img
                    src={screenshot.src}
                    alt=""
                    width="1920"
                    height="1080"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

export default function ProjectModal({
  projectId,
  previewOnOpen = false,
  onPreviewChange,
  onClose,
}) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const closeRef = useRef(null);
  const project = PROJECTS.find((p) => p.id === projectId);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setPreviewOpen(Boolean(previewOnOpen && project?.live));
  }, [projectId, previewOnOpen, project?.live]);

  function togglePreview() {
    const next = !previewOpen;
    setPreviewOpen(next);
    onPreviewChange?.(next);
  }

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
            className={[
              styles.panel,
              previewOpen && styles.panelPreview,
              project.screenshots?.length > 0 && styles.panelGallery,
            ].filter(Boolean).join(" ")}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          >
            <Button ref={closeRef} className={styles.close} variant="ghost" size="icon" onClick={onClose} aria-label={t("projects.close")}>
              ×
            </Button>

            <Badge variant={project.status === "completed" ? "success" : "warning"}>
              {t(`projects.status.${project.status}`)}
            </Badge>
            <h3 id="project-modal-title" className={styles.title}>
              {t(`projects.${project.id}.title`)}
            </h3>
            <div className={previewOpen ? styles.previewDetailsHidden : undefined}>
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
            </div>

            {project.screenshots?.length > 0 && (
              <ProjectScreenshotGallery
                key={project.id}
                screenshots={project.screenshots}
                projectId={project.id}
                t={t}
              />
            )}

            <div className={styles.links}>
              {project.live && (
                <Button
                  variant={previewOpen ? "secondary" : "default"}
                  size="sm"
                  onClick={togglePreview}
                  aria-expanded={previewOpen}
                  aria-controls="project-website-preview"
                >
                  {previewOpen ? t("projects.hide_preview") : t("projects.preview")}
                </Button>
              )}
              {project.live && (
                <Button as="a" href={project.live} target="_blank" rel="noopener noreferrer" size="sm">
                  {t("projects.open_new_tab")}
                </Button>
              )}
              {project.github && (
                <Button as="a" href={project.github} target="_blank" rel="noopener noreferrer" variant="outline" size="sm">
                  {t("projects.github_link")}
                </Button>
              )}
            </div>

            {previewOpen && project.live && (
              <section className={styles.preview} id="project-website-preview" aria-label={t("projects.preview")}>
                <div className={styles.previewHeader}>
                  <span>{t("projects.preview_hint")}</span>
                  <a href={project.live} target="_blank" rel="noopener noreferrer">
                    {t("projects.open_new_tab")}
                  </a>
                </div>
                <iframe
                  className={styles.iframe}
                  src={project.live}
                  title={`${t(`projects.${project.id}.title`)} — ${t("projects.preview_frame_title")}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  allow="fullscreen"
                />
              </section>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
