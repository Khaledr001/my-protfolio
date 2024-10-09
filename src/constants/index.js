import { title } from "framer-motion/client";
import {
  backend,
  carrent,
  creator,
  css,
  enosis,
  git,
  html,
  javascript,
  jobit,
  mobile,
  mongodb,
  nodejs,
  reactjs,
  rebel_force,
  tailwind,
  threejs,
  tripguide,
  typescript,
  vivasoft,
  web,
  wowgpt,
  employees,
  isp3,
  bustrack,
  devsfleet,
  bdFlag,
  eCommerce,
  eWallet,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "project",
    title: "Project",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "NodeJs Developer",
    icon: web,
  },
  {
    title: "React Developer",
    icon: mobile,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "MySQL",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
];

const experiences = [
  {
    title: "Junior Software Engineer (Backend)",
    company_name: "Bright Technologies Limited",
    project: "ISP Insights - An ISP solution",
    icon: rebel_force,
    iconBg: "#ffffff",
    date: "March 2024 - Present",
    points: [
      "Developing a web app for ISP (Internet service provider) using NodeJs and React.",
      "I develop role based authentication with permission system using jwt. Which allows different users to access different services",
      "Multi-Tenant architecture for handling multiple client. This system reduce the database cost significantly!",
      "This project designed based on clean code architecture. Also integrade online transaction system (BKASH). API validation and so more.",
      "Technologies: TypeScript, React, Tailwind, NodeJs, ExpressJs, MongoDB",
    ],
  },
  {
    title: "Volunteering in a project as a Backend Developer",
    // company_name: "Bright Technologies Limited",
    project: "Telemedicine Service system ",
    icon: devsfleet,
    iconBg: "#ffffff",
    date: "June 2023 - November 2023",
    points: [
      "I have developed a prescription system that allows doctors to easily provide online prescriptions. Patients can view, download, and print the prescription.",

      "I extensively work with regional data from Bangladesh, focusing on District, Sub-District, and Union levels. My goal is to help users quickly find the desired doctor in their preferred location. By using structured regional data, I ensure that the search and filtering processes are efficient and accurate, enabling patients to locate healthcare professionals based on their specific needs and areas.",

      "Technologies - NestJs, PostgreSQL, MongoDB",
    ],
  },
  {
    title: "Programming Trainer",
    company_name:
      "Khadija Memorial Girls High School, Homna, Cumilla, Bangladesh",
    project: 'Teaching programming concepts with "C"',
    icon: bdFlag,
    iconBg: "#ffffff",
    date: "February 2022 - March 2022",
    points: [
      "The Cumilla DC office arranged a training program to educate school and college students about programming concepts.",
      "The curriculum included C Programming, Number Theory, and Problem-Solving, providing students with valuable skills and knowledge in these areas.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "ISP Solution Backend",
    description:
      "Developed a web app for ISP using NodeJs and React. I develop the backend architecture. Here are some features. Role based authentication with permission system using jwt. Multi-Tenant architecture for handling multiple client. Router OS connection and mikrotik controll.",
    tags: [
      {
        name: "Node Js",
        color: "blue-text-gradient",
      },
      {
        name: "MongoDB",
        color: "green-text-gradient",
      },
      {
        name: "Express Js",
        color: "white-text-gradient",
      },
      {
        name: "Typescript",
        color: "blue-text-gradient",
      },
    ],
    image: isp3,
    source_code_link: "https://ispadmin.softinsightsltd.com/",
  },
  {
    name: "E Commerce",
    description:
      "This project is an e-commerce platform designed for a single vendor to sell products directly to customers. It offers an easy-to-use interface where customers can browse, select, and purchase products smoothly. Also include admin panel to manage the system.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "Node Js",
        color: "green-text-gradient",
      },
      {
        name: "Express Js",
        color: "orange-text-gradient",
      },
      {
        name: "MongoDB",
        color: "white-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
      {
        name: "Daisy UI",
        color: "blue-text-gradient",
      },
    ],
    image: eCommerce,
    source_code_link: "https://github.com/Khaledr001/eCommerce",
  },

  {
    name: "Employee Management System",
    description:
      "Web application that enables company admin to maintain their employee information, leave, notice, HR management.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "Node Js",
        color: "green-text-gradient",
      },
      {
        name: "Express Js",
        color: "orange-text-gradient",
      },
      {
        name: "MongoDB",
        color: "white-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
      {
        name: "Daisy UI",
        color: "blue-text-gradient",
      },
    ],
    image: employees,
    source_code_link:
      "https://github.com/Khaledr001/Employee-Management-System",
  },
  {
    name: "E Wallet",
    description:
      "This project is an e-wallet application built using Flutter for the frontend and Firebase for backend services. The app provides a fast, secure, and convenient way for users to manage their funds, save cards, and make digital payments with ease.",
    tags: [
      {
        name: "Flutter",
        color: "blue-text-gradient",
      },
      {
        name: "Dart",
        color: "green-text-gradient",
      },
      {
        name: "Firebase",
        color: "pink-text-gradient",
      },
    ],
    image: eWallet,
    source_code_link: "https://github.com/zahid-ul-islam/Vehicle-Detection",
  },
];

export { experiences, projects, services, technologies, testimonials };
