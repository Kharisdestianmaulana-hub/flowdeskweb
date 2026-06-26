import { getRepoInfo, getAllReleases, getTotalDownloads } from '@/lib/github';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import { getDictionary } from '@/lib/dictionary';
import { Apple, Monitor, Terminal, Code, Download } from 'lucide-react';
import NumberCounter from '@/components/animations/NumberCounter';
import InstallGuideAccordion from '@/components/InstallGuideAccordion';

export default async function DownloadPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const dict = await getDictionary(lang);
  const [releases, repoInfo, totalDownloads] = await Promise.all([
    getAllReleases(),
    getRepoInfo(),
    getTotalDownloads()
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <div className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-[800] text-[var(--color-text-primary)] mb-4 tracking-tight">
            {dict.downloadPage.title}
          </h1>
          <p className="text-[18px] text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
            {dict.downloadPage.subtitle}
          </p>
          <div className="inline-flex items-center justify-center gap-2 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] px-6 py-2.5 rounded-full shadow-[var(--shadow-card)]">
            <Download className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-[14px] font-medium text-[var(--color-text-muted)]">
               {dict.downloadPage.totalDownloads.split('{count}')[0]}
               <strong className="text-[var(--color-text-primary)] mx-1 text-[15px]"><NumberCounter value={totalDownloads} /></strong>
               {dict.downloadPage.totalDownloads.split('{count}')[1]}
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {releases.map((release, index) => {
            const isLatest = index === 0;
            const macAsset = release.assets.find(a => a.name.toLowerCase().endsWith('.dmg'));
            const winAsset = release.assets.find(a => a.name.toLowerCase().endsWith('.exe') || a.name.toLowerCase().endsWith('.msi'));
            const linuxAsset = release.assets.find(a =>
              a.name.toLowerCase().endsWith('.tar.gz') ||
              a.name.toLowerCase().endsWith('.appimage') ||
              a.name.toLowerCase().endsWith('.deb')
            );

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
                      <div className="flex flex-col gap-3">
                        <a 
                          href={macAsset.browser_download_url}
                          className={`flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border transition-all ${isLatest ? 'bg-[var(--color-surface-raised)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-card-hover)]' : 'bg-[var(--color-bg)] border-[var(--color-border-subtle)] hover:border-[var(--color-border)]'}`}
                        >
                          <Apple className="w-5 h-5 text-[var(--color-text-primary)] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-[var(--color-text-primary)] text-[14px]">{dict.downloadPage.macOS}</div>
                            <div className="text-[12px] font-medium text-[var(--color-primary)]">
                              {dict.downloadPage.downloadFor.replace('{version}', release.tag_name)} macOS (.dmg)
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                        </a>
                        {isLatest && dict.downloadPage.guides?.dmg && (
                          <InstallGuideAccordion
                            title={dict.downloadPage.guides.dmg.title}
                            steps={dict.downloadPage.guides.dmg.steps}
                            showLabel={dict.downloadPage.installGuideShow}
                            hideLabel={dict.downloadPage.installGuideHide}
                            platform="mac"
                          />
                        )}
                      </div>
                    )}

                    {/* Windows */}
                    {winAsset && (
                      <div className="flex flex-col gap-3">
                        <a 
                          href={winAsset.browser_download_url}
                          className={`flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border transition-all ${isLatest ? 'bg-[var(--color-surface-raised)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-card-hover)]' : 'bg-[var(--color-bg)] border-[var(--color-border-subtle)] hover:border-[var(--color-border)]'}`}
                        >
                          <Monitor className="w-5 h-5 text-[var(--color-text-primary)] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-[var(--color-text-primary)] text-[14px]">{dict.downloadPage.windows}</div>
                            <div className="text-[12px] font-medium text-[var(--color-primary)]">
                              {dict.downloadPage.downloadFor.replace('{version}', release.tag_name)} Windows (.exe)
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                        </a>
                        {isLatest && dict.downloadPage.guides?.exe && (
                          <InstallGuideAccordion
                            title={dict.downloadPage.guides.exe.title}
                            steps={dict.downloadPage.guides.exe.steps}
                            showLabel={dict.downloadPage.installGuideShow}
                            hideLabel={dict.downloadPage.installGuideHide}
                            platform="win"
                          />
                        )}
                      </div>
                    )}

                    {/* Linux */}
                    {linuxAsset && (
                      <div className="flex flex-col gap-3">
                        <a 
                          href={linuxAsset.browser_download_url}
                          className={`flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border transition-all ${isLatest ? 'bg-[var(--color-surface-raised)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-card-hover)]' : 'bg-[var(--color-bg)] border-[var(--color-border-subtle)] hover:border-[var(--color-border)]'}`}
                        >
                          <Terminal className="w-5 h-5 text-[var(--color-text-primary)] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-[var(--color-text-primary)] text-[14px]">{dict.downloadPage.linux}</div>
                            <div className="text-[12px] font-medium text-[var(--color-primary)]">
                              {dict.downloadPage.downloadFor.replace('{version}', release.tag_name)} Linux (.tar.gz)
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                        </a>
                        {isLatest && dict.downloadPage.guides?.tar && (
                          <InstallGuideAccordion
                            title={dict.downloadPage.guides.tar.title}
                            steps={dict.downloadPage.guides.tar.steps}
                            showLabel={dict.downloadPage.installGuideShow}
                            hideLabel={dict.downloadPage.installGuideHide}
                            platform="linux"
                          />
                        )}
                      </div>
                    )}

                    {/* Source Code */}
                    <a 
                      href={release.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg)] hover:border-[var(--color-border)] transition-all"
                    >
                      <Code className="w-5 h-5 text-[var(--color-text-secondary)] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[var(--color-text-secondary)] text-[14px]">{dict.downloadPage.sourceCode}</div>
                        <div className="text-[12px] text-[var(--color-text-muted)]">.zip / .tar.gz</div>
                      </div>
                    </a>

                  </div>
                </div>
              </div>
            );
          })}

          {releases.length === 0 && (
            <div className="text-center py-12 text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
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
