import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
  ReviewStars,
} from "@/components/ui/animated-cards-stack";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock testimonials — replace with real client/colleague feedback when available.
const TESTIMONIALS = [
  {
    id: "t-1",
    name: "James Sullivan",
    profession: "Engineering Manager, Sidago",
    rating: 5,
    description:
      "Khaled architected our headless CMS platform end-to-end. Clean APIs, thoughtful system design, and he ships fast without cutting corners.",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=60",
  },
  {
    id: "t-2",
    name: "Jessica Huang",
    profession: "Product Designer",
    rating: 4.5,
    description:
      "A rare full-stack engineer who genuinely cares about UX. He turned ambiguous designs into a polished, responsive product.",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60",
  },
  {
    id: "t-3",
    name: "Liam Morgan",
    profession: "CTO, Soft Insights Ltd",
    rating: 5,
    description:
      "Our ISP backend handles real production load thanks to Khaled. RabbitMQ pipelines, MikroTik integrations, payments — all rock solid.",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=60",
  },
  {
    id: "t-4",
    name: "Aisha Rahman",
    profession: "Frontend Lead",
    rating: 4.5,
    description:
      "Strong communicator and a true problem solver. His algorithmic background shows in how cleanly he reasons through complex features.",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=60",
  },
];

const Testimonials = () => {
  return (
    <section className="px-6 py-12 sm:px-8">
      <div>
        <p className="text-center text-sm uppercase tracking-[0.25em] text-secondary">
          What people say
        </p>
        <h2 className="mt-2 text-center text-4xl font-bold text-white md:text-[3rem]">
          Testimonials
        </h2>
      </div>

      <ContainerScroll className="container mx-auto h-[300vh]">
        <div className="sticky left-0 top-0 flex h-svh w-full items-center justify-center py-12">
          <CardsContainer className="mx-auto h-[450px] w-[320px] sm:w-[360px]">
            {TESTIMONIALS.map((testimonial, index) => (
              <CardTransformed
                key={testimonial.id}
                arrayLength={TESTIMONIALS.length}
                index={index + 2}
                variant="light"
                role="article"
                aria-label={`Testimonial from ${testimonial.name}`}
              >
                <div className="flex flex-col items-center space-y-4 text-center">
                  <ReviewStars
                    className="text-[var(--accent)]"
                    rating={testimonial.rating}
                  />
                  <blockquote className="mx-auto w-4/5 text-lg leading-relaxed text-white/90">
                    {testimonial.description}
                  </blockquote>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="!size-12 border border-white/15">
                    <AvatarImage
                      src={testimonial.avatarUrl}
                      alt={`Portrait of ${testimonial.name}`}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <span className="block text-lg font-semibold tracking-tight text-white">
                      {testimonial.name}
                    </span>
                    <span className="block text-sm text-secondary">
                      {testimonial.profession}
                    </span>
                  </div>
                </div>
              </CardTransformed>
            ))}
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  );
};

export default Testimonials;
