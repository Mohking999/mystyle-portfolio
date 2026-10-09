import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./desktopPet.module.css";

const STORAGE_KEY = "portfolio-robo-hidden";
const SOUND_STORAGE_KEY = "portfolio-robo-sound";
const DESKTOP_SIZE = { width: 76, height: 88 };
const COMPACT_SIZE = { width: 66, height: 78 };
const MOBILE_SIZE = { width: 60, height: 72 };
const OBSTACLE_SELECTOR =
  "button, a, input, select, textarea, [role='button'], [role='dialog'], main h1, main h2, main h3, main p, main label";

function readHiddenPreference() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch (error) {
    console.warn("Robo Assistant preference could not be read.", error);
    return false;
  }
}

function saveHiddenPreference(hidden) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(hidden));
  } catch (error) {
    console.warn("Robo Assistant preference could not be saved.", error);
  }
}

function readSoundPreference() {
  try {
    return window.localStorage.getItem(SOUND_STORAGE_KEY) === "true";
  } catch (error) {
    console.warn("Robo Assistant sound preference could not be read.", error);
    return false;
  }
}

function saveSoundPreference(enabled) {
  try {
    window.localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
  } catch (error) {
    console.warn("Robo Assistant sound preference could not be saved.", error);
  }
}

function getPetSize(width) {
  if (width < 600) return MOBILE_SIZE;
  if (width < 960) return COMPACT_SIZE;
  return DESKTOP_SIZE;
}

function getViewportWidth() {
  return document.documentElement.clientWidth || window.innerWidth;
}

function findSafePosition(
  preferredX,
  preferredRise,
  width,
  height,
  targetSize = getPetSize(width),
  stageBottom = height - 8
) {
  const size = targetSize;
  const obstacles = Array.from(document.querySelectorAll(OBSTACLE_SELECTOR))
    .filter((element) => !element.closest("[data-desktop-pet]"))
    .map((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return style.display === "none" || style.visibility === "hidden" ||
        rect.width === 0 || rect.height === 0 ||
        rect.bottom <= 0 || rect.top >= height || rect.right <= 0 || rect.left >= width
        ? null
        : rect;
    })
    .filter(Boolean);

  const minX = size.width / 2 + 8;
  const maxX = Math.max(minX, width - size.width / 2 - 8);
  const columns = [];
  for (let x = minX; x <= maxX; x += Math.max(44, Math.round(size.width * 0.75))) {
    columns.push(x);
  }
  columns.push(maxX);

  const maxRise = Math.max(12, stageBottom - size.height - 8);
  const rows = [];
  for (let rise = 12; rise <= maxRise; rise += size.height + 10) rows.push(rise);
  rows.push(maxRise);

  const candidates = rows.flatMap((rise) =>
    columns.map((x) => ({
      x,
      rise,
      distance: Math.abs(x - preferredX) + Math.abs(rise - preferredRise) * 1.4,
    }))
  ).sort((a, b) => a.distance - b.distance);

  let leastOverlap = null;
  let leastOverlapArea = Infinity;

  for (const candidate of candidates) {
    const bounds = {
      left: candidate.x - size.width / 2,
      right: candidate.x + size.width / 2,
      top: stageBottom - candidate.rise - size.height,
      bottom: stageBottom - candidate.rise,
    };
    let overlapArea = 0;
    for (const rect of obstacles) {
      const overlapWidth = Math.max(0, Math.min(bounds.right, rect.right) - Math.max(bounds.left, rect.left));
      const overlapHeight = Math.max(0, Math.min(bounds.bottom, rect.bottom) - Math.max(bounds.top, rect.top));
      overlapArea += overlapWidth * overlapHeight;
    }
    if (overlapArea === 0) return { x: candidate.x, rise: candidate.rise };
    if (overlapArea < leastOverlapArea) {
      leastOverlapArea = overlapArea;
      leastOverlap = candidate;
    }
  }

  return leastOverlap ? { x: leastOverlap.x, rise: leastOverlap.rise } : null;
}

