import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { chapters } from "@/data/chapters";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

interface NavbarProps {
  active: number;
  progressRef: RefObject<HTMLDivElement>;
}

const links = chapters.slice(1);

export function Navbar({ active, progressRef }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock scroll, move focus in, close on Escape, restore focus.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  // Close the sheet if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const list = window.matchMedia("(min-width: 1024px)");
    const onChange = () => list.matches && setOpen(false);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-3 z-[70] -translate-y-20 rounded-full bg-fg px-4 py-2 text-sm font-medium text-ink-950 transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || open
            ? "border-b border-line bg-ink-950/75 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="container-x flex h-[var(--nav-height)] items-center justify-between"
        >
          <a
            href="#top"
            className="group flex items-center gap-3"
            aria-label={`${profile.name}, back to top`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border border-line-strong font-mono text-[10.5px] font-semibold tracking-wider text-fg transition-colors group-hover:border-accent/70">
              {profile.initials}
            </span>
            <span className="hidden text-[14px] font-medium tracking-tight text-fg sm:block">
              {profile.name}
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((chapter, i) => {
              const isActive = active === i + 1;
              return (
                <li key={chapter.id}>
                  <a
                    href={`#${chapter.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-[14.5px] font-medium transition-colors",
                      isActive ? "text-fg" : "text-fg-subtle hover:text-fg",
                    )}
                  >
                    {chapter.nav}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3.5 -bottom-px h-px origin-left bg-gradient-to-r from-accent to-cool transition-transform duration-500",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${profile.email}`}
              className="hidden h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-[13.5px] font-medium text-fg transition-colors hover:border-accent/60 hover:bg-white/[0.04] sm:inline-flex"
            >
              Let&rsquo;s talk
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-line-strong text-fg lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {/* Reading progress */}
        <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden" aria-hidden="true">
          <div
            ref={progressRef}
            className="h-full origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-cool"
          />
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-40 bg-ink-950/95 pt-[var(--nav-height)] backdrop-blur-xl lg:hidden"
        >
          <ul className="container-x flex flex-col pt-8">
            {links.map((chapter, i) => (
              <li key={chapter.id} className="border-b border-line">
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={`#${chapter.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-5"
                >
                  <span className="display text-[2.4rem]">{chapter.nav}</span>
                  <span className="meta">{chapter.number}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="container-x mt-10">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 text-fg-muted"
            >
              {profile.email}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
