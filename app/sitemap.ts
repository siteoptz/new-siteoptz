import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { MetadataRoute } from "next";
import { ROUTES, type RouteEntry } from "@/lib/nav";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const APP_ROOT = path.join(process.cwd(), "app");

/**
 * Resolves the content/*.mdx file backing a route, if it is MDX-driven.
 * Everything under /services/<slug> (hubs and services alike, per the shared
 * dynamic route) and /industries/<slug> is content-backed; nothing else is.
 */
function contentFilePath(route: RouteEntry): string | null {
  const serviceSlug = /^\/services\/([^/]+)$/.exec(route.path)?.[1];
  if (serviceSlug) {
    return path.join(CONTENT_ROOT, "services", `${serviceSlug}.mdx`);
  }

  const industrySlug = /^\/industries\/([^/]+)$/.exec(route.path)?.[1];
  if (industrySlug) {
    return path.join(CONTENT_ROOT, "industries", `${industrySlug}.mdx`);
  }

  return null;
}

/** Best-effort source file for a non-content-backed route, for its mtime. */
function staticPageFilePath(route: RouteEntry): string {
  if (route.path === "/privacy") return path.join(APP_ROOT, "privacy", "page.tsx");
  if (route.path === "/terms") return path.join(APP_ROOT, "terms", "page.tsx");
  const segment = route.path === "/" ? "" : route.path.slice(1);
  return path.join(APP_ROOT, "(marketing)", segment, "page.tsx");
}

function contentLastModified(filePath: string): Date {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    if (typeof data.updatedAt === "string") {
      const parsed = new Date(data.updatedAt);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
  } catch {
    // fall through to mtime below
  }
  return statMtimeOrNow(filePath);
}

function statMtimeOrNow(filePath: string): Date {
  try {
    return fs.statSync(filePath).mtime;
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    throw new Error("app/sitemap: NEXT_PUBLIC_SITE_URL is not set");
  }

  const entries: MetadataRoute.Sitemap = [];

  for (const route of ROUTES) {
    const contentPath = contentFilePath(route);

    if (contentPath) {
      if (!fs.existsSync(contentPath)) continue;
      entries.push({
        url: new URL(route.path, siteUrl).toString(),
        lastModified: contentLastModified(contentPath),
      });
      continue;
    }

    entries.push({
      url: new URL(route.path, siteUrl).toString(),
      lastModified: statMtimeOrNow(staticPageFilePath(route)),
    });
  }

  return entries;
}
