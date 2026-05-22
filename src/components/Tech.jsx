import { technologies } from "../constants";
import { SectionWrapper } from "../hoc";
import { BallCanvas } from "./canvas";

const Tech = () => <BallCanvas technologies={technologies} />;

export default SectionWrapper(Tech, "");
