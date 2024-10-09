import { motion } from "framer-motion";
import React from "react";
import { Tilt } from "react-tilt";

import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { styles } from "../style";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className="xs:w-[250px] w-full">
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card">
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
        <img
          src={icon}
          alt="web-development"
          className="w-16 h-16 object-contain"
        />

        <h3 className="text-white text-[20px] font-bold text-center">
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <div className="flex justify-center items-center">
      <div>
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>Introduction</p>
          <h2 className={styles.sectionHeadText}>Overview.</h2>
        </motion.div>

        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]">
          <p className="text-justify">
            I am a backend developer with expertise in{" "}
            <span className="text-[#FAB75A]">Node.js</span> specializing in
            building high-performance, scalable server-side applications. With
            deep knowledge of NoSQL databases like{" "}
            <span className="text-[#FAB75A]">MongoDB</span> and relational
            databases like <span className="text-[#FAB75A]">MySQL </span>. I
            also have experience with{" "}
            <span className="text-[#FAB75A]">.NET </span>
            technologies, allowing me to develop cross-platform,
            enterprise-level applications.{" "}
          </p>
          <p className="text-justify mt-4">
            On the frontend, I am proficient in{" "}
            <span className="text-[#FAB75A]">React.js </span> where I create
            dynamic, responsive user interfaces that integrate smoothly with
            backend services. My full-stack capabilities enable me to oversee
            the entire development process from database management and API
            development to frontend implementation.{" "}
          </p>
          <p className="text-justify mt-4">
            Inaddition to development, I have a strong understanding of system
            architecture and design patterns. I focus on crafting scalable,
            maintainable architectures that ensure smooth performance, security,
            and fault tolerance across distributed systems. With experience in
            designing <span className="text-[#FAB75A]">microservices</span>,{" "}
            <span className="text-[#FAB75A]">RESTful APIs</span> , and{" "}
            <span className="text-[#FAB75A]">event-driven architectures</span> ,
            I am able to develop systems that are robust and easy to extend.
          </p>
        </motion.p>

        <div className="mt-20 flex flex-wrap gap-10">
          {services.map((service, index) => (
            <ServiceCard key={service.title} index={index} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");
