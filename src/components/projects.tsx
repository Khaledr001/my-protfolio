import React from "react";

const Projects = () => {
  return (
    <>
      <section className="max-w-screen-xl mx-auto px-4 relative pb-8 sm:pb-16">
        <h2 className="text-3xl sm:text-[40px] bg-[#111] relative z-10 font-bold px-4 py-2 w-max mx-auto text-center text-[#1788ae] sm:border-b-2 border-[#1788ae]">
          Latest Works
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 mt-12 sm:gap-[80px] items-center sm:mt-20 relative">
          <div className="w-full">
            <h3 className="text-[#fc815c] font-bold text-2xl md:text-4xl">
              ISP Solution
            </h3>
            <span className="text-[#fc815c] text-base md:text-lg">
              Manage ISP client and admin
            </span>
            <p className="text-justify text-sm md:text-base mt-2 text-gray-200">
              Developed a web app for ISP (Internet service provider) using
              NodeJs and React. I develop the backend architecture. Here are
              some features. <br />
              1. Role based authentication with permission system using jwt.{" "}
              <br />
              2. Multi-Tenant architecture for handling multiple client
              (Companies). <br />
              3. Online Payment Method (BKASH) <br />
              4. Router OS connection and mikrotik controll.
            </p>

            <ul className="flex flex-wrap gap-2 mt-2 text-[#fc815c]">
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #express.js
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #node.js
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #typescript
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #mongoDB
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #mongoose
              </li>
            </ul>
          </div>
          <div className="h-[1px] left-1/2 right-1/4 bg-[#1788ae] absolute top-1/2 hidden sm:block"></div>
          <div className="w-4 h-4 rounded-full border-[3px] border-[#ffe578] absolute left-1/2 -translate-x-1/2 bg-[#111] z-10 hover:scale-110 ease-in-out duration-100 hidden sm:block"></div>
          <a
            target="blank"
            href="https://ispadmin.softinsightsltd.com/"
            className="order-1 sm:order-2 flex w-full relative justify-center sm:justify-start">
            <div className="flex flex-col items-center relative group sm:hover:scale-105 ease-in-out duration-200 sm:ml-auto">
              <img
                className="max-w-[450px] w-full relative z-10 drop-shadow-[0_0px_60px_rgba(59,130,246,0.6)]"
                src="../../public/assets/projects/softinsights.jpg"
                alt=""
              />
              <span className="flex group-hover:-top-14 ease-jump duration-200 text-black bg-[#ffe578] sm:absolute left-1/2 sm:-translate-x-1/2 top-5 px-2 py-1 text-sm sm:text-base mt-2 rounded w-max items-center gap-1 after:hidden sm:after:block after:w-4 after:h-4 after:bg-inherit after:absolute after:left-1/2 after:-translate-x-1/2 after:rotate-45 after:-bottom-2">
                E-Wallet
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="feather feather-external-link">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </span>
            </div>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 sm:gap-[80px] items-center sm:mt-20 relative">
          <div className="h-[1px] left-1/4 right-1/2 bg-[#1788ae] absolute top-1/2 hidden sm:block"></div>
          <div className="w-4 h-4 rounded-full border-[3px] border-[#459bd5] absolute left-1/2 -translate-x-1/2 bg-[#111] z-10 hover:scale-110 ease-in-out duration-100 hidden sm:block"></div>
          <a
            target="blank"
            href="https://github.com/Khaledr001/eCommerce"
            className="flex w-full relative justify-center sm:justify-start">
            <div className="flex flex-col items-center relative group sm:hover:scale-105 ease-in-out duration-200">
              <img
                className="max-w-[450px] w-full mr-auto relative z-10 drop-shadow-[0_0px_60px_rgba(59,130,246,0.6)]"
                src="../../public/assets/projects/ecommerce.png"
                alt=""
              />
              <span className="flex group-hover:-top-14 ease-jump duration-200 bg-[#459bd5] sm:absolute left-1/2 sm:-translate-x-1/2 top-5 px-2 py-1 text-sm sm:text-base mt-2 rounded w-max items-center gap-1 after:hidden sm:after:block after:w-4 after:h-4 after:bg-inherit after:absolute after:left-1/2 after:-translate-x-1/2 after:rotate-45 after:-bottom-2">
                E-Commerce
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="feather feather-external-link">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </span>
            </div>
          </a>

          <div className="w-full">
            <h3 className="text-[#459bd5] font-bold text-2xl md:text-4xl">
              E-Commerce
            </h3>
            <span className="text-[#459bd5] text-base md:text-lg">
              E-Commerce Platform
            </span>
            <p className="text-justify text-sm md:text-base mt-2 text-white">
              It's a single vendor e-commerce application.
            </p>

            <ul className="flex flex-wrap gap-2 mt-2 text-[#459bd5]">
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #react.js
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #express.js
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #node.js
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #mongoDB
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #mongoose
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #css
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #tailwind css
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #javascript
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-12 sm:gap-[80px] items-center sm:mt-20 relative">
          <div className="order-2 sm:order-1 w-full">
            <h3 className="text-[#ffe578] font-bold text-2xl md:text-4xl">
              E-Wallet
            </h3>
            <span className="text-[#ffe578] text-base md:text-lg">
              Mobile Application
            </span>
            <p className="text-justify text-sm md:text-base mt-2 text-gray-200">
              It's a mobile application to store your creadit card devit card.
              You can pay with your application.
            </p>

            <ul className="flex flex-wrap gap-2 mt-2 text-[#ffe578]">
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #flutter
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #dart
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #firebase
              </li>
            </ul>
          </div>

          <div className="h-[1px] left-1/2 right-1/4 bg-[#1788ae] absolute top-1/2 hidden sm:block"></div>
          <div className="w-4 h-4 rounded-full border-[3px] border-[#ffe578] absolute left-1/2 -translate-x-1/2 bg-[#111] z-10 hover:scale-110 ease-in-out duration-100 hidden sm:block"></div>
          <a
            target="blank"
            href="https://github.com/Khaledr001/Flutter-E-Wallet/tree/master"
            className="order-1 sm:order-2 flex w-full relative justify-center sm:justify-start">
            <div className="flex flex-col items-center relative group sm:hover:scale-105 ease-in-out duration-200 sm:ml-auto">
              <img
                className="max-w-[550px] w-full relative z-10 drop-shadow-[0_0px_60px_rgba(59,130,246,0.6)]"
                src="../../public/assets/projects/ewallet.png"
                alt=""
              />
              <span className="flex group-hover:-top-14 ease-jump duration-200 text-black bg-[#ffe578] sm:absolute left-1/2 sm:-translate-x-1/2 top-5 px-2 py-1 text-sm sm:text-base mt-2 rounded w-max items-center gap-1 after:hidden sm:after:block after:w-4 after:h-4 after:bg-inherit after:absolute after:left-1/2 after:-translate-x-1/2 after:rotate-45 after:-bottom-2">
                E-Wallet
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="feather feather-external-link">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </span>
            </div>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-12 sm:gap-[80px] items-center sm:mt-20 relative">
          <div className="h-[1px] left-1/4 right-1/2 bg-[#1788ae] absolute top-1/2 hidden sm:block"></div>
          <div className="w-4 h-4 rounded-full border-[3px] border-[#fc815c] absolute left-1/2 -translate-x-1/2 bg-[#111] z-10 hover:scale-110 ease-in-out duration-100 hidden sm:block"></div>
          <a
            href="https://github.com/Khaledr001/Employee-Management-System"
            className="flex w-full relative justify-center sm:justify-start">
            <div className="flex flex-col items-center relative group hover:scale-105 ease-in-out sm:mr-auto duration-200">
              <img
                className="max-w-[400px] w-full mr-auto relative z-10 drop-shadow-[0_0px_60px_rgba(59,130,246,0.6)]"
                src="./assets/images/harigurus.webp"
                alt=""
              />
              <span className="flex group-hover:-top-14 ease-jump duration-200 bg-[#fc815c] sm:absolute left-1/2 sm:-translate-x-1/2 top-5 px-2 py-1 text-sm sm:text-base mt-2 rounded w-max items-center gap-1 after:hidden sm:after:block after:w-4 after:h-4 after:bg-inherit after:absolute after:left-1/2 after:-translate-x-1/2 after:rotate-45 after:-bottom-2">
                Employee Management System
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="feather feather-external-link">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </span>
            </div>
          </a>

          <div className="w-full">
            <h3 className="text-[#fc815c] font-bold text-2xl md:text-4xl">
              Employee Management System
            </h3>
            <span className="text-[#fc815c] text-base md:text-lg">
              Manage your employee
            </span>
            <p className="text-justify text-sm md:text-base mt-2 text-gray-200">
              It's a admin palnel to manage your employee. Their sellary, and
              overall management.
            </p>

            <ul className="flex flex-wrap gap-2 mt-2 text-[#fc815c]">
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #react.js
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #express.js
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #node.js
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #mongoDB
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #mongoose
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #css
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #tailwind css
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #javascript
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-12 sm:gap-[80px] items-center sm:mt-20 relative">
          <div className="order-2 sm:order-1 w-full">
            <h3 className="text-[#47afa1] font-bold text-2xl md:text-4xl">
              To Do Application
            </h3>
            <span className="text-[#47afa1] text-base md:text-lg">
              Todo Task
            </span>
            <p className="text-justify text-sm md:text-base mt-2 text-gray-200">
              Manage your daily activities.
            </p>

            <ul className="flex flex-wrap gap-2 mt-2 text-[#47afa1]">
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #javascript
              </li>
              <li className="border rounded-[50px] border-[#999] px-[10px] py-[5px] text-sm md:text-base">
                #css
              </li>
            </ul>
          </div>
          <div className="h-[1px] left-1/2 right-1/4 bg-[#1788ae] absolute top-1/2 hidden sm:block"></div>
          <div className="w-4 h-4 rounded-full border-[3px] border-[#47afa1] absolute left-1/2 -translate-x-1/2 bg-[#111] z-10 hover:scale-110 ease-in-out duration-100 hidden sm:block"></div>
          <a
            target="blank"
            href="https://khaled-task-manager.surge.sh/"
            className="order-1 sm:order-2 flex w-full relative justify-center sm:justify-start">
            <div className="flex flex-col items-center relative group sm:hover:scale-105 ease-in-out duration-200 sm:ml-auto">
              <img
                className="max-w-[450px] w-full relative z-10 drop-shadow-[0_0px_60px_rgba(59,130,246,0.6)]"
                src="../../public/assets/projects/todo.jpg"
                alt=""
              />
              <span className="flex group-hover:-top-14 ease-jump duration-200 bg-[#47afa1] sm:absolute left-1/2 sm:-translate-x-1/2 top-5 px-2 py-1 text-sm sm:text-base mt-2 rounded w-max items-center gap-1 after:hidden sm:after:block after:w-4 after:h-4 after:bg-inherit after:absolute after:left-1/2 after:-translate-x-1/2 after:rotate-45 after:-bottom-2">
                Todo Application
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="feather feather-external-link">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </span>
            </div>
          </a>
        </div>

        <div className="w-[2px] hidden sm:block bg-[#1788ae] absolute top-0 bottom-0 left-1/2 -translate-x-1/2"></div>
      </section>
    </>
  );
};

export default Projects;
