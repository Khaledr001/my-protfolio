import { useNavigate } from "react-router-dom";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { projects } from "../constants";
import { rippleNavigate } from "../utils/ripple";

// Pick the project flagged `featured`, else fall back to the first project.
const featured = projects.find((p) => p.featured) ?? projects[0];
const cover = featured.image || featured.images?.[0];

const FeaturedWork = () => {
  const navigate = useNavigate();

  const goToProject = (e) => {
    rippleNavigate(navigate, e.clientX, e.clientY, `/projects/${featured.slug}`);
  };

  return (
    <ContainerScroll
      titleComponent={
        <>
          <p className="text-sm uppercase tracking-[0.25em] text-secondary">
            A glimpse of my work
          </p>
          <h2 className="mt-3 text-4xl font-bold leading-none text-white md:text-[5rem]">
            Featured <span className="text-[var(--accent)]">Work</span>
          </h2>
        </>
      }
    >
      <div
        onClick={goToProject}
        role="link"
        tabIndex={0}
        aria-label={`View ${featured.name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter") goToProject(e);
        }}
        className="group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl"
      >
        <img
          src={cover}
          alt={featured.name}
          className="h-full w-full object-cover object-left-top transition-transform duration-500 group-hover:scale-105"
          draggable={false}
        />
        {/* Hover overlay with project name + CTA */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/25 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-8">
          <h3 className="text-xl font-bold text-white sm:text-3xl">
            {featured.name}
          </h3>
          <span className="mt-1 text-sm font-semibold text-[var(--accent)]">
            View project →
          </span>
        </div>
      </div>
    </ContainerScroll>
  );
};

export default FeaturedWork;
