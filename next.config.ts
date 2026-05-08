import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.22", "*.lhr.life"],
  async headers() {
    return [
      {
        source: "/ar/models/:path*.usdz",
        headers: [
          {
            key: "Content-Type",
            value: "model/vnd.usdz+zip",
          },
          {
            key: "Content-Disposition",
            value: "inline",
          },
        ],
      },
    ];
  },
  turbopack: {
    resolveAlias: {
      fs: "./lib/empty-module.ts",
    },
  },
};

export default nextConfig;
