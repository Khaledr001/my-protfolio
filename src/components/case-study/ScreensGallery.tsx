import type { ReactNode } from "react";
import { Expand } from "lucide-react";

import type { Screen } from "@/data/projects";
import { BrowserFrame, PhoneFrame, ScreenImage } from "./DeviceFrames";

interface ScreensGalleryProps {
  /** Every screen of the project; `indexOf` maps back for the lightbox. */
  screens: Screen[];
  /** Which screens to show here (the first is already the hero showcase). */
  shown: Screen[];
  title: string;
  address?: string;
  onOpen: (index: number) => void;
}

function OpenButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group relative block w-full cursor-zoom-in text-left focus-visible:outline-offset-4"
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute right-4 top-14 grid h-10 w-10 place-items-center rounded-full border border-line-strong bg-surface/90 text-fg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <Expand className="h-4 w-4" />
      </span>
    </button>
  );
}

/** Desktop screens in browser frames, mobile screens in phone frames. */
export function ScreensGallery({ screens, shown, title, address, onOpen }: ScreensGalleryProps) {
  const desktops = shown.filter((s) => s.device === "desktop");
  const phones = shown.filter((s) => s.device === "mobile");
  const label = (screen: Screen) => `Open ${title} screenshot ${screens.indexOf(screen) + 1} of ${screens.length}`;
  const alt = (screen: Screen) => `${title} — ${screen.device} screenshot ${screens.indexOf(screen) + 1}`;

  // Only phone screens left: show them in a captioned card instead of
  // leaving a lone phone floating in a wide column.
  if (!desktops.length) {
    return (
      <div className="card flex flex-col items-center gap-8 p-6 sm:flex-row sm:p-10">
        <div className="flex flex-wrap justify-center gap-6">
          {phones.map((screen) => (
            <OpenButton key={screen.src} label={label(screen)} onClick={() => onOpen(screens.indexOf(screen))}>
              <PhoneFrame className="w-[13rem]">
                <ScreenImage screen={screen} alt={alt(screen)} />
              </PhoneFrame>
            </OpenButton>
          ))}
        </div>
        <div className="max-w-sm text-center sm:text-left">
          <p className="eyebrow">Mobile</p>
          <p className="display mt-3 text-[1.6rem]">The same product on a phone.</p>
          <p className="mt-3 text-[16px] leading-[1.7] text-fg-muted">
            The mobile layout of {title}. Select the screen to view it full size.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={phones.length ? "grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_15rem]" : "grid gap-8"}>
      <div className="grid gap-8">
        {desktops.map((screen) => (
          <OpenButton key={screen.src} label={label(screen)} onClick={() => onOpen(screens.indexOf(screen))}>
            <BrowserFrame address={address}>
              <ScreenImage screen={screen} alt={alt(screen)} />
            </BrowserFrame>
          </OpenButton>
        ))}
      </div>
      {phones.length > 0 && (
        <div className="grid gap-8">
          {phones.map((screen) => (
            <OpenButton key={screen.src} label={label(screen)} onClick={() => onOpen(screens.indexOf(screen))}>
              <PhoneFrame className="mx-auto w-full max-w-[15rem]">
                <ScreenImage screen={screen} alt={alt(screen)} />
              </PhoneFrame>
            </OpenButton>
          ))}
        </div>
      )}
    </div>
  );
}
