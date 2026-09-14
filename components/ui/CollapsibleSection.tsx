"use client";

import { useId } from "react";
import ExpandIndicator from "./ExpandIndicator";

export interface CollapsibleSectionProps {
  label: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

/**
 * One disclosure row: a trigger button plus an animated panel, the
 * grid-template-rows technique also used by FAQ and the desktop mega menu —
 * 140ms, and disabled under prefers-reduced-motion by the sitewide rule in
 * globals.css that zeroes every transition-duration, not a rule of its own
 * here. `inert` on the collapsed panel keeps its links out of the tab order;
 * a container running its own focus trap over this component's DOM subtree
 * must filter candidates through `!el.closest('[inert]')`, since inert
 * elements still satisfy querySelectorAll.
 */
export default function CollapsibleSection({
  label,
  isExpanded,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  const panelId = useId();

  return (
    <div className="mb-2">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={onToggle}
        className={`group flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 text-left text-sm ${
          isExpanded ? "text-white" : "text-muted hover:text-white"
        }`}
      >
        <span>{label}</span>
        <ExpandIndicator isExpanded={isExpanded} />
      </button>
      <div
        id={panelId}
        inert={!isExpanded}
        className={`grid transition-[grid-template-rows] duration-[140ms] ease-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
