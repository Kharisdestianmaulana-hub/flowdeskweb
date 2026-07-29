import { getDocData, getDocsList } from '@/lib/docs';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<import('next').Metadata> {
  const { lang, slug } = await params;
  const doc = await getDocData(lang, slug);
  if (!doc) return { title: 'Not Found | FlowDesk Docs' };

  const canonicalUrl = `https://flowdesk.web.id/en/docs/${slug}`;
  const description = `${doc.title} — FlowDesk documentation. Learn how to use FlowDesk, the offline-first local workspace app.`;

  return {
    title: `${doc.title} | FlowDesk Docs`,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `https://flowdesk.web.id/en/docs/${slug}`,
        'id': `https://flowdesk.web.id/id/docs/${slug}`,
      },
    },
    openGraph: {
      title: `${doc.title} | FlowDesk Docs`,
      description,
      url: canonicalUrl,
      type: 'article',
    },
  };
}



export default async function DocPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
  const { lang, slug } = await params;
  const doc = await getDocData(lang, slug);

  if (!doc) {
    notFound();
  }

  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-3xl font-[700] text-[var(--color-text-primary)] tracking-tight mb-8 pb-4 border-b border-[var(--color-border-subtle)]">
        {doc.title}
      </h1>
      <div className="text-[16px] leading-[1.8] text-[var(--color-text-secondary)]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {doc.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
