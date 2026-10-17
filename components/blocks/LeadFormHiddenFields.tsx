"use client";

import { useEffect, useRef } from "react";
import { readSessionFields, SESSION_FIELD_NAMES } from "@/lib/landing-session";

/**
 * The honeypot trap, the elapsed-time timestamp, and the ad-parameter/session hidden
 * fields every lead form needs - one definition, imported by every form, so there is
 * exactly one honeypot and one elapsed-time field in the codebase rather than one per
 * form. Render this once, anywhere inside the <form>; FormData collection at submit time
 * reads every input inside the form tag regardless of which component rendered it.
 *
 * Reads session state via readSessionFields() - never syncLandingSession(). This component
 * must not write to so_landing/so_ad_params: LandingSessionCapture, in the root layout, is
 * the one writer for the whole site. Two writers racing each other is exactly what made
 * adParamsSource misreport every first-touch ad click as "mid-session".
 */
export default function LeadFormHiddenFields() {
  const loadedAtInputRef = useRef<HTMLInputElement>(null);
  const consentPageInputRef = useRef<HTMLInputElement>(null);
  const sessionFieldsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set once on mount, client-only — a server-rendered timestamp would race the browser's
    // own render and make the trap fire (or fail to) for reasons unrelated to submission speed.
    if (loadedAtInputRef.current) {
      loadedAtInputRef.current.value = String(Date.now());
    }
  }, []);

  useEffect(() => {
    if (consentPageInputRef.current) {
      consentPageInputRef.current.value = `${window.location.pathname}${window.location.search}`;
    }

    const session = readSessionFields();
    const container = sessionFieldsRef.current;
    if (!container) return;
    for (const input of container.querySelectorAll<HTMLInputElement>("input[name]")) {
      const value = session[input.name];
      if (value !== undefined) input.value = value;
    }
  }, []);

  return (
    <>
      {/*
        A bot that fills every field trips this. display:none (not off-screen positioning,
        opacity, or a zero-size box) is what keeps autofill and password managers out of it -
        those treat an off-screen-but-visible field as fair game, which is exactly what caused
        a real visitor's password manager to fill the old version of this field and get their
        submission silently flagged. The name is a meaningless token on purpose: autofill
        matches on name/type, and a name describing any real field (email, company, website,
        address, and so on) is a magnet for exactly the heuristic this is trying to avoid.
        Still real type="text" input, not type="hidden", which autofill simply skips and would
        defeat the point of having a trap at all.
      */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="qzx92f">Leave blank</label>
        <input type="text" id="qzx92f" name="qzx92f" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="loaded_at" ref={loadedAtInputRef} defaultValue="" />
      <input type="hidden" name="consentPage" ref={consentPageInputRef} defaultValue="" />
      <div ref={sessionFieldsRef}>
        {SESSION_FIELD_NAMES.map((name) => (
          <input key={name} type="hidden" name={name} defaultValue="" />
        ))}
      </div>
    </>
  );
}
