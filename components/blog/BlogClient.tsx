'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Search, ArrowRight, Clock, Eye } from 'lucide-react';

export default function BlogClient({ posts, lang, dict }: { posts: any[], lang: string, dict: any }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Extract all unique categories from posts, split by comma
  const allCategories = Array.from(new Set(
    posts.flatMap(post => post.category ? post.category.split(',').map((c: string) => c.trim()).filter(Boolean) : [])
  )).sort();
  const categories = ['All', ...allCategories];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (activeCategory !== 'All') {
      const postCategories = post.category ? post.category.split(',').map((c: string) => c.trim()) : [];
      matchesCategory = postCategories.includes(activeCategory);
    }

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (debouncedSearchQuery.trim() !== '') {
      const query = debouncedSearchQuery.toLowerCase();
      
      const getScore = (post: any) => {
        let score = 0;
        const title = post.title.toLowerCase();
        const content = post.content.toLowerCase();
        
        if (title === query) score += 100;
        else if (title.startsWith(query)) score += 50;
        else if (title.includes(query)) score += 30;
        
        if (content.includes(query)) {
           score += 5;
           const occurrences = (content.split(query).length - 1);
           score += Math.min(occurrences, 10); 
        }
        return score;
      };

      const scoreA = getScore(a);
      const scoreB = getScore(b);

      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const regularPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  const getReadingTime = (text: string) => Math.max(1, Math.ceil(text.split(/\s+/).length / 200));

  return (
    <div className="w-full">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat 
                  ? 'bg-[var(--color-primary)] text-white shadow-md' 
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="py-32 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl border-dashed">
          <p className="text-[var(--color-text-muted)] text-lg">No articles found matching your criteria.</p>
          <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="mt-4 text-[var(--color-primary)] hover:underline font-medium">Clear filters</button>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Featured Post */}
          {featuredPost && (
            <Link href={`/${lang}/blog/${featuredPost.slug}`} className="group block relative rounded-[2rem] bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shadow-sm hover:shadow-[var(--shadow-elevated)] hover:border-[var(--color-primary)] transition-all duration-300">
              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-3/5 aspect-[16/10] lg:aspect-auto lg:min-h-[480px] relative overflow-hidden bg-[var(--color-surface-raised)] border-r border-[var(--color-border-subtle)]">
                  {featuredPost.cover_image ? (
                    <Image src={featuredPost.cover_image} alt={featuredPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" priority />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)] text-sm">No cover image</div>
                  )}
                </div>
                <div className="w-full lg:w-2/5 p-8 sm:p-12 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider rounded-full">Featured</span>
                    {featuredPost.category && featuredPost.category.split(',').map((cat: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-bold uppercase tracking-wider rounded-full">{cat.trim()}</span>
                    ))}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4 leading-tight group-hover:text-[var(--color-primary)] transition-colors line-clamp-3">
                    {featuredPost.title}
                  </h2>
                  <p className="text-[var(--color-text-secondary)] text-lg mb-8 line-clamp-3 leading-relaxed">
                    {featuredPost.content.replace(/[#*`>]/g, '').substring(0, 200)}...
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-8 border-t border-[var(--color-border-subtle)]">
                    <div className="flex items-center gap-3">
                      {featuredPost.author_username ? (
                        <Link href={`/${lang}/author/${featuredPost.author_username}`} onClick={(e) => e.stopPropagation()} className="group/author flex items-center gap-3 hover:opacity-80 transition">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-inner group-hover/author:shadow-lg transition">
                            {featuredPost.author ? featuredPost.author.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'FD'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-text-primary)] group-hover/author:text-[var(--color-primary)] transition">{featuredPost.author || 'FlowDesk Team'}</p>
                            <div className="flex items-center text-xs text-[var(--color-text-muted)] mt-0.5">
                              <time dateTime={featuredPost.created_at}>{format(new Date(featuredPost.created_at), 'MMM d, yyyy')}</time>
                              <span className="mx-1.5">&middot;</span>
                              <span>{getReadingTime(featuredPost.content)} min read</span>
                              <span className="mx-1.5">&middot;</span>
                              <span className="flex items-center gap-1"><Eye className="w-3 h-3"/>{featuredPost.views || 0} views</span>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                            {featuredPost.author ? featuredPost.author.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'FD'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-text-primary)]">{featuredPost.author || 'FlowDesk Team'}</p>
                            <div className="flex items-center text-xs text-[var(--color-text-muted)] mt-0.5">
                              <time dateTime={featuredPost.created_at}>{format(new Date(featuredPost.created_at), 'MMM d, yyyy')}</time>
                              <span className="mx-1.5">&middot;</span>
                              <span>{getReadingTime(featuredPost.content)} min read</span>
                              <span className="mx-1.5">&middot;</span>
                              <span className="flex items-center gap-1"><Eye className="w-3 h-3"/>{featuredPost.views || 0} views</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid Posts */}
          {regularPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post: any) => (
                <Link href={`/${lang}/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-[var(--shadow-elevated)] hover:border-[var(--color-primary)] transition-all duration-300">
                  <div className="relative aspect-[16/10] w-full bg-[var(--color-surface-raised)] border-b border-[var(--color-border-subtle)] overflow-hidden">
                    {post.cover_image ? (
                      <Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)] text-sm">No cover image</div>
                    )}
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.category && post.category.split(',').map((cat: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-[10px] font-bold uppercase tracking-wider rounded-md">{cat.trim()}</span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 mb-8 flex-1 leading-relaxed">
                      {post.content.replace(/[#*`>]/g, '').substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--color-border-subtle)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-primary)] font-bold text-xs">
                          {post.author ? post.author.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'FD'}
                        </div>
                        <div className="flex flex-col">
                          {post.author_username ? (
                            <Link href={`/${lang}/author/${post.author_username}`} onClick={(e) => e.stopPropagation()} className="font-semibold text-sm text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition">
                              {post.author || 'FlowDesk Team'}
                            </Link>
                          ) : (
                            <span className="font-semibold text-sm text-[var(--color-text-primary)]">
                              {post.author || 'FlowDesk Team'}
                            </span>
                          )}
                          <div className="flex items-center text-xs font-medium text-[var(--color-text-muted)] mt-0.5">
                            <time dateTime={post.created_at}>{format(new Date(post.created_at), 'MMM d, yyyy')}</time>
                            <span className="mx-1.5">&middot;</span>
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3"/>{post.views || 0}</span>
                          </div>
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
      )}
    </div>
  );
}
