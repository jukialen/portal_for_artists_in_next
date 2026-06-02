export default {
  globDirectory: 'public/',
  globPatterns: ['**/*.{png,jpg,jpeg,svg,gif,webp,avif,ico,json,webmanifest}'],
  swDest: 'public/sw.js',
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      // Supabase Storage: NetworkFirst for everything EXCEPT video
      // This allows videos to bypass the SW and use native browser Range Requests.
      urlPattern: ({ url, request }) => url.href.includes('.supabase.co/storage') && request.destination !== 'video',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-storage',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 Year
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|webp|avif|ico)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
    {
      urlPattern: /\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 16,
          maxAgeSeconds: 24 * 60 * 60, // 24 Hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      // Catch-all for same-origin requests only, excluding media
      urlPattern: ({ url, request }) =>
        url.origin === self.location.origin &&
        !url.pathname.match(/\.(?:mp4|hevc|webm)$/i) &&
        request.destination !== 'video',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'others',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 Hours
        },
        cacheableResponse: {
          statuses: [200],
        },
      },
    },
  ],
};