function Robot({ sleeping }) {
  return (
    <svg className={styles.robot} viewBox="0 0 76 88" aria-hidden="true">
      {/* Stepped antenna with beacon diode */}
      <path className={styles.antenna} d="M38 16V6" />
      <rect className={styles.antennaTip} x="35" y="3" width="6" height="5" />

      {/* Side comm bolts / ears */}
      <rect className={styles.ear} x="5" y="28" width="7" height="16" />
      <rect className={styles.ear} x="64" y="28" width="7" height="16" />

      {/* Sharp CRT monitor head */}
      <rect className={styles.head} x="12" y="16" width="52" height="40" />

      {/* Screen visor */}
      <rect className={styles.face} x="16" y="20" width="44" height="32" />

      {/* Digital HUD Eyes */}
      <g className={styles.openEyes}>
        <rect className={styles.eye} x="23" y="29" width="10" height="10" />
        <rect className={styles.eye} x="43" y="29" width="10" height="10" />
        <rect className={styles.pupil} x="26" y="32" width="4" height="4" />
        <rect className={styles.pupil} x="46" y="32" width="4" height="4" />
      </g>

      {/* Low-power standby sleeping eyes */}
      <g className={styles.sleepEyes}>
        <path d="M23 34h10M43 34h10" />
      </g>

      {/* Digital mouth / telemetry line */}
      <path className={styles.smile} d="M29 44h18" />

      {/* Chassis / Torso */}
      <rect className={styles.body} x="20" y="60" width="36" height="20" />
      <rect className={styles.bodyPanel} x="27" y="64" width="22" height="9" />
      <rect className={styles.statusLight} x="36" y="66.5" width="4" height="4" />

      {/* Arms & Legs */}
      <path className={`${styles.arm} ${styles.leftArm}`} d="M20 64l-7 10" />
      <path className={`${styles.arm} ${styles.rightArm}`} d="M56 64l7 10" />
      <path className={`${styles.leg} ${styles.leftLeg}`} d="M29 80v6" />
      <path className={`${styles.leg} ${styles.rightLeg}`} d="M47 80v6" />

      {/* Sleep Z in retro monospace font */}
      {sleeping && <text className={styles.sleepZ} x="56" y="14">Z</text>}
    </svg>
  );
}

