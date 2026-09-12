const SITE_NAME = "SiteOptz";

function requireSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) {
    throw new Error("lib/schema: NEXT_PUBLIC_SITE_URL is not set");
  }
  return url;
}

function absoluteUrl(path: string): string {
  return new URL(path, requireSiteUrl()).toString();
}

export interface OrganizationInput {
  name: string;
  logoUrl: string;
  email?: string;
  sameAs?: string[];
}

export function buildOrganization(input: OrganizationInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    url: requireSiteUrl(),
    logo: absoluteUrl(input.logoUrl),
    ...(input.email ? { email: input.email } : {}),
    ...(input.sameAs ? { sameAs: input.sameAs } : {}),
  };
}

export interface WebSiteInput {
  name: string;
}

export function buildWebSite(input: WebSiteInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name,
    url: requireSiteUrl(),
  };
}

export interface ServiceInput {
  name: string;
  description: string;
  path: string;
  areaServed?: string;
}

export function buildService(input: ServiceInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    ...(input.areaServed ? { areaServed: input.areaServed } : {}),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Takes the same question/answer array shape the FAQ component renders from,
 * so the visible accordion and the schema can never diverge.
 */
export function buildFaqPage(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface HowToInput {
  name: string;
  description: string;
  steps: HowToStep[];
}

export function buildHowTo(input: HowToInput) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    step: input.steps.map((step) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text,
    })),
  };
}

export interface ArticleInput {
  headline: string;
  description: string;
  path: string;
  authorName: string;
  publishedAt: string;
  updatedAt: string;
  imageUrl?: string;
}

export function buildArticle(input: ArticleInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: absoluteUrl(input.path),
    author: {
      "@type": "Person",
      name: input.authorName,
    },
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    ...(input.imageUrl ? { image: [input.imageUrl] } : {}),
  };
}

export interface PersonInput {
  name: string;
  role: string;
}

/** A standalone Person node for an article byline, alongside (not instead of) Article's own nested author reference. */
export function buildPerson(input: PersonInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    jobTitle: input.role,
  };
}

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

export function buildBreadcrumbList(items: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export interface CollectionPageInput {
  name: string;
  description: string;
  path: string;
}

export function buildCollectionPage(input: CollectionPageInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
  };
}

export interface AboutPageInput {
  name: string;
  description: string;
  path: string;
}

export function buildAboutPage(input: AboutPageInput) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
  };
}

export interface ContactPageInput {
  name: string;
  description: string;
  path: string;
}

export function buildContactPage(input: ContactPageInput) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
  };
}

export interface WebPageInput {
  name: string;
  description: string;
  path: string;
}

export function buildWebPage(input: WebPageInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
  };
}
