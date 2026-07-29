import { NextRequest, NextResponse } from 'next/server';
import { queryD1 } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { question_id, answer_id, question_en, answer_en, order_num } = await request.json();

    await queryD1(
      'UPDATE faq SET question_id = ?, answer_id = ?, question_en = ?, answer_en = ?, order_num = ? WHERE id = ?',
      [question_id, answer_id, question_en, answer_en, order_num || 99, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update faq:', error);
    return NextResponse.json({ error: 'Failed to update faq' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await queryD1('DELETE FROM faq WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete faq:', error);
    return NextResponse.json({ error: 'Failed to delete faq' }, { status: 500 });
  }
}
