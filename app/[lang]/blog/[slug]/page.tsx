import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getDictionary } from '@/lib/dictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getRepoInfo } from '@/lib/github';
import { ArrowLeft } from 'lucide-react';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const dbId = process.env.CLOUDFLARE_DATABASE_ID;
const token = process.env.CLOUDFLARE_D1_TOKEN;

async function getPost(slug: string) {
  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql: 'SELECT * FROM posts WHERE slug = ? LIMIT 1', params: [slug] }),
      next: { revalidate: 60 }
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    const results = data.result[0].results;
    return results.length > 0 ? results[0] : null;
  } catch (e) {
    console.error('Failed to fetch post', e);
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const repoInfo = await getRepoInfo();

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <article className="flex-1 max-w-3xl mx-auto w-full px-6 py-24 sm:py-32">
        <Link href={`/${lang}/blog`} className="inline-flex items-center text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to blog
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-[800] tracking-tight leading-[1.15] text-[var(--color-text-primary)] mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
            <time dateTime={post.created_at}>
              {format(new Date(post.created_at), 'MMMM d, yyyy')}
            </time>
          </div>
        </header>

        {post.cover_image && (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-16 border border-[var(--color-border)] shadow-sm">
            <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="prose prose-invert max-w-none 
          prose-headings:text-[var(--color-text-primary)] prose-headings:font-bold
          prose-p:text-[var(--color-text-secondary)] prose-p:leading-relaxed prose-p:text-[17px]
          prose-a:text-[var(--color-primary)] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[var(--color-text-primary)]
          prose-li:text-[var(--color-text-secondary)]
          prose-code:text-[var(--color-text-primary)] prose-code:bg-[var(--color-surface-raised)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-[#30363d]
          prose-blockquote:border-l-[var(--color-primary)] prose-blockquote:bg-[var(--color-surface)] prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-[var(--color-text-secondary)]
          prose-img:rounded-xl prose-img:border prose-img:border-[var(--color-border)]
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
