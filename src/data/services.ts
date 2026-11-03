// Services offered, as chosen by the site owner. Each one points to work that
// demonstrates it; keep those links to real projects only.

export type ServiceTone = "terracotta" | "ochre" | "olive" | "sky";
export type ServiceIcon = "server" | "building" | "brain" | "app";

export interface ServiceProof {
  label: string;
  /** Internal route (case study) or in-page anchor. */
  href: string;
}

export interface Service {
  id: string;
  title: string;
  summary: string;
  points: string[];
  stack: string[];
  proof: ServiceProof[];
  tone: ServiceTone;
  icon: ServiceIcon;
}

export const services: Service[] = [
  {
    id: "backend",
    title: "Backend & API development",
    summary: "Production-ready services and APIs that other teams and apps can build on.",
    points: [
      "Modular NestJS and Node.js services with typed, validated contracts",
      "Authentication, roles and secure, signed webhook integrations",
      "Payment gateways, background jobs and event-driven messaging",
    ],
    stack: ["NestJS", "Node.js", "TypeScript", "PostgreSQL", "RabbitMQ"],
    proof: [
      { label: "Technician Marketplace", href: "#work" },
      { label: "Multi-Brand Sales CRM", href: "#work" },
    ],
    tone: "terracotta",
    icon: "server",
  },
  {
    id: "saas",
    title: "SaaS & multi-tenant systems",
    summary: "Platforms where many companies share one system without ever sharing data.",
    points: [
      "Tenant isolation enforced in queries and at the database level",
      "Role and permission models (RBAC / ABAC) that scale with the product",
      "Billing, subscription and renewal engines",
    ],
    stack: ["Multi-tenancy", "RBAC / ABAC", "CQRS", "PostgreSQL", "MongoDB"],
    proof: [
      { label: "ISP Management Platform", href: "/projects/isp-management-saas-platform" },
      { label: "POS & Inventory (ERP)", href: "/projects/pos-inventory-management-system" },
    ],
    tone: "ochre",
    icon: "building",
  },
  {
    id: "ai",
    title: "AI integration (LLM / RAG)",
    summary: "LLM features inside your product, grounded in your own data rather than guesswork.",
    points: [
      "Retrieval-augmented generation over your documents and records",
      "Embeddings and vector search with PostgreSQL + pgvector",
      "Tool calling and agent workflows behind your existing APIs",
    ],
    stack: ["LLM APIs", "RAG", "pgvector", "Embeddings", "Tool calling"],
    proof: [{ label: "Tenant-Aware AI Assistant (personal build)", href: "#work" }],
    tone: "olive",
    icon: "brain",
  },
  {
    id: "fullstack",
    title: "Full-stack web apps",
    summary: "End-to-end products, from the database schema to the screen your users see.",
    points: [
      "React / Next.js or Angular frontends on a solid backend",
      "Query optimisation and indexing for fast, predictable APIs",
      "Docker-based deployment with CI/CD",
    ],
    stack: ["React", "Next.js", "Angular", "Docker", "CI/CD"],
    proof: [
      { label: "Mazarini", href: "/projects/mazarini" },
      { label: "POS & Inventory (ERP)", href: "/projects/pos-inventory-management-system" },
    ],
    tone: "sky",
    icon: "app",
  },
];
