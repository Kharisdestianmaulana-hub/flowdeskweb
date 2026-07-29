import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/dictionary';
import { getRepoInfo } from '@/lib/github';
import { getDocsList } from '@/lib/docs';
import Link from 'next/link';

export const revalidate = 0;

export default async function DocsLayout({ children, params }: { children: React.ReactNode, params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const dict = await getDictionary(lang);
  const repoInfo = await getRepoInfo();
  const docsList = await getDocsList(lang);

  // Group by category
  const groupedDocs = docsList.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, typeof docsList>);

  // Predefined category order
  const categoryOrder = [
    'Introduction', 'Pengenalan',
    'Get Started', 'Memulai',
    'Core Features', 'Fitur Utama',
    'Settings & Security', 'Pengaturan & Keamanan',
    'Support', 'Dukungan'
  ];

  const sortedCategories = Object.keys(groupedDocs).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });

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
            
            <nav className="space-y-8">
              {sortedCategories.map((category) => (
                <div key={category}>
                  <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 px-3">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {groupedDocs[category].map((doc) => (
                      <Link 
                        key={doc.slug} 
                        href={`/${lang}/docs/${doc.slug}`}
                        className="flex items-center gap-3 px-3 py-2 text-[14px] font-medium rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] transition-colors"
                      >
                        {doc.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 sm:p-10 shadow-[var(--shadow-card)]">
          {children}
        </div>

      </div>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
