import { ImageResponse } from "next/og";

export const alt = "SiteOptz — marketing intelligence for operators";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * One file, placed at the true app root (outside the (marketing) route
 * group) so Next.js's file-convention inheritance applies it as the default
 * share card for every route in the tree — all 38, current and future —
 * without a per-page override. A more specific opengraph-image.tsx placed
 * inside any route segment later would take precedence for that segment
 * only.
 *
 * Uses the warm dark palette (app/globals.css: --color-base, --color-accent)
 * as literal hex — next/og's ImageResponse can't read CSS custom properties,
 * so these can't reference the tokens directly and will drift if the
 * palette changes again — with a system font stack rather than the site's
 * self-hosted
 * fonts — next/font/google's processed files are not addressable as static
 * assets for next/og's ImageResponse, and fetching a font from Google's CDN
 * at request time would make every shared link depend on that fetch
 * succeeding. Same reliability trade CLAUDE.md's fallback stacks make.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#15100C",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 14, height: 14, backgroundColor: "#F7931D", marginRight: 16 }} />
          <div style={{ color: "#F7931D", fontSize: 28, letterSpacing: "-0.01em" }}>SiteOptz</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 920 }}>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 56,
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Marketing intelligence for operators.
          </div>
          <div style={{ color: "#A99A8C", fontSize: 26, marginTop: 24, lineHeight: 1.4 }}>
            Attribution, campaign optimization, and AI implementation, measured to cost per
            booked outcome.
          </div>
        </div>

        <div style={{ display: "flex", height: 6, width: "100%", backgroundColor: "#211913" }}>
          <div style={{ height: "100%", width: 220, backgroundColor: "#F7931D" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
