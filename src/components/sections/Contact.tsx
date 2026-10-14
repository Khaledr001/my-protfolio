import { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Download, Mail } from "lucide-react";

import { revealIn, useScrollMotion } from "@/animations/useScrollMotion";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { ContactForm } from "@/components/ui/ContactForm";
import { profile, socials } from "@/data/profile";
import { contactFormEnabled } from "@/lib/emailjs";

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be unavailable (permissions, insecure context); the
      // mailto link next to this button still works.
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Email address copied" : "Copy email address"}
      className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border border-white/15 text-fg-muted transition-colors hover:border-accent/60 hover:text-fg"
    >
      {copied ? (
        <Check aria-hidden="true" className="h-4 w-4 text-cool-soft" />
      ) : (
        <Copy aria-hidden="true" className="h-4 w-4" />
      )}
    </button>
  );
}

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const professionalLinks = socials.filter((s) => s.id !== "x");

  useScrollMotion(ref, () => {
    revealIn(ref.current!);
  });

  return (
    <section
      id="contact"
      ref={ref}
      aria-labelledby="contact-title"
      className="relative flex min-h-[100svh] items-center py-28 sm:py-36"
    >
      <div className="container-x grid lg:grid-cols-12">
        <div className="lg:col-span-8 xl:col-span-7">
          <p className="eyebrow flex items-center gap-3" data-reveal>
            <span className="text-accent">06</span>
            <span aria-hidden="true" className="h-px w-8 bg-white/20" />
            <span>The invitation</span>
          </p>

          <h2
            id="contact-title"
            className="display mt-7 text-[clamp(2.4rem,4.4vw,4.25rem)]"
            data-reveal-lines
          >
            <span className="line-mask">
              <span>Have a complex problem?</span>
            </span>
            <span className="line-mask">
              <span>
                Let&rsquo;s engineer the{" "}
                <span className="serif-accent text-signal pr-[0.06em]">solution.</span>
              </span>
            </span>
          </h2>

          <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-fg-muted sm:text-lg" data-reveal>
            Open to software engineering opportunities and collaborations in backend
            systems, SaaS, and AI-powered products.
          </p>

          <div className="mt-10 flex items-center gap-3" data-reveal>
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex h-[52px] min-w-0 items-center gap-3 rounded-full bg-accent pl-6 pr-5 text-[15px] font-medium text-ink-950 transition-shadow duration-300 hover:shadow-[0_0_0_6px_rgba(242,166,90,0.18),0_12px_40px_-8px_rgba(242,166,90,0.55)]"
            >
              <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="truncate">{profile.email}</span>
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <CopyEmailButton />
          </div>

          <ul className="mt-8 flex flex-wrap gap-3" data-reveal>
            {professionalLinks.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2.5 rounded-full border border-white/15 px-5 text-[14px] text-fg transition-colors hover:border-accent/60 hover:bg-white/[0.05]"
                >
                  <BrandIcon id={social.id} className="h-4 w-4" />
                  {social.label}
                  <span className="font-mono text-[11px] text-fg-subtle">{social.handle}</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={profile.resumeUrl}
                download={profile.resumeFileName}
                className="inline-flex h-11 items-center gap-2.5 rounded-full border border-white/15 px-5 text-[14px] text-fg transition-colors hover:border-accent/60 hover:bg-white/[0.05]"
              >
                <Download aria-hidden="true" className="h-4 w-4" />
                Download CV
                <span className="font-mono text-[11px] text-fg-subtle">PDF</span>
              </a>
            </li>
          </ul>

          {contactFormEnabled && (
            <div className="panel mt-14 max-w-2xl p-6 sm:p-8" data-reveal>
              <h3 className="text-lg font-semibold tracking-tight text-fg">Or send a message</h3>
              <p className="mt-1 text-[14px] text-fg-subtle">It goes straight to my inbox.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
