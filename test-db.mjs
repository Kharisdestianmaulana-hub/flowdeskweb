import fs from 'fs';
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('=')));

const accountId = env.CLOUDFLARE_ACCOUNT_ID;
const dbId = env.CLOUDFLARE_DATABASE_ID;
const token = env.CLOUDFLARE_D1_TOKEN;

async function run() {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql: "PRAGMA table_info(posts);", params: [] })
  });
  const data = await res.json();
  console.log(data.result[0].results);
}
run();