export default function DesktopPet() {
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(readHiddenPreference);
  const [soundEnabled, setSoundEnabled] = useState(readSoundPreference);
  const [panelOpen, setPanelOpen] = useState(false);
  const [wandering, setWandering] = useState(true);
  const [mode, setMode] = useState("idle");
  const [message, setMessage] = useState("");
  const [panelMessage, setPanelMessage] = useState("");
  const [tabVisible, setTabVisible] = useState(
    () => document.visibilityState === "visible"
  );
  const [position, setPosition] = useState(() => ({
    x: Math.max(42, getViewportWidth() - 52),
    rise: 12,
  }));
  const [direction, setDirection] = useState("left");
  const [moveDuration, setMoveDuration] = useState(0);
  const [dragging, setDragging] = useState(false);
  const petRef = useRef(null);
  const stageRef = useRef(null);
  const panelRef = useRef(null);
  const modeRef = useRef("idle");
  const messageTimerRef = useRef(null);
  const modeTimerRef = useRef(null);
  const sleepTimerRef = useRef(null);
  const clickTimerRef = useRef(null);
  const dragClickTimerRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const proximityAtRef = useRef(0);
  const activityAtRef = useRef(0);
  const lastActivityUpdateRef = useRef(0);
  const positionRef = useRef(position);
  const audioContextRef = useRef(null);

  const playRobotSound = useCallback((sound, allowWhenDisabled = false) => {
    if ((!soundEnabled && !allowWhenDisabled) || document.visibilityState !== "visible") return;

    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) {
      console.warn("Robo Assistant sound is unavailable in this browser.");
      return;
    }

    const context = audioContextRef.current || new AudioContextConstructor();
    audioContextRef.current = context;
    const playNotes = () => {
      const sequences = {
        waving: [[660, 0], [880, 0.1]],
        jumping: [[520, 0], [780, 0.09], [1040, 0.18]],
        surprised: [[880, 0], [520, 0.12]],
        waking: [[440, 0], [587, 0.12], [740, 0.24]],
      };
      const notes = sequences[sound];
      if (!notes) return;

      const startAt = context.currentTime + 0.015;
      for (const [frequency, offset] of notes) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const noteStart = startAt + offset;
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, noteStart);
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.07, noteStart + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.18);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(noteStart);
        oscillator.stop(noteStart + 0.19);
      }
    };

    if (context.state === "suspended") {
      context.resume().then(playNotes).catch((error) => {
        console.error("Robo Assistant sound could not start.", error);
      });
    } else {
      playNotes();
    }
  }, [soundEnabled]);

  const getPlacementSize = useCallback(() => {
    if (hidden) return { width: 46, height: 46 };
    const viewportWidth = getViewportWidth();
    const petSize = getPetSize(viewportWidth);
    if (!panelOpen) return petSize;

    const panelWidth = Math.min(292, Math.max(0, viewportWidth - 16));
    const panelHeight = panelRef.current?.getBoundingClientRect().height ||
      Math.min(window.innerHeight * 0.7, 190);
    return {
      width: Math.max(petSize.width, panelWidth),
      height: panelHeight + 110,
    };
  }, [hidden, panelOpen]);

  const setPetMode = useCallback((nextMode, duration = 1100) => {
    modeRef.current = nextMode;
    setMode(nextMode);
    if (nextMode === "waving" || nextMode === "jumping" || nextMode === "surprised" || nextMode === "waking") {
      playRobotSound(nextMode);
    }
    window.clearTimeout(modeTimerRef.current);
    if (nextMode !== "sleeping") {
      modeTimerRef.current = window.setTimeout(() => {
        modeRef.current = "idle";
        setMode("idle");
      }, duration);
    }
  }, [playRobotSound]);

  const showMessage = useCallback((text) => {
    if (!text || document.visibilityState !== "visible") return;
    setMessage(text);
    window.clearTimeout(messageTimerRef.current);
    messageTimerRef.current = window.setTimeout(() => setMessage(""), 3600);
  }, []);

  const placePet = useCallback((requestedX, requestedRise, animate = false) => {
    const size = getPlacementSize();
    const viewportWidth = getViewportWidth();
    const stageBottom = stageRef.current?.getBoundingClientRect().bottom ?? window.innerHeight - 8;
    const next = findSafePosition(
      requestedX,
      requestedRise,
      viewportWidth,
      window.innerHeight,
      size,
      stageBottom
    );
    if (!next) return false;

    positionRef.current = next;
    setPosition(next);
    setMoveDuration(animate ? 1800 : 0);
    return true;
  }, [getPlacementSize]);

  const movePet = useCallback((requestedX) => {
    const start = positionRef.current;
    const size = getPlacementSize();
    const viewportWidth = getViewportWidth();
    const targetX = Math.max(
      size.width / 2 + 8,
      Math.min(viewportWidth - size.width / 2 - 8, requestedX)
    );
    const stageBottom = stageRef.current?.getBoundingClientRect().bottom ?? window.innerHeight - 8;
    const next = findSafePosition(
      targetX,
      start.rise,
      viewportWidth,
      window.innerHeight,
      size,
      stageBottom
    );
    if (!next || Math.abs(next.x - start.x) < 28) return false;

    setDirection(next.x < start.x ? "left" : "right");
    positionRef.current = next;
    setPosition(next);
    const duration = Math.min(3600, Math.max(1200, Math.abs(next.x - start.x) * 5));
    setMoveDuration(duration);
    setPetMode("walking", duration);
    return true;
  }, [getPlacementSize, setPetMode]);

  const resetSleepTimer = useCallback(() => {
    window.clearTimeout(sleepTimerRef.current);
    if (document.visibilityState !== "visible" || hidden) return;

    const idleDelay = window.innerWidth < 720 ? 26000 : 22000;
    const remaining = Math.max(1000, idleDelay - (Date.now() - activityAtRef.current));
    sleepTimerRef.current = window.setTimeout(() => {
      if (Date.now() - activityAtRef.current < idleDelay) {
        resetSleepTimer();
        return;
      }
      setPetMode("sleeping");
      showMessage(t("pet.sleepy"));
    }, remaining);
  }, [hidden, setPetMode, showMessage, t]);

  const wakePet = useCallback(() => {
    if (modeRef.current !== "sleeping") return;
    setPetMode("waking", 1000);
    showMessage(t("pet.wake"));
  }, [setPetMode, showMessage, t]);

  useEffect(() => {
    function onActivity(event) {
      if (document.visibilityState !== "visible" || hidden) return;
      const now = Date.now();
      if (event.type === "pointermove" && now - lastActivityUpdateRef.current < 300) return;
      lastActivityUpdateRef.current = now;
      activityAtRef.current = now;
      wakePet();
      resetSleepTimer();
    }

    function onPointerMove(event) {
      if (document.visibilityState !== "visible") return;
      const rect = petRef.current?.getBoundingClientRect();
      if (!rect) return;

      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      const pupilX = Math.max(-3, Math.min(3, dx / 32));
      const pupilY = Math.max(-2, Math.min(2, dy / 36));
      petRef.current.style.setProperty("--look-x", `${pupilX}px`);
      petRef.current.style.setProperty("--look-y", `${pupilY}px`);

      if (distance < 125 && Date.now() - proximityAtRef.current > 9000) {
        proximityAtRef.current = Date.now();
        if (modeRef.current !== "sleeping" && !panelOpen) {
          setPetMode("looking", 900);
          if (Math.random() < 0.35) showMessage(t("pet.nearby"));
        }
      }
      onActivity(event);
    }

    function onKeyDown(event) {
      onActivity(event);
      if (event.key === "Escape") setPanelOpen(false);
    }

    function onVisibilityChange() {
      const visible = document.visibilityState === "visible";
      setTabVisible(visible);
      if (!visible) {
        window.clearTimeout(sleepTimerRef.current);
        window.clearTimeout(messageTimerRef.current);
        setMessage("");
      } else {
        activityAtRef.current = Date.now();
        resetSleepTimer();
      }
    }

    function scheduleReposition() {
      window.clearTimeout(scheduleReposition.timer);
      scheduleReposition.timer = window.setTimeout(() => {
        placePet(positionRef.current.x, positionRef.current.rise);
      }, 160);
    }

    const stageResizeObserver = new ResizeObserver(scheduleReposition);
    if (stageRef.current) stageResizeObserver.observe(stageRef.current);
    window.visualViewport?.addEventListener("resize", scheduleReposition, { passive: true });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onActivity, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onActivity, { passive: true });
    window.addEventListener("resize", scheduleReposition, { passive: true });
    window.addEventListener("scroll", scheduleReposition, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    placePet(positionRef.current.x, positionRef.current.rise);
    activityAtRef.current = Date.now();
    resetSleepTimer();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onActivity);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onActivity);
      window.removeEventListener("resize", scheduleReposition);
      window.removeEventListener("scroll", scheduleReposition);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stageResizeObserver.disconnect();
      window.visualViewport?.removeEventListener("resize", scheduleReposition);
      window.clearTimeout(scheduleReposition.timer);
      window.clearTimeout(sleepTimerRef.current);
    };
  }, [hidden, panelOpen, placePet, resetSleepTimer, setPetMode, showMessage, t, wakePet]);

  useEffect(() => {
    if (hidden || panelOpen || !wandering || !tabVisible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let timer;
    let cancelled = false;
    const compact = getViewportWidth() < 900;

    function scheduleNext() {
      if (cancelled || document.visibilityState !== "visible") return;
      const delay = compact
        ? 24000 + Math.random() * 14000
        : 7500 + Math.random() * 8500;

      timer = window.setTimeout(() => {
        if (modeRef.current === "sleeping") {
          scheduleNext();
          return;
        }

        const actions = compact
          ? ["looking", "waving", "jumping", "idle", "walking"]
          : ["looking", "waving", "jumping", "surprised", "walking", "idle"];
        const action = actions[Math.floor(Math.random() * actions.length)];

        if (action === "walking") {
          const size = getPetSize(getViewportWidth());
          const margin = size.width / 2 + 12;
          const destination = compact
            ? positionRef.current.x + (Math.random() < 0.5 ? -1 : 1) * (36 + Math.random() * 64)
            : margin + Math.random() * Math.max(0, getViewportWidth() - margin * 2);
          if (!movePet(destination)) setPetMode("looking", 850);
        } else {
          setPetMode(action, action === "idle" ? 700 : 1300);
          if (action === "waving" && Math.random() < 0.7) showMessage(t("pet.wave"));
          else if (action === "surprised" && Math.random() < 0.45) showMessage(t("pet.surprised"));
          else if (action === "looking" && Math.random() < 0.4) showMessage(t("pet.lookAround"));
        }

        const occasionalMessages = t("pet.messages", { returnObjects: true });
        if (Array.isArray(occasionalMessages) && Math.random() < 0.16) {
          showMessage(occasionalMessages[Math.floor(Math.random() * occasionalMessages.length)]);
        }
        scheduleNext();
      }, delay);
    }

    scheduleNext();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [hidden, movePet, panelOpen, setPetMode, showMessage, tabVisible, t, wandering]);

  useEffect(() => () => {
    window.clearTimeout(messageTimerRef.current);
    window.clearTimeout(modeTimerRef.current);
    window.clearTimeout(sleepTimerRef.current);
    window.clearTimeout(clickTimerRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close().catch((error) => {
        console.warn("Robo Assistant audio could not be closed cleanly.", error);
      });
      audioContextRef.current = null;
    }
  }, []);

  function handlePetClick(event) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      window.clearTimeout(dragClickTimerRef.current);
      return;
    }

    wakePet();
    setPanelOpen(true);
    setPanelMessage(t("pet.panelIntro"));

    if (event.detail === 2) {
      window.clearTimeout(clickTimerRef.current);
      setPetMode("jumping", 1500);
      showMessage(t("pet.doubleClick"));
      return;
    }

    if (event.detail === 0) {
      setPetMode("waving", 1200);
      showMessage(t("pet.clicked"));
      return;
    }

    window.clearTimeout(clickTimerRef.current);
    window.clearTimeout(dragClickTimerRef.current);
    clickTimerRef.current = window.setTimeout(() => {
      const actions = ["waving", "jumping", "surprised", "looking"];
      setPetMode(actions[Math.floor(Math.random() * actions.length)], 1300);
      showMessage(t("pet.clicked"));
    }, 260);
  }

  function handleDragStart(event) {
    if (event.button !== 0 || !event.isPrimary) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - bounds.left,
      offsetY: event.clientY - bounds.top,
      startX: event.clientX,
      startY: event.clientY,
      x: positionRef.current.x,
      rise: positionRef.current.rise,
      active: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleDragMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (!drag.active && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 4) {
      return;
    }

    if (!drag.active) {
      drag.active = true;
      setDragging(true);
    }
    suppressClickRef.current = true;

    const viewportWidth = getViewportWidth();
    const petSize = getPetSize(viewportWidth);
    const placementSize = getPlacementSize();
    const stageBottom = stageRef.current?.getBoundingClientRect().bottom ?? window.innerHeight - 8;
    drag.x = Math.max(
      placementSize.width / 2 + 8,
      Math.min(viewportWidth - placementSize.width / 2 - 8, event.clientX - drag.offsetX + petSize.width / 2)
    );
    drag.rise = Math.max(
      12,
      Math.min(
        stageBottom - placementSize.height - 8,
        stageBottom - (event.clientY - drag.offsetY + petSize.height)
      )
    );
    stageRef.current?.style.setProperty("--pet-x", `${drag.x}px`);
    stageRef.current?.style.setProperty("--pet-rise", `${drag.rise}px`);
    stageRef.current?.style.setProperty("--move-duration", "0ms");
  }

  function finishDrag(event) {
    const drag = dragRef.current;
    if (!drag || (event && drag.pointerId !== event.pointerId)) return;

    dragRef.current = null;
    setDragging(false);
    if (drag.active) {
      setDirection(drag.x < positionRef.current.x ? "left" : "right");
      placePet(drag.x, drag.rise);
      suppressClickRef.current = true;
      window.clearTimeout(dragClickTimerRef.current);
      dragClickTimerRef.current = window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 350);
    }
  }

  function handlePetKeyDown(event) {
    const size = getPetSize(getViewportWidth());
    const changes = {
      ArrowLeft: [-Math.max(44, Math.round(size.width * 0.75)), 0],
      ArrowRight: [Math.max(44, Math.round(size.width * 0.75)), 0],
      ArrowUp: [0, size.height + 10],
      ArrowDown: [0, -(size.height + 10)],
    };
    const change = changes[event.key];
    if (!change) return;

    event.preventDefault();
    if (change[0]) setDirection(change[0] < 0 ? "left" : "right");
    placePet(positionRef.current.x + change[0], positionRef.current.rise + change[1]);
  }

  function hidePet() {
    setPetMode("disappearing", 260);
    window.setTimeout(() => {
      saveHiddenPreference(true);
      setHidden(true);
      setPanelOpen(false);
    }, 240);
  }

  function restorePet() {
    saveHiddenPreference(false);
    setHidden(false);
    setPetMode("appearing", 500);
    setTimeout(() => showMessage(t("pet.greeting")), 420);
  }

  function handleHelp() {
    setPanelMessage(t("pet.helpMessage"));
    setPetMode("waving", 1200);
    showMessage(t("pet.helpMessage"));
  }

  function handleSurprise() {
    const actions = ["waving", "jumping", "surprised", "looking"];
    setPetMode(actions[Math.floor(Math.random() * actions.length)], 1400);
    setPanelMessage(t("pet.surpriseMessage"));
    showMessage(t("pet.surprise"));
  }

  function toggleSound() {
    const nextEnabled = !soundEnabled;
    saveSoundPreference(nextEnabled);
    setSoundEnabled(nextEnabled);
    if (nextEnabled) playRobotSound("waking", true);
  }

  function closePanel() {
    setPanelOpen(false);
  }

  if (hidden) {
    return (
      <div
        className={styles.stage}
        ref={stageRef}
        data-desktop-pet
        style={{
          "--pet-x": `${position.x}px`,
          "--pet-rise": `${position.rise}px`,
          "--move-duration": "0ms",
        }}
      >
        <button
          type="button"
          className={styles.launcher}
          onClick={restorePet}
          aria-label={t("pet.restore")}
          title={t("pet.restore")}
        >
          <span aria-hidden="true">🤖</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={styles.stage}
      ref={stageRef}
      data-desktop-pet
      style={{
        "--pet-x": `${position.x}px`,
        "--pet-rise": `${position.rise}px`,
        "--move-duration": `${moveDuration}ms`,
      }}
    >
      {panelOpen && (
        <section
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-label={t("pet.title")}
          id="robo-assistant-panel"
          data-desktop-pet
        >
          <header className={styles.titlebar}>
            <span className={styles.titleIcon} aria-hidden="true">🤖</span>
            <h2>{t("pet.title")}</h2>
            <button
              type="button"
              className={styles.hideButton}
              onClick={hidePet}
              aria-label={t("pet.hide")}
              title={t("pet.hide")}
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <div className={styles.panelBody}>
            <p className={styles.panelMessage} aria-live="polite">{panelMessage}</p>
            <div className={styles.actions}>
              <a href="#work" onClick={() => setPanelOpen(false)}>{t("pet.explore")}</a>
              <button type="button" onClick={handleHelp}>{t("pet.help")}</button>
              <a href="#about" onClick={() => setPanelOpen(false)}>{t("pet.about")}</a>
              <a href="#contact" onClick={closePanel}>{t("pet.contact")}</a>
              <button type="button" onClick={handleSurprise}>{t("pet.surpriseAction")}</button>
              <button
                type="button"
                onClick={toggleSound}
                aria-pressed={soundEnabled}
              >
                {t(soundEnabled ? "pet.soundOn" : "pet.soundOff")}
              </button>
              <button
                type="button"
                onClick={() => setWandering((enabled) => !enabled)}
              >
                {t(wandering ? "pet.pauseWandering" : "pet.resumeWandering")}
              </button>
              <a href="#top" onClick={closePanel}>{t("pet.backToTop")}</a>
              <button type="button" onClick={closePanel}>{t("pet.close")}</button>
            </div>
          </div>
        </section>
      )}

      <div
        ref={petRef}
        className={styles.pet}
        data-mode={mode}
        data-direction={direction}
        data-dragging={dragging}
        data-panel-open={panelOpen}
      >
        {message && !panelOpen && (
          <div className={styles.speech} role="status" aria-live="polite">
            {message}
          </div>
        )}
        <button
          type="button"
          className={styles.petButton}
          onClick={handlePetClick}
          aria-label={t("pet.openLabel")}
          aria-expanded={panelOpen}
          aria-controls="robo-assistant-panel"
          aria-description={t("pet.moveInstructions")}
          title={`${t("pet.openLabel")} — ${t("pet.moveInstructions")}`}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onLostPointerCapture={finishDrag}
          onKeyDown={handlePetKeyDown}
        >
          <Robot sleeping={mode === "sleeping"} />
        </button>
      </div>
    </div>
  );
}
