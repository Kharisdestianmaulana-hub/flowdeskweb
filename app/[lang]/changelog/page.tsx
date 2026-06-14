import { getRepoInfo, getAllReleases, getRecentCommits } from '@/lib/github';
import ChangelogClient from '@/components/ChangelogClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/dictionary';

export default async function ChangelogPage({ params }: { params: Promise<{ lang: 'en' | 'id' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const [releases, commits, repoInfo] = await Promise.all([
    getAllReleases(),
    getRecentCommits(50),
    getRepoInfo()
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-[800] text-[var(--color-text-primary)] mb-4 tracking-tight">
            {dict.changelogPage.title}
          </h1>
          <p className="text-[18px] text-[var(--color-text-secondary)]">
            {dict.changelogPage.subtitle}
          </p>
        </div>

        <ChangelogClient releases={releases} commits={commits} dict={dict.changelogPage} />
      </div>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
