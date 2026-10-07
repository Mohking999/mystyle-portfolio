import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const modelUrl = `${import.meta.env.BASE_URL}models/classic-laptop/classic_laptop_1k.gltf`;

export default function LaptopModel({ reduced }) {
  const group = useRef(null);
  const { scene } = useGLTF(modelUrl);

  useFrame((state, delta) => {
    if (reduced || !group.current) return;
    const time = state.clock.elapsedTime;
    const rotationSpeed = (Math.PI * 2) / 18;

    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      time * rotationSpeed + state.pointer.x * 0.4,
      4,
      delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -0.12 + state.pointer.y * 0.22,
      4,
      delta
    );
    group.current.position.y = Math.sin(time * 0.55) * 0.035;
  });

  return (
    <group ref={group} position={[0, -0.2, 0]} scale={3.1}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(modelUrl);
