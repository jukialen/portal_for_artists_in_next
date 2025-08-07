/** @type {import("next").NextConfig} */

import { GenerateSW } from 'workbox-webpack-plugin';
import path from 'path';
import { projectUrlWithOutPrefix } from './src/constants/links.js';

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-cookieyes.com',
        port: '',
        pathname: '/',
      },
      {
        protocol: 'https',
        hostname: projectUrlWithOutPrefix,
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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      const publicPath = path.join(process.cwd(), 'public');

      config.output.publicPath = '/';

      config.plugins.push(
        new GenerateSW({
          swDest: path.join(publicPath, 'sw.js'),
          clientsClaim: true,
          skipWaiting: true,
          include: [
            /^static\//,
            /^\/$/,
            '/manifest.webmanifest',
            '/icon-192x192.png',
            '/icon-256x256.png',
            '/icon-384x384.png',
            '/icon-512x512.png',
            '/maskable_icon-512x512.png',
            '/apple-touch-icon.png',
            '/pfartists.png',
          ],
          exclude: [/\.map$/, /asset-manifest\.json$/],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.origin === self.location.origin,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'nextjs-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                },
              },
            },
            {
              urlPattern: /\.(?:gif|webp|avif|apng|webm|mp4)$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                },
              },
            },
            {
              urlPattern: ({ url }) => url.pathname.startsWith('/languages/'),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'language-files-cache',
                expiration: {
                  maxAgeSeconds: 7 * 24 * 60 * 60,
                },
              },
            },
            // Przykład dla API: Network First (jeśli API często się zmienia)
            {
              urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60,
                },
              },
            },
          ],
        }),
      );
    }
    return config;
  },
};

export default nextConfig;
