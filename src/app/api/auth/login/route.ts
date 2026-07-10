import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { getDb, initDb } from '@/lib/db';

await initDb();

export async function POST(request: NextRequest) {
  const db = await getDb();
  const body = await request.json();

  if (!body.email || !body.password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(body.email) as any;

  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  if (!verifyPassword(body.password, user.password_hash)) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  const response = NextResponse.json({
    user: { name: user.name, email: user.email, role: user.role },
    message: 'Login successful'
  });

  response.headers.set('Set-Cookie', setAuthCookie(token));

  return response;
}
