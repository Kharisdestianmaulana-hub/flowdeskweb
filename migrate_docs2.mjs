import fs from 'fs';
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
    console.log("Creating docs_new table...");
    await query(`
      CREATE TABLE IF NOT EXISTS docs_new (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        title_id TEXT NOT NULL,
        title_en TEXT NOT NULL,
        content_id TEXT NOT NULL,
        content_en TEXT NOT NULL,
        category TEXT,
        order_num INTEGER DEFAULT 99,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Fetching existing docs...");
    const data = await query(`SELECT * FROM docs`);
    const allDocs = data.result[0].results;
    
    // Group by slug
    const grouped = {};
    for (const doc of allDocs) {
      if (!grouped[doc.slug]) {
        grouped[doc.slug] = {
          slug: doc.slug,
          category: doc.category,
          order_num: doc.order_num,
          title_id: '',
          title_en: '',
          content_id: '',
          content_en: ''
        };
      }
      if (doc.lang === 'id') {
        grouped[doc.slug].title_id = doc.title;
        grouped[doc.slug].content_id = doc.content;
      } else if (doc.lang === 'en') {
        grouped[doc.slug].title_en = doc.title;
        grouped[doc.slug].content_en = doc.content;
      }
    }

    console.log("Inserting into docs_new...");
    for (const slug in grouped) {
      const g = grouped[slug];
      const id = uuidv4();
      await query(
        'INSERT INTO docs_new (id, slug, title_id, title_en, content_id, content_en, category, order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, g.slug, g.title_id || g.title_en, g.title_en || g.title_id, g.content_id || g.content_en, g.content_en || g.content_id, g.category, g.order_num]
      );
    }

    console.log("Swapping tables...");
    await query(`DROP TABLE docs`);
    await query(`ALTER TABLE docs_new RENAME TO docs`);

    console.log("Migration complete!");
  } catch (error) {
    console.error(error);
  }
}

run();
