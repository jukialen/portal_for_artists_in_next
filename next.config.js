/** @type {import("next").NextConfig} */

const S3_HOST = process.env.NEXT_PUBLIC_S3_URL;

module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: S3_HOST,
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's.yimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/pfartists/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};
