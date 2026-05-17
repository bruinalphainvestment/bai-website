import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bruin Alpha Investment',
    short_name: 'BAI',
    description:
      'UCLA student-led investment club bridging academic finance with real-world markets.',
    start_url: '/',
    display: 'standalone',
    theme_color: '#031E42',
    background_color: '#FAF7F2',
    icons: [
      {
        src: '/brand/favicon/png/favicon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/brand/favicon/png/favicon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
