import { ArrowUp } from "lucide-react";

import { BrandIcon } from "@/components/ui/BrandIcon";
import { profile, socials } from "@/data/profile";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-ink-950/80">
      <div className="container-x flex flex-col gap-6 py-10 text-[13px] text-fg-subtle md:flex-row md:items-center md:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <ul className="flex items-center gap-5">
          {socials.map((social) => (
            <li key={social.id}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-fg"
              >
                <BrandIcon id={social.id} className="h-3.5 w-3.5" />
                {social.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#top" className="inline-flex items-center gap-2 transition-colors hover:text-fg">
          Back to top <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
        </a>
      </div>
    </footer>
  );
}
