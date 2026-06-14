import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/dictionary';
import { getRepoInfo } from '@/lib/github';
import { BookOpen, Network, Database } from 'lucide-react';

export default async function DocsPage({ params }: { params: Promise<{ lang: 'en' | 'id' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const repoInfo = await getRepoInfo();

  const sections = [
    {
      id: 'getting-started',
      icon: BookOpen,
      title: dict.docsPage.menu.gettingStarted,
      contentTitle: dict.docsPage.content.gettingStarted.title,
      contentBody: dict.docsPage.content.gettingStarted.body
    },
    {
      id: 'local-workspace',
      icon: Network,
      title: dict.docsPage.menu.localWorkspace,
      contentTitle: dict.docsPage.content.localWorkspace.title,
      contentBody: dict.docsPage.content.localWorkspace.body
    },
    {
      id: 'data-backups',
      icon: Database,
      title: dict.docsPage.menu.dataBackups,
      contentTitle: dict.docsPage.content.dataBackups.title,
      contentBody: dict.docsPage.content.dataBackups.body
    }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h1 className="text-2xl font-[800] text-[var(--color-text-primary)] tracking-tight mb-2">
              {dict.docsPage.title}
            </h1>
            <p className="text-[14px] text-[var(--color-text-muted)] mb-8">
              {dict.docsPage.subtitle}
            </p>
            
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <a 
                    key={section.id} 
                    href={`#${section.id}`}
                    className="flex items-center gap-3 px-3 py-2 text-[14px] font-medium rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors"
                  >
                    <Icon className="w-4 h-4 opacity-70" />
                    {section.title}
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 sm:p-10 shadow-[var(--shadow-card)]">
          <div className="prose prose-invert max-w-none">
            {sections.map((section, idx) => (
              <div key={section.id} id={section.id} className={`${idx !== 0 ? 'mt-16 pt-16 border-t border-[var(--color-border-subtle)]' : ''} scroll-mt-24`}>
                <h2 className="text-3xl font-[700] text-[var(--color-text-primary)] tracking-tight mb-6 flex items-center gap-3">
                  <section.icon className="w-8 h-8 text-[var(--color-primary)]" />
                  {section.contentTitle}
                </h2>
                <p className="text-[16px] leading-[1.8] text-[var(--color-text-secondary)]">
                  {section.contentBody}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
