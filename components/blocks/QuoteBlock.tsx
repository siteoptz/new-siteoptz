export interface QuoteBlockProps {
  quote: string;
  name: string;
  role: string;
  organization: string;
}

export default function QuoteBlock({ quote, name, role, organization }: QuoteBlockProps) {
  return (
    <blockquote className="border-l-2 border-blue-600 pl-6">
      <p className="font-serif text-xl leading-[1.45]">&ldquo;{quote}&rdquo;</p>
      <footer className="mt-3 text-sm text-muted">
        {name}, {role}, {organization}
      </footer>
    </blockquote>
  );
}
