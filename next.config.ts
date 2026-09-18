import type { NextConfig } from "next";
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

export default nextConfig;
