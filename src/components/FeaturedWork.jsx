import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { eCommerce } from "../assets";

const FeaturedWork = () => {
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
      <img
        src={eCommerce}
        alt="Featured project preview"
        className="mx-auto h-full w-full rounded-2xl object-cover object-left-top"
        draggable={false}
      />
    </ContainerScroll>
  );
};

export default FeaturedWork;
