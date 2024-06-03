/** @type {import('next').NextConfig} */
const { withFonts } = require('next-fonts');

module.exports = withFonts({
  webpack(config) {
    return config;
  },
});

const nextConfig = {
  experimental: {
    taint: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatars.githubusercontent.com',
      },
      {
        hostname: 'imagedelivery.net',
      },
      {
        hostname: 't1.kakaocdn.net',
      },
    ],
  },
};

export default nextConfig;
