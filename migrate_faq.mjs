import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  const idDictPath = join(__dirname, 'dictionaries', 'id.json');
  const enDictPath = join(__dirname, 'dictionaries', 'en.json');

  const idDict = JSON.parse(fs.readFileSync(idDictPath, 'utf8'));
  const enDict = JSON.parse(fs.readFileSync(enDictPath, 'utf8'));

  const idFaq = idDict.faq.questions;
  const enFaq = enDict.faq.questions;

  console.log('Creating faq table...');
  await query(`
    CREATE TABLE IF NOT EXISTS faq (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL,
      answer_id TEXT NOT NULL,
      question_en TEXT NOT NULL,
      answer_en TEXT NOT NULL,
      order_num INTEGER DEFAULT 99,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Migrating data...');
  let order = 1;
  for (let i = 0; i < idFaq.length; i++) {
    const q_id = idFaq[i].q;
    const a_id = idFaq[i].a;
    const q_en = enFaq[i] ? enFaq[i].q : q_id;
    const a_en = enFaq[i] ? enFaq[i].a : a_id;
    const id = uuidv4();
    
    await query(`
      INSERT INTO faq (id, question_id, answer_id, question_en, answer_en, order_num) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, q_id, a_id, q_en, a_en, order]);
    
    console.log(`Inserted FAQ ${order}: ${q_id}`);
    order++;
  }

  console.log('Migration complete!');
}

run().catch(console.error);
