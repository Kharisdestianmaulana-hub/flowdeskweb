import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getRepoInfo, getLicenseText } from '@/lib/github';
import { getDictionary } from '@/lib/dictionary';

export const revalidate = 3600; // Cache for 1 hour

export default async function LicensePage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const dict = await getDictionary(lang);
  const repoInfo = await getRepoInfo();
  const licenseText = await getLicenseText();

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <h1 className="text-3xl sm:text-4xl font-[800] text-[var(--color-text-primary)] mb-4 tracking-tight">
          {dict.licensePage.title}
        </h1>
        <p className="text-[18px] text-[var(--color-text-secondary)] mb-8">
          {dict.licensePage.subtitle}
        </p>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 sm:p-8 text-[15px] text-[var(--color-text-secondary)] whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto">
          {licenseText}
        </div>
      </div>
      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
