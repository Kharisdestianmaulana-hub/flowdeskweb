import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { queryD1 } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await queryD1('SELECT id, username, display_name, role, bio, social_links FROM users WHERE username = ?', [session.username]);
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(users[0]);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { bio, social_links, display_name } = await request.json();

    if (!display_name) {
      return NextResponse.json({ error: 'Display name is required' }, { status: 400 });
    }

    await queryD1(
      'UPDATE users SET bio = ?, social_links = ?, display_name = ? WHERE username = ?',
      [bio || null, social_links || null, display_name, session.username]
    );

    // Sync author name in posts table to match the new display name
    await queryD1(
      'UPDATE posts SET author = ? WHERE author = ?',
      [display_name, session.display_name]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
