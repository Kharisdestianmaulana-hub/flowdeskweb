import { MetadataRoute } from 'next'
import { queryD1 } from '@/lib/db'

const baseUrl = 'https://flowdesk.web.id';
const locales = ['en', 'id'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '',
    '/download',
    '/roadmap',
    '/changelog',
    '/philosophy',
    '/docs',
    '/blog',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach(locale => {
    routes.forEach(route => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/download' || route === '/changelog' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : route === '/download' ? 0.9 : route === '/roadmap' || route === '/changelog' ? 0.8 : route === '/blog' ? 0.8 : 0.6,
      });
    });
  });

  try {
    const posts = await queryD1(
      "SELECT slug, published_at FROM posts WHERE status = 'published' AND datetime(published_at) <= datetime('now') ORDER BY published_at DESC"
    );

    for (const post of posts) {
      locales.forEach(locale => {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.published_at ? new Date(post.published_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      });
    }
  } catch (e) {
    console.error('sitemap: failed to fetch posts', e);
  }

  return sitemapEntries;
}
