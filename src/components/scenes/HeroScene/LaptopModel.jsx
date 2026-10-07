import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

const modelUrl = `${import.meta.env.BASE_URL}models/classic-laptop/classic_laptop_1k.gltf`;
const screenArtworkUrl = `${import.meta.env.BASE_URL}images/retro-anime-laptop-screen.svg`;

export default function LaptopModel({ reduced, compact = false }) {
  const group = useRef(null);
  const spinGroup = useRef(null);
  const spin = useRef({ angle: 0, startAngle: 0, elapsed: 0, active: false, queued: 0 });
  const { scene } = useGLTF(modelUrl);
  const screenArtwork = useTexture(screenArtworkUrl);
  const laptop = useMemo(() => {
    const clone = scene.clone(true);
    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenArtwork,
      side: THREE.DoubleSide,
      toneMapped: false,
    });

    screenArtwork.colorSpace = THREE.SRGBColorSpace;
    screenArtwork.flipY = false;
    screenArtwork.needsUpdate = true;

    clone.traverse((node) => {
      if (!node.isMesh) return;

      const replaceScreenMaterial = (material) =>
        material.name === "classic_laptop_screen" ? screenMaterial : material;

      node.material = Array.isArray(node.material)
        ? node.material.map(replaceScreenMaterial)
        : replaceScreenMaterial(node.material);
    });

    return clone;
  }, [scene, screenArtwork]);

  function handleClick(event) {
    event.stopPropagation();
    if (reduced) return;

    spin.current.queued += 1;
    if (!spin.current.active) {
      spin.current.active = true;
      spin.current.elapsed = 0;
      spin.current.startAngle = spin.current.angle;
      spin.current.queued -= 1;
    }
  }

  useFrame((state, delta) => {
    if (!group.current || !spinGroup.current) return;
    const time = state.clock.elapsedTime;

    if (!reduced) {
      if (!compact) {
        group.current.rotation.y = THREE.MathUtils.damp(
          group.current.rotation.y,
          state.pointer.x * 0.4,
          4,
          delta
        );
        group.current.rotation.x = THREE.MathUtils.damp(
          group.current.rotation.x,
          -0.12 + state.pointer.y * 0.22,
          4,
          delta
        );
      }
      group.current.position.y = Math.sin(time * 0.55) * 0.035;

      const currentSpin = spin.current;
      if (currentSpin.active) {
        currentSpin.elapsed += delta;
        const progress = THREE.MathUtils.clamp(currentSpin.elapsed / 1.25, 0, 1);
        const easedProgress = progress * progress * (3 - 2 * progress);
        currentSpin.angle = currentSpin.startAngle + Math.PI * 2 * easedProgress;

        if (progress === 1) {
          currentSpin.active = false;
          if (currentSpin.queued > 0) {
            currentSpin.queued -= 1;
            currentSpin.startAngle = currentSpin.angle;
            currentSpin.elapsed = 0;
            currentSpin.active = true;
          }
        }
      }
    }

    spinGroup.current.rotation.y = spin.current.angle;
  });

  return (
    <group
      ref={group}
      position={[0, -0.2, 0]}
      scale={compact ? 2.45 : 3.1}
      onClick={handleClick}
    >
      <group ref={spinGroup}>
        <primitive object={laptop} />
      </group>
    </group>
  );
}

useGLTF.preload(modelUrl);
