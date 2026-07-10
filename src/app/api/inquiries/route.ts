import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';

await initDb();

export async function GET() {
  const db = await getDb();
  const inquiries = db.prepare('SELECT * FROM bulk_inquiries ORDER BY created_at DESC').all();
  return NextResponse.json(inquiries);
}

export async function POST(request: NextRequest) {
  const db = await getDb();
  const body = await request.json();

  const result = db.prepare(`
    INSERT INTO bulk_inquiries (name, business_name, mobile, email, gst_number, product_id, product_name, quantity, delivery_city, expected_delivery_date, message, status, admin_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    body.name,
    body.business_name || null,
    body.mobile,
    body.email,
    body.gst_number || null,
    body.product_id || null,
    body.product_name,
    body.quantity,
    body.delivery_city,
    body.expected_delivery_date || null,
    body.message || null,
    body.status || 'pending',
    body.admin_notes || null
  );

  const inquiry = db.prepare('SELECT * FROM bulk_inquiries WHERE id = ?').get(result.lastInsertRowid);
  return NextResponse.json(inquiry, { status: 201 });
}
