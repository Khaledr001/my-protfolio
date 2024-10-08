import { useEffect, useState } from "react";
import "./App.css";
// import Home from "./pages/home";
import Design from "./components/particle";
import Home from "./pages/home";
import Projects from "./components/projects";
import Carosole from "./components/carosole";
import Contact from "./components/contact";
import Footer from "./components/footer";


function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") ? localStorage.getItem("theme")! : "light"
  );

  // const handleToggle = (e: ChangeEvent<HTMLInputElement>): void => {
  //   if (e.target.checked) setTheme("dark");
  //   else setTheme("light");
  // };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme") ?? "light";
    document.querySelector("html")?.setAttribute("data-theme", localTheme);
  }, [theme]);

  return (
    <>
      <div className="bg-gray-800">
        <div
          className={`background-container ${theme} w-full h-full bg-banner-bg bg-no-repeat bg-center bg-cover overflow-hidden`}>
          {/* <Navbar />
        <Projects /> */}
          {/* <canvas className="  h-full w-full z-[-1]"> */}
          {/* <div className="relative"> */}

          <div className="relative w-full h-full">
            <div className="w-full h-screen  top-0 left-0 bottom-0 right-0 absolute">
              <Design />
            </div>
          </div>
          <div className=" mx-auto text-white ">
            <Home />
          </div>
        </div>
        {/* </div> */}
        {/* </canvas> */}
        <div id="hello">
          <Projects />
        </div>
        {/* <div>
          <Carosole />
        </div> */}
        <div>
          <Contact />
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
