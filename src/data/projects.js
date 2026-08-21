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
    stack: ["HTML", "CSS", "JavaScript"],
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
];

export const FILTERS = ["all", "web", "mobile", "saas", "java"];
