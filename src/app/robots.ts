import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/login/', '/dashboard/', '/portal/'],
    },
    sitemap: 'https://visionify.co.in/sitemap.xml',
  };
}
