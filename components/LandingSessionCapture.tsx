"use client";

import { useEffect } from "react";
import { syncLandingSession } from "@/lib/landing-session";

/**
 * Renders nothing. Mounted once in the root layout so the landing page (first touch) and any
 * ad parameters (last touch) are captured on whatever page a visitor actually lands on first,
 * not only on /contact.
 */
export default function LandingSessionCapture() {
  useEffect(() => {
    syncLandingSession();
  }, []);

  return null;
}
