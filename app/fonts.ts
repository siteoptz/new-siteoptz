import { Inter, Inter_Tight, Source_Serif_4 } from "next/font/google";

export const fontDisplay = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display-src",
  display: "swap",
  fallback: ["system-ui", "arial"],
  preload: true,
});

export const fontSans = Inter({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-sans-src",
  display: "swap",
  fallback: ["system-ui", "arial"],
  preload: false,
});

export const fontSerif = Source_Serif_4({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-serif-src",
  display: "swap",
  fallback: ["Georgia", "serif"],
  preload: false,
});
