import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import AboutFlowDesk from '@/components/AboutFlowDesk';
import Features from '@/components/Features';
import WhyFlowDesk from '@/components/WhyFlowDesk';
import PlatformDownload from '@/components/PlatformDownload';
import ChangelogStrip from '@/components/ChangelogStrip';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import UseCases from '@/components/UseCases';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import Contributors from '@/components/Contributors';

import { getRepoInfo, getLatestRelease, getRecentCommits, getContributors, getTotalDownloads } from '@/lib/github';
import { getDictionary } from '@/lib/dictionary';
import { queryD1 } from '@/lib/db';

export const revalidate = 0;

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const dict = await getDictionary(lang);
  const [repoInfo, latestRelease, commits, contributors, totalDownloads, rawFaq] = await Promise.all([
    getRepoInfo(),
    getLatestRelease(),
    getRecentCommits(5),
    getContributors(),
    getTotalDownloads(),
    queryD1('SELECT * FROM faq ORDER BY order_num ASC'),
  ]);

  // Format FAQ based on language
  const faqQuestions = (rawFaq || []).map((f: any) => ({
    q: lang === 'id' ? f.question_id : f.question_en,
    a: lang === 'id' ? f.answer_id : f.answer_en,
  }));

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)] relative">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <Hero 
        stars={repoInfo.stargazers_count} 
        version={latestRelease.tag_name} 
        releaseName={latestRelease.name}
        repoUrl={repoInfo.html_url} 
        assets={latestRelease.assets} 
        dict={dict.hero}
        totalDownloads={totalDownloads}
        currentLang={lang}
      />
      
      <SocialProof dict={dict.socialProof} />
      
      <AboutFlowDesk dict={dict.about} />
      
      <Features dict={dict.features} />

      <UseCases dict={dict.useCases} />
      
      <WhyFlowDesk dict={dict.whyFlowDesk} />

      <HowItWorks dict={dict.howItWorks} />
      
      <PlatformDownload 
        assets={latestRelease.assets} 
        version={latestRelease.tag_name} 
        dict={dict.download}
        totalDownloads={totalDownloads}
      />
      
      <ChangelogStrip commits={commits} dict={dict.changelogStrip} currentLang={lang} />
      
      <FAQ dict={dict.faq} questions={faqQuestions} />

      <Contributors contributors={contributors} lang={lang} />

      <CTASection assets={latestRelease.assets} dict={dict.cta} />

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
