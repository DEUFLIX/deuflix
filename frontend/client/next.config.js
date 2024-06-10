/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['assets.nflxext.com'],
  },
  env: {
    NEXT_PUBLIC_API: 'http://localhost:8080/api',
    NEXT_PUBLIC_NODE_API: 'http://localhost:8081/api',
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

module.exports = {
  ...nextConfig,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    });

    return config;
  },
};

module.exports = nextConfig;