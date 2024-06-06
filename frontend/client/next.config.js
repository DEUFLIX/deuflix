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

<<<<<<< HEAD
module.exports = {
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

=======
>>>>>>> origin/IK4P1N4
module.exports = nextConfig;
