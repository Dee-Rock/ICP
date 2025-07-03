import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://m.media-amazon.com/**"),
      new URL("https://image.tmdb.org/**"),
      new URL("https://via.placeholder.com/**"),
    ],
  },

  // Deployment optimization
  serverExternalPackages: [
    "@google-cloud/firestore",
    "@google-cloud/translate",
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
