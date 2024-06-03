/** @type {import('next').NextConfig} */
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
