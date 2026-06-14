import Link from 'next/link';
import { Commit } from '../types/github';

interface ChangelogStripProps {
  commits: Commit[];
  dict: any;
  currentLang: string;
}

export default function ChangelogStrip({ commits, dict, currentLang }: ChangelogStripProps) {
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

  const truncate = (str: string, length: number) => {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
  };

  if (!commits || commits.length === 0) return null;

  return (
    <section className="bg-[var(--color-bg)] py-16 border-t border-[var(--color-border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left side: Heading */}
          <div className="lg:w-1/3">
            <h2 className="text-2xl font-[700] text-[var(--color-text-primary)]">
            {dict.title}
          </h2>
          <Link 
            href={`/${currentLang}/changelog`}
            className="text-[14px] font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] flex items-center transition-colors"
          >
            {dict.viewAll} <span className="ml-2">→</span>
          </Link>
          </div>

          {/* Right side: Commits List */}
          <div className="lg:w-2/3">
            <div className="flex flex-col">
              {commits.map((item, index) => (
                <a 
                  key={item.sha} 
                  href={item.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col sm:flex-row sm:items-center justify-between py-4 group ${
                    index !== commits.length - 1 ? 'border-b border-[var(--color-border-subtle)]' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    <span className="font-mono text-[13px] text-[var(--color-text-muted)] group-hover:text-[var(--color-text-accent)] transition-colors">
                      {item.sha.substring(0, 7)}
                    </span>
                    <span className="text-[15px] text-[var(--color-text-primary)] group-hover:text-[var(--color-primary-light)] transition-colors font-medium">
                      {truncate(item.commit.message.split('\n')[0], 72)}
                    </span>
                  </div>
                  <span className="text-[13px] text-[var(--color-text-muted)] sm:ml-4 whitespace-nowrap">
                    {timeAgo(item.commit.author.date)}
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
