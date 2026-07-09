import { NextRequest, NextResponse } from 'next/server';
import { queryD1 } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Increment the view counter by 1
    const result = await queryD1(
      'UPDATE posts SET views = COALESCE(views, 0) + 1 WHERE slug = ?',
      [slug]
    );
    
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Failed to update views:', error);
    return NextResponse.json({ success: false, error: 'Failed to update views' }, { status: 500 });
  }
}
