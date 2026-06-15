import { getRepoInfo } from '@/lib/github';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import { getDictionary } from '@/lib/dictionary';
import RoadmapTimeline from '@/components/RoadmapTimeline';
import { promises as fs } from 'fs';
import path from 'path';

export default async function RoadmapPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const dict = await getDictionary(lang);
  
  // Fetch repo info for Navbar/Footer
  const repoInfo = await getRepoInfo();

  // Read JSON data
  const dataFilePath = path.join(process.cwd(), 'data', 'roadmap.json');
  let roadmapData = [];
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    roadmapData = JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to read roadmap.json:', error);
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
