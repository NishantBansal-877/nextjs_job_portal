import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "3y36wopflv.ufs.sh", protocol: "https" }],
  },
};

export default nextConfig;
