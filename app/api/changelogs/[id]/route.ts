import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { version, title, content, status, published_at } = await request.json();
    
    if (!version || !title || !content) {
      return NextResponse.json({ error: 'Version, title, and content are required' }, { status: 400 });
    }

    const date = published_at || new Date().toISOString();
    
    await queryD1(
      "UPDATE changelogs SET version = ?, title = ?, content = ?, status = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [version, title, content, status || 'published', date, resolvedParams.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating changelog:', error);
    return NextResponse.json({ error: 'Failed to update changelog' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await queryD1("DELETE FROM changelogs WHERE id = ?", [resolvedParams.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting changelog:', error);
    return NextResponse.json({ error: 'Failed to delete changelog' }, { status: 500 });
  }
}
