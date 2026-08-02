import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
              svgoConfig: {
                plugins: [
                  {
                    name: "convertColors",
                    params: { currentColor: true },
                  },
                ],
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";

    return [
      { source: "/v1/:path*", destination: `${backendUrl}/v1/:path*` },
    ];
  },
};

export default nextConfig;