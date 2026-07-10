import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';

await initDb();

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const db = await getDb();

  const inquiry = db.prepare('SELECT * FROM bulk_inquiries WHERE id = ?').get(parseInt(id));
  if (!inquiry) {
    return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
  }

  return NextResponse.json(inquiry);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const db = await getDb();
  const body = await request.json();

  const existing = db.prepare('SELECT id FROM bulk_inquiries WHERE id = ?').get(parseInt(id)) as any;
  if (!existing) {
    return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
  }

  const fields: string[] = [];
  const values: any[] = [];

  if (body.status !== undefined) {
    fields.push('status = ?');
    values.push(body.status);
  }

  if (body.admin_notes !== undefined) {
    fields.push('admin_notes = ?');
    values.push(body.admin_notes);
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  values.push(parseInt(id));
  db.prepare(`UPDATE bulk_inquiries SET ${fields.join(', ')} WHERE id = ?`).run(...values);

  const inquiry = db.prepare('SELECT * FROM bulk_inquiries WHERE id = ?').get(parseInt(id));
  return NextResponse.json(inquiry);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const db = await getDb();

  const inquiry = db.prepare('SELECT id, name, product_name FROM bulk_inquiries WHERE id = ?').get(parseInt(id)) as any;
  if (!inquiry) {
    return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
  }

  db.prepare('DELETE FROM bulk_inquiries WHERE id = ?').run(parseInt(id));

  return NextResponse.json({ message: `Inquiry from "${inquiry.name}" for "${inquiry.product_name}" deleted successfully` });
}
