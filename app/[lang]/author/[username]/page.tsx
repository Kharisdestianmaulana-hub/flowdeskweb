import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/dictionary';
import { getRepoInfo } from '@/lib/github';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ArrowRight, Link as LinkIcon } from 'lucide-react';
import { queryD1 } from '@/lib/db';

async function getAuthorByUsername(username: string) {
  try {
    const users = await queryD1('SELECT id, username, display_name, bio, social_links FROM users WHERE username = ?', [username]);
    if (users.length === 0) return null;
    return users[0];
  } catch (e) {
    return null;
  }
}

async function getPostsByAuthor(displayName: string) {
  try {
    return await queryD1('SELECT * FROM posts WHERE author = ? ORDER BY created_at DESC', [displayName]);
  } catch (e) {
    return [];
  }
}

export default async function AuthorPage({ params }: { params: Promise<{ lang: string, username: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const username = resolvedParams.username;
  
  const dict = await getDictionary(lang);
  const repoInfo = await getRepoInfo();
  
  const author = await getAuthorByUsername(username);
  if (!author) {
    notFound();
  }

  const posts = await getPostsByAuthor(author.display_name);

  // Simple avatar generator based on initials
  const initials = author.display_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <div className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-20 sm:py-28">
        
        {/* Author Profile Header */}
        <div className="mb-16 flex flex-col md:flex-row items-start md:items-center gap-8 bg-[var(--color-surface)] border border-[var(--color-border)] p-8 md:p-12 rounded-[2rem] shadow-sm">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white font-black text-4xl sm:text-5xl shadow-inner shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
              {author.display_name}
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-3xl mb-6">
              {author.bio || (lang === 'id' ? 'Penulis ini belum menambahkan deskripsi.' : 'This author hasn\'t added a bio yet.')}
            </p>
            {author.social_links && (
              <a href={author.social_links.startsWith('http') ? author.social_links : `https://${author.social_links}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] hover:underline bg-[var(--color-primary)]/10 px-4 py-2 rounded-full transition">
                <LinkIcon className="w-4 h-4" /> Connect with Author
              </a>
            )}
          </div>
        </div>

        {/* Posts by Author */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            {lang === 'id' ? 'Artikel oleh' : 'Articles by'} {author.display_name}
          </h2>
          <p className="text-[var(--color-text-muted)]">
            {posts.length} {lang === 'id' ? 'artikel ditemukan' : 'articles found'}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="py-20 text-center border border-[var(--color-border)] rounded-2xl border-dashed">
            <p className="text-[var(--color-text-muted)]">No posts yet from this author.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link href={`/${lang}/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-[var(--shadow-elevated)] hover:border-[var(--color-primary)] transition-all duration-300">
                <div className="relative aspect-[16/10] w-full bg-[var(--color-surface-raised)] border-b border-[var(--color-border-subtle)] overflow-hidden">
                  {post.cover_image ? (
                    <Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)] text-sm">No cover image</div>
                  )}
                </div>
                <div className="p-6 sm:p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 mb-8 flex-1 leading-relaxed">
                    {post.content.replace(/[#*`>]/g, '').substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--color-border-subtle)]">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <time className="text-xs font-medium text-[var(--color-text-muted)]">{format(new Date(post.created_at), 'MMM d, yyyy')}</time>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[var(--color-surface-raised)] group-hover:bg-[var(--color-primary)] group-hover:text-white flex items-center justify-center text-[var(--color-text-muted)] transition-colors">
                      <ArrowRight className="w-4 h-4 transform group-hover:-rotate-45 transition-transform" />
                    </div>
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
