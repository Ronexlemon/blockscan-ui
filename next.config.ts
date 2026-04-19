import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self' http://localhost:8080;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
