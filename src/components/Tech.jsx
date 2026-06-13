import { technologies } from "../constants";
import { SectionWrapper } from "../hoc";
import { styles } from "../style";
import { MarketingBadges } from "@/components/ui/marketing-badges";

// Scattered "sticker pile" layout + colors, applied to the tech list in order.
const layout = [
  { size: "lg", rotation: -4, offsetX: -110, offsetY: -85, color: "from-blue-400 to-blue-500" },
  { size: "md", rotation: 3, offsetX: 75, offsetY: -95, color: "from-amber-300 to-yellow-400" },
  { size: "lg", rotation: 2, offsetX: -135, offsetY: 5, color: "from-green-400 to-green-500" },
  { size: "lg", rotation: -2, offsetX: 130, offsetY: -15, color: "from-sky-300 to-cyan-400" },
  { size: "md", rotation: -3, offsetX: 0, offsetY: -25, color: "from-emerald-400 to-green-500" },
  { size: "sm", rotation: 4, offsetX: 110, offsetY: 80, color: "from-teal-300 to-cyan-400" },
  { size: "md", rotation: -2, offsetX: -85, offsetY: 90, color: "from-sky-400 to-blue-500" },
  { size: "sm", rotation: 3, offsetX: 25, offsetY: 110, color: "from-orange-400 to-orange-500" },
];

const skillBadges = technologies.map((tech, index) => {
  const preset = layout[index % layout.length];
  return {
    id: tech.name,
    label: tech.name,
    zIndex: index + 1,
    ...preset,
  };
});

const Tech = () => {
  return (
    <>
      <div className="text-center">
        <p className={styles.sectionSubText}>What I work with</p>
        <h2 className={styles.sectionHeadText}>Skills &amp; Tech.</h2>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="origin-center scale-[0.72] sm:scale-90 md:scale-100">
          <MarketingBadges badges={skillBadges} className="w-[420px]" />
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "");
