// Skill groups, rendered as the layers of a system — no proficiency scores.
export interface SkillLayer {
  id: string;
  name: string;
  layer: string;
  summary: string;
  items: string[];
}

export const skillLayers: SkillLayer[] = [
  {
    id: "backend",
    name: "Backend",
    layer: "Service layer",
    summary: "Typed, modular services and the APIs other teams build on.",
    items: [
      "TypeScript",
      "JavaScript",
      "Node.js",
      "NestJS",
      "Express.js",
      "REST APIs",
      "C# · ASP.NET Core",
    ],
  },
  {
    id: "databases",
    name: "Databases",
    layer: "Data layer",
    summary: "Schemas, indexes and queries shaped by how the data is read.",
    items: [
      "PostgreSQL",
      "MongoDB",
      "MySQL",
      "Redis",
      "Prisma",
      "Drizzle",
      "Indexing & query optimization",
    ],
  },
  {
    id: "architecture",
    name: "Architecture",
    layer: "System design",
    summary: "Boundaries that keep tenants, permissions and services apart.",
    items: [
      "Multi-tenancy",
      "Microservices",
      "CQRS",
      "Event-driven architecture",
      "RBAC / ABAC",
      "Data isolation",
    ],
  },
  {
    id: "ai",
    name: "AI",
    layer: "Intelligence layer",
    summary: "LLM features grounded in retrieval rather than guesswork.",
    items: ["LLM APIs", "RAG", "pgvector", "Embeddings", "Tool calling", "AI agents"],
  },
  {
    id: "frontend",
    name: "Frontend",
    layer: "Interface layer",
    summary: "The product surfaces that sit on top of the backend.",
    items: ["React", "Next.js", "Angular", "Tailwind CSS"],
  },
  {
    id: "infrastructure",
    name: "Messaging & infrastructure",
    layer: "Runtime layer",
    summary: "Queues, brokers and the machines everything runs on.",
    items: ["RabbitMQ", "NATS", "BullMQ", "Docker", "Linux", "AWS", "CI/CD"],
  },
];
