import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/dictionary';
import { getRepoInfo } from '@/lib/github';
import { Check, X } from 'lucide-react';
import { SiNotion, SiObsidian, SiEvernote, SiJira } from 'react-icons/si';
import Link from 'next/link';
import Image from 'next/image';

export default async function CompareNotionPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const dict = await getDictionary(lang);
  const repoInfo = await getRepoInfo();

  const data = dict.comparePage.all;

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-[var(--radius-lg)] shadow-lg flex items-center justify-center overflow-hidden">
              <Image src="/logo.png" alt="FlowDesk Logo" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <span className="text-3xl text-[var(--color-text-muted)] font-light px-4">vs</span>
            <div className="flex -space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[var(--radius-lg)] bg-white border border-gray-200 flex items-center justify-center text-black shadow-lg z-10 transition-transform hover:z-50 hover:scale-110">
                <SiNotion className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[var(--radius-lg)] bg-[#483699] border border-[#3e2e85] flex items-center justify-center text-white shadow-lg z-20 transition-transform hover:z-50 hover:scale-110">
                <SiObsidian className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[var(--radius-lg)] bg-[#00a82d] border border-[#008f26] flex items-center justify-center text-white shadow-lg z-30 transition-transform hover:z-50 hover:scale-110">
                <SiEvernote className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[var(--radius-lg)] bg-[#0052cc] border border-[#0047b3] flex items-center justify-center text-white shadow-lg z-40 transition-transform hover:z-50 hover:scale-110">
                <SiJira className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-[800] tracking-tight mb-6 text-[var(--color-text-primary)]">
            {data.title}
          </h1>
          <p className="text-[18px] sm:text-[20px] text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </header>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-card)] overflow-hidden mb-16 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-6 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
              <div className="p-4 sm:p-6 font-bold text-[var(--color-text-primary)]">{data.tableHeaders.feature}</div>
              <div className="p-4 sm:p-6 font-bold text-[var(--color-primary)] bg-[var(--color-primary-light)]/5 border-l border-r border-[var(--color-border)]">{data.tableHeaders.flowdesk}</div>
              <div className="p-4 sm:p-6 font-bold text-[var(--color-text-secondary)]">{data.tableHeaders.notion}</div>
              <div className="p-4 sm:p-6 font-bold text-[var(--color-text-secondary)]">{data.tableHeaders.obsidian}</div>
              <div className="p-4 sm:p-6 font-bold text-[var(--color-text-secondary)]">{data.tableHeaders.evernote}</div>
              <div className="p-4 sm:p-6 font-bold text-[var(--color-text-secondary)]">{data.tableHeaders.jira}</div>
            </div>
            
            <div className="divide-y divide-[var(--color-border-subtle)]">
              {data.features.map((item: any, idx: number) => (
                <div key={idx} className="grid grid-cols-6 hover:bg-[var(--color-bg)] transition-colors">
                  <div className="p-4 sm:p-6 text-[14px] font-medium text-[var(--color-text-primary)] flex items-center">
                    {item.name}
                  </div>
                  <div className="p-4 sm:p-6 text-[14px] text-[var(--color-text-primary)] bg-[var(--color-primary-light)]/5 border-l border-r border-[var(--color-border)] flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item.fd}
                  </div>
                  <div className="p-4 sm:p-6 text-[14px] text-[var(--color-text-secondary)] flex items-center gap-2">
                    {item.nt.includes('No ') || item.nt.includes('Tidak ') || item.nt.includes('Sub') || item.nt.includes('Berlangganan') || item.nt.includes('Limited') || item.nt.includes('Terbatas') || item.nt.includes('None') || item.nt.includes('Dependent') || item.nt.includes('Tergantung') ? (
                      <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    ) : null}
                    {item.nt}
                  </div>
                  <div className="p-4 sm:p-6 text-[14px] text-[var(--color-text-secondary)] flex items-center gap-2">
                    {item.ob.includes('No ') || item.ob.includes('Tidak ') || item.ob.includes('Paid') || item.ob.includes('Berbayar') ? (
                      <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    ) : null}
                    {item.ob}
                  </div>
                  <div className="p-4 sm:p-6 text-[14px] text-[var(--color-text-secondary)] flex items-center gap-2">
                    {item.ev.includes('No ') || item.ev.includes('Tidak ') || item.ev.includes('Sub') || item.ev.includes('Berlangganan') || item.ev.includes('Limited') || item.ev.includes('Terbatas') || item.ev.includes('None') || item.ev.includes('Dependent') || item.ev.includes('Tergantung') ? (
                      <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    ) : null}
                    {item.ev}
                  </div>
                  <div className="p-4 sm:p-6 text-[14px] text-[var(--color-text-secondary)] flex items-center gap-2">
                    {item.ji.includes('No ') || item.ji.includes('Tidak ') || item.ji.includes('Sub') || item.ji.includes('Berlangganan') || item.ji.includes('Limited') || item.ji.includes('Terbatas') || item.ji.includes('None') || item.ji.includes('Dependent') || item.ji.includes('Tergantung') ? (
                      <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    ) : null}
                    {item.ji}
                  </div>
                </div>
              ))}
            </div>
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
