import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

const modelUrl = `${import.meta.env.BASE_URL}models/classic-laptop/classic_laptop_1k.gltf`;
const screenArtworkUrl = new URL("../../../../asstes/window.gif", import.meta.url).href;

function readGifPlayback(bytes) {
  const signature = String.fromCharCode(...bytes.subarray(0, 6));
  if (signature !== "GIF87a" && signature !== "GIF89a") {
    throw new Error("Laptop screen artwork is not a valid GIF.");
  }

  let offset = 13;
  if (bytes.length < offset) throw new Error("Laptop screen GIF header is incomplete.");

  const hasGlobalColorTable = (bytes[10] & 0x80) !== 0;
  if (hasGlobalColorTable) {
    offset += 3 * (2 ** ((bytes[10] & 0x07) + 1));
  }

  let frameDelay = 100;
  let duration = 0;
  let loopCount = null;
  let frameCount = 0;

  function skipSubBlocks() {
    while (offset < bytes.length) {
      const blockSize = bytes[offset++];
      if (blockSize === 0) return;
      offset += blockSize;
    }
    throw new Error("Laptop screen GIF contains an incomplete data block.");
  }

  while (offset < bytes.length) {
    const marker = bytes[offset++];
    if (marker === 0x3b) break;

    if (marker === 0x21) {
      const label = bytes[offset++];

      if (label === 0xf9) {
        const blockSize = bytes[offset++];
        if (blockSize < 4 || offset + blockSize >= bytes.length) {
          throw new Error("Laptop screen GIF contains an invalid frame control block.");
        }
        frameDelay = (bytes[offset + 1] | (bytes[offset + 2] << 8)) * 10;
        offset += blockSize + 1;
        continue;
      }

      if (label === 0xff) {
        const blockSize = bytes[offset++];
        const application = String.fromCharCode(...bytes.subarray(offset, offset + blockSize));
        offset += blockSize;

        while (offset < bytes.length) {
          const dataSize = bytes[offset++];
          if (dataSize === 0) break;
          const data = bytes.subarray(offset, offset + dataSize);
          if (
            (application === "NETSCAPE2.0" || application === "ANIMEXTS1.0") &&
            dataSize >= 3 &&
            data[0] === 1
          ) {
            loopCount = data[1] | (data[2] << 8);
          }
          offset += dataSize;
        }
        continue;
      }

      if (label === 0x01) {
        const blockSize = bytes[offset++];
        offset += blockSize;
      }
      skipSubBlocks();
      continue;
    }

    if (marker !== 0x2c || offset + 9 > bytes.length) {
      throw new Error("Laptop screen GIF contains an invalid image frame.");
    }

    const imageFlags = bytes[offset + 8];
    offset += 9;
    if (imageFlags & 0x80) {
      offset += 3 * (2 ** ((imageFlags & 0x07) + 1));
    }
    offset += 1;
    skipSubBlocks();

    duration += Math.max(20, frameDelay);
    frameDelay = 100;
    frameCount += 1;
  }

  if (frameCount === 0) throw new Error("Laptop screen GIF does not contain animation frames.");
  return { duration, loopCount };
}

export default function LaptopModel({ reduced, compact = false }) {
  const group = useRef(null);
  const spinGroup = useRef(null);
  const spin = useRef({ angle: 0, startAngle: 0, elapsed: 0, active: false, queued: 0 });
  const { scene } = useGLTF(modelUrl);
  const screenArtwork = useTexture(screenArtworkUrl);

  useEffect(() => {
    let cancelled = false;
    let loopTimer;
    let objectUrl;

    async function keepGifLooping() {
      const response = await fetch(screenArtworkUrl);
      if (!response.ok) {
        throw new Error(`Laptop screen GIF could not be loaded (${response.status}).`);
      }

      const blob = await response.blob();
      const playback = readGifPlayback(new Uint8Array(await blob.arrayBuffer()));
      if (cancelled || playback.loopCount === 0) return;

      objectUrl = URL.createObjectURL(blob);
      const playThrough = () => {
        const image = new Image();
        image.onload = () => {
          if (cancelled) return;
          screenArtwork.image = image;
          screenArtwork.needsUpdate = true;
          const playCount = playback.loopCount === null ? 1 : playback.loopCount + 1;
          loopTimer = window.setTimeout(playThrough, playback.duration * playCount);
        };
        image.onerror = () => {
          if (!cancelled) console.error("Laptop screen GIF could not be restarted.");
        };
        image.src = objectUrl;
      };

      const playCount = playback.loopCount === null ? 1 : playback.loopCount + 1;
      loopTimer = window.setTimeout(playThrough, playback.duration * playCount);
    }

    keepGifLooping().catch((error) => {
      if (!cancelled) console.error("Laptop screen GIF looping failed.", error);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(loopTimer);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [screenArtwork]);

  const laptop = useMemo(() => {
    const clone = scene.clone(true);
    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenArtwork,
      side: THREE.DoubleSide,
      toneMapped: false,
    });

    screenArtwork.colorSpace = THREE.SRGBColorSpace;
    screenArtwork.wrapS = THREE.RepeatWrapping;
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
    if (screenArtworkUrl.toLowerCase().endsWith(".gif")) {
      screenArtwork.needsUpdate = true;
    }
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
      scale={compact ? 2.8 : 3.35}
      onClick={handleClick}
    >
      <group ref={spinGroup}>
        <primitive object={laptop} />
      </group>
    </group>
  );
}

useGLTF.preload(modelUrl);
