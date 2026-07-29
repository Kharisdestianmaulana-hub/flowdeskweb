import { NextRequest, NextResponse } from 'next/server';
import { queryD1 } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const results = await queryD1('SELECT * FROM roadmap ORDER BY order_num ASC');
    return NextResponse.json(results);
  } catch (error) {
    console.error('Failed to fetch roadmap:', error);
    return NextResponse.json({ error: 'Failed to fetch roadmap' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized. Only admins can manage roadmap.' }, { status: 401 });
  }

  try {
    const { quarter, version, status, title_id, title_en, description_id, description_en, items_id, items_en, order_num } = await request.json();

    if (!quarter || !version || !status || !title_id || !title_en) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = uuidv4();
    await queryD1(
      'INSERT INTO roadmap (id, quarter, version, status, title_id, title_en, description_id, description_en, items_id, items_en, order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, quarter, version, status, title_id, title_en, description_id || '', description_en || '', items_id || '', items_en || '', order_num || 99]
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Failed to create roadmap item:', error);
    return NextResponse.json({ error: 'Failed to create roadmap item' }, { status: 500 });
  }
}
