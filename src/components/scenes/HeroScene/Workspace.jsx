import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

// A minimal, low-poly "developer workspace": a monitor with a glowing screen
// plane, a slim base/stand, and a keyboard slab. Everything is built from
// primitives (no GLTF) so there's nothing to load or optimize beyond
// draw calls — keeps this cheap on mid-range and mobile GPUs.
export default function Workspace({ reduced }) {
  const group = useRef();
  const screen = useRef();

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.getElapsedTime();
    if (group.current) {
      // gentle idle bob, no spinning
      group.current.position.y = Math.sin(t * 0.6) * 0.06;
    }
    if (screen.current) {
      screen.current.material.emissiveIntensity = 0.55 + Math.sin(t * 1.4) * 0.08;
    }
  });

  return (
    <group ref={group}>
      {/* monitor screen */}
      <RoundedBox args={[2.6, 1.6, 0.08]} radius={0.05} smoothness={4} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="#161927" roughness={0.5} metalness={0.2} />
      </RoundedBox>
      <mesh ref={screen} position={[0, 0.9, 0.05]}>
        <planeGeometry args={[2.32, 1.34]} />
        <meshStandardMaterial
          color="#0f1119"
          emissive="#c9a227"
          emissiveIntensity={0.55}
          roughness={0.4}
        />
      </mesh>
      <Text
        position={[0, 0.9, 0.09]}
        fontSize={0.16}
        color="#eee9e0"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        {"<MD />"}
      </Text>

      {/* stand */}
      <mesh position={[0, 0.05, -0.05]}>
        <boxGeometry args={[0.14, 0.75, 0.14]} />
        <meshStandardMaterial color="#1b1f30" roughness={0.6} />
      </mesh>
      <RoundedBox args={[0.9, 0.06, 0.5]} radius={0.02} position={[0, -0.35, -0.05]}>
        <meshStandardMaterial color="#1b1f30" roughness={0.6} />
      </RoundedBox>

      {/* keyboard slab */}
      <RoundedBox args={[1.6, 0.06, 0.55]} radius={0.03} position={[0, -0.55, 0.65]}>
        <meshStandardMaterial color="#20263a" roughness={0.7} />
      </RoundedBox>
    </group>
  );
}
