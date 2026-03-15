/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/stamp-collection",
  assetPrefix: "/stamp-collection",
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000" },
    ],
  },
  async rewrites() {
    return [
      { source: "/api/:path*",     destination: "http://localhost:8001/api/:path*" },
      { source: "/uploads/:path*", destination: "http://localhost:8001/uploads/:path*" },
    ];
  },
};
module.exports = nextConfig;
