import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Reveal from "../ui/Reveal.jsx";
import styles from "./certificates.module.css";

const CERTIFICATES = [
  {
    title: "GoMyCode + NVIDIA",
    url: "https://hackathon.gomycode.com/onboarding/projects?project=c6b9cce07935d7ecdbfc875d5a93f521",
    image: new URL("../../../certf/gomy code +nvidia.jfif", import.meta.url).href,
  },
  {
    title: "Come Build with AI",
    url: "https://hackathon.gomycode.com/onboarding/projects?certificate=p-c6b9cce07935d7ecdbfc875d5a93f521-646a6562697269206d6f68616d65642061626472617a616b",
    image: new URL("../../../certf/Come-Build-with-AI-djebiri-mohamed-abdrazak.jpg", import.meta.url).href,
  },
  {
    title: "الذكاء الاصطناعي للمبتدئين",
    url: "https://www.life-global.org/certificate/ad533d04-06a8-438b-96dc-348dbf7b55bd",
    image: new URL("../../../certf/الذكاء الاصطناعي للمبتدئين.jpg", import.meta.url).href,
  },
  {
    title: "إدارة مشاريع Agile",
    url: "https://www.life-global.org/certificate/9b4264e8-2042-438e-82a4-af6cb02bea45",
    image: new URL("../../../certf/إدارة مشاريع Agile.jpg", import.meta.url).href,
  },
  {
    title: "مقدمة للتوعية بالأمن السيبراني",
    url: "https://www.life-global.org/certificate/dd6d081f-7a22-4caa-93ef-88beb6f8a85d",
    image: new URL("../../../certf/مقدمة للتوعية بالأمن السيبراني.jpg", import.meta.url).href,
  },
  {
    title: "c++ Ali Shahin",
    url: new URL("../../../certf/c++ Ali Shahin.jfif", import.meta.url).href,
    image: new URL("../../../certf/c++ Ali Shahin.jfif", import.meta.url).href,
  },
  {
    title: "البيع عبر الإنترنت",
    url: "https://www.life-global.org/certificate/fa8cd1e5-94a6-405b-b8c9-8a8ddcdbe0dd",
    image: new URL("../../../certf/البيع عبر الإنترنت_page-0001.jpg", import.meta.url).href,
  },
];

export default function Certificates() {
  const { t } = useTranslation();
  const [activeIdx, setActiveIdx] = useState(null);

  useEffect(() => {
    if (activeIdx === null) return;
    function onKey(e) {
      if (e.key === "Escape") {
        setActiveIdx(null);
      } else if (e.key === "ArrowLeft") {
        setActiveIdx((i) => (i - 1 + CERTIFICATES.length) % CERTIFICATES.length);
      } else if (e.key === "ArrowRight") {
        setActiveIdx((i) => (i + 1) % CERTIFICATES.length);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx]);

  const currentCert = activeIdx !== null ? CERTIFICATES[activeIdx] : null;

  return (
    <section id="certificates" className={styles.section}>
      <Reveal className={styles.head}>
        <span className={styles.num}>04</span>
        <div>
          <span className={styles.eyebrow}>{t("certificates.eyebrow")}</span>
          <h2 className={styles.heading}>{t("certificates.heading")}</h2>
        </div>
      </Reveal>

      <Reveal>
        <p className={styles.subtitle}>{t("certificates.subtitle")}</p>
      </Reveal>

      <div className={styles.grid}>
        {CERTIFICATES.map((item, idx) => {
          const isExternal = item.url && item.url !== item.image;
          return (
            <Reveal key={item.title}>
              <div
                className={styles.card}
                onClick={() => setActiveIdx(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveIdx(idx);
                  }
                }}
                aria-label={`${item.title} — ${t("certificates.view_full")}`}
              >
                <div className={styles.cardTitlebar}>
                  <span className={styles.cardDocId}>CERT_0{idx + 1}.DOC</span>
                  <span className={styles.badgeVerify}>VERIFIED</span>
                </div>
                {item.image ? (
                  <div className={styles.imageWrap}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className={styles.image}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className={styles.zoomBadge}>
                      🔍 {t("certificates.view_full")}
                    </span>
                  </div>
                ) : (
                  <div className={styles.fallback}>
                    <span>{item.title}</span>
                  </div>
                )}

                <div className={styles.meta}>
                  <div className={styles.metaRow}>
                    <span className={styles.label}>
                      {t("certificates.view_full")} 🔍
                    </span>
                    {isExternal && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.verifyLink}
                        onClick={(e) => e.stopPropagation()}
                        title={t("certificates.verify_online")}
                      >
                        {t("certificates.verify_online")} ↗
                      </a>
                    )}
                  </div>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Full size crystal-clear lightbox viewer */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {activeIdx !== null && currentCert && (
              <motion.div
                className={styles.lightboxOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setActiveIdx(null);
                }}
                role="dialog"
                aria-modal="true"
                aria-label={currentCert.title}
              >
                <div className={styles.lightboxHeader}>
                  <div className={styles.lightboxDocInfo}>
                    <span className={styles.lightboxDocId}>
                      CERT_0{activeIdx + 1}.DOC
                    </span>
                    <span className={styles.lightboxCounter}>
                      {activeIdx + 1} / {CERTIFICATES.length}
                    </span>
                    <span className={styles.lightboxTitle}>
                      {currentCert.title}
                    </span>
                  </div>

                  <div className={styles.lightboxActions}>
                    {currentCert.url && currentCert.url !== currentCert.image && (
                      <a
                        href={currentCert.url}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.lightboxActionBtn}
                        title={t("certificates.verify_online")}
                      >
                        <span>{t("certificates.verify_online")}</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    <a
                      href={currentCert.image}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.lightboxActionIcon}
                      title={t("certificates.open_file")}
                      aria-label={t("certificates.open_file")}
                    >
                      ↗
                    </a>
                    <button
                      type="button"
                      className={styles.lightboxClose}
                      onClick={() => setActiveIdx(null)}
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {CERTIFICATES.length > 1 && (
                  <>
                    <button
                      type="button"
                      className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIdx(
                          (activeIdx - 1 + CERTIFICATES.length) %
                            CERTIFICATES.length
                        );
                      }}
                      aria-label="Previous Certificate"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIdx((activeIdx + 1) % CERTIFICATES.length);
                      }}
                      aria-label="Next Certificate"
                    >
                      →
                    </button>
                  </>
                )}

                <div
                  className={styles.lightboxContent}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) setActiveIdx(null);
                  }}
                >
                  <img
                    src={currentCert.image}
                    alt={currentCert.title}
                    className={styles.lightboxImg}
                    loading="eager"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
