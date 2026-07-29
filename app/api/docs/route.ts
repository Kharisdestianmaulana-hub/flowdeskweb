import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getSession } from '@/lib/auth';
import { queryD1 } from '@/lib/db';

// GET all docs (for CMS)
export async function GET(request: NextRequest) {
  try {
    const results = await queryD1('SELECT * FROM docs ORDER BY order_num ASC');
    return NextResponse.json(results);
  } catch (error) {
    console.error('Failed to fetch docs:', error);
    return NextResponse.json({ error: 'Failed to fetch docs' }, { status: 500 });
  }
}

// POST new doc
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized. Only admins can manage docs.' }, { status: 401 });
  }

  try {
    const { slug, title_id, title_en, content_id, content_en, category, order_num } = await request.json();

    if (!slug || !title_id || !title_en || !content_id || !content_en) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = uuidv4();
    await queryD1(
      'INSERT INTO docs (id, slug, title_id, title_en, content_id, content_en, category, order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, slug, title_id, title_en, content_id, content_en, category || 'Uncategorized', order_num || 99]
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Failed to create doc:', error);
    return NextResponse.json({ error: 'Failed to create doc' }, { status: 500 });
  }
}
