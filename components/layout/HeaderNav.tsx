"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";

export interface MegaMenuColumn {
  heading: string;
  headingHref: string;
  items: { href: string; label: string }[];
}

export type HeaderNavItem =
  | { type: "link"; path: string; label: string }
  | {
      type: "menu";
      id: string;
      label: string;
      basePath: string;
      columns: MegaMenuColumn[];
      extra?: React.ReactNode;
      layout?: "grid" | "single";
    };

export interface HeaderNavProps {
  items: HeaderNavItem[];
}

// Module-level store coordinating "only one mega menu open at a time" across
// independent menu triggers (Services, Industries), without a context
// provider or a new dependency.
type Listener = () => void;
let openMenuId: string | null = null;
const listeners = new Set<Listener>();

function setOpenMenuId(id: string | null) {
  openMenuId = id;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return openMenuId;
}

function getServerSnapshot() {
  return null;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

const NAV_LINK_CLASSES = "border-b-[1.5px] text-sm";
const NAV_LINK_INACTIVE = "border-transparent text-muted hover:text-white";
const NAV_LINK_ACTIVE = "border-accent text-white";

function isRouteActive(pathname: string, basePath: string): boolean {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

function PlainNavLink({
  path,
  label,
  pathname,
}: {
  path: string;
  label: string;
  pathname: string;
}) {
  const active = isRouteActive(pathname, path);
  return (
    <Link
      href={path}
      aria-current={active ? "page" : undefined}
      className={`${NAV_LINK_CLASSES} ${active ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE}`}
    >
      {label}
    </Link>
  );
}

function MegaMenuTrigger({
  id,
  label,
  basePath,
  columns,
  extra,
  layout = "grid",
  pathname,
}: {
  id: string;
  label: string;
  basePath: string;
  columns: MegaMenuColumn[];
  extra?: React.ReactNode;
  layout?: "grid" | "single";
  pathname: string;
}) {
  const panelId = `${id}-panel`;
  const currentOpenId = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isOpen = currentOpenId === id;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isActive = isRouteActive(pathname, basePath);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }
      setOpenMenuId(null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenuId(null);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = getFocusableElements(panelRef.current);
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

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" onMouseEnter={() => setOpenMenuId(id)}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-current={isActive ? "page" : undefined}
        onClick={() => setOpenMenuId(isOpen ? null : id)}
        className={`${NAV_LINK_CLASSES} ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE}`}
      >
        {label}
      </button>

      <div
        id={panelId}
        ref={panelRef}
        inert={!isOpen}
        className={`fixed inset-x-0 top-[76px] z-40 grid border-b border-[rgba(255,236,220,0.14)] bg-raised transition-[grid-template-rows] duration-[140ms] ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mx-auto max-w-site px-gutter py-10">
            <div className={layout === "grid" ? "grid grid-cols-4 gap-x-8" : "grid grid-cols-1"}>
              {columns.map((column) => (
                <div key={column.headingHref}>
                  <Link
                    href={column.headingHref}
                    className="mb-3 block text-sm font-medium text-white hover:text-accent-lt"
                  >
                    {column.heading}
                  </Link>
                  <ul>
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
                </div>
              ))}
              {extra ? <div>{extra}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The whole desktop nav row — plain links and mega-menu triggers together —
 * as one client island, so active-route styling covers every link without a
 * third client component.
 */
export default function HeaderNav({ items }: HeaderNavProps) {
  const pathname = usePathname();

  useEffect(() => {
    setOpenMenuId(null);
  }, [pathname]);

  return (
    <>
      {items.map((item) =>
        item.type === "link" ? (
          <PlainNavLink key={item.path} path={item.path} label={item.label} pathname={pathname} />
        ) : (
          <MegaMenuTrigger key={item.id} {...item} pathname={pathname} />
        )
      )}
    </>
  );
}
