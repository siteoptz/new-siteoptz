import Link from "next/link";

export type ButtonVariant = "primary" | "ghost" | "line";

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
  primary: "border-blue-600 bg-blue-600 text-white hover:bg-blue-700",
  ghost:
    "border-[rgba(255,255,255,0.3)] bg-transparent text-[#DCE4F2] hover:bg-[rgba(255,255,255,0.07)]",
  line: "border-[#C7D3E8] bg-transparent text-blue-600 hover:border-blue-600 hover:bg-paper-2",
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
