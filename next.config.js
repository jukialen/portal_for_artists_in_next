/** @type {import("next").NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
})

module.exports = withPWA({
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'jp', 'pl'],
    defaultLocale: 'en',
  },
  images: {
    deviceSizes: [280, 320, 375, 425, 768, 1024, 1200, 1440, 2560],
    loader: 'default',
    domains: ['firebasestorage.googleapis.com', 's.yimg.com', 'localhost', 'pfartists.xyz'],
    formats: ['image/avif', 'image/webp'],
  },
});
