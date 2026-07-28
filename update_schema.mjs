import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => {
  const i = l.indexOf('=');
  let val = l.slice(i + 1).trim();
  if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
  return [l.slice(0, i).trim(), val];
}));

const query = async (sql) => {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${env.CLOUDFLARE_DATABASE_ID}/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.CLOUDFLARE_D1_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql })
  });
  return res.json();
};

async function run() {
  try {
    console.log("Adding status column...");
    let res = await query("ALTER TABLE posts ADD COLUMN status TEXT DEFAULT 'published'");
    console.log(JSON.stringify(res));

    console.log("Adding published_at column...");
    res = await query("ALTER TABLE posts ADD COLUMN published_at DATETIME DEFAULT CURRENT_TIMESTAMP");
    console.log(JSON.stringify(res));
  } catch (error) {
    console.error(error);
  }
}

run();
