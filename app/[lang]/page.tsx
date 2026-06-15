import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import Features from '@/components/Features';
import WhyFlowDesk from '@/components/WhyFlowDesk';
import AppPreview from '@/components/AppPreview';
import PlatformDownload from '@/components/PlatformDownload';
import ChangelogStrip from '@/components/ChangelogStrip';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import UseCases from '@/components/UseCases';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import Newsletter from '@/components/Newsletter';
import Contributors from '@/components/Contributors';
import StackedCard from '@/components/StackedCard';

import { getRepoInfo, getLatestRelease, getRecentCommits, getContributors } from '@/lib/github';
import { getDictionary } from '@/lib/dictionary';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const dict = await getDictionary(lang);
  const [repoInfo, latestRelease, commits, contributors] = await Promise.all([
    getRepoInfo(),
    getLatestRelease(),
    getRecentCommits(5),
    getContributors(),
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)] relative">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <Hero 
        stars={repoInfo.stargazers_count} 
        version={latestRelease.tag_name} 
        repoUrl={repoInfo.html_url} 
        assets={latestRelease.assets} 
        dict={dict.hero}
      />
      
      {/* Stacking Parallax Wrapper */}
      <div className="relative z-10">
        <StackedCard zIndex={10} bgClass="bg-[var(--color-surface)] border-t border-[var(--color-border-subtle)]">
          <AppPreview dict={dict.appPreview} />
        </StackedCard>

        <StackedCard zIndex={20} bgClass="bg-[var(--color-bg)]">
          <div className="flex flex-col gap-0">
            <SocialProof dict={dict.socialProof} />
            <Features dict={dict.features} />
          </div>
        </StackedCard>

        <StackedCard zIndex={30} bgClass="bg-[var(--color-surface)]">
          <UseCases dict={dict.useCases} />
        </StackedCard>
        
        <StackedCard zIndex={40} bgClass="bg-[var(--color-bg)]">
          <WhyFlowDesk dict={dict.whyFlowDesk} />
        </StackedCard>

        <StackedCard zIndex={50} bgClass="bg-[var(--color-surface)]">
          <HowItWorks dict={dict.howItWorks} />
        </StackedCard>
        
        <StackedCard zIndex={60} bgClass="bg-[var(--color-bg)]" isLast={true}>
          <PlatformDownload 
            assets={latestRelease.assets} 
            version={latestRelease.tag_name} 
            dict={dict.download}
          />
        </StackedCard>
      </div>
      
      {/* Normal Scrolling Sections */}
      <div className="relative z-[70] bg-[var(--color-bg)] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <ChangelogStrip commits={commits} dict={dict.changelogStrip} currentLang={lang} />
        
        <FAQ dict={dict.faq} />

        <Contributors contributors={contributors} lang={lang} />

        <CTASection assets={latestRelease.assets} dict={dict.cta} />
        
        <div className="pb-24 px-4 sm:px-6 lg:px-8">
          <Newsletter dict={dict.newsletter} />
        </div>

        <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
      </div>
    </main>
  );
}
