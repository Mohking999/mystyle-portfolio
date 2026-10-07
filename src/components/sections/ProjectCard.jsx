import { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import useReducedMotion from "../../hooks/useReducedMotion.js";
import { Badge, Button, Card, CardContent, CardFooter, CardHeader } from "../ui/Primitives.jsx";
import styles from "./projectCard.module.css";

const MotionCard = motion.create(Card);

const cardVariants = {
  rest: { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover: {
    scale: 1.01,
    boxShadow: "0 24px 40px rgba(8, 14, 32, 0.08)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export default function ProjectCard({ project, onOpen }) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
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
    <MotionCard
      as="article"
      ref={ref}
      className={styles.card}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      variants={cardVariants}
      initial="rest"
      whileHover={reduced ? "rest" : "hover"}
    >
      <CardHeader className={styles.header}>
        <div className={styles.top}>
          <Badge variant={project.status === "completed" ? "success" : "warning"}>
            {t(`projects.status.${project.status}`)}
          </Badge>
        </div>

        <h3 className={styles.title}>{t(`projects.${project.id}.title`)}</h3>
      </CardHeader>

      <CardContent className={styles.content}>
        <p className={styles.problem}>{t(`projects.${project.id}.problem`)}</p>
        <p className={styles.desc}>{t(`projects.${project.id}.description`)}</p>
        <div className={styles.stack}>
          {project.stack.map((s) => (
            <Badge variant="outline" key={s}>{s}</Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className={styles.actions}>
        <Button
          variant="default"
          size="sm"
          onClick={() => onOpen(project.id)}
        >
          {t("projects.view_details")}
        </Button>
        <div className={styles.linkRow}>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {t("projects.live_link")}
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {t("projects.github_link")}
            </a>
          )}
        </div>
      </CardFooter>
    </MotionCard>
  );
}
