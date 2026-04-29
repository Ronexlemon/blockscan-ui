import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src *",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "connect-src *",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "img-src * data:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;