import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const docsDirectory = path.join(process.cwd(), 'content/docs');

export interface DocMeta {
  slug: string;
  title: string;
  order: number;
}

export interface DocData extends DocMeta {
  content: string;
}

export function getDocsList(lang: string): DocMeta[] {
  const langDir = path.join(docsDirectory, lang);
  if (!fs.existsSync(langDir)) return [];

  const fileNames = fs.readdirSync(langDir);
  const docs = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(langDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        order: data.order || 99,
      };
    })
    .sort((a, b) => a.order - b.order);

  return docs;
}

export function getDocData(lang: string, slug: string): DocData | null {
  const fullPath = path.join(docsDirectory, lang, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    order: data.order || 99,
    content,
  };
}
