import { getRepoInfo, getAllReleases } from '@/lib/github';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import { getDictionary } from '@/lib/dictionary';
import { Apple, Monitor, Terminal, Code } from 'lucide-react';

const Github = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default async function DownloadPage({ params }: { params: Promise<{ lang: 'en' | 'id' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const [releases, repoInfo] = await Promise.all([
    getAllReleases(),
    getRepoInfo()
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <div className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-[800] text-[var(--color-text-primary)] mb-4 tracking-tight">
            {dict.downloadPage.title}
          </h1>
          <p className="text-[18px] text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            {dict.downloadPage.subtitle}
          </p>
        </div>

        <div className="space-y-8">
          {releases.map((release, index) => {
            const isLatest = index === 0;
            const macAsset = release.assets.find(a => a.name.toLowerCase().endsWith('.dmg'));
            const winAsset = release.assets.find(a => a.name.toLowerCase().endsWith('.exe') || a.name.toLowerCase().endsWith('.msi'));
            const linuxAsset = release.assets.find(a => a.name.toLowerCase().endsWith('.appimage') || a.name.toLowerCase().endsWith('.deb'));

            const formattedDate = new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }).format(new Date(release.published_at));

            return (
              <div 
                key={release.tag_name} 
                className={`bg-[var(--color-surface)] border ${isLatest ? 'border-[var(--color-primary)] shadow-[var(--shadow-elevated)]' : 'border-[var(--color-border)] shadow-[var(--shadow-card)]'} rounded-[var(--radius-xl)] overflow-hidden transition-all`}
              >
                {/* Card Header */}
                <div className={`p-6 sm:px-8 border-b ${isLatest ? 'border-[var(--color-primary-glow)] bg-[var(--color-primary-light)]/10' : 'border-[var(--color-border-subtle)]'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-[700] text-[var(--color-text-primary)] tracking-tight">
                          {release.name || release.tag_name}
                        </h2>
                        {isLatest && (
                          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-[var(--color-primary)] rounded-full">
                            {dict.downloadPage.latestBadge}
                          </span>
                        )}
                      </div>
                      <div className="text-[14px] text-[var(--color-text-muted)] flex items-center gap-2">
                        <span>{release.tag_name}</span>
                        <span>•</span>
                        <span>{dict.downloadPage.releasedOn} {formattedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body - Downloads */}
                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {/* macOS */}
                    {macAsset && (
                      <a 
                        href={macAsset.browser_download_url}
                        className={`flex flex-col p-4 rounded-[var(--radius-lg)] border transition-all ${isLatest ? 'bg-[var(--color-surface-raised)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-card-hover)]' : 'bg-[var(--color-bg)] border-[var(--color-border-subtle)] hover:border-[var(--color-border)]'}`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Apple className="w-5 h-5 text-[var(--color-text-primary)]" />
                          <span className="font-semibold text-[var(--color-text-primary)]">{dict.downloadPage.macOS}</span>
                        </div>
                        <span className="text-[13px] font-medium text-[var(--color-primary)] mt-auto">
                          {dict.downloadPage.downloadFor.replace('{version}', release.tag_name)} macOS
                        </span>
                      </a>
                    )}

                    {/* Windows */}
                    {winAsset && (
                      <a 
                        href={winAsset.browser_download_url}
                        className={`flex flex-col p-4 rounded-[var(--radius-lg)] border transition-all ${isLatest ? 'bg-[var(--color-surface-raised)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-card-hover)]' : 'bg-[var(--color-bg)] border-[var(--color-border-subtle)] hover:border-[var(--color-border)]'}`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Monitor className="w-5 h-5 text-[var(--color-text-primary)]" />
                          <span className="font-semibold text-[var(--color-text-primary)]">{dict.downloadPage.windows}</span>
                        </div>
                        <span className="text-[13px] font-medium text-[var(--color-primary)] mt-auto">
                          {dict.downloadPage.downloadFor.replace('{version}', release.tag_name)} Windows
                        </span>
                      </a>
                    )}

                    {/* Linux (if exists) */}
                    {linuxAsset && (
                      <a 
                        href={linuxAsset.browser_download_url}
                        className={`flex flex-col p-4 rounded-[var(--radius-lg)] border transition-all ${isLatest ? 'bg-[var(--color-surface-raised)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-card-hover)]' : 'bg-[var(--color-bg)] border-[var(--color-border-subtle)] hover:border-[var(--color-border)]'}`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Terminal className="w-5 h-5 text-[var(--color-text-primary)]" />
                          <span className="font-semibold text-[var(--color-text-primary)]">{dict.downloadPage.linux}</span>
                        </div>
                        <span className="text-[13px] font-medium text-[var(--color-primary)] mt-auto">
                          {dict.downloadPage.downloadFor.replace('{version}', release.tag_name)} Linux
                        </span>
                      </a>
                    )}

                    {/* Source Code */}
                    <a 
                      href={release.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg)] hover:border-[var(--color-border)] transition-all lg:col-span-1 md:col-span-2"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Code className="w-5 h-5 text-[var(--color-text-secondary)]" />
                        <span className="font-semibold text-[var(--color-text-secondary)]">{dict.downloadPage.sourceCode}</span>
                      </div>
                      <span className="text-[13px] font-medium text-[var(--color-text-muted)] mt-auto">
                        .zip / .tar.gz
                      </span>
                    </a>

                  </div>
                </div>
              </div>
            );
          })}

          {releases.length === 0 && (
            <div className="text-center py-12 text-[var(--color-text-muted)] border border-[var(--color-border-dashed)] rounded-[var(--radius-lg)]">
              No releases found on GitHub.
            </div>
          )}
        </div>
        
        {/* Newsletter / Waitlist Section */}
        <div className="mt-8">
          <Newsletter dict={dict.newsletter} />
        </div>
      </div>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
