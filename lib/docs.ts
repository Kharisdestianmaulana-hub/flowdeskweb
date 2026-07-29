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
      `SELECT slug, title_${lang} as title, order_num as "order", category FROM docs ORDER BY order_num ASC, title_${lang} ASC`,
      []
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
      `SELECT slug, title_${lang} as title, order_num as "order", category, content_${lang} as content FROM docs WHERE slug = ? LIMIT 1`,
      [slug]
    );
    
    if (results.length === 0) return null;
    
    return results[0] as DocData;
  } catch (error) {
    console.error('Failed to fetch doc data:', error);
    return null;
  }
}
