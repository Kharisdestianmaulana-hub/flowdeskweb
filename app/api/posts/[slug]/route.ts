import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { queryD1 } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const posts = await queryD1('SELECT * FROM posts WHERE slug = ?', [resolvedParams.slug]);
    
    if (posts.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(posts[0]);
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    
    // Check permission
    const existingPosts = await queryD1('SELECT author FROM posts WHERE slug = ?', [resolvedParams.slug]);
    if (existingPosts.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    if (session.role !== 'SUPER_ADMIN' && existingPosts[0].author !== session.display_name) {
      return NextResponse.json({ error: 'Forbidden: You can only edit your own posts' }, { status: 403 });
    }

    const { title, slug, content, cover_image, category } = await request.json();

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await queryD1(
      'UPDATE posts SET title = ?, slug = ?, content = ?, cover_image = ?, category = ? WHERE slug = ?',
      [title, slug, content, cover_image || null, category || 'Blog', resolvedParams.slug]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;

    // Check permission
    const existingPosts = await queryD1('SELECT author FROM posts WHERE slug = ?', [resolvedParams.slug]);
    if (existingPosts.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    if (session.role !== 'SUPER_ADMIN' && existingPosts[0].author !== session.display_name) {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own posts' }, { status: 403 });
    }

    await queryD1('DELETE FROM posts WHERE slug = ?', [resolvedParams.slug]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
