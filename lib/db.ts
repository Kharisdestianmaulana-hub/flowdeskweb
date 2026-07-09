const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const dbId = process.env.CLOUDFLARE_DATABASE_ID;
const token = process.env.CLOUDFLARE_D1_TOKEN;

export async function queryD1(sql: string, params: any[] = []) {
  if (!accountId || !dbId || !token) {
    throw new Error('Cloudflare D1 credentials are not configured in environment variables.');
  }

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`D1 query failed: ${errorText}`);
  }
  
  const data = await res.json();
  if (data.success && data.result && data.result[0]) {
    return data.result[0].results;
  }
  return [];
}
