import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

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
    console.log("Creating roadmap table...");
    await query(`
      CREATE TABLE IF NOT EXISTS roadmap (
        id TEXT PRIMARY KEY,
        quarter TEXT NOT NULL,
        version TEXT NOT NULL,
        status TEXT NOT NULL,
        title_id TEXT NOT NULL,
        title_en TEXT NOT NULL,
        description_id TEXT NOT NULL,
        description_en TEXT NOT NULL,
        items_id TEXT NOT NULL,
        items_en TEXT NOT NULL,
        order_num INTEGER DEFAULT 99,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Reading data/roadmap.json...");
    const dataFilePath = path.join(process.cwd(), 'data', 'roadmap.json');
    if (fs.existsSync(dataFilePath)) {
      const roadmapData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
      
      console.log(`Found ${roadmapData.length} roadmap items. Inserting into D1...`);
      
      let order_num = 1;
      for (const item of roadmapData) {
        const id = uuidv4();
        const items_id = Array.isArray(item.items.id) ? item.items.id.join('\\n') : '';
        const items_en = Array.isArray(item.items.en) ? item.items.en.join('\\n') : '';
        
        await query(
          'INSERT INTO roadmap (id, quarter, version, status, title_id, title_en, description_id, description_en, items_id, items_en, order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [id, item.quarter, item.version, item.status, item.title.id, item.title.en, item.description.id, item.description.en, items_id, items_en, order_num]
        );
        order_num++;
      }
      console.log("Migration complete!");
    } else {
      console.log("data/roadmap.json not found, assuming already migrated.");
    }
  } catch (error) {
    console.error(error);
  }
}

run();
