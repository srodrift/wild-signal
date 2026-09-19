import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    localPatterns: [
      {
        pathname: "/encounters/**",
      },
      {
        pathname: "/brand/**",
      },
      {
        pathname: "/slides/**",
      },
      {
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
