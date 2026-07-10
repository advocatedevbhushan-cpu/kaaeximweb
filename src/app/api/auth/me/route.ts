import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('kaaexim_admin_token')?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ user: null });
  }

  const db = getDb();
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(payload.id) as any;

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
