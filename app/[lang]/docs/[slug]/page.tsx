import { getDocData } from '@/lib/docs';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function DocPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
  const { lang, slug } = await params;
  const doc = getDocData(lang, slug);

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
