import Link from "next/link";

export type ButtonVariant = "primary" | "ghost" | "reading";

export interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant: ButtonVariant;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-default border py-[0.68rem] px-[1.15rem] " +
  "font-sans text-sm font-medium shadow-none transition-[background-color,border-color] " +
  "duration-[120ms] disabled:pointer-events-none disabled:opacity-50";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // #1A1008, not white — the orange is light enough that dark text reads
  // better on it and is the one that actually clears contrast (white on
  // accent measures under 2.5:1).
  primary: "border-accent bg-accent text-[#1A1008] hover:border-accent-lt hover:bg-accent-lt",
  ghost:
    "border-[rgba(255,236,220,0.3)] bg-transparent text-text hover:bg-[rgba(255,236,220,0.07)]",
  // The article reading surface only — a light background, so this is the
  // one variant that isn't styled for a dark surface.
  reading: "border-reading-ink/20 bg-transparent text-reading-accent hover:bg-reading-ink/5",
};

/**
 * Renders next/link for an internal href (starts with "/"), an <a> for an
 * external one, or a <button> otherwise. Never appends an arrow, chevron, or
 * any glyph — the label is the whole label.
 */
export default function Button({ children, href, variant, type = "button", disabled }: ButtonProps) {
  const className = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]}`;

  if (href && !disabled) {
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} rel="noopener" className={className}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} disabled={disabled} className={className}>
      {children}
    </button>
  );
}
