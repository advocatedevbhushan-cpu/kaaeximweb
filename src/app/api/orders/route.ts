import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { generateOrderNumber } from '@/lib/utils';

await initDb();

export async function GET(request: NextRequest) {
  const db = await getDb();
  const searchParams = request.nextUrl.searchParams;

  let sql = 'SELECT * FROM orders WHERE 1=1';
  const params: any[] = [];

  const status = searchParams.get('status');
  if (status) {
    sql += ' AND order_status = ?';
    params.push(status);
  }

  const payment_status = searchParams.get('payment_status');
  if (payment_status) {
    sql += ' AND payment_status = ?';
    params.push(payment_status);
  }

  sql += ' ORDER BY created_at DESC';

  const orders = db.prepare(sql).all(...params);
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  const db = await getDb();
  const body = await request.json();

  const order_number = generateOrderNumber();

  const insertOrder = db.prepare(`
    INSERT INTO orders (order_number, customer_id, customer_name, customer_mobile, customer_email, delivery_address, city, state, pincode, order_type, subtotal, delivery_charge, gst_amount, total_amount, payment_method, payment_status, order_status, landmark, delivery_instructions, gst_number, business_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, sku, quantity, price, total)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    const result = insertOrder.run(
      order_number,
      body.customer_id || null,
      body.customer_name,
      body.customer_mobile,
      body.customer_email,
      body.delivery_address,
      body.city,
      body.state,
      body.pincode,
      body.order_type,
      body.subtotal || 0,
      body.delivery_charge || 0,
      body.gst_amount || 0,
      body.total_amount,
      body.payment_method || 'cod',
      body.payment_status || 'pending',
      body.order_status || 'pending',
      body.landmark || null,
      body.delivery_instructions || null,
      body.gst_number || null,
      body.business_name || null
    );

    const orderId = result.lastInsertRowid;

    if (body.items && Array.isArray(body.items)) {
      for (const item of body.items) {
        insertItem.run(
          orderId,
          item.product_id,
          item.product_name,
          item.sku,
          item.quantity,
          item.price,
          item.total || item.quantity * item.price
        );
      }
    }

    return orderId;
  });

  const orderId = transaction();

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
  order.items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

  return NextResponse.json(order, { status: 201 });
}
