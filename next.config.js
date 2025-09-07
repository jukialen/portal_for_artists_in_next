// next.config.js
/** @type {import("next").NextConfig} */

import { GenerateSW } from 'workbox-webpack-plugin';
import path from 'path';
import { projectUrl, projectUrlWithOutPrefix } from './src/constants/links.js';

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com ${projectUrl} https://region1.analytics.google.com ;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://www.google.com https://www.gstatic.com ${projectUrl} https://www.google.pl;
    font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https://www.google.com https://www.gstatic.com https://www.google.com/recaptcha/ https://recaptcha.google.com/ ${projectUrl};
    frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/ ${projectUrl};
    worker-src 'self'; 
    child-src 'self';
`;

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
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
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
      {
        source: '/workbox-:hash.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.output.publicPath = '/_next/';

      const publicFolderRoot = path.join(process.cwd(), 'public');

      config.plugins.push(
        new GenerateSW({
          swDest: path.join(publicFolderRoot, 'sw.js'),
          clientsClaim: true,
          skipWaiting: true,
          include: [
            /^\/_next\/static\//,
            '/',
            '/manifest.webmanifest',
            '/icon-192x192.png',
            '/icon-256x256.png',
            '/icon-384x384.png',
            '/icon-512x512.png',
            '/maskable_icon-512x512.png',
            '/apple-touch-icon.png',
            '/pfartists.png',
            '/desktop-screenshot.png',
            '/mobile-screenshot.png',
          ],
          exclude: [
            /\.map$/,
            /asset-manifest\.json$/,
            /\/_next\/static\/webpack\//,
            /\/_next\/static\/chunks\/(pages|app)\/_app\.js/,
            /\/_next\/static\/chunks\/pages\/_error\.js/,
            /\/_next\/static\/chunks\/pages\/_document\.js/,
          ],
          runtimeCaching: [
            {
              urlPattern: /^\/_next\/static\/chunks\/(pages|app)\/.*\.js$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'next-js-chunks',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 7 * 24 * 60 * 60,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
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
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|apng|webm|mp4)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'media-cache',
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
