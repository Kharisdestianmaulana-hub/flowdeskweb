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
import { ArrowLeft, Clock } from 'lucide-react';
import ProgressBar from '@/components/blog/ProgressBar';
import ShareButtons from '@/components/blog/ShareButtons';

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

function generateId(text: any) {
  if (!text) return '';
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

import TableOfContents from '@/components/blog/TableOfContents';

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }): Promise<import('next').Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  
  if (!post) {
    return { title: 'Post Not Found | FlowDesk' };
  }

  const parsedContent = post.content.replace(/\\n/g, '\n');
  const descriptionMatch = parsedContent.match(/^(?!#|>|-|\*).+$/m);
  const description = descriptionMatch ? descriptionMatch[0].slice(0, 160).trim() + '...' : 'Artikel terbaru dari blog FlowDesk.';

  const ogImageUrl = post.cover_image 
    ? `https://flowdesk.web.id/_next/image?url=${encodeURIComponent(post.cover_image)}&w=1200&q=75` 
    : '';

  return {
    title: `${post.title} | FlowDesk Blog`,
    description,
    openGraph: {
      title: post.title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
      type: 'article',
      publishedTime: post.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    }
  };
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

  // Fix literal newlines from database
  const parsedContent = post.content.replace(/\\n/g, '\n');

  // Reading time
  const wordCount = parsedContent.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Extract ToC
  const headings = parsedContent.match(/^(##|###) (.*$)/gim) || [];
  const toc = headings.map((h: string) => ({
    level: h.startsWith('###') ? 3 : 2,
    text: h.replace(/^(##|###) /, '').trim(),
    id: generateId(h.replace(/^(##|###) /, '').trim())
  }));

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <div className="flex-1 w-full max-w-6xl mx-auto px-6 pt-10 pb-24 sm:pt-16 sm:pb-32 flex flex-col lg:flex-row gap-12 xl:gap-24 items-start justify-center">
        
        {/* Main Article Content */}
        <article className="w-full lg:w-[720px] shrink-0">
          <Link href={`/${lang}/blog`} className="inline-flex items-center text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors mb-8 sm:mb-12">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to blog
          </Link>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] leading-[1.1] mb-6 tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--color-text-muted)] mb-10 sm:mb-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-xs">
                FD
              </div>
              <span className="font-medium text-[var(--color-text-primary)]">FlowDesk Team</span>
            </div>
            <div className="flex items-center gap-2">
              <time dateTime={post.created_at}>
                {format(new Date(post.created_at), 'MMMM d, yyyy')}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {post.cover_image && (
            <div className="relative w-full aspect-[16/9] mb-12 sm:mb-16 rounded-2xl overflow-hidden border border-[var(--color-border-subtle)] shadow-lg">
              <Image 
                src={post.cover_image} 
                alt={post.title} 
                fill 
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Mobile Table of Contents */}
          {toc.length > 0 && (
            <div className="lg:hidden mb-10 p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-sm">
              <h4 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-4">
                On this page
              </h4>
              <ul className="space-y-3 text-sm">
                {toc.map((item: { level: number; text: string; id: string }, i: number) => (
                  <li key={i} className={`${item.level === 3 ? 'ml-4' : ''}`}>
                    <a 
                      href={`#${item.id}`} 
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors line-clamp-2"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="
            prose prose-invert max-w-none 
            prose-headings:text-[var(--color-text-primary)] prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:mt-10 prose-h1:mb-6
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-[var(--color-border-subtle)] prose-h2:pb-3
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-[var(--color-text-secondary)] prose-p:leading-[1.8] prose-p:text-[18px] prose-p:mb-6
            prose-a:text-[var(--color-primary)] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[var(--color-text-primary)]
            prose-li:text-[var(--color-text-secondary)] prose-li:text-[18px] prose-li:leading-[1.8]
            prose-ul:mt-4 prose-ul:mb-8 prose-ul:space-y-2
            prose-ol:mt-4 prose-ol:mb-8 prose-ol:space-y-2
            prose-code:text-[var(--color-text-primary)] prose-code:bg-[var(--color-surface-raised)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-code:font-medium
            prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-[#30363d] prose-pre:rounded-xl prose-pre:shadow-sm prose-pre:my-10
            prose-blockquote:border-l-[4px] prose-blockquote:border-[var(--color-primary)] prose-blockquote:bg-[var(--color-surface)] prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:my-10 prose-blockquote:not-italic prose-blockquote:text-[var(--color-text-muted)] prose-blockquote:text-[20px] prose-blockquote:leading-relaxed prose-blockquote:rounded-r-xl
            prose-img:rounded-2xl prose-img:border prose-img:border-[var(--color-border-subtle)] prose-img:w-full prose-img:shadow-sm prose-img:my-12
            prose-hr:border-[var(--color-border)] prose-hr:my-14
            prose-table:w-full prose-table:my-10 prose-th:bg-[var(--color-surface-raised)] prose-th:p-4 prose-td:p-4 prose-td:border-t prose-td:border-[var(--color-border-subtle)]
          ">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({node, ...props}) => <h2 id={generateId(props.children)} className="scroll-mt-24" {...props} />,
                h3: ({node, ...props}) => <h3 id={generateId(props.children)} className="scroll-mt-24" {...props} />
              }}
            >
              {parsedContent}
            </ReactMarkdown>
          </div>

          <ShareButtons title={post.title} />
        </article>

        {/* Sticky Table of Contents sidebar for Desktop */}
        <TableOfContents toc={toc} />

      </div>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
