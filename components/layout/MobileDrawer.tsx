"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import CollapsibleSection from "@/components/ui/CollapsibleSection";
import type { MegaMenuColumn } from "./HeaderNav";

export interface NavItem {
  href: string;
  label: string;
}

export interface MobileDrawerProps {
  stageColumns: MegaMenuColumn[];
  industriesColumn: MegaMenuColumn;
  links: NavItem[];
  contact: NavItem;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    // A collapsed CollapsibleSection panel is inert but still rendered, so
    // querySelectorAll still returns its links — exclude them, or the drawer's
    // own Tab trap can compute a "last" element the browser will never
    // actually let a keyboard user land on.
  ).filter((element) => !element.closest("[inert]"));
}

/**
 * The nav collapses to this below 900px. No hamburger icon — "Menu" is the
 * trigger text and "Close" is the dismiss control, per spec.
 */
export default function MobileDrawer({
  stageColumns,
  industriesColumn,
  links,
  contact,
}: MobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close on route change: adjust state during render rather than in an
  // effect, per React's guidance for resetting state when a prop changes.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Deferred to the next tick: focusing immediately after removing `inert`
    // in the same commit is unreliable, since the browser hasn't finished
    // processing the inert removal yet.
    const focusTimeout = setTimeout(() => {
      const firstFocusable = drawerRef.current
        ? getFocusableElements(drawerRef.current)[0]
        : undefined;
      firstFocusable?.focus();
    }, 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = getFocusableElements(drawerRef.current);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(focusTimeout);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function closeAndReturnFocus() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function toggleSection(heading: string) {
    setExpandedSections((current) => {
      const next = new Set(current);
      if (next.has(heading)) {
        next.delete(heading);
      } else {
        next.add(heading);
      }
      return next;
    });
  }

  return (
    <div className="min-[900px]:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-drawer"
        onClick={() => setIsOpen(true)}
        className="text-sm text-muted hover:text-white"
      >
        Menu
      </button>

      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!isOpen}
        className={`fixed inset-x-0 top-[76px] bottom-0 z-50 overflow-y-auto bg-base transition-opacity duration-[120ms] ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="px-gutter py-8">
          <button
            type="button"
            onClick={closeAndReturnFocus}
            className="mb-6 text-sm text-muted hover:text-white"
          >
            Close
          </button>

          <div className="mb-6">
            <p className="mb-2 text-sm font-medium text-white">Services</p>
            {stageColumns.map((column) => (
              <CollapsibleSection
                key={column.headingHref}
                label={column.heading}
                isExpanded={expandedSections.has(column.heading)}
                onToggle={() => toggleSection(column.heading)}
              >
                <ul className="pl-4">
                  <li>
                    <Link
                      href={column.headingHref}
                      className="block py-1 text-sm text-muted hover:text-white"
                    >
                      All {column.heading}
                    </Link>
                  </li>
                  {column.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block py-1 text-sm text-muted hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            ))}
          </div>

          <div className="mb-6">
            <CollapsibleSection
              label={industriesColumn.heading}
              isExpanded={expandedSections.has(industriesColumn.heading)}
              onToggle={() => toggleSection(industriesColumn.heading)}
            >
              <ul className="pl-4">
                <li>
                  <Link
                    href={industriesColumn.headingHref}
                    className="block py-1 text-sm text-muted hover:text-white"
                  >
                    All {industriesColumn.heading}
                  </Link>
                </li>
                {industriesColumn.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block py-1 text-sm text-muted hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          </div>

          <div className="mb-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-sm text-muted hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Button variant="primary" href={contact.href}>
            {contact.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
