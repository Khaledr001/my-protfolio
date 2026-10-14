import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 rounded-full font-medium tracking-tight transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-out active:scale-[0.98] focus-visible:outline-offset-4";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-ink-950 hover:bg-accent-soft hover:shadow-[0_0_0_6px_rgba(242,166,90,0.18),0_12px_40px_-8px_rgba(242,166,90,0.55)]",
  secondary:
    "border border-line-strong bg-white/[0.02] text-fg hover:border-accent/60 hover:bg-white/[0.06]",
  ghost: "text-fg-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[14px]",
  lg: "h-[52px] px-7 text-[15px]",
};

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  /** Render a react-router <Link> for internal routes. */
  internal?: boolean;
  external?: boolean;
}

/** A link styled as a button. Opens external URLs in a new tab. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon,
  internal,
  external,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <span
          aria-hidden="true"
          className="transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px"
        >
          {icon}
        </span>
      )}
    </>
  );

  if (internal) {
    return (
      <Link to={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {content}
    </a>
  );
}
