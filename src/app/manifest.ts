import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Visionify India',
    short_name: 'Visionify',
    description: 'Visionify India is the official platform for creative designs that make brands, events, and celebrations impossible to ignore. Explore our services, solutions, portfolio and contact our team.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#6E1EDB',
    icons: [
      {
        src: '/logo.jpeg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/logo.jpeg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  };
}
