import fs from 'fs';
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => {
  const i = l.indexOf('=');
  let val = l.slice(i + 1).trim();
  if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
  return [l.slice(0, i), val];
}));

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
    body: JSON.stringify({ sql: "ALTER TABLE posts ADD COLUMN author TEXT;", params: [] })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
