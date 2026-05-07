import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.113:8080/hexaquiz'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
