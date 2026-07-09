import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from '@/lib/auth';
import { queryD1 } from '@/lib/db';

// GET all posts
export async function GET(request: NextRequest) {
  try {
    const results = await queryD1('SELECT * FROM posts ORDER BY created_at DESC');
    return NextResponse.json(results);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST new post
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, slug, content, cover_image, category } = await request.json();

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Force author to be the currently logged in user's display_name
    const author = session.display_name;

    const id = uuidv4();
    await queryD1(
      'INSERT INTO posts (id, slug, title, content, cover_image, author, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, slug, title, content, cover_image || null, author, category || 'Blog']
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
