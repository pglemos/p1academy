import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.cba.org.br",
      },
      {
        protocol: "https",
        hostname: "backend.fiakarting.com",
      },
    ],
  },
};

export default nextConfig;
