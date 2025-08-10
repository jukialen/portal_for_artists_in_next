import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pfartists',
    short_name: 'Pfartists',
    description: 'Portal for artists.',
    display: 'standalone',
    scope: '/',
    id: '/',
    start_url: '/',
    theme_color: 'hsla(0, 0%, 97%, 0.1)',
    background_color: 'hsla(0, 0%, 97%, 0.1)',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/maskable_icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/desktop-screenshot.png',
        sizes: '932x431',
        type: 'image/png',
        form_factor: 'wide',
        label: 'View of the application on a desktop device',
      },
      {
        src: 'mobile-screenshot.png',
        sizes: '430x933',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'View of the application on a mobile device',
      },
    ],
  };
}
