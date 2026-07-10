import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';

initDb();

export async function GET(request: NextRequest) {
  const db = getDb();
  const searchParams = request.nextUrl.searchParams;
  const all = searchParams.get('all') === 'true';
  const sql = all ? 'SELECT * FROM shipping_cities ORDER BY city_name ASC' : 'SELECT * FROM shipping_cities WHERE status = 1 ORDER BY city_name ASC';
  const cities = db.prepare(sql).all();
  return NextResponse.json(cities);
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body = await request.json();

  const existing = db.prepare('SELECT id FROM shipping_cities WHERE city_name = ?').get(body.city_name);
  if (existing) {
    return NextResponse.json({ error: 'City already exists' }, { status: 409 });
  }

  const result = db.prepare(`
    INSERT INTO shipping_cities (city_name, state, small_order_allowed, bulk_order_allowed, small_delivery_charge, bulk_delivery_charge, min_order_value, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    body.city_name,
    body.state,
    body.small_order_allowed ?? 0,
    body.bulk_order_allowed ?? 0,
    body.small_delivery_charge || 0,
    body.bulk_delivery_charge || 0,
    body.min_order_value || 0,
    body.status ?? 1
  );

  const city = db.prepare('SELECT * FROM shipping_cities WHERE id = ?').get(result.lastInsertRowid);
  return NextResponse.json(city, { status: 201 });
}
