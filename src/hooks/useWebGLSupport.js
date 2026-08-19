import { useEffect, useState } from "react";

// Cheap, one-time WebGL capability check used to decide whether to mount
// the 3D scene at all, so we can offer a graceful non-3D fallback.
export default function useWebGLSupport() {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setSupported(!!gl);
    } catch (e) {
      setSupported(false);
    }
  }, []);

  return supported;
}
