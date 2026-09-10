export interface DefinitionListItem {
  term: string;
  definition: string;
}

export interface DefinitionListProps {
  items: DefinitionListItem[];
}

/** Two-column dt/dd rows separated by hairlines. Single column below 900px. */
export default function DefinitionList({ items }: DefinitionListProps) {
  return (
    <dl>
      {items.map((item) => (
        <div
          key={item.term}
          className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-rule py-4 first:border-t min-[900px]:grid-cols-[16rem_1fr]"
        >
          <dt className="font-display text-md">{item.term}</dt>
          <dd className="text-muted">{item.definition}</dd>
        </div>
      ))}
    </dl>
  );
}
