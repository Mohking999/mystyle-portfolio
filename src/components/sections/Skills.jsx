import { useTranslation } from "react-i18next";
import Reveal from "../ui/Reveal.jsx";
import { SKILL_GROUPS } from "../../data/skills.js";
import styles from "./skills.module.css";

export default function Skills() {
  const { t } = useTranslation();

  return (
    <section id="skills" className={styles.section}>
      <Reveal className={styles.head}>
        <span className={styles.num}>02</span>
        <div>
          <span className={styles.eyebrow}>{t("skills.eyebrow")}</span>
          <h2 className={styles.heading}>{t("skills.heading")}</h2>
          <p className={styles.intro}>{t("skills.intro")}</p>
        </div>
      </Reveal>

      <nav className={styles.categoryNav} aria-label={t("skills.categoryNavigation")}>
        {SKILL_GROUPS.map((group) => (
          <a key={group.key} href={`#skills-${group.key}`}>
            {t(`skills.${group.key}`)}
          </a>
        ))}
      </nav>

      <div className={styles.groups}>
        {SKILL_GROUPS.map((group) => (
          <Reveal className={styles.group} key={group.key}>
            <section
              id={`skills-${group.key}`}
              aria-labelledby={`skills-${group.key}-heading`}
            >
              <h3 className={styles.groupLabel} id={`skills-${group.key}-heading`}>
                {t(`skills.${group.key}`)}
              </h3>
              <div className={styles.grid} role="list">
                {group.items.map(({ name, logos, color }) => (
                  <article
                    className={styles.card}
                    key={name}
                    role="listitem"
                    style={{ "--brand-color": color }}
                  >
                    <span className={styles.logoCluster}>
                      {logos.map((logo) => (
                        <span className={styles.logoSurface} key={logo}>
                          <img
                            src={`${import.meta.env.BASE_URL}technology-logos/${logo}`}
                            alt={name}
                            width="72"
                            height="72"
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                      ))}
                    </span>
                    <span className={styles.cardName}>{name}</span>
                  </article>
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className={styles.note}>{t("skills.note")}</p>
      </Reveal>
    </section>
  );
}
