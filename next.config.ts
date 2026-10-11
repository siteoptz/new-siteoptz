import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";
import { REDIRECTS } from "./lib/redirects";

const nextConfig: NextConfig = {
  async redirects() {
    return REDIRECTS;
  },
  // /llms.txt is served by app/llms-txt/route.ts. Next's file-system router
  // does not treat a literal dot in a folder name as a normal segment, so
  // the route lives at the hyphenated path and this rewrite maps the public
  // URL to it — the request URL stays "/llms.txt", only the internal
  // resolution changes.
  async rewrites() {
    return [{ source: "/llms.txt", destination: "/llms-txt" }];
  },
};

// Adds BotID's proxy rewrites (its challenge script and verification calls route through our
// own domain, same-origin, so an ad-blocker or third-party-script blocker can't see or strip
// them). This exposes the proxy paths site-wide; it does not by itself load the challenge
// script on every page - instrumentation-client.ts's own protect list decides that.
export default withBotId(nextConfig);
