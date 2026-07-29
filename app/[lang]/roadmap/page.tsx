import { getRepoInfo } from '@/lib/github';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import { getDictionary } from '@/lib/dictionary';
import RoadmapTimeline from '@/components/RoadmapTimeline';
import { queryD1 } from '@/lib/db';

export const revalidate = 0;

export default async function RoadmapPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const dict = await getDictionary(lang);
  
  // Fetch repo info for Navbar/Footer
  const repoInfo = await getRepoInfo();

  // Fetch Roadmap from D1
  let roadmapData = [];
  try {
    const results = await queryD1('SELECT * FROM roadmap ORDER BY order_num ASC');
    roadmapData = results.map((row: any) => ({
      quarter: row.quarter,
      status: row.status,
      version: row.version,
      title: { en: row.title_en, id: row.title_id },
      description: { en: row.description_en, id: row.description_id },
      items: {
        en: row.items_en ? row.items_en.split('\n').filter(Boolean) : [],
        id: row.items_id ? row.items_id.split('\n').filter(Boolean) : []
      }
    }));
  } catch (error) {
    console.error('Failed to fetch roadmap data:', error);
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar stars={repoInfo.stargazers_count} repoUrl={repoInfo.html_url} dict={dict.navbar} currentLang={lang} />
      
      <div className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        {/* Header */}
        <div className="text-center mb-24">
          <span className="text-[12px] font-medium text-[var(--color-primary)] tracking-widest uppercase block mb-4">
            FlowDesk Future
          </span>
          <h1 className="text-4xl sm:text-5xl font-[800] text-[var(--color-text-primary)] mb-6 tracking-tight">
            {dict.roadmapPage.title}
          </h1>
          <p className="text-[18px] text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            {dict.roadmapPage.subtitle}
          </p>
        </div>

        {/* Timeline */}
        <RoadmapTimeline data={roadmapData} lang={lang} dict={dict.roadmapPage} />
        
        {/* Newsletter */}
        <div className="mt-24">
          <Newsletter dict={dict.newsletter} />
        </div>
      </div>

      <Footer repoUrl={repoInfo.html_url} dict={dict.footer} currentLang={lang} />
    </main>
  );
}
