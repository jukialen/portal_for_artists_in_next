// next.config.js
/** @type {import("next").NextConfig} */

import {
  faroHost,
  faroHostWithoutProtocol,
  lokiHost,
  paddleBuyLink,
  paddleCspLink,
  paddleStyles,
  projectUrl,
  projectUrlWithOutPrefix,
} from './src/constants/links.js';

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com
     ${projectUrl} https://region1.analytics.google.com ${paddleCspLink};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com ${paddleCspLink} ${paddleBuyLink} ${paddleStyles};
    img-src 'self' blob: data: https://www.google.com https://www.gstatic.com ${projectUrl} https://www.google.pl;
    media-src 'self' blob: data: https://www.google.com https://www.gstatic.com ${projectUrl} https://www.google.pl;
    font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors none;
    connect-src 'self' https://www.google.com https://www.gstatic.com https://www.google.com/recaptcha/ https://recaptcha.google.com/ ${projectUrl}  ${lokiHost} ${faroHost}
    https://api.paddle.com https://checkout.paddle.com https://events.paddle.com ${paddleCspLink} https://www.google.com/pay https://sandbox-checkout.paddle.com;
    frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/ ${projectUrl} https://checkout.paddle.com 
    ${paddleBuyLink} https://play.google.com ${paddleCspLink} https://www.google.com/pay;
    worker-src 'self'; 
    child-src 'self';
`;

const nextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [75, 100],
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
      {
        protocol: 'https',
        hostname: faroHostWithoutProtocol,
        port: '',
        pathname: '/**',
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
};

export default nextConfig;
