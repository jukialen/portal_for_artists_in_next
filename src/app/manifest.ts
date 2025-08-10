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
  };
}
