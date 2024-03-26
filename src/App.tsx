import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/nav";
import Projects from "./components/projects";

function App() {

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
      <div className={`background-container ${theme}`}>
        <Navbar />
        <Projects />
      </div>
    </>
  );
}

export default App;
