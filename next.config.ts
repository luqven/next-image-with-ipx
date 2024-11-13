import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.IPX_REMOTE_STORAGE || "*",
      },
    ],
  },
};

export default nextConfig;
