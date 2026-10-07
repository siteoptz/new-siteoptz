"use client";

import { useEffect } from "react";
import { readOrWriteLandingSession } from "@/lib/landing-session";

/**
 * Renders nothing. Mounted once in the root layout so the landing page and ad parameters are
 * captured on whatever page a visitor actually lands on first, not only on /contact - the
 * write is idempotent, so mounting it again on a later page is a no-op read.
 */
export default function LandingSessionCapture() {
  useEffect(() => {
    readOrWriteLandingSession();
  }, []);

  return null;
}
