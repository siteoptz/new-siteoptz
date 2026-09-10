import type { Metadata } from "next";

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

function requireSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) {
    throw new Error("buildMetadata: NEXT_PUBLIC_SITE_URL is not set");
  }
  return url;
}

export interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

/**
 * Builds a Next.js Metadata object with an absolute canonical URL, OpenGraph,
 * and Twitter card. Throws at call time (which for `export const metadata =
 * buildMetadata(...)` is module evaluation time) if the title or description
 * is over length, or if NEXT_PUBLIC_SITE_URL is unset.
 */
export function buildMetadata({ title, description, path, ogImage }: BuildMetadataInput): Metadata {
  const siteUrl = requireSiteUrl();

  if (title.length > TITLE_MAX) {
    throw new Error(
      `buildMetadata: title exceeds ${TITLE_MAX} characters (${title.length}): "${title}"`
    );
  }

  if (description.length > DESCRIPTION_MAX) {
    throw new Error(
      `buildMetadata: description exceeds ${DESCRIPTION_MAX} characters (${description.length}): "${description}"`
    );
  }

  const canonical = new URL(path, siteUrl).toString();
  const image = ogImage ? new URL(ogImage, siteUrl).toString() : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
