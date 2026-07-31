'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Release, Commit } from '@/types/github';
import { ArrowLeft, GitCommit, Tag } from 'lucide-react';

interface ChangelogClientProps {
  releases: Release[];
  commits: Commit[];
  dict: any;
  lang?: string;
}

export default function ChangelogClient({ releases, commits, dict, lang }: ChangelogClientProps) {
  const [activeTab, setActiveTab] = useState<'releases' | 'commits'>('releases');

  const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days} days ago`;
    
    return date.toLocaleDateString();
  };

  const truncateBody = (body: string, length: number = 300) => {
    if (!body) return '';
    // Strip simple markdown for display purposes
    const plainText = body.replace(/[#*`_]/g, '');
    if (plainText.length <= length) return plainText;
    return plainText.slice(0, length) + '...';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="mb-12">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>
        <h1 className="text-4xl font-[800] text-[var(--color-text-primary)] mb-4 tracking-tight">
          Changelog
        </h1>
        <p className="text-[18px] text-[var(--color-text-secondary)]">
          Every release and commit, straight from the GitHub repository.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center space-x-2 mb-12">
        <button
          onClick={() => setActiveTab('releases')}
          className={`px-6 py-2.5 rounded-full text-[15px] font-medium transition-all ${
            activeTab === 'releases'
              ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-btn)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]'
          }`}
        >
          {dict.tabs.releases}
        </button>
        <button
          onClick={() => setActiveTab('commits')}
          className={`px-6 py-2.5 rounded-full text-[15px] font-medium transition-all ${
            activeTab === 'commits'
              ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-btn)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]'
          }`}
        >
          {dict.tabs.commits}
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === 'releases' && (
          <div className="space-y-8">
            {releases.length === 0 ? (
              <div className="text-center py-12 text-[var(--color-text-muted)]">
                {dict.emptyReleases}
              </div>
            ) : (
              releases.map((release) => (
                <div key={release.tag_name} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-[700] text-[var(--color-text-primary)]">
                          {release.name || release.tag_name}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-text-accent)] text-[12px] font-mono font-medium">
                          {release.tag_name}
                        </span>
                      </div>
                      <p className="text-[14px] text-[var(--color-text-muted)]">
                        Published on {new Date(release.published_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-[15px] leading-relaxed text-[var(--color-text-secondary)] whitespace-pre-wrap">
                      {truncateBody(release.body)}
                    </p>
                    {release.body && release.body.length > 300 && (
                      <Link 
                        href={release.html_url}
                        className="mt-6 inline-block text-[14px] font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                      >
                        {dict.readMore} →
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'commits' && (
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
            {commits.length === 0 ? (
              <div className="text-center py-12 text-[var(--color-text-muted)]">
                {dict.emptyCommits}
              </div>
            ) : (
              <ul className="divide-y divide-[var(--color-border-subtle)]">
                {commits.map((item) => (
                  <li key={item.sha} className="group p-4 sm:p-6 hover:bg-[var(--color-surface-raised)] transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                      <div className="mb-2 sm:mb-0">
                        <a 
                          href={item.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[15px] font-medium text-[var(--color-text-primary)] hover:text-[var(--color-text-accent)] transition-colors"
                        >
                          {item.commit.message.split('\n')[0]}
                        </a>
                        <div className="flex items-center space-x-2 mt-1 text-[13px] text-[var(--color-text-muted)]">
                          <span className="font-mono bg-[var(--color-bg)] px-1.5 py-0.5 rounded text-[12px] border border-[var(--color-border)]">
                            {item.sha.substring(0, 7)}
                          </span>
                          <span>·</span>
                          <span>by {item.commit.author.name}</span>
                        </div>
                      </div>
                      <div className="text-[13px] text-[var(--color-text-secondary)] sm:ml-4 whitespace-nowrap">
                        {timeAgo(item.commit.author.date)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
