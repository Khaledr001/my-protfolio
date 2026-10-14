// Roles and dates come from the resume. The telemedicine role comes from the
// previous version of the site (it is not on the current resume).
export interface Role {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  focus: string;
  points: string[];
  stack: string[];
}

export const experience: Role[] = [
  {
    id: "sidago",
    role: "Full-Stack Developer",
    company: "Sidago Inc",
    location: "Chicago, USA · Remote",
    period: "Feb 2026 — Present",
    focus: "Headless CMS platform and a multi-brand sales CRM backend",
    points: [
      "Architected Mazarini, a headless CMS on Strapi, Next.js and TypeScript in a monorepo, delivering 10+ configurable content modules for business clients.",
      "Building the backend of a multi-brand sales CRM: timezone-prioritized calling queues, lead-state transitions, follow-up scheduling and reporting APIs.",
      "Integrations through HMAC-SHA256-signed webhooks and asynchronous RabbitMQ events.",
      "Containerized the stack with Docker, PostgreSQL and Nginx for dev/production parity, plus a technical SEO pipeline.",
    ],
    stack: ["NestJS", "PostgreSQL", "Drizzle", "RabbitMQ", "Next.js", "Strapi", "Docker"],
  },
  {
    id: "bizreflex",
    role: "Junior Software Engineer",
    company: "Bizreflex",
    location: "Dhaka, Bangladesh",
    period: "Jul 2025 — Jan 2026",
    focus: "TekomoPro, a technician marketplace",
    points: [
      "Developed 10+ REST endpoints covering the full work-order lifecycle with NestJS and PostgreSQL.",
      "Decoupled three core services with RabbitMQ and NATS events, moving third-party webhook processing off the request path.",
      "Improved Order Service response time by ~30% under production load through indexing, N+1 elimination and schema normalization.",
      "Replaced local disk storage with AWS S3 so the service scales horizontally without state concerns.",
    ],
    stack: ["NestJS", "Angular", "PostgreSQL", "Knex", "RabbitMQ", "NATS", "AWS S3"],
  },
  {
    id: "bright",
    role: "Junior Software Engineer",
    company: "Bright Technology Limited",
    location: "Dhaka, Bangladesh",
    period: "Jan 2024 — Jun 2025",
    focus: "Multi-tenant ISP management SaaS",
    points: [
      "Designed and built a multi-tenant ISP management platform with company-level data isolation and role-based access control.",
      "Integrated the MikroTik RouterOS API for PPPoE provisioning, bandwidth throttling and network monitoring.",
      "Built an automated billing and renewal engine with cron jobs and multi-payment support, including bKash.",
      "Secured every API surface with JWT, bcrypt, modular RBAC and Swagger documentation.",
    ],
    stack: ["Node.js", "Express.js", "TypeScript", "MongoDB", "Docker", "MikroTik API"],
  },
  {
    id: "telemedicine",
    role: "Backend Developer",
    company: "Non-profit organization",
    location: "Bangladesh",
    period: "Jun 2023 — Nov 2023",
    focus: "Telemedicine service",
    points: [
      "Built an online prescription system so doctors can issue prescriptions that patients can view, download and print.",
      "Integrated Bangladesh regional data (district, sub-district, union) for location-based doctor search.",
    ],
    stack: ["NestJS", "PostgreSQL", "MongoDB"],
  },
];

export const education = {
  degree: "BSc in Computer Science and Engineering",
  school: "Comilla University",
  period: "2018 — 2023",
};
