import { NextRequest, NextResponse } from 'next/server';
import { queryD1 } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const results = await queryD1('SELECT * FROM faq ORDER BY order_num ASC');
    return NextResponse.json(results || []);
  } catch (error) {
    console.error('Failed to fetch faq:', error);
    return NextResponse.json({ error: 'Failed to fetch faq' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { question_id, answer_id, question_en, answer_en, order_num } = await request.json();
    const id = uuidv4();

    await queryD1(
      'INSERT INTO faq (id, question_id, answer_id, question_en, answer_en, order_num) VALUES (?, ?, ?, ?, ?, ?)',
      [id, question_id, answer_id, question_en, answer_en, order_num || 99]
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Failed to create faq:', error);
    return NextResponse.json({ error: 'Failed to create faq' }, { status: 500 });
  }
}
