import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SiteOptz",
    short_name: "SiteOptz",
    description: "Marketing intelligence for operators.",
    start_url: "/",
    display: "standalone",
    theme_color: "#15100C",
    background_color: "#15100C",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
