import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://skylex.com';
  const locales = ['en', 'fr', 'he', 'es'];
  const currentDate = new Date();

  // Main pages
  const mainPages = ['', '/login', '/register', '/dashboard'];

  // Generate URLs for all locales
  const urls: MetadataRoute.Sitemap = [];

  // Homepage with highest priority
  locales.forEach((locale) => {
    urls.push({
      url: `${baseUrl}/${locale}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}`])
        ),
      },
    });
  });

  // Auth and dashboard pages
  mainPages.slice(1).forEach((page) => {
    locales.forEach((locale) => {
      urls.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${page}`])
          ),
        },
      });
    });
  });

  // Admin pages (lower priority, exclude from public sitemap if needed)
  const adminPages = ['/admin', '/admin/claims', '/admin/users'];
  adminPages.forEach((page) => {
    locales.forEach((locale) => {
      urls.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 0.5,
      });
    });
  });

  return urls;
}
