import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const changelogs = await queryD1("SELECT * FROM changelogs ORDER BY published_at DESC");
    return NextResponse.json(changelogs);
  } catch (error) {
    console.error('Error fetching changelogs:', error);
    return NextResponse.json({ error: 'Failed to fetch changelogs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { version, title, content, status, published_at } = await request.json();
    
    if (!version || !title || !content) {
      return NextResponse.json({ error: 'Version, title, and content are required' }, { status: 400 });
    }

    const id = uuidv4();
    const date = published_at || new Date().toISOString();
    
    await queryD1(
      "INSERT INTO changelogs (id, version, title, content, status, published_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, version, title, content, status || 'published', date]
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error creating changelog:', error);
    return NextResponse.json({ error: 'Failed to create changelog' }, { status: 500 });
  }
}
