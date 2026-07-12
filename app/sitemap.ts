import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://flowdesk.web.id';
  
  // Define available locales
  const locales = ['en', 'id'];
  
  // Core routes
  const routes = [
    '',
    '/download',
    '/roadmap',
    '/changelog',
    '/philosophy',
    '/docs',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach(locale => {
    routes.forEach(route => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/download' || route === '/changelog' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : route === '/download' ? 0.9 : route === '/roadmap' || route === '/changelog' ? 0.8 : 0.6,
      });
    });
  });

  return sitemapEntries;
}
