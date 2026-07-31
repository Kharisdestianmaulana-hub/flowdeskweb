import { queryD1 } from '@/lib/db';
import ChangelogClient from '@/components/ChangelogClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/dictionary';
import { getRepoInfo } from '@/lib/github';

export default async function ChangelogPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const dict = await getDictionary(lang);
  
  let releases = [];
  try {
    const results = await queryD1("SELECT * FROM changelogs WHERE status = 'published' ORDER BY published_at DESC");
    
    // Map D1 data to match the expected format for ChangelogClient (or we can adapt ChangelogClient)
    releases = results.map((row: any) => ({
      id: row.id,
      tag_name: row.version,
      name: row.title,
      body: row.content,
      published_at: row.published_at,
      html_url: `/${lang}/changelog/${row.version}`
    }));
  } catch(e) {
    console.error("Failed to fetch changelogs from DB:", e);
  }

  const repoInfo = await getRepoInfo();

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

        <ChangelogClient releases={releases} commits={[]} dict={dict.changelogPage} lang={lang} />
      </div>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
