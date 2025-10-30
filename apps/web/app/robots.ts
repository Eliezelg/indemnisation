import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://skylex.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/en/',
          '/fr/',
          '/he/',
          '/es/',
          '/login',
          '/register',
        ],
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/*?*utm_*', // Exclude URLs with UTM parameters from indexing
          '/*/admin/', // Exclude admin pages in all locales
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
        crawlDelay: 0,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
