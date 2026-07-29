import { NextRequest, NextResponse } from 'next/server';
import { queryD1 } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized. Only admins can manage roadmap.' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const { quarter, version, status, title_id, title_en, description_id, description_en, items_id, items_en, order_num } = await request.json();

    if (!quarter || !version || !status || !title_id || !title_en) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await queryD1(
      'UPDATE roadmap SET quarter = ?, version = ?, status = ?, title_id = ?, title_en = ?, description_id = ?, description_en = ?, items_id = ?, items_en = ?, order_num = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [quarter, version, status, title_id, title_en, description_id || '', description_en || '', items_id || '', items_en || '', order_num || 99, resolvedParams.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update roadmap item:', error);
    return NextResponse.json({ error: 'Failed to update roadmap item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized. Only admins can manage roadmap.' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    await queryD1('DELETE FROM roadmap WHERE id = ?', [resolvedParams.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete roadmap item:', error);
    return NextResponse.json({ error: 'Failed to delete roadmap item' }, { status: 500 });
  }
}
