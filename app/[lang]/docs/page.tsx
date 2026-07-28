import { redirect } from 'next/navigation';
import { getDocsList } from '@/lib/docs';

export default async function DocsRootPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as 'en' | 'id';
  const docsList = await getDocsList(lang);
  
  if (docsList.length > 0) {
    redirect(`/${lang}/docs/${docsList[0].slug}`);
  }

  return <div className="text-white">No docs found.</div>;
}
