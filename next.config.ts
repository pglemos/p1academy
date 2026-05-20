import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingIncludes: {
    "/api/competicoes/legends/live": ["./node_modules/@sparticuz/chromium/bin/**/*"],
  },
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
