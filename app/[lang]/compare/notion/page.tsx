import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/dictionary';
import { getRepoInfo } from '@/lib/github';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default async function CompareNotionPage({ params }: { params: Promise<{ lang: 'en' | 'id' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const repoInfo = await getRepoInfo();

  const data = dict.comparePage.notion;

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-[var(--radius-lg)] shadow-lg flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="FlowDesk Logo" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <span className="text-3xl text-[var(--color-text-muted)] font-light">vs</span>
            <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-white border border-gray-200 flex items-center justify-center text-black text-2xl font-serif font-bold shadow-lg">
              N
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-[800] tracking-tight mb-6 text-[var(--color-text-primary)]">
            {data.title}
          </h1>
          <p className="text-[18px] sm:text-[20px] text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </header>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-card)] overflow-hidden mb-16">
          <div className="grid grid-cols-3 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
            <div className="p-4 sm:p-6 font-bold text-[var(--color-text-primary)]">{data.tableHeaders.feature}</div>
            <div className="p-4 sm:p-6 font-bold text-[var(--color-primary)] bg-[var(--color-primary-light)]/5 border-l border-r border-[var(--color-border)]">{data.tableHeaders.flowdesk}</div>
            <div className="p-4 sm:p-6 font-bold text-[var(--color-text-secondary)]">{data.tableHeaders.notion}</div>
          </div>
          
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {data.features.map((item: any, idx: number) => (
              <div key={idx} className="grid grid-cols-3 hover:bg-[var(--color-bg)] transition-colors">
                <div className="p-4 sm:p-6 text-[15px] font-medium text-[var(--color-text-primary)] flex items-center">
                  {item.name}
                </div>
                <div className="p-4 sm:p-6 text-[15px] text-[var(--color-text-primary)] bg-[var(--color-primary-light)]/5 border-l border-r border-[var(--color-border)] flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {item.fd}
                </div>
                <div className="p-4 sm:p-6 text-[15px] text-[var(--color-text-secondary)] flex items-center gap-2">
                  {item.nt.includes('No ') || item.nt.includes('Tidak ') || item.nt.includes('Subscription') || item.nt.includes('Berlangganan') ? (
                    <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                  ) : null}
                  {item.nt}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[18px] text-[var(--color-text-primary)] font-medium leading-relaxed mb-8">
            {data.conclusion}
          </p>
          <Link href={`/${lang}/download`} className="inline-flex items-center justify-center px-8 py-4 rounded-[var(--radius-lg)] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-[600] text-[16px] transition-all shadow-lg shadow-[var(--color-primary)]/20">
            {dict.downloadPage.title}
          </Link>
        </div>

      </div>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
