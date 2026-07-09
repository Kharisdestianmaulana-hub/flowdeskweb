import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getDictionary } from '@/lib/dictionary';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getRepoInfo } from '@/lib/github';
import { ArrowRight } from 'lucide-react';

import BlogClient from '@/components/blog/BlogClient';

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
      body: JSON.stringify({ sql: 'SELECT p.*, u.username as author_username FROM posts p LEFT JOIN users u ON p.author = u.display_name ORDER BY p.created_at DESC' }),
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
      
      <div className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-20 sm:py-28">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-[800] tracking-tight text-[var(--color-text-primary)] mb-6">
            FlowDesk <span className="text-[var(--color-primary)]">Journal</span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] leading-relaxed">
            Stories, insights, and updates from the team building the offline-first productivity haven.
          </p>
        </div>

        <BlogClient posts={posts} lang={lang} dict={dict} />
      </div>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
