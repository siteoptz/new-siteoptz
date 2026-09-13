"use client";

import { useState } from "react";
import JsonLd from "@/components/seo/JsonLd";
import ExpandIndicator from "@/components/ui/ExpandIndicator";
import { buildFaqPage } from "@/lib/schema";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FAQProps {
  items: FaqItem[];
}

/**
 * Native disclosure semantics — a button with aria-expanded controlling a
 * region, not a div with a click handler. Several items may be open at
 * once. Renders FAQPage JSON-LD from the same items array so the visible
 * answers and the structured data cannot diverge.
 */
export default function FAQ({ items }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div>
      <JsonLd data={buildFaqPage(items)} />
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <div key={item.question} className="border-b border-rule first:border-t">
            <button
              type="button"
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(index)}
              className={`group flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-display ${
                isOpen ? "text-white" : "text-text hover:text-white"
              }`}
            >
              <span>{item.question}</span>
              <ExpandIndicator isExpanded={isOpen} />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-[140ms] ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-4 text-muted">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
