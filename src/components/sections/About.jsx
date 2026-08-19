import { useTranslation } from "react-i18next";
import Reveal from "../ui/Reveal.jsx";
import styles from "./about.module.css";

export default function About() {
  const { t } = useTranslation();

  const stats = [
    ["stat_role", "stat_role_v"],
    ["stat_focus", "stat_focus_v"],
    ["stat_now", "stat_now_v"],
    ["stat_langs", "stat_langs_v"],
  ];

  return (
    <section id="about" className={styles.section}>
      <Reveal className={styles.head}>
        <span className={styles.num}>01</span>
        <h2 className={styles.heading}>{t("about.eyebrow")}</h2>
      </Reveal>
      <div className={styles.grid}>
        <Reveal>
          <p className={styles.p}>{t("about.p1")}</p>
          <p className={styles.p}>{t("about.p2")}</p>
          <p className={styles.p}>{t("about.p3")}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className={styles.statList}>
            {stats.map(([k, v]) => (
              <div className={styles.statRow} key={k}>
                <span className={styles.k}>{t(`about.${k}`)}</span>
                <span className={styles.v}>{t(`about.${v}`)}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
