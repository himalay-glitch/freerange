import type { Metadata } from "next";
import { Work_Sans, Lato } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Primary UI font (loaded from Google Fonts on the original site, weights 200–800)
const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Secondary font referenced by the HubSpot theme overrides (forms, copyright line)
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

// Brand wordmark font ("FREE RANGE"), self-hosted on the original site
const colfax = localFont({
  variable: "--font-colfax",
  display: "swap",
  src: [
    { path: "../fonts/colfax-100.woff2", weight: "100", style: "normal" },
    { path: "../fonts/colfax-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/colfax-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/colfax-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/colfax-700.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Free Range",
  description:
    "We imagine the future and bring your ideas to life with bold brands, creative stories, and product innovation.",
  icons: { icon: "/hubfs/Free-Range/Chicken.svg", shortcut: "/hubfs/Free-Range/Chicken.svg" },
  openGraph: {
    title: "Free Range",
    description:
      "We imagine the future and bring your ideas to life with bold brands, creative stories, and product innovation.",
    images: ["/hubfs/Free-Range-Zoom-Background-Free-Your-Story.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${workSans.variable} ${lato.variable} ${colfax.variable}`}>
      <body>{children}</body>
    </html>
  );
}
