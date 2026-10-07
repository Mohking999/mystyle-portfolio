import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor, ContactShadows } from "@react-three/drei";
import { useTranslation } from "react-i18next";
import LaptopModel from "./LaptopModel.jsx";
import AppWindow from "./AppWindow.jsx";
import useReducedMotion from "../../../hooks/useReducedMotion.js";
import styles from "./heroScene.module.css";

// Camera rig: reads the normalized pointer position from R3F state and
// eases the camera toward a small offset — a gentle parallax response to
// the cursor rather than free orbit controls, which keeps the scene feeling
// controlled and professional instead of game-like.
function CameraRig({ reduced }) {
  useFrame((state) => {
    if (reduced) return;
    const { pointer, camera } = state;
    const targetX = pointer.x * 0.6;
    const targetY = 0.9 + pointer.y * 0.2;
    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (targetY - camera.position.y) * 0.03;
    camera.lookAt(0, 0.28, 0);
  });
  return null;
}

function SceneContents({ reduced }) {
  const windows = [
    { label: "MyStyle", color: "#c9a227", position: [-1.9, 1.25, -0.8], bobOffset: 0 },
    { label: "GestionSalles", color: "#5b8c85", position: [1.85, 0.65, -0.6], bobOffset: 1.4 },
    { label: "Adhahi", color: "#8a93c9", position: [-1.65, -0.15, -1.2], bobOffset: 2.6 },
  ];

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 2]} intensity={0.9} castShadow={false} />
      <pointLight position={[-3, 2, 3]} intensity={0.4} color="#c9a227" />
      <pointLight position={[2, -1, 4]} intensity={0.25} color="#5b8c85" />

      <LaptopModel reduced={reduced} />

      {windows.map((w) => (
        <AppWindow key={w.label} reduced={reduced} scale={0.62} bobSpeed={0.45} {...w} />
      ))}

      <ContactShadows position={[0, -0.85, 0]} opacity={0.35} scale={5} blur={2.4} far={2} />
    </>
  );
}

export default function HeroScene() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [dpr, setDpr] = useState(1.5);
  const containerRef = useRef(null);

  return (
    <div className={styles.canvasWrap} ref={containerRef}>
      <Suspense fallback={<div className={styles.loading}>{t("scene.loading")}</div>}>
        <Canvas
          dpr={dpr}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0.9, 4.8], fov: 42 }}
          // The 3D canvas is purely decorative background/foreground content;
          // it must never intercept scroll or block normal page interaction
          // outside of the intentional hover targets on AppWindow meshes.
          style={{ touchAction: "pan-y" }}
        >
          <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(Math.min(2, dpr + 0.25))} />
          <CameraRig reduced={reduced} />
          <SceneContents reduced={reduced} />
        </Canvas>
      </Suspense>
    </div>
  );
}
