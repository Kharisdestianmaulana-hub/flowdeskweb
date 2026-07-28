import { queryD1 } from '@/lib/db';

export interface DocMeta {
  slug: string;
  title: string;
  order: number;
  category: string;
  lang: string;
}

export interface DocData extends DocMeta {
  content: string;
}

export async function getDocsList(lang: string): Promise<DocMeta[]> {
  try {
    const results = await queryD1(
      'SELECT slug, title, order_num as "order", category, lang FROM docs WHERE lang = ? ORDER BY order_num ASC, title ASC',
      [lang]
    );
    return results;
  } catch (error) {
    console.error('Failed to fetch docs list:', error);
    return [];
  }
}

export async function getDocData(lang: string, slug: string): Promise<DocData | null> {
  try {
    const results = await queryD1(
      'SELECT slug, title, order_num as "order", category, lang, content FROM docs WHERE lang = ? AND slug = ? LIMIT 1',
      [lang, slug]
    );
    
    if (results.length === 0) return null;
    
    return results[0] as DocData;
  } catch (error) {
    console.error('Failed to fetch doc data:', error);
    return null;
  }
}
