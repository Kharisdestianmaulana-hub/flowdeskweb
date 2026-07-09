import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from '@/lib/auth';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const dbId = process.env.CLOUDFLARE_DATABASE_ID;
const token = process.env.CLOUDFLARE_D1_TOKEN;

async function queryD1(sql: string, params: any[] = []) {
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
  return data.result[0].results;
}

// GET all posts
export async function GET(request: NextRequest) {
  try {
    const posts = await queryD1('SELECT * FROM posts ORDER BY created_at DESC');
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new article
export async function POST(request: NextRequest) {
  // Auth check
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, slug, content, cover_image } = await request.json();

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = uuidv4();
    await queryD1(
      'INSERT INTO posts (id, slug, title, content, cover_image) VALUES (?, ?, ?, ?, ?)',
      [id, slug, title, content, cover_image || null]
    );

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
