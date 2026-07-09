import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getDictionary } from '@/lib/dictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getRepoInfo } from '@/lib/github';
import { ArrowRight } from 'lucide-react';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const dbId = process.env.CLOUDFLARE_DATABASE_ID;
const token = process.env.CLOUDFLARE_D1_TOKEN;

async function getPosts() {
  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql: 'SELECT * FROM posts ORDER BY created_at DESC' }),
      next: { revalidate: 60 } // Revalidate every minute
    });
    
    if (!res.ok) return [];
    const data = await res.json();
    return data.result[0].results || [];
  } catch (e) {
    console.error('Failed to fetch posts for blog page', e);
    return [];
  }
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const dict = await getDictionary(lang);
  const repoInfo = await getRepoInfo();
  const posts = await getPosts();

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-24 sm:py-32">
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-[800] tracking-tight text-[var(--color-text-primary)] mb-4">
            {dict.blog?.title || 'Updates'}
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            {dict.blog?.subtitle || 'Latest news, product updates, and articles from FlowDesk.'}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="py-20 text-center border border-[var(--color-border)] rounded-2xl border-dashed">
            <p className="text-[var(--color-text-muted)]">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link href={`/${lang}/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-[var(--shadow-elevated)] hover:border-[var(--color-border-hover)] transition-all">
                <div className="relative aspect-[16/10] w-full bg-[var(--color-surface-raised)] border-b border-[var(--color-border)] overflow-hidden">
                  {post.cover_image ? (
                    <Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)] text-sm">No cover image</div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs font-mono text-[var(--color-text-muted)] mb-3">
                    {format(new Date(post.created_at), 'MMMM d, yyyy')}
                  </p>
                  <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 mb-6 flex-1">
                    {post.content.replace(/[#*`>]/g, '').substring(0, 150)}...
                  </p>
                  <div className="flex items-center text-sm font-medium text-[var(--color-primary)]">
                    Read more <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
