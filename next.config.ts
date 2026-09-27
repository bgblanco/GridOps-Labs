import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/journal", destination: "/white-papers", permanent: true },
      { source: "/journal/:slug", destination: "/white-papers/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
