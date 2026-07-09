import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-0057875638a74890acc68f4ece19f7a3.r2.dev',
      },
    ],
  },
};

export default nextConfig;
