import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => {
  const i = l.indexOf('=');
  let val = l.slice(i + 1).trim();
  if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
  return [l.slice(0, i).trim(), val];
}));

const query = async (sql, params = []) => {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${env.CLOUDFLARE_DATABASE_ID}/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.CLOUDFLARE_D1_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql, params })
  });
  const data = await res.json();
  if (!data.success) {
    console.error('Error in query:', data.errors);
    throw new Error('Query failed');
  }
  return data;
};

async function run() {
  try {
    console.log("Creating docs table...");
    await query(`
      CREATE TABLE IF NOT EXISTS docs (
        id TEXT PRIMARY KEY,
        lang TEXT NOT NULL,
        slug TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT,
        order_num INTEGER DEFAULT 99,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create unique index on lang and slug
    await query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_docs_lang_slug ON docs (lang, slug)`);

    console.log("Migrating files...");
    const docsDirectory = path.join(process.cwd(), 'content/docs');
    
    for (const lang of ['id', 'en']) {
      const langDir = path.join(docsDirectory, lang);
      if (!fs.existsSync(langDir)) continue;
      
      const fileNames = fs.readdirSync(langDir);
      for (const fileName of fileNames) {
        if (!fileName.endsWith('.md')) continue;
        
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(langDir, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        
        const title = data.title || slug;
        const order_num = data.order || 99;
        const category = data.category || 'Uncategorized';
        
        const id = uuidv4();
        
        console.log(`Inserting ${lang}/${slug}...`);
        await query(
          'INSERT INTO docs (id, lang, slug, title, content, category, order_num) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [id, lang, slug, title, content, category, order_num]
        );
      }
    }
    console.log("Migration complete!");
  } catch (error) {
    console.error(error);
  }
}

run();
