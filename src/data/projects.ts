// ─────────────────────────────────────────────────────────────────────────────
// Projects. `featuredProjects` drive the "Selected systems" chapters on the
// home page; `caseStudies` drive /projects/:slug and the "More work" index.
// Only link to destinations that exist; never add metrics that aren't on the
// resume.
// ─────────────────────────────────────────────────────────────────────────────
import {
  chat_app,
  eCommerce,
  isp,
  isp_mobile,
  mazarini,
  mazarini1,
  mazarini_mobile,
  pos,
  pos_terminal,
} from "@/assets";

export type ProjectVisual = "isp" | "crm" | "marketplace" | "rag";

export interface ProjectLink {
  label: string;
  href: string;
  /** Internal routes use the router; everything else opens in a new tab. */
  internal?: boolean;
}

export interface FeaturedProject {
  id: string;
  code: string;
  title: string;
  context: string;
  status: "production" | "personal";
  summary: string;
  problem: string;
  solution: string;
  architecture: string[];
  highlights: string[];
  stack: string[];
  note?: string;
  links: ProjectLink[];
  accent: string;
  visual: ProjectVisual;
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: "isp",
    code: "A",
    title: "ISP Management Platform",
    context: "Production SaaS · Bright Technology",
    status: "production",
    summary:
      "A multi-company ISP management and billing platform with role-based permissions, customer billing, payment workflows and MikroTik integration.",
    problem:
      "Internet service providers were running subscribers, router provisioning and monthly billing as separate manual steps, and several companies needed one platform without ever seeing each other's data.",
    solution:
      "A multi-tenant SaaS with company-level data isolation and RBAC, where billing, renewals and network provisioning run as one workflow against the MikroTik RouterOS API.",
    architecture: [
      "Tenant-scoped REST API",
      "Company-isolated MongoDB",
      "Cron billing & renewals",
      "bKash payments",
      "RouterOS API → PPPoE",
    ],
    highlights: [
      "PPPoE provisioning, bandwidth throttling and network monitoring through the RouterOS API, automating 80%+ of previously manual ISP operations.",
      "Automated billing and renewal engine with multi-payment support, including bKash mobile payments.",
      "JWT, bcrypt, Swagger and modular RBAC across every API surface.",
    ],
    stack: ["Node.js", "Express", "TypeScript", "MongoDB", "MikroTik"],
    note: "Later rebuilt as a public demo on NestJS, Angular, PostgreSQL and Redis.",
    links: [
      { label: "Case study", href: "/projects/isp-management-saas-platform", internal: true },
      { label: "Live demo", href: "https://isp.devsfleet.com" },
    ],
    accent: "#F2A65A",
    visual: "isp",
  },
  {
    id: "crm",
    code: "B",
    title: "Multi-Brand Sales CRM",
    context: "Production backend · Sidago Inc",
    status: "production",
    summary:
      "A sales CRM with timezone-prioritized calling queues, lead-state transitions, follow-up scheduling, reporting APIs, signed webhooks and asynchronous RabbitMQ events.",
    problem:
      "Sales teams working several brands from one system have to call the right lead at the right local time, keep every lead in a consistent state, and keep other systems in sync.",
    solution:
      "A NestJS backend that orders calling queues by each lead's time zone, models the lead lifecycle as explicit state transitions, schedules follow-ups and publishes domain events over RabbitMQ.",
    architecture: [
      "Brand-scoped NestJS modules",
      "PostgreSQL + Drizzle ORM",
      "Timezone-aware call queues",
      "Lead state transitions",
      "RabbitMQ events",
      "HMAC-signed webhooks",
    ],
    highlights: [
      "Calling queues prioritized by each lead's local time zone.",
      "Lead lifecycle modeled as explicit state transitions, with scheduled follow-ups and reporting APIs.",
      "Outbound webhooks signed with HMAC-SHA256 so receivers can verify origin and integrity.",
    ],
    stack: ["NestJS", "PostgreSQL", "Drizzle ORM", "RabbitMQ", "HMAC-SHA256"],
    links: [],
    accent: "#4FD1C5",
    visual: "crm",
  },
  {
    id: "marketplace",
    code: "C",
    title: "Technician Marketplace",
    context: "Production · Bizreflex — TekomoPro",
    status: "production",
    summary:
      "A technician marketplace with backend APIs, event-driven integrations, messaging, object storage and order-processing improvements.",
    problem:
      "A work-order marketplace where core services and third-party integrations had to stay in sync, and where the order service had to stay fast under production load.",
    solution:
      "RabbitMQ and NATS events decoupled three core services and moved webhook handling off the request path; the order service was reworked at the query and schema level; files moved to S3.",
    architecture: [
      "Angular client",
      "NestJS REST APIs",
      "Order service · PostgreSQL",
      "RabbitMQ + NATS events",
      "Async webhooks",
      "AWS S3 storage",
    ],
    highlights: [
      "~30% faster Order Service responses under production load from indexing, N+1 elimination and schema normalization.",
      "Three core services decoupled through RabbitMQ and NATS events.",
      "S3 replaced local disk, so the service scales horizontally without state concerns.",
    ],
    stack: ["NestJS", "Angular", "NATS", "RabbitMQ", "S3"],
    links: [],
    accent: "#8AB4F8",
    visual: "marketplace",
  },
  {
    id: "ai-assistant",
    code: "D",
    title: "Tenant-Aware AI Assistant",
    context: "Personal build · Applied AI",
    status: "personal",
    summary:
      "An AI support assistant that uses retrieval and vector search to ground its answers in the relevant tenant's data.",
    problem:
      "A support assistant on a multi-tenant product is only useful if its answers come from the right customer's data, and never from anyone else's.",
    solution:
      "Retrieval-augmented generation over tenant-scoped embeddings in PostgreSQL and pgvector: the question is embedded, the search is filtered to the tenant, and the LLM answers from the retrieved context.",
    architecture: [
      "Question",
      "Embedding",
      "Tenant-filtered pgvector search",
      "Context assembly",
      "LLM API",
      "Grounded answer",
    ],
    highlights: [
      "Tenant filter applied at retrieval time, so context never crosses tenant boundaries.",
      "Embeddings live next to relational data in PostgreSQL with pgvector.",
      "Answers are grounded in retrieved documents rather than the model's general knowledge.",
    ],
    stack: ["LLM APIs", "RAG", "PostgreSQL", "pgvector", "Embeddings"],
    note: "A personal project for learning applied AI, not a deployed product.",
    links: [],
    accent: "#E9C46A",
    visual: "rag",
  },
];

