import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';

await initDb();

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const db = await getDb();

  const product = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ?
  `).get(slug) as any;

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const images = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order').all(product.id);
  product.images = images;

  return NextResponse.json(product);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const db = await getDb();
  const body = await request.json();

  const existing = db.prepare('SELECT id FROM products WHERE slug = ?').get(slug) as any;
  if (!existing) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const fields: string[] = [];
  const values: any[] = [];

  const updatableFields = [
    'category_id', 'name', 'sku', 'short_description', 'full_description',
    'mrp', 'selling_price', 'bulk_price', 'gst_rate', 'hsn_code', 'unit_type',
    'min_small_qty', 'max_small_qty', 'min_bulk_qty', 'stock_quantity',
    'status', 'is_featured', 'is_best_seller', 'allow_middle_qty'
  ];

  for (const field of updatableFields) {
    if (body[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(body[field]);
    }
  }

  if (body.name && !body.slug) {
    const { slugify } = await import('@/lib/utils');
    const newSlug = slugify(body.name);
    fields.push('slug = ?');
    values.push(newSlug);
  } else if (body.slug) {
    fields.push('slug = ?');
    values.push(body.slug);
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  fields.push("updated_at = datetime('now')");
  values.push(existing.id);

  db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`).run(...values);

  const product = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `).get(existing.id);

  return NextResponse.json(product);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const db = await getDb();

  const product = db.prepare('SELECT id, name FROM products WHERE slug = ?').get(slug) as any;
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  db.prepare('DELETE FROM products WHERE id = ?').run(product.id);

  return NextResponse.json({ message: `Product "${product.name}" deleted successfully` });
}
