import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';

initDb();

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const db = getDb();

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(parseInt(id)) as any;
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  order.items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  return NextResponse.json(order);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const db = getDb();
  const body = await request.json();

  const existing = db.prepare('SELECT id FROM orders WHERE id = ?').get(parseInt(id)) as any;
  if (!existing) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const fields: string[] = [];
  const values: any[] = [];

  if (body.payment_status !== undefined) {
    fields.push('payment_status = ?');
    values.push(body.payment_status);
  }

  if (body.order_status !== undefined) {
    fields.push('order_status = ?');
    values.push(body.order_status);
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  fields.push("updated_at = datetime('now')");
  values.push(parseInt(id));

  db.prepare(`UPDATE orders SET ${fields.join(', ')} WHERE id = ?`).run(...values);

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(parseInt(id)) as any;
  order.items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

  return NextResponse.json(order);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const db = getDb();

  const order = db.prepare('SELECT id, order_number FROM orders WHERE id = ?').get(parseInt(id)) as any;
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  db.prepare('DELETE FROM orders WHERE id = ?').run(parseInt(id));

  return NextResponse.json({ message: `Order "${order.order_number}" deleted successfully` });
}
