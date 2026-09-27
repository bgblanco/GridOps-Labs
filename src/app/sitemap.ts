import type { MetadataRoute } from "next";
import { site } from "@/lib/content/site";
import { whitepapers } from "@/lib/content/whitepapers";
import { scenarios } from "@/lib/scenarios";
import { challenges } from "@/lib/content/challenges";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const paths = [
    "/", "/decision-labs", "/for-utilities", "/challenge", "/white-papers", "/about", "/contact",
    ...scenarios.map((s) => `/labs/${s.metadata.slug}`),
    ...whitepapers.map((a) => `/white-papers/${a.slug}`),
    ...challenges.map((c) => `/challenge/${c.id}`),
  ];
  return paths.map((p) => ({ url: `${base}${p}` }));
}
