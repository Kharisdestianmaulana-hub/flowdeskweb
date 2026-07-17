import { MetadataRoute } from 'next'
import { queryD1 } from '@/lib/db'
import { getDocsList } from '@/lib/docs'

const baseUrl = 'https://flowdesk.web.id';
const locales = ['en', 'id'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    { path: '', freq: 'weekly' as const, priority: 1.0 },
    { path: '/download', freq: 'weekly' as const, priority: 0.9 },
    { path: '/blog', freq: 'weekly' as const, priority: 0.8 },
    { path: '/changelog', freq: 'weekly' as const, priority: 0.8 },
    { path: '/roadmap', freq: 'monthly' as const, priority: 0.7 },
    { path: '/docs', freq: 'monthly' as const, priority: 0.7 },
    { path: '/compare', freq: 'monthly' as const, priority: 0.6 },
    { path: '/philosophy', freq: 'monthly' as const, priority: 0.6 },
    { path: '/contact', freq: 'monthly' as const, priority: 0.5 },
    { path: '/sponsor', freq: 'monthly' as const, priority: 0.5 },
    { path: '/license', freq: 'monthly' as const, priority: 0.4 },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static routes
  locales.forEach(locale => {
    routes.forEach(({ path, freq, priority }) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: freq,
        priority,
      });
    });
  });

  // Docs pages
  const enDocs = getDocsList('en');
  enDocs.forEach(doc => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/docs/${doc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  });

  // Blog posts
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
