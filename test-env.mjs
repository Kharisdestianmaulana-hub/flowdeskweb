import fs from 'fs';
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => {
  const i = l.indexOf('=');
  return [l.slice(0, i), l.slice(i + 1)];
}));
console.log("Account:", env.CLOUDFLARE_ACCOUNT_ID);
console.log("DB:", env.CLOUDFLARE_DATABASE_ID);
console.log("Token length:", env.CLOUDFLARE_D1_TOKEN ? env.CLOUDFLARE_D1_TOKEN.length : 'undefined');
