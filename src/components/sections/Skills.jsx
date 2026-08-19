import { useTranslation } from "react-i18next";
import Reveal from "../ui/Reveal.jsx";
import { SKILL_GROUPS, LEARNING } from "../../data/skills.js";
import styles from "./skills.module.css";

export default function Skills() {
  const { t } = useTranslation();

  return (
    <section id="skills" className={styles.section}>
      <Reveal className={styles.head}>
        <span className={styles.num}>02</span>
        <h2 className={styles.heading}>{t("skills.heading")}</h2>
      </Reveal>

      <div className={styles.groups}>
        {SKILL_GROUPS.map((g) => (
          <Reveal key={g.key}>
            <span className={styles.groupLabel}>{t(`skills.${g.key}`)}</span>
            <div className={styles.swatches}>
              {g.items.map((s) => (
                <span className={styles.swatch} key={s}>{s}</span>
              ))}
            </div>
          </Reveal>
        ))}

        <Reveal>
          <span className={styles.groupLabel}>{t("skills.learning")}</span>
          <div className={styles.swatches}>
            {LEARNING.map((s) => (
              <span className={`${styles.swatch} ${styles.learning}`} key={s}>{s}</span>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal>
        <p className={styles.note}>{t("skills.note")}</p>
      </Reveal>
    </section>
  );
}
