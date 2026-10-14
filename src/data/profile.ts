// ─────────────────────────────────────────────────────────────────────────────
// Personal facts used across the site. Sources: the resume PDF in
// src/assets/resume and the previous version of this portfolio.
// ─────────────────────────────────────────────────────────────────────────────
import resumeUrl from "@/assets/resume/Syed_Khaled_Hossain_Resume.pdf";

export type SocialId = "github" | "linkedin" | "x";

export interface SocialLink {
  id: SocialId;
  label: string;
  handle: string;
  href: string;
}

export const profile = {
  name: "Syed Khaled Hossain",
  initials: "SKH",
  title: "Software Engineer",
  location: "Dubai, UAE",
  email: "syedkhaled.h01@gmail.com",
  site: "https://syedkhaled.netlify.app/",
  resumeUrl: resumeUrl as string,
  resumeFileName: "Syed_Khaled_Hossain_Resume.pdf",
} as const;

export const socials: SocialLink[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "in/khaled01",
    href: "https://www.linkedin.com/in/khaled01",
  },
  {
    id: "github",
    label: "GitHub",
    handle: "Khaledr001",
    href: "https://github.com/Khaledr001",
  },
  {
    id: "x",
    label: "X",
    handle: "@Khaled01534838",
    href: "https://x.com/Khaled01534838",
  },
];

export const heroStack = ["TypeScript", "NestJS", "PostgreSQL", "React", "AI / RAG"];

/** Headline numbers for the About section — every value is on the resume. */
export const facts = [
  {
    value: "~3",
    unit: "yrs",
    label: "Shipping production software",
    detail: "Backend-first, since 2023",
  },
  {
    value: "4",
    unit: "domains",
    label: "SaaS · ERP · CRM · Marketplace",
    detail: "Backends built for each",
  },
  {
    value: "1,100+",
    unit: "",
    label: "Algorithmic problems solved",
    detail: "Codeforces 700+, LeetCode 200+",
  },
  {
    value: "RAG",
    unit: "",
    label: "Applied AI, hands-on",
    detail: "LLM APIs, embeddings, pgvector",
  },
] as const;

export const principles = [
  {
    title: "Isolation first",
    body: "Multi-tenant systems where every query is scoped, every role is explicit, and one customer's data never reaches another's.",
  },
  {
    title: "Contracts over coupling",
    body: "Clear API design and event-driven services, so components can change without breaking each other.",
  },
  {
    title: "Measure, then optimize",
    body: "Indexing, N+1 elimination and schema work driven by real query patterns, not guesswork.",
  },
  {
    title: "AI, grounded",
    body: "LLM features backed by retrieval, embeddings and pgvector, so answers come from the right data.",
  },
] as const;
