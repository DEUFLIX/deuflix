/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['assets.nflxext.com'],
  },
  env: {
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
  },
  async rewrites() {
    return [
      {
        source: "/movies",
        destination: "/",
      },
      {
        source: "/series",
        destination: "/",
      },
      {
        source: "/my-list",
        destination: "/userList",
      },
    ];
  },
};

module.exports = nextConfig;
