import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await login(formData);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
