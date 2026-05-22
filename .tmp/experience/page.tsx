import type { Metadata } from "next";
import { getExperiencePage } from "@/lib/api/experience";
import { ImgOrVideoHero } from "@/components/common/img-video-hero";
import { CircularScroll } from "@/components/experience/circular-scroll";
import { buildMetadata } from "@/lib/utils/seo";
import type { ExperiencePage, ExperienceStep } from "@/lib/types/strapi";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await getExperiencePage();
    const data = res.data;
    return buildMetadata({
      seo: data.seo,
      fallbackTitle: data.heroTitle ?? "The Mazarini Experience",
      fallbackDescription: data.heroText ?? "Decades of expertise, landmark projects, and a relentless pursuit of construction excellence — that's the Mazarini experience.",
      fallbackImage: data.heroImage,
    });
  } catch {
    return buildMetadata({
      fallbackTitle: "The Mazarini Experience",
      fallbackDescription: "Decades of expertise, landmark projects, and a relentless pursuit of construction excellence — that's the Mazarini experience.",
    });
  }
}

const FALLBACK_PAGE: ExperiencePage = {
  id: 0,
  documentId: "",
  heroTitle: "Our Experience",
  heroText: "Discover how we deliver exceptional results at every stage.",
  heroVideo: null,
  heroImage: null,
  heroCtaText: null,
  heroCtaUrl: null,
  experience_steps: [],
};

const FALLBACK_STEPS: ExperienceStep[] = [
  {
    id: 1,
    documentId: "1",
    title: "Consideration",
    description:
      "When there's a new project on the horizon, our clients feel comfortable calling upon us because they know we're here to help, even if we're not selected to build the project. Deep relationships with our clients and partners are the heart of our approach, and we're humbled to be considered your trusted advisors.",
    image: null,
    ctaText: "Learn More",
    ctaUrl: "/experience/consideration",
    order: 0,
  },
  {
    id: 2,
    documentId: "2",
    title: "Project Award",
    description:
      "Once selected, we hit the ground running. Our award process ensures a seamless transition from selection to execution, with clear communication and defined expectations from day one.",
    image: null,
    ctaText: "Learn More",
    ctaUrl: "/experience/project-award",
    order: 1,
  },
  {
    id: 3,
    documentId: "3",
    title: "Preconstruction",
    description:
      "Our preconstruction team works hand-in-hand with you to refine the vision, optimize the budget, and create a roadmap for success. We believe that great buildings start with great planning.",
    image: null,
    ctaText: "Learn More",
    ctaUrl: "/experience/preconstruction",
    order: 2,
  },
  {
    id: 4,
    documentId: "4",
    title: "Construction",
    description:
      "The best part of our job is bringing the project vision to fruition. You can expect incredible communication to keep you informed of challenges (and solutions!) as well as construction progress. We're obsessed with the details and getting the job done safely and exactly right, the first time, every time.",
    image: null,
    ctaText: "Learn More",
    ctaUrl: "/experience/construction",
    order: 3,
  },
  {
    id: 5,
    documentId: "5",
    title: "Post-construction",
    description:
      "Our commitment doesn't end when the building opens. We provide comprehensive post-construction support to ensure everything performs as intended, maintaining the relationships that matter most.",
    image: null,
    ctaText: "Learn More",
    ctaUrl: "/experience/post-construction",
    order: 4,
  },
];

export default async function Experience(): Promise<React.ReactElement> {
  let page: ExperiencePage = FALLBACK_PAGE;

  try {
    const res = await getExperiencePage();
    if (res.data) {
      page = res.data;
    }
  } catch {
    // Strapi unavailable — render with fallback data
  }

  const steps =
    page.experience_steps.length > 0 ? page.experience_steps : FALLBACK_STEPS;

  // Sort by order
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

  return (
    <>
      {/* <ImgOrVideoHero
        title={page.heroTitle}
        text={page.heroText ?? ""}
        heroVideo={page.heroVideo}
        heroImage={page.heroImage}
      /> */}

      <CircularScroll steps={sortedSteps} />
    </>
  );
}
