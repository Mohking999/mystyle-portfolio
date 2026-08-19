import { Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTranslation } from "react-i18next";
import AppWindow from "../HeroScene/AppWindow.jsx";
import useReducedMotion from "../../../hooks/useReducedMotion.js";
import { PROJECTS } from "../../../data/projects.js";
import styles from "./projectsScene.module.css";

const COLORS = ["#c9a227", "#5b8c85", "#8a93c9", "#c98a6f", "#8fc9a2"];
const LAYOUT = [
  [-2.4, 0.6, 0],
  [-0.9, -0.4, 0.6],
  [0.7, 0.5, -0.4],
  [2.1, -0.5, 0.2],
  [0, 1.3, -0.8],
];

function CameraEase({ target, reduced }) {
  useFrame(({ camera }) => {
    if (reduced) return;
    const tx = target ? target[0] * 0.4 : 0;
    const ty = target ? target[1] * 0.25 + 0.4 : 0.4;
    camera.position.x += (tx - camera.position.x) * 0.05;
    camera.position.y += (ty + 0.4 - camera.position.y) * 0.05;
    camera.lookAt(target ? target[0] * 0.3 : 0, target ? target[1] * 0.2 : 0, 0);
  });
  return null;
}

export default function ProjectsScene({ onSelect, activeId }) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(null);
  const activePos = PROJECTS.findIndex((p) => p.id === activeId);
  const target = activePos >= 0 ? LAYOUT[activePos] : null;

  return (
    <div className={styles.wrap}>
      <Suspense fallback={<div className={styles.loading}>{t("scene.loading")}</div>}>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.8, 5.5], fov: 44 }}
          gl={{ antialias: true, alpha: true }}
          style={{ touchAction: "pan-y" }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 3, 2]} intensity={0.7} />
          <CameraEase target={target} reduced={reduced} />
          {PROJECTS.map((p, i) => (
            <AppWindow
              key={p.id}
              label={t(`projects.${p.id}.title`)}
              position={LAYOUT[i]}
              color={COLORS[i % COLORS.length]}
              scale={p.id === activeId ? 1.15 : hovered === p.id ? 1.05 : 0.9}
              bobSpeed={0.4 + i * 0.05}
              bobOffset={i * 1.1}
              reduced={reduced}
              onClick={() => onSelect(p.id)}
              onHoverChange={(h) => setHovered(h ? p.id : null)}
            />
          ))}
        </Canvas>
      </Suspense>
      <p className={styles.hint}>{t("projects.view_details")}</p>
    </div>
  );
}
