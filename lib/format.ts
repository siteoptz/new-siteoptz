/** ISO date ("2026-09-11") to "September 11, 2026". UTC-pinned so the displayed date is stable regardless of viewer timezone. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
