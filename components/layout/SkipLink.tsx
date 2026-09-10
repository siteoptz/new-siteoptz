/**
 * First focusable element in the document. Visually hidden until focused,
 * then visible top-left on navy with the standard focus ring. Targets #main,
 * which the marketing layout renders as the id on its <main>.
 */
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-default focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
    >
      Skip to main content
    </a>
  );
}
