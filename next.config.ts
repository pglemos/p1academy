import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingIncludes: {
    "/api/campeonatos/legends/live": ["./node_modules/@sparticuz/chromium/bin/**/*"],
  },
  async redirects() {
    return [
      {
        source: "/competicoes/:path*",
        destination: "/campeonatos/:path*",
        permanent: true,
      },
      {
        source: "/api/competicoes/:path*",
        destination: "/api/campeonatos/:path*",
        permanent: false,
      },
      {
        source: "/calendario-tracados/:path*",
        destination: "/tracados/:path*",
        permanent: true,
      },
    ];
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
