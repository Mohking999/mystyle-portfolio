import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import useReducedMotion from "../../hooks/useReducedMotion.js";
import styles from "./mobileMenu.module.css";

export default function MobileMenu({ open, onClose, links }) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const closeRef = useRef(null);

  useEffect(() => {
    if (open && closeRef.current) closeRef.current.focus();
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.menu")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
        >
          <button ref={closeRef} className={styles.close} onClick={onClose} aria-label={t("nav.close")}>
            {t("nav.close")}
          </button>
          <nav className={styles.links}>
            {links.map((key) => (
              <a key={key} href={`#${key}`} className={styles.link} onClick={onClose}>
                {t(`nav.${key}`)}
              </a>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
