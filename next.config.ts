import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/the-art-of-joy-companion",
  images: { unoptimized: true },
};

export default nextConfig;
