import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-b634f17d23194dc5b3d768912b9d1565.r2.dev',
        pathname: '/**',
      },
    ],
    deviceSizes: [320, 480, 768, 1024, 1280],
    imageSizes: [16, 32, 48, 64, 128],
    minimumCacheTTL: 2678400, // 31 days
    formats: ['image/webp'],
    qualities: [50, 75, 90],

  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    }
  }
};

export default nextConfig;
