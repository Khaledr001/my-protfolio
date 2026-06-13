// ─────────────────────────────────────────────────────────────────────────────
// STRUCTURED DATA — shapes, categories, and lists.
// For plain text (bio, hero subtitle) edit src/content.js instead.
// ─────────────────────────────────────────────────────────────────────────────

import {
  backend,
  creator,
  mobile,
  web,
  javascript,
  typescript,
  nodejs,
  reactjs,
  mongodb,
  docker,
  git,
  tailwind,
  bizReflex,
  pos,
  chat_app,
  isp3,
  eCommerce,
  employees,
} from "../assets";

// ── Navigation ───────────────────────────────────────────────────────────────
export const navLinks = [
  { id: "about",   title: "About"    },
  { id: "project", title: "Projects" },
  { id: "work",    title: "Work"     },
  { id: "contact", title: "Contact"  },
];

// ── Services (About section cards) ───────────────────────────────────────────
// Replace icon with any image from src/assets if you have a better one.
export const services = [
  { title: "AI & Agentic Systems",   icon: creator },
  { title: "Backend Engineering",    icon: backend },
  { title: "Full-Stack Development", icon: web     },
  { title: "API & System Design",    icon: mobile  },
];

// ── Technologies (spinning balls) ────────────────────────────────────────────
// Only techs relevant to the resume; icons must exist in src/assets/tech/.
export const technologies = [
  { name: "TypeScript",   icon: typescript },
  { name: "JavaScript",   icon: javascript },
  { name: "Node.js",      icon: nodejs     },
  { name: "React",        icon: reactjs    },
  { name: "MongoDB",      icon: mongodb    },
  { name: "Tailwind CSS", icon: tailwind   },
  { name: "Docker",       icon: docker     },
  { name: "Git",          icon: git        },
];

// ── Work Experience ───────────────────────────────────────────────────────────
// icon    → company logo from src/assets (use web/backend/creator/mobile as
//           placeholders; swap for a real logo once you have it)
// iconBg  → background colour of the icon circle
// project → shown as "Project: <value>" in the timeline card
// points  → keep each bullet to 1–2 lines
export const experiences = [
  {
    title:        "Full-Stack Developer",
    company_name: "Sidago Inc — Chicago, USA (Remote)",
    project:      "mazarini — Headless CMS Platform",
    icon:         web,       // TODO: replace with Sidago logo
    iconBg:       "#1e293b",
    date:         "Feb 2026 – Present",
    points: [
      "Built mazarini, a full-stack headless CMS using Strapi, Next.js and TypeScript in a monorepo architecture with scalable business modules.",
      "Engineered advanced UI components — mega menus, animated hero sections, and touch-enabled carousels — using Framer Motion and Tailwind CSS.",
      "Containerised and deployed backend services with Docker, PostgreSQL, and Nginx.",
      "Implemented technical SEO: metadata, sitemap.xml, and robots.txt.",
    ],
  },
  {
    title:        "Junior Software Engineer",
    company_name: "Bizreflex — Dhaka, Bangladesh",
    project:      "TekomoPro — Technician Marketplace",
    icon:         bizReflex,
    iconBg:       "#ffffff",
    date:         "Jul 2025 – Jan 2026",
    points: [
      "Built full-stack features for TekomoPro — a work-order management marketplace — using NestJS REST APIs and Angular UI components.",
      "Implemented event-driven communication with RabbitMQ and NATS, integrating third-party webhooks and enabling asynchronous service interactions.",
      "Optimised Order Service APIs by ~30% through query optimisation and database schema improvements.",
      "Implemented AWS S3 storage for scalable file uploads and asset management.",
    ],
  },
  {
    title:        "Junior Software Engineer",
    company_name: "Bright Technology Ltd — Dhaka, Bangladesh",
    project:      "ISP Management SaaS",
    icon:         backend,   // TODO: replace with Bright Technology logo
    iconBg:       "#1e3a5f",
    date:         "Jan 2024 – Jun 2025",
    points: [
      "Architected a RESTful API backend in Node.js, Express.js, and TypeScript with a modular controllers/routes/models structure.",
      "Designed a multi-tenant SaaS platform with company-level data isolation and role-based access control (RBAC).",
      "Integrated bKash payment gateway for automated billing and transaction management.",
      "Integrated MikroTik RouterOS API for PPPoE user provisioning and network monitoring.",
      "Built a billing and renewal system with cron jobs and multi-payment support.",
    ],
  },
  {
    title:        "Backend Developer",
    company_name: "Non-Profit Organization",
    project:      "Telemedicine Service",
    icon:         creator,   // TODO: replace with org logo if available
    iconBg:       "#e2e8f0",
    date:         "Jun 2023 – Nov 2023",
    points: [
      "Developed an online prescription system so doctors can issue prescriptions that patients can view, download, and print.",
      "Integrated Bangladesh regional data (District, Sub-District, Union) for accurate doctor search by location.",
      "Technologies: NestJS, PostgreSQL, MongoDB.",
    ],
  },
];

