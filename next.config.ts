import type { NextConfig } from "next";

const apiBase = process.env.NEXT_PUBLIC_API_BASE || "https://online-management-backend.onrender.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
      {
        source: '/media/:path*',
        destination: `${apiBase}/media/:path*`,
      },
    ]
  },
};

export default nextConfig;
