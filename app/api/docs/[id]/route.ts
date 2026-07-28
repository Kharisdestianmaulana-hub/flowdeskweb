import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { queryD1 } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const docs = await queryD1('SELECT * FROM docs WHERE id = ?', [resolvedParams.id]);
    
    if (docs.length === 0) {
      return NextResponse.json({ error: 'Doc not found' }, { status: 404 });
    }
    
    return NextResponse.json(docs[0]);
  } catch (error) {
    console.error('Failed to fetch doc:', error);
    return NextResponse.json({ error: 'Failed to fetch doc' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized. Only admins can manage docs.' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const { lang, slug, title, content, category, order_num } = await request.json();

    if (!lang || !slug || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await queryD1(
      'UPDATE docs SET lang = ?, slug = ?, title = ?, content = ?, category = ?, order_num = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [lang, slug, title, content, category || 'Uncategorized', order_num || 99, resolvedParams.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update doc:', error);
    return NextResponse.json({ error: 'Failed to update doc' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized. Only admins can manage docs.' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    await queryD1('DELETE FROM docs WHERE id = ?', [resolvedParams.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete doc:', error);
    return NextResponse.json({ error: 'Failed to delete doc' }, { status: 500 });
  }
}
