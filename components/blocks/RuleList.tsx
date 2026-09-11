import Link from "next/link";

export interface RuleListItem {
  label: string;
  heading: string;
  description: string;
  href: string;
}

export interface RuleListProps {
  items: RuleListItem[];
}

/**
 * Hairline-separated rows — 1px top and bottom borders only, no side
 * borders, no radius, no shadow, no hover background.
 */
export default function RuleList({ items }: RuleListProps) {
  return (
    <div>
      {items.map((item) => (
        <div
          key={item.href}
          className="grid grid-cols-2 gap-x-6 gap-y-2 border-b border-rule py-6 first:border-t min-[900px]:grid-cols-[minmax(0,10ch)_1fr_1fr]"
        >
          <p className="font-display text-sm text-accent">{item.label}</p>
          <p className="font-display">{item.heading}</p>
          <div className="col-span-2 min-[900px]:col-span-1">
            <p className="text-muted">{item.description}</p>
            <Link href={item.href} className="text-sm text-accent hover:text-accent-lt">
              {item.heading}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
