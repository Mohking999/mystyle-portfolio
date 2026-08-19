import { useState } from "react";
import { useTranslation } from "react-i18next";
import Reveal from "../ui/Reveal.jsx";
import styles from "./contact.module.css";

// Set this to a real Formspree (or similar static-friendly) endpoint before
// deploying, e.g. "https://formspree.io/f/xxxxxxx". Left empty by default so
// the form honestly tells the visitor it isn't wired up yet, instead of
// silently failing or pretending to send.
const FORM_ENDPOINT = "";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const { t } = useTranslation();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error | unconfigured

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = t("contact.error_required");
    if (!values.email.trim()) next.email = t("contact.error_required");
    else if (!EMAIL_RE.test(values.email)) next.email = t("contact.error_email");
    if (!values.message.trim()) next.message = t("contact.error_required");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    if (!FORM_ENDPOINT) {
      setStatus("unconfigured");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
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

          <button className={styles.submit} type="submit" disabled={status === "sending"}>
            {status === "sending" ? t("contact.sending") : t("contact.send")}
          </button>

          <div role="status" aria-live="polite" className={styles.statusMsg}>
            {status === "success" && t("contact.success")}
            {status === "error" && t("contact.error")}
            {status === "unconfigured" && t("contact.not_configured")}
          </div>
        </form>

        <p className={styles.directEmail}>
          {t("contact.or_email")}{" "}
          <a href="mailto:djebiriabdrazak@gmail.com">djebiriabdrazak@gmail.com</a>
        </p>
      </Reveal>
    </section>
  );
}
