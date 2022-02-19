/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");

import('firebase/firestore').then(() => {
  const firestore = app.firestore();
  // Use Cloud Firestore ...
  firestore.enableIndexedDbPersistence()
  .catch((e) => {
    if (e.code === 'failed-precondition') {
      console.error(e.code)
    } else if (e.code === 'unimplemented') {
      console.error(e.code)
    }
  });
});

module.exports = withPWA({
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
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
});

