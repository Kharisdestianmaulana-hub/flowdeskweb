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
      
      <AppPreview dict={dict.appPreview} />

      <SocialProof dict={dict.socialProof} />
      
      <Features dict={dict.features} />

      <UseCases dict={dict.useCases} />
      
      <WhyFlowDesk dict={dict.whyFlowDesk} />

      <HowItWorks dict={dict.howItWorks} />
      
      <PlatformDownload 
        assets={latestRelease.assets} 
        version={latestRelease.tag_name} 
        dict={dict.download}
      />
      
      <ChangelogStrip commits={commits} dict={dict.changelogStrip} currentLang={lang} />
      
      <FAQ dict={dict.faq} />

      <Contributors contributors={contributors} lang={lang} />

      <CTASection assets={latestRelease.assets} dict={dict.cta} />
      
      <div className="pb-24 px-4 sm:px-6 lg:px-8">
        <Newsletter dict={dict.newsletter} />
      </div>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
