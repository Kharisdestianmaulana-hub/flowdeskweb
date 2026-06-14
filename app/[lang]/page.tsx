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

import { getRepoInfo, getLatestRelease, getRecentCommits } from '@/lib/github';
import { getDictionary } from '@/lib/dictionary';

export default async function Home({ params }: { params: Promise<{ lang: 'en' | 'id' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const [repoInfo, latestRelease, commits] = await Promise.all([
    getRepoInfo(),
    getLatestRelease(),
    getRecentCommits(5),
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
      
      <SocialProof dict={dict.socialProof} />
      
      <Features dict={dict.features} />
      
      <WhyFlowDesk dict={dict.whyFlowDesk} />
      
      <AppPreview dict={dict.appPreview} />
      
      <PlatformDownload 
        assets={latestRelease.assets} 
        version={latestRelease.tag_name} 
        dict={dict.download}
      />
      
      <ChangelogStrip commits={commits} dict={dict.changelogStrip} currentLang={lang} />
      
      <CTASection assets={latestRelease.assets} dict={dict.cta} />
      
      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
