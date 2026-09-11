export interface RuleProps {
  tone?: "light" | "dark";
}

const TONE_CLASSES: Record<NonNullable<RuleProps["tone"]>, string> = {
  light: "bg-rule",
  dark: "bg-[rgba(255,236,220,0.14)]",
};

/**
 * A 1px horizontal rule. No margin of its own — spacing belongs to whatever
 * composes it.
 */
export default function Rule({ tone = "light" }: RuleProps) {
  return <hr className={`m-0 h-px w-full border-0 ${TONE_CLASSES[tone]}`} />;
}
