import { ChangeEvent, useEffect, useState } from "react";

const Navbar = () => {
  
  // const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    // setIsDarkMode((prevMode) => !prevMode);
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <>
      <nav>
        <label className="relative inline-block w-[60px] h-[34px]">
          <input
            type="checkbox"
            onChange={toggleTheme}
            className="opacity-0 w-0 h-0 checked:bg-[#2196f3]"
          />
          <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#ccc] transition-[.4s] rounded-[34px] before:absolute before:content-none before:h-[26px] before:w-[26px] before:left-1 before:bottom-1 before:bg-white before:transition-[.4s] checked:bg-[#2196f3] before:checked:translate-x-[26px]"></span>
        </label>
      </nav>
    </>
  );
};

export default Navbar;
