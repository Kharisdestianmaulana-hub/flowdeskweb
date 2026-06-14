import { redirect } from 'next/navigation';
import { getDocsList } from '@/lib/docs';

export default async function DocsRootPage({ params }: { params: Promise<{ lang: 'en' | 'id' }> }) {
  const { lang } = await params;
  const docsList = getDocsList(lang);
  
  if (docsList.length > 0) {
    redirect(`/${lang}/docs/${docsList[0].slug}`);
  }

  return <div className="text-white">No docs found.</div>;
}