// ── Testimonials (Feedbacks component is commented out in App) ────────────────
export const testimonials = [];

// ── Projects ─────────────────────────────────────────────────────────────────
// source_code_link → GitHub repo URL or live demo URL
// tags[].color     → CSS class from src/index.css (e.g. blue-text-gradient)
export const projects = [
  {
    name: "POS & Inventory Management System",
    slug: "pos-inventory-management-system",
    description: "Point-of-Sale (POS) and inventory management system with role-based authentication, product and category management, sales and purchase tracking, and real-time stock level monitoring.",
    tags: [
      { name: "Angular",    color: "blue-text-gradient"   },
      { name: ".NET",  color: "green-text-gradient"  },
      { name: "PostgreSQL",  color: "orange-text-gradient" },
      { name: "TypeScript",color: "blue-text-gradient"   },
    ],
    image: pos,
    source_code_link: "https://github.com/Khaledr001/pos.git",
    live_demo_link: "https://pos.devsfleet.com",
    demo_login: "demo@demo.com",
    demo_password: "Demo123!",
  },
  {
    name: "Chat Application",
    slug: "chat-application",
    description:
      "Real-time chat platform with private messaging, group chat, and file sharing. NestJS backend, Socket.IO for live communication, React frontend, and JWT authentication.",
    tags: [
      { name: "NestJS",     color: "blue-text-gradient"   },
      { name: "Socket.IO",  color: "orange-text-gradient" },
      { name: "MongoDB",    color: "green-text-gradient"  },
      { name: "React",      color: "white-text-gradient"  },
      { name: "TypeScript", color: "blue-text-gradient"   },
    ],
    image: chat_app,
    source_code_link: "https://github.com/Khaledr001/chat-app.git",
  },
  {
    name: "ISP Solution Backend",
    slug: "isp-solution-backend",
    description:
      "Multi-tenant SaaS for ISP management with role-based JWT authentication, company-level data isolation, MikroTik RouterOS control for PPPoE provisioning, and automated billing with cron jobs.",
    tags: [
      { name: "Node.js",    color: "blue-text-gradient"   },
      { name: "MongoDB",    color: "green-text-gradient"  },
      { name: "TypeScript", color: "blue-text-gradient"   },
      { name: "Docker",     color: "white-text-gradient"  },
    ],
    image: isp3,
    source_code_link: "https://ispadmin.softinsightsltd.com/",
  },
  {
    name: "E-Commerce Platform",
    slug: "e-commerce-platform",
    description:
      "Full-stack single-vendor e-commerce app with role-based JWT authentication, multi-category product listings, cart, checkout, and an admin panel for inventory and order management.",
    tags: [
      { name: "React",    color: "blue-text-gradient"   },
      { name: "Node.js",  color: "green-text-gradient"  },
      { name: "MongoDB",  color: "orange-text-gradient" },
      { name: "Tailwind", color: "pink-text-gradient"   },
    ],
    image: eCommerce,
    source_code_link: "https://github.com/Khaledr001/eCommerce",
  },
  {
    name: "Employee Management System",
    slug: "employee-management-system",
    description:
      "HR platform for managing employee records, leave requests, and company notices, with role-based dashboards for admin and employee users.",
    tags: [
      { name: "React",   color: "blue-text-gradient"   },
      { name: "Node.js", color: "green-text-gradient"  },
      { name: "MongoDB", color: "orange-text-gradient" },
      { name: "DaisyUI", color: "pink-text-gradient"   },
    ],
    image: employees,
    source_code_link: "https://github.com/Khaledr001/Employee-Management-System",
  },
];
