import { useState, useEffect, useRef } from "react";
import styles from "./customCursor.module.css";

function pad(n) {
  return String(Math.round(n)).padStart(4, "0");
}

export default function CustomCursor() {
  const [coords, setCoords] = useState({ x: -100, y: -100 });
  const [isHover, setIsHover] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pulses, setPulses] = useState([]);

  const dotRef = useRef(null);
  const reticleRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const reticlePos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef(null);

  useEffect(() => {
    // Only activate on pointer-fine desktop environments
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    document.body.classList.add("has-custom-cursor");

    function handleMouseMove(e) {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      // Move center dot immediately for zero latency
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      setCoords({ x: e.clientX, y: e.clientY });

      // Detect interactive element hover
      const target = e.target;
      const isInteractive = target && target.closest(
        'a, button, input, textarea, select, [role="button"], article, .card, [data-interactive="true"]'
      );
      setIsHover(!!isInteractive);
    }

    function handleMouseDown(e) {
      setIsDown(true);
      const newPulse = { id: Date.now(), x: e.clientX, y: e.clientY };
      setPulses((prev) => [...prev.slice(-3), newPulse]);
      setTimeout(() => {
        setPulses((prev) => prev.filter((p) => p.id !== newPulse.id));
      }, 350);
    }

    function handleMouseUp() {
      setIsDown(false);
    }

    function handleMouseLeave() {
      setIsVisible(false);
    }

    function handleMouseEnter() {
      setIsVisible(true);
    }

    // Reticle animation loop with damping
    function loop() {
      const dx = mousePos.current.x - reticlePos.current.x;
      const dy = mousePos.current.y - reticlePos.current.y;

      reticlePos.current.x += dx * 0.28;
      reticlePos.current.y += dy * 0.28;

      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${reticlePos.current.x}px, ${reticlePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrameId.current = requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={styles.cursorWrap}
      data-hover={isHover}
      data-down={isDown}
      aria-hidden="true"
    >
      {/* Central target dot */}
      <div ref={dotRef} className={styles.dot} />

      {/* Trailing targeting reticle */}
      <div ref={reticleRef} className={styles.reticle}>
        <span className={styles.bracketTL} />
        <span className={styles.bracketTR} />
        <span className={styles.bracketBL} />
        <span className={styles.bracketBR} />
        <span className={styles.crosshairH} />
        <span className={styles.crosshairV} />

        {/* Telemetry coordinates readout */}
        <div className={styles.telemetry}>
          <span>X:{pad(coords.x)}</span>
          <span>Y:{pad(coords.y)}</span>
          <span className={styles.telemetryTag}>
            {isHover ? "[LOCKED]" : "[SYS_TRK]"}
          </span>
        </div>
      </div>

      {/* Click impulse shockwaves */}
      {pulses.map((p) => (
        <div
          key={p.id}
          className={styles.pulse}
          style={{ left: `${p.x}px`, top: `${p.y}px` }}
        />
      ))}
    </div>
  );
}
