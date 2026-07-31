import { queryD1 } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/dictionary';
import { getRepoInfo } from '@/lib/github';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import remarkGfm from 'remark-gfm';

export async function generateMetadata({ params }: { params: Promise<{ lang: string, version: string }> }) {
  const resolvedParams = await params;
  const { lang, version } = resolvedParams;
  
  let changelog = null;
  try {
    const results = await queryD1("SELECT * FROM changelogs WHERE version = ? AND status = 'published'", [version]);
    if (results && results.length > 0) {
      changelog = results[0];
    }
  } catch (e) {
    console.error(e);
  }

  if (!changelog) {
    return { title: 'Not Found | FlowDesk' };
  }

  return {
    title: `${changelog.title} - ${changelog.version} | FlowDesk Changelog`,
    description: changelog.content.substring(0, 150) + '...',
  };
}

export default async function ChangelogDetailPage({ params }: { params: Promise<{ lang: string, version: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const version = decodeURIComponent(resolvedParams.version);
  
  const dict = await getDictionary(lang);
  const repoInfo = await getRepoInfo();
  
  let changelog = null;
  try {
    const results = await queryD1("SELECT * FROM changelogs WHERE version = ? AND status = 'published'", [version]);
    if (results && results.length > 0) {
      changelog = results[0];
    }
  } catch (e) {
    console.error(e);
  }

  if (!changelog) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <div className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <Link 
          href={`/${lang}/changelog`}
          className="inline-flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {lang === 'id' ? 'Kembali ke Daftar Update' : 'Back to Changelogs'}
        </Link>
        
        <article className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 sm:p-12 shadow-sm">
          <header className="mb-10 border-b border-[var(--color-border)] pb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-text-accent)] text-[14px] font-mono font-medium">
                {changelog.version}
              </span>
              <span className="text-[14px] text-[var(--color-text-muted)]">
                {new Date(changelog.published_at).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-[800] text-[var(--color-text-primary)] leading-tight">
              {changelog.title}
            </h1>
          </header>
          
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-[var(--color-primary)] prose-img:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {changelog.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
