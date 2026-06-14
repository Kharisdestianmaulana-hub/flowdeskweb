import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/dictionary';
import { getRepoInfo } from '@/lib/github';
import { MessageSquare, Mail } from 'lucide-react';

const Github = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const dict = await getDictionary(lang);
  const repoInfo = await getRepoInfo();

  const cards = [
    {
      id: 'discord',
      icon: MessageSquare,
      title: dict.contactPage.cards.discord.title,
      desc: dict.contactPage.cards.discord.desc,
      href: '#',
      button: 'Join Server'
    },
    {
      id: 'github',
      icon: Github,
      title: dict.contactPage.cards.github.title,
      desc: dict.contactPage.cards.github.desc,
      href: `${repoInfo.html_url}/issues`,
      button: 'Open Issue'
    },
    {
      id: 'email',
      icon: Mail,
      title: dict.contactPage.cards.email.title,
      desc: dict.contactPage.cards.email.desc,
      href: 'mailto:kharisdestian862@gmail.com',
      button: 'Send Email'
    }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <div className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-[800] tracking-tight mb-6 text-[var(--color-text-primary)]">
            {dict.contactPage.title}
          </h1>
          <p className="text-[18px] sm:text-[20px] text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            {dict.contactPage.subtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.id} className="flex flex-col p-8 rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-card)]">
                <div className="w-14 h-14 rounded-full bg-[var(--color-bg)] flex items-center justify-center mb-6 border border-[var(--color-border-subtle)]">
                  <Icon className="w-7 h-7 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                  {card.title}
                </h3>
                <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed mb-8 flex-grow">
                  {card.desc}
                </p>
                <a 
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[var(--color-bg)] hover:bg-[var(--color-border-subtle)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-center text-[14px] font-semibold text-[var(--color-text-primary)] transition-colors"
                >
                  {card.button}
                </a>
              </div>
            );
          })}
        </div>

      </div>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
