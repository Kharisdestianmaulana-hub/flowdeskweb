import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/dictionary';
import { getRepoInfo } from '@/lib/github';
import { Heart, Coffee, CupSoda } from 'lucide-react';

const Github = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default async function SponsorPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const dict = await getDictionary(lang);
  const repoInfo = await getRepoInfo();

  const sponsorMethods = [
    {
      id: 'saweria',
      icon: Coffee,
      name: dict.sponsorPage.methods[0].name,
      description: dict.sponsorPage.methods[0].description,
      href: 'https://saweria.co/RiRay',
      color: 'hover:border-[#E5A824] hover:shadow-[#E5A824]/20'
    },
    {
      id: 'kofi',
      icon: CupSoda,
      name: dict.sponsorPage.methods[1].name,
      description: dict.sponsorPage.methods[1].description,
      href: 'https://ko-fi.com/riray',
      color: 'hover:border-[#29abe0] hover:shadow-[#29abe0]/20'
    }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <div className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-500/10 mb-8 ring-1 ring-pink-500/30">
          <Heart className="w-10 h-10 text-pink-500" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-[800] tracking-tight mb-6 text-[var(--color-text-primary)]">
          {dict.sponsorPage.title}
        </h1>
        <p className="text-[18px] sm:text-[20px] text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed mb-16">
          {dict.sponsorPage.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto gap-8 text-left">
          {sponsorMethods.map((method) => {
            const Icon = method.icon;
            return (
              <a 
                key={method.id} 
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-card)] transition-all duration-300 ${method.color}`}
              >
                <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--color-bg)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-[var(--color-text-primary)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                  {method.name}
                </h3>
                <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed">
                  {method.description}
                </p>
              </a>
            );
          })}
        </div>

        <div className="mt-20 pt-10 border-t border-[var(--color-border-subtle)]">
          <p className="text-[18px] font-medium text-[var(--color-text-primary)]">
            {dict.sponsorPage.thankYou} 💖
          </p>
        </div>

      </div>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
