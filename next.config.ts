import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://online-management-backend.onrender.com/api/:path*',
      },
      {
        source: '/media/:path*',
        destination: 'https://online-management-backend.onrender.com/media/:path*',
      },
    ]
  },
};

export default nextConfig;
