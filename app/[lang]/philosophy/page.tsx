import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/dictionary';
import { getRepoInfo } from '@/lib/github';

export default async function PhilosophyPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const dict = await getDictionary(lang);
  const repoInfo = await getRepoInfo();

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <div className="flex-grow max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-[800] tracking-tight mb-6 text-transparent bg-clip-text bg-[image:var(--gradient-hero)]">
            {dict.philosophyPage.title}
          </h1>
          <p className="text-[18px] sm:text-[20px] text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            {dict.philosophyPage.subtitle}
          </p>
        </header>

        <article className="prose prose-invert prose-lg max-w-none space-y-12">
          {dict.philosophyPage.content.map((section: { heading: string; body: string }, idx: number) => (
            <section key={idx} className="relative">
              {idx !== 0 && <div className="absolute -top-6 left-0 w-12 h-1 bg-[var(--color-border-subtle)] rounded-full"></div>}
              <h2 className="text-2xl sm:text-3xl font-[700] text-[var(--color-text-primary)] tracking-tight mb-4 mt-8">
                {section.heading}
              </h2>
              <p className="text-[17px] sm:text-[18px] leading-[1.8] text-[var(--color-text-secondary)]">
                {section.body}
              </p>
            </section>
          ))}
        </article>

        <div className="mt-20 pt-10 border-t border-[var(--color-border-subtle)] text-center">
          <a 
            href={`/${lang}/download`}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[image:var(--gradient-cta)] text-white text-[16px] font-semibold shadow-[var(--shadow-btn)] hover:opacity-90 transition-opacity"
          >
            {dict.navbar.download} FlowDesk
          </a>
        </div>

      </div>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
