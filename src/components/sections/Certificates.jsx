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

  return (
    <section id="certificates" className={styles.section}>
      <Reveal className={styles.head}>
        <span className={styles.num}>03</span>
        <div>
          <span className={styles.eyebrow}>{t("certificates.eyebrow")}</span>
          <h2 className={styles.heading}>{t("certificates.heading")}</h2>
        </div>
      </Reveal>

      <Reveal>
        <p className={styles.subtitle}>{t("certificates.subtitle")}</p>
      </Reveal>

      <div className={styles.grid}>
        {CERTIFICATES.map((item) => (
          <Reveal key={item.title}>
            <a className={styles.card} href={item.url} target="_blank" rel="noreferrer" aria-label={item.title}>
              {item.image ? (
                <div className={styles.imageWrap}>
                  <img src={item.image} alt={item.title} className={styles.image} />
                </div>
              ) : (
                <div className={styles.fallback}>
                  <span>{item.title}</span>
                </div>
              )}

              <div className={styles.meta}>
                <span className={styles.label}>{t("certificates.view")}</span>
                <h3>{item.title}</h3>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
