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
  pos_terminal,
  chat_app,
  eCommerce,
  employees,
  isp,
  isp_mobile,
  mazarini,
  mazarini1,
  mazarini_mobile,
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
  { name: "Nest.js",      icon: nodejs     },
  { name: ".NET",      icon: nodejs     },
  { name: "Strapi CMS",      icon: mongodb    },
  { name: "React",        icon: reactjs    },
  { name: "Angular",        icon: reactjs    },
  { name: "MongoDB",      icon: mongodb    },
  { name: "PostgreSQL",      icon: mongodb    },
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
//
// Optional fields used by the project detail page (src/pages/ProjectPage.jsx) —
// each renders only when present:
//   image / images: []   → preview image(s); `images` array enables a gallery
//   video / videos: []   → demo video URL(s)
//   points: []           → bullet-point highlights about the project
//   live_demo_link       → live site URL (shows a "Live Demo" button)
//   demo_login           → demo account email/username (copy button)
//   demo_password        → demo account password (copy button)
export const projects = [
  {
    name: "Mazarini a Propfolio Site",
    slug: "mazarini",
    featured: true,
    description: "A responsive multi-purpose full-stack application built with Next.js (React) frontend and Strapi headless CMS backend. The site showcases interactive UI components, advanced animations, and a comprehensive project portfolio with detailed case studies.",
    tags: [
      { name: "Next.js",    color: "blue-text-gradient" },
      { name: "Strapi",     color: "green-text-gradient" },
      { name: "TypeScript", color: "blue-text-gradient" },
      { name: "Tailwind CSS", color: "blue-text-gradient" },
      { name: "Docker",       color: "blue-text-gradient" },
    ],
    points: [
      "Architected Mazarini, a headless CMS platform built with Strapi, Next.js, and TypeScript in a monorepo architecture, delivering **15+** configurable content modules for business clients.",
      "Engineered interactive UI components (mega menus, animated hero sections, touch-enabled carousels) using Framer Motion and Tailwind CSS.",
      "Containerized and deployed the full stack with Docker (PostgreSQL, Nginx), achieving full production environment",
      "Implemented technical SEO pipeline — dynamic metadata, sitemap.xml, robots.txt"
    ],
    images: [mazarini, mazarini1, mazarini_mobile],
    live_demo_link: "https://mazarinigroup.com/",
  },

  {
    name: "POS & Inventory Management System",
    slug: "pos-inventory-management-system",
    description: "Point-of-Sale (POS) and inventory management system with role-based authentication, product and category management, sales and purchase tracking, and real-time stock level monitoring.",
    tags: [
      { name: "Angular",    color: "blue-text-gradient"   },
      { name: ".NET",  color: "green-text-gradient"  },
      { name: "PostgreSQL",  color: "orange-text-gradient" },
      { name: "TypeScript",color: "blue-text-gradient"   },
      { name: "Clean Architecture",    color: "green-text-gradient"   },
      { name: "CQRS",    color: "white-text-gradient"   },
      { name: "NgRx",    color: "blue-text-gradient"   },
      { name: "MediatR",    color: "white-text-gradient"   },
      { name: "Dexie.js",    color: "white-text-gradient"   },
      { name: "JWT",    color: "white-text-gradient"   },
    ],
    points: [
      "Architected a **15-module ERP** platform (Sales, Purchasing, Inventory, POS, Payments, Reports) using **Clean Architecture (4 layers)** and **CQRS with MediatR**.",
      "Implemented **ledger-based inventory** with an append-only InventoryTransaction table and materialized StockBalance view — eliminating race conditions and enabling full audit trails.",
      "Built **RBAC + ABAC** authorization: 25 permissions, 4 roles, warehouse-scoped access in JWT claims, enforced via a custom RequirePermission attribute.",
      "Engineered **offline-first POS** terminal with **Dexie.js** queues sales in IndexedDB, auto-syncs on reconnect.",
      "**PostgreSQL Row-Level Security** via EF Core interceptor, and **global tenant query filters**.",
    ],
    images: [pos, pos_terminal],
    live_demo_link: "https://pos.devsfleet.com",
    demo_login: "demo@demo.com",
    demo_password: "Demo123!",
  },

  {
    name: "ISP Management SaaS Platform",
    slug: "isp-management-saas-platform",
    description:
      "Multi-tenant SaaS for ISP management with role-based JWT authentication, company-level data isolation, MikroTik RouterOS control for PPPoE provisioning, and automated billing with cron jobs.",
    tags: [
      { name: "Angular",    color: "blue-text-gradient"   },
      { name: "Nest.Js",    color: "blue-text-gradient"   },
      { name: "PostgreSQL", color: "blue-text-gradient"   },
      { name: "Redis",    color: "blue-text-gradient"   },
      { name: "TypeScript", color: "blue-text-gradient"   },
      { name: "Mikrotik", color: "blue-text-gradient"   },
      { name: "Docker",     color: "white-text-gradient"  },
    ],
    points: [
      "Architected a multi-tenant ISP SaaS platform with 4 distinct layers (UI, Application, Domain, Infrastructure) and clean separation of concerns.",
      "Engineered role-based access control (RBAC) with 3 primary roles (Owner, Admin, Staff), company-level tenant isolation, and role-scoped JWT claims.",
      "Built a billing & subscription management engine with monthly + daily billing cycles, automated renewal cron jobs, and payment tracking.",
      "Integrated **MikroTik RouterOS API** to manage customer PPPoE sessions, bandwidth profiles, and service activation/deactivation.",
      "Implemented real-time monitoring dashboard with Redis-powered customer tracking, active session lists, and usage graphs.",
      "Optimized performance using Redis caching for hot data (customers, packages), background queues for heavy operations, and idempotent API design.",
      "Built a scalable backend in **Nest.js + TypeScript** with modular architecture, JWT authentication, and PostgreSQL ORM.",
      "Developed a feature-rich **Angular** admin portal with NgRx state management, dynamic forms, and comprehensive CRUD interfaces.",
      "Dockerized the entire stack with docker-compose for easy deployment and environment consistency."
    ],
    images: [isp, isp_mobile],
    live_demo_link: "https://isp.devsfleet.com",
    demo_login: "demo",
    demo_password: "123456"
  },

  {
    name: "Chat Application",
    slug: "chat-application",
    description:
      "Real-time chat platform with private messaging, group chat, and file sharing. NestJS backend, Socket.IO for live communication, React frontend, and JWT authentication.",
    tags: [
      { name: "Nest.Js",     color: "blue-text-gradient"   },
      { name: "Socket.IO",  color: "orange-text-gradient" },
      { name: "MongoDB",    color: "green-text-gradient"  },
      { name: "React",      color: "white-text-gradient"  },
      { name: "TypeScript", color: "blue-text-gradient"   },
    ],
    points: [
      "Built a **real-time messaging** platform with **Socket.IO** — private 1-to-1 chat, group conversations, and live presence indicators.",
      "Secured both REST and WebSocket gateways with **JWT authentication** and authorization guards.",
      "Added **file & media sharing** with upload handling and message persistence in **MongoDB**.",
      "Structured the **NestJS** backend into modular gateways, services, and DTO validation for maintainability.",
    ],
    image: chat_app,
    source_code_link: "https://github.com/Khaledr001/chat-app.git",
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
    points: [
      "Developed a full-stack **single-vendor e-commerce** app with role-based **JWT authentication**.",
      "Built multi-category product listings with **cart and checkout** flows and order management.",
      "Created an **admin panel** for inventory, product, and order administration.",
      "Responsive **React + Tailwind CSS** frontend backed by a **Node.js / MongoDB** REST API.",
    ],
    image: eCommerce,
    source_code_link: "https://github.com/Khaledr001/eCommerce",
  },
];
