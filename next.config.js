/** @type {import('next').NextConfig} */


module.exports = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'jp', 'pl'],
    defaultLocale: 'en',
  },
  images: {
    deviceSizes: [280, 320, 375, 425, 768, 1024, 1200, 1440, 2560],
    loader: 'default',
    domains: ['firebasestorage.googleapis.com', 's.yimg.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
