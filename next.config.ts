import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  transpilePackages: ["@/"],
  // 정적 생성 방지
  generateEtags: false,
};

export default nextConfig;
