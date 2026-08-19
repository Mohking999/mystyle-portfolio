import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";

// A single floating "application window" plane — represents a product
// (used for hero decoration and, reused, for the projects constellation).
// Idle motion is a slow bob + slight tilt, no spinning, no orbit.
export default function AppWindow({
  label,
  position = [0, 0, 0],
  color = "#5b8c85",
  scale = 1,
  bobSpeed = 0.5,
  bobOffset = 0,
  reduced,
  onClick,
  onHoverChange,
}) {
  const ref = useRef();

  useFrame((state) => {
    if (reduced || !ref.current) return;
    const t = state.clock.getElapsedTime() + bobOffset;
    ref.current.position.y = position[1] + Math.sin(t * bobSpeed) * 0.12;
    ref.current.rotation.z = Math.sin(t * bobSpeed * 0.6) * 0.03;
  });

  return (
    <group
      ref={ref}
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = onClick ? "pointer" : "default";
        onHoverChange?.(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
        onHoverChange?.(false);
      }}
    >
      <RoundedBox args={[1.1, 0.75, 0.04]} radius={0.04} smoothness={4}>
        <meshStandardMaterial color="#161927" roughness={0.5} metalness={0.15} />
      </RoundedBox>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.0, 0.63]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} roughness={0.6} />
      </mesh>
      {label && (
        <Text position={[0, -0.5, 0.03]} fontSize={0.09} color="#9296a8" anchorX="center" anchorY="middle">
          {label}
        </Text>
      )}
    </group>
  );
}
