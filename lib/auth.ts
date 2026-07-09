import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { queryD1 } from '@/lib/db';

const secretKey = process.env.ADMIN_PASSWORD || 'flowdesksecret2026'; // Keeping as JWT secret for now
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  try {
    const users = await queryD1('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length > 0) {
      const user = users[0];
      const match = await bcrypt.compare(password, user.password_hash);
      
      if (match) {
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const session = await encrypt({ 
          username: user.username, 
          display_name: user.display_name,
          role: user.role,
          expires 
        });

        const cookieStore = await cookies();
        cookieStore.set('session', session, {
          expires,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
        return { success: true };
      }
    }
  } catch (error) {
    console.error('Login error:', error);
  }

  return { success: false, error: 'Invalid credentials' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', { expires: new Date(0) });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (e) {
    return null;
  }
}
