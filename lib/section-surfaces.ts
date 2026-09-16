import type { SectionSurface } from "@/components/ui/Section";

export interface SurfaceSlot<K extends string> {
  key: K;
  /** The surface this slot gets when it doesn't collide with the two before it. */
  surface: SectionSurface;
  /** Whether this slot actually renders — an absent slot is skipped, not assigned a surface used for tracking. */
  when: boolean;
}

/**
 * Walks a page's sections in render order and flips a slot's surface when
 * assigning its default would make three of the same surface in a row —
 * CLAUDE.md's design system prohibits that, and several sections on both
 * the service and industry templates are optional (present only when the
 * content or an emergent topic-cluster link exists), so the actual sequence
 * of rendered surfaces isn't knowable just from each slot's own default.
 *
 * Shared between the service and industry page templates rather than
 * duplicated — both walk a hero/body run of fixed sections into a tail of
 * optional ones (faq, cross-links or related-reading, cta) with the same
 * collision rule.
 */
export function deriveSequentialSurfaces<K extends string>(
  slots: ReadonlyArray<SurfaceSlot<K>>
): Record<K, SectionSurface> {
  const result = {} as Record<K, SectionSurface>;
  const rendered: SectionSurface[] = [];

  for (const slot of slots) {
    let surface = slot.surface;
    if (slot.when) {
      const last = rendered[rendered.length - 1];
      const secondLast = rendered[rendered.length - 2];
      if (surface === last && surface === secondLast) {
        surface = surface === "base" ? "raised" : "base";
      }
      rendered.push(surface);
    }
    result[slot.key] = surface;
  }

  return result;
}
