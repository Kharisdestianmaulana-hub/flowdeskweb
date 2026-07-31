import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/db';

export async function GET() {
  try {
    const settings = await queryD1("SELECT * FROM settings");
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // We expect an array of { key, value } pairs
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Body must be an array of settings' }, { status: 400 });
    }

    for (const setting of body) {
      if (!setting.key || setting.value === undefined) continue;
      
      await queryD1(
        "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP",
        [setting.key, String(setting.value)]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
