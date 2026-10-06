import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GridOpsHeader } from "@/components/site/GridOpsHeader";
import { GridOpsFooter } from "@/components/site/GridOpsFooter";
import { site } from "@/lib/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "GridOps Labs · Distribution operator training",
    template: "%s · GridOps Labs",
  },
  description: site.description,
  keywords: [
    "distribution operator training",
    "distribution system operator training",
    "electric utility operator training",
    "distribution operations training",
    "grid operator training",
    "scenario-based utility training",
    "operator proficiency training",
  ],
  openGraph: {
    type: "website",
    siteName: "GridOps Labs",
    title: "GridOps Labs · Practice the decisions before they happen on the desk",
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary", title: "GridOps Labs", description: site.description },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edf0f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1116" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap"
        />
      </head>
      <body>
        <GridOpsHeader />
        <main id="main">{children}</main>
        <GridOpsFooter />
      </body>
    </html>
  );
}
