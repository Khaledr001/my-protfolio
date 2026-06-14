import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { logo } from "../assets";
import { navLinks } from "../constants";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

// Nav link ids → the real section element ids rendered in App.jsx
const sectionMap = {
  about: "s-about",
  project: "s-works",
  work: "s-experience",
  contact: "s-contact",
};

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 70;
  window.scrollTo({ top: y, behavior: "smooth" });
}

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);

  // Scroll-spy: highlight the link whose section is in view
  useEffect(() => {
    const observed = navLinks
      .map((link) => ({ link, el: document.getElementById(sectionMap[link.id]) }))
      .filter((entry) => entry.el);

    if (!observed.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = observed.find((o) => o.el === entry.target);
            if (match) setActive(match.link.title);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    observed.forEach(({ el }) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (link) => {
    setActive(link.title);
    setToggle(false);
    scrollToId(sectionMap[link.id]);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 z-20 w-full bg-transparent"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8 lg:px-12">
          {/* Logo + name */}
          <Link
            to="/"
            className="group flex items-center gap-2.5"
            onClick={() => {
              setActive("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
              <img src={logo} alt="logo" className="h-7 w-7 object-contain" />
              <span className="absolute inset-0 rounded-xl opacity-0 ring-2 ring-[var(--accent)] transition-opacity duration-300 group-hover:opacity-60" />
            </span>
            <p className="hidden text-[15px] font-bold tracking-wide text-white xs:block">
              Syed <span className="text-[var(--accent)]">Khaled</span>
            </p>
          </Link>

          {/* Desktop links — glass pill with animated active indicator */}
          <ul className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md sm:flex">
            {navLinks.map((link) => {
              const isActive = active === link.title;
              return (
                <li key={link.id} className="relative">
                  <a
                    href={`#${sectionMap[link.id]}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link);
                    }}
                    className={`relative block rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-secondary hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-[var(--accent)] shadow-[0_0_18px_-2px_var(--accent)]"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    {link.title}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Right side — CTA (desktop) + hamburger (mobile) */}
          <div className="flex items-center gap-3">
            <LiquidButton
              type="button"
              onClick={() => scrollToId("s-contact")}
              size="sm"
              className="hidden text-white sm:inline-flex"
            >
              Let&apos;s Talk
            </LiquidButton>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setToggle((prev) => !prev)}
              className="relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl border border-white/10 bg-white/5 backdrop-blur-md sm:hidden"
            >
              <motion.span
                animate={toggle ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="block h-[2px] w-5 rounded-full bg-white"
              />
              <motion.span
                animate={toggle ? { opacity: 0 } : { opacity: 1 }}
                className="block h-[2px] w-5 rounded-full bg-white"
              />
              <motion.span
                animate={toggle ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="block h-[2px] w-5 rounded-full bg-white"
              />
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {toggle && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-t border-white/10 bg-primary/90 backdrop-blur-xl sm:hidden"
            >
              <ul className="flex flex-col gap-1 px-4 py-4">
                {navLinks.map((link) => {
                  const isActive = active === link.title;
                  return (
                    <li key={link.id}>
                      <a
                        href={`#${sectionMap[link.id]}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(link);
                        }}
                        className={`block rounded-xl px-4 py-3 text-[16px] font-medium transition-colors ${
                          isActive
                            ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                            : "text-secondary hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {link.title}
                      </a>
                    </li>
                  );
                })}
                <li className="mt-1">
                  <LiquidButton
                    type="button"
                    onClick={() => {
                      setToggle(false);
                      scrollToId("s-contact");
                    }}
                    size="lg"
                    className="w-full text-white"
                  >
                    Let&apos;s Talk
                  </LiquidButton>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
