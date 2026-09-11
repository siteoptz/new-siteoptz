/**
 * Shared between lib/content.ts's heading extractor and lib/mdx-components.tsx's
 * h2 renderer for point-of-view articles, so a table of contents built from
 * raw MDX text and the ids actually rendered on the page can never drift
 * apart — both call this on the same heading text.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
