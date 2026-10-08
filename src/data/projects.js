// Structural project data. Translated text (title, problem, description, role)
// lives in src/i18n/locales/*.json under projects.<id> and is looked up by id
// in the Projects section — this file only holds facts that don't change per language.
export const PROJECTS = [
  {
    id: "mystyle",
    category: ["saas", "web"],
    status: "in_development",
    stack: ["React", "FastAPI", "Three.js", "PostgreSQL"],
    github: null,
    live: null,
  },
  {
    id: "mohamed_service",
    category: ["web"],
    status: "completed",
    stack: ["PHP", "MySQL"],
    github: null,
    live: "https://mohking999.github.io/welcome/",
  },
  {
    id: "resto",
    category: ["web"],
    status: "completed",
    stack: ["PHP", "HTML", "CSS", "JavaScript"],
    github: null,
    live: "https://restoalsalamelbayadh.online/",
  },
  {
    id: "adhahi",
    category: ["web", "mobile"],
    status: "concept",
    stack: ["React", "TypeScript", "Kotlin"],
    github: "https://github.com/Mohking999/frontend-suggest",
    live: "https://mohking999.github.io/frontend/",
  },
  {
    id: "gestionsalles",
    category: ["web", "java"],
    status: "completed",
    stack: ["PHP 8.2+", "MySQL", "PDO"],
    github: "https://github.com/Mohking999/reservesite",
    live: "https://reservesite.liveblog365.com/login.php",
  },
  {
    id: "salle_de_fetes",
    category: ["desktop"],
    status: "completed",
    stack: ["JavaScript", "Electron"],
    github: "https://github.com/Mohking999/salle_de_fetes.git",
    live: null,
    screenshots: [
      {
        src: new URL("../../asstes/salle de fate/Screenshot (72).png", import.meta.url).href,
        title: "calendar",
      },
      {
        src: new URL("../../asstes/salle de fate/Screenshot (74).png", import.meta.url).href,
        title: "new_reservation",
      },
      {
        src: new URL("../../asstes/salle de fate/Screenshot (75).png", import.meta.url).href,
        title: "kitchen_labs",
      },
      {
        src: new URL("../../asstes/salle de fate/Screenshot (76).png", import.meta.url).href,
        title: "identity_cards",
      },
      {
        src: new URL("../../asstes/salle de fate/Screenshot (73).png", import.meta.url).href,
        title: "revenue",
      },
      {
        src: new URL("../../asstes/salle de fate/Screenshot (77).png", import.meta.url).href,
        title: "calendar_detail",
      },
    ],
  },
  {
    id: "zira3i",
    category: ["web", "saas"],
    status: "completed",
    stack: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/Mohking999/zira3i.git",
    live: null,
  },
  {
    id: "PHONE_STORE",
    category: ["web", "saas"],
    status: "completed",
    stack: ["React", "Node.js", "PostgreSQL"],
    github: "https://github.com/Mohking999/phone-store.git",
    live: "https://pixel-perfect-cyan-five.vercel.app/",
  },
];

export const FILTERS = ["all", "web", "desktop", "mobile", "saas", "java"];
