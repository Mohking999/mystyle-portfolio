import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { buttonHover } from "../ui/motionUtils.js";
import Reveal from "../ui/Reveal.jsx";
import styles from "./contact.module.css";

const contactVideo = new URL("../../../asstes/4153407-hd_1920_1080_25fps.mp4", import.meta.url).href;

const CONTACT_EMAIL = "djebiriabdrazak@gmail.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const { t } = useTranslation();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | opening

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = t("contact.error_required");
    if (!values.email.trim()) next.email = t("contact.error_required");
    else if (!EMAIL_RE.test(values.email)) next.email = t("contact.error_email");
    if (!values.message.trim()) next.message = t("contact.error_required");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("opening");
    const subject = encodeURIComponent(`Portfolio message from ${values.name.trim()}`);
    const body = encodeURIComponent(
      `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  function field(name) {
    return {
      value: values[name],
      onChange: (e) => setValues((v) => ({ ...v, [name]: e.target.value })),
      "aria-invalid": !!errors[name],
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    };
  }

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.videoBg}>
        <video className={styles.video} src={contactVideo} autoPlay muted loop playsInline />
      </div>
      <div className={styles.videoOverlay} />
      <Reveal className={styles.inner}>
        <span className={styles.eyebrow}>{t("contact.eyebrow")}</span>
        <h2 className={styles.heading}>{t("contact.heading")}</h2>
        <p className={styles.subheading}>{t("contact.subheading")}</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="name">{t("contact.name")}</label>
            <input id="name" type="text" {...field("name")} />
            {errors.name && <span id="name-error" className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="email">{t("contact.email")}</label>
            <input id="email" type="email" {...field("email")} />
            {errors.email && <span id="email-error" className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="message">{t("contact.message")}</label>
            <textarea id="message" rows={5} {...field("message")} />
            {errors.message && <span id="message-error" className={styles.error}>{errors.message}</span>}
          </div>

          <motion.button
            className={styles.submit}
            type="submit"
            disabled={status === "opening"}
            variants={buttonHover}
            initial="rest"
            whileHover={status === "opening" ? undefined : "hover"}
            whileTap={status === "opening" ? undefined : { scale: 0.98 }}
          >
            {t("contact.send")}
          </motion.button>

          <div role="status" aria-live="polite" className={styles.statusMsg}>
            {status === "success" && t("contact.success")}
            {status === "error" && t("contact.error")}
          </div>
        </form>

        <p className={styles.directEmail}>
          {t("contact.or_email")}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </Reveal>
    </section>
  );
}