// ── Case studies (/projects/:slug) ──────────────────────────────────────────

/** A product screenshot; dimensions reserve space so frames don't shift. */
export interface Screen {
  src: string;
  device: "desktop" | "mobile";
  width: number;
  height: number;
}

const desktop = (src: string, width = 1920, height = 864): Screen => ({ src, device: "desktop", width, height });
const mobile = (src: string, width = 430, height = 757): Screen => ({ src, device: "mobile", width, height });

export interface CaseStudy {
  slug: string;
  name: string;
  kind: string;
  description: string;
  note?: string;
  tags: string[];
  points: string[];
  screens: Screen[];
  liveUrl?: string;
  sourceUrl?: string;
  demoLogin?: string;
  demoPassword?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "pos-inventory-management-system",
    name: "POS & Inventory Management",
    kind: "ERP platform",
    description:
      "A 15-module ERP covering sales, purchasing, inventory, POS, payments and reports, built on Clean Architecture and CQRS, with an offline-first POS terminal.",
    tags: ["ASP.NET Core", "C#", "Angular", "PostgreSQL", "CQRS", "MediatR", "Dexie.js", "Docker"],
    points: [
      "Architected a **15-module ERP** (Sales, Purchasing, Inventory, POS, Payments, Reports) using **Clean Architecture (4 layers)** and **CQRS with MediatR**.",
      "Implemented **ledger-based inventory** with an append-only InventoryTransaction table and a materialized StockBalance view, eliminating race conditions and keeping a full audit trail.",
      "Built **RBAC + ABAC** authorization: 25 permissions, 4 roles and warehouse-scoped access in JWT claims, enforced by a custom RequirePermission attribute.",
      "Engineered an **offline-first POS** terminal with **Dexie.js** that queues sales in IndexedDB during outages and syncs on reconnect.",
      "**PostgreSQL Row-Level Security** through an EF Core interceptor, plus **global tenant query filters**.",
    ],
    screens: [desktop(pos, 1918, 859), desktop(pos_terminal, 1918, 866)],
    liveUrl: "https://pos.devsfleet.com",
    demoLogin: "demo@demo.com",
    demoPassword: "Demo123!",
  },
  {
    slug: "isp-management-saas-platform",
    name: "ISP Management SaaS Platform",
    kind: "Multi-tenant SaaS",
    description:
      "Multi-tenant SaaS for ISP management with role-based JWT authentication, company-level data isolation, MikroTik RouterOS control for PPPoE provisioning, and automated billing.",
    note:
      "This page covers the public demo rebuild (NestJS · Angular · PostgreSQL · Redis). The original production platform at Bright Technology ran on Node.js, Express, TypeScript and MongoDB.",
    tags: ["NestJS", "Angular", "PostgreSQL", "Redis", "TypeScript", "MikroTik", "Docker"],
    points: [
      "Multi-tenant architecture with four layers (UI, Application, Domain, Infrastructure) and clear separation of concerns.",
      "**RBAC** with three primary roles (Owner, Admin, Staff), company-level tenant isolation and role-scoped JWT claims.",
      "Billing and subscription engine with monthly and daily cycles, automated renewal cron jobs and payment tracking.",
      "**MikroTik RouterOS API** integration to manage PPPoE sessions, bandwidth profiles and service activation.",
      "Monitoring dashboard with Redis-backed customer tracking, active session lists and usage graphs.",
      "Redis caching for hot data, background queues for heavy operations and idempotent API design.",
      "Angular admin portal with NgRx state management and dynamic forms; the whole stack runs under docker-compose.",
    ],
    screens: [desktop(isp, 1920, 863), mobile(isp_mobile, 429, 757)],
    liveUrl: "https://isp.devsfleet.com",
    demoLogin: "demo",
    demoPassword: "123456",
  },
  {
    slug: "mazarini",
    name: "Mazarini",
    kind: "Headless CMS platform · Sidago Inc",
    description:
      "A headless CMS platform built with Strapi, Next.js and TypeScript in a monorepo, with configurable content modules, interactive UI and a containerized production deployment.",
    tags: ["Next.js", "Strapi", "TypeScript", "PostgreSQL", "Docker", "Nginx", "Tailwind CSS"],
    points: [
      "Architected a headless CMS on **Strapi, Next.js and TypeScript** in a monorepo, delivering **10+ configurable content modules** for business clients.",
      "Engineered interactive UI components (mega menus, animated hero sections, touch-enabled carousels) with Framer Motion and Tailwind CSS.",
      "Containerized and deployed the full stack with **Docker, PostgreSQL and Nginx**, achieving dev/production parity.",
      "Implemented a technical SEO pipeline: dynamic metadata, sitemap.xml and robots.txt.",
    ],
    screens: [desktop(mazarini, 1920, 866), desktop(mazarini1, 1918, 866), mobile(mazarini_mobile, 431, 757)],
    liveUrl: "https://mazarinigroup.com/",
  },
  {
    slug: "chat-application",
    name: "Chat Application",
    kind: "Real-time messaging",
    description:
      "A real-time chat platform with private messaging, group chat and file sharing: NestJS and Socket.IO on the backend, React on the frontend, JWT throughout.",
    tags: ["NestJS", "Socket.IO", "MongoDB", "React", "TypeScript"],
    points: [
      "**Real-time messaging** with **Socket.IO**: private 1-to-1 chat, group conversations and live presence.",
      "REST and WebSocket gateways secured with **JWT** and authorization guards.",
      "**File and media sharing** with upload handling and message persistence in **MongoDB**.",
      "NestJS backend organised into modular gateways, services and validated DTOs.",
    ],
    screens: [desktop(chat_app, 1598, 730)],
    sourceUrl: "https://github.com/Khaledr001/chat-app",
  },
  {
    slug: "e-commerce-platform",
    name: "E-Commerce Platform",
    kind: "Full-stack web app",
    description:
      "A single-vendor e-commerce app with role-based JWT authentication, multi-category listings, cart and checkout, and an admin panel for inventory and orders.",
    tags: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    points: [
      "Full-stack **single-vendor e-commerce** app with role-based **JWT authentication**.",
      "Multi-category product listings with **cart and checkout** flows and order management.",
      "**Admin panel** for inventory, product and order administration.",
      "Responsive React and Tailwind CSS frontend on a Node.js / MongoDB REST API.",
    ],
    screens: [desktop(eCommerce, 1918, 958)],
    sourceUrl: "https://github.com/Khaledr001/eCommerce",
  },
];

/** Projects listed under "More work" on the home page, in display order. */
export const moreWork = [
  "pos-inventory-management-system",
  "mazarini",
  "chat-application",
  "e-commerce-platform",
]
  .map((slug) => caseStudies.find((c) => c.slug === slug))
  .filter((c): c is CaseStudy => Boolean(c));
