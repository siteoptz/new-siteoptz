import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// dental.siteoptz.com is a domain alias on the same Vercel project, not a separate
// app - without this, that hostname serves the regular site's own routing (home
// page at "/", full nav). A next.config.ts rewrite with a `has: [{type: "host"}]`
// condition was tried first and verified, via `next start` plus curl against both
// hostnames, to NOT redirect home's content to /dental under a self-hosted Node
// server - the Host header override never changed the response. Middleware runs
// per-request in both the self-hosted and Vercel-edge cases, and was verified
// locally to work where the config-level rewrite did not.
const LANDING_HOST = "dental.siteoptz.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  if (host === LANDING_HOST && request.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL("/dental", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
