import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';

await initDb();

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const db = await getDb();
  const body = await request.json();

  const existing = db.prepare('SELECT id FROM shipping_cities WHERE id = ?').get(parseInt(id)) as any;
  if (!existing) {
    return NextResponse.json({ error: 'City not found' }, { status: 404 });
  }

  const fields: string[] = [];
  const values: any[] = [];

  const updatableFields = ['city_name', 'state', 'small_order_allowed', 'bulk_order_allowed', 'small_delivery_charge', 'bulk_delivery_charge', 'min_order_value', 'status'];

  for (const field of updatableFields) {
    if (body[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(body[field]);
    }
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  values.push(parseInt(id));
  db.prepare(`UPDATE shipping_cities SET ${fields.join(', ')} WHERE id = ?`).run(...values);

  const city = db.prepare('SELECT * FROM shipping_cities WHERE id = ?').get(parseInt(id));
  return NextResponse.json(city);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const db = await getDb();

  const city = db.prepare('SELECT id, city_name FROM shipping_cities WHERE id = ?').get(parseInt(id)) as any;
  if (!city) {
    return NextResponse.json({ error: 'City not found' }, { status: 404 });
  }

  db.prepare('DELETE FROM shipping_cities WHERE id = ?').run(parseInt(id));

  return NextResponse.json({ message: `City "${city.city_name}" deleted successfully` });
}
