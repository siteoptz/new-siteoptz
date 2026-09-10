/**
 * Renders a JSON-LD <script> tag. Server component only — no 'use client',
 * no hooks. `<` is escaped so a value containing "</script>" cannot break out
 * of the tag.
 */
export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
