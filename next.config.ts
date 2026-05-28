import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // These packages use Node.js native modules and must run in the Node.js
  // runtime, not bundled by webpack. Required for Prisma + Neon + bcrypt + jwt.
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-neon",
    "@neondatabase/serverless",
    "bcryptjs",
    "jsonwebtoken",
    "cloudinary",
    "ws",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Replicate — AI try-on result images (Phase A — active)
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "*.replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "pbxt.replicate.delivery",
      },
      // Fashn.ai CDN — AI try-on result images (Phase B — future)
      {
        protocol: "https",
        hostname: "*.fashn.ai",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
