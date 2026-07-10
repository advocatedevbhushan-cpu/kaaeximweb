import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { slugify } from '@/lib/utils';

await initDb();

export async function GET(request: NextRequest) {
  const db = await getDb();
  const searchParams = request.nextUrl.searchParams;

  let sql = `
    SELECT p.*, c.name as category_name,
      (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as first_image
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const params: any[] = [];

  const category_id = searchParams.get('category_id');
  if (category_id) {
    sql += ' AND p.category_id = ?';
    params.push(parseInt(category_id));
  }

  const search = searchParams.get('search');
  if (search) {
    sql += ' AND (p.name LIKE ? OR p.sku LIKE ? OR p.short_description LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  const minPrice = searchParams.get('minPrice');
  if (minPrice) {
    sql += ' AND p.selling_price >= ?';
    params.push(parseFloat(minPrice));
  }

  const maxPrice = searchParams.get('maxPrice');
  if (maxPrice) {
    sql += ' AND p.selling_price <= ?';
    params.push(parseFloat(maxPrice));
  }

  const bulkOnly = searchParams.get('bulkOnly');
  if (bulkOnly === 'true') {
    sql += ' AND p.bulk_price IS NOT NULL';
  }

  const inStock = searchParams.get('inStock');
  if (inStock === 'true') {
    sql += ' AND p.stock_quantity > 0';
  }

  const sort = searchParams.get('sort');
  switch (sort) {
    case 'price_asc':
      sql += ' ORDER BY p.selling_price ASC';
      break;
    case 'price_desc':
      sql += ' ORDER BY p.selling_price DESC';
      break;
    case 'name_asc':
      sql += ' ORDER BY p.name ASC';
      break;
    case 'name_desc':
      sql += ' ORDER BY p.name DESC';
      break;
    case 'newest':
      sql += ' ORDER BY p.created_at DESC';
      break;
    default:
      sql += ' ORDER BY p.id DESC';
  }

  const products = db.prepare(sql).all(...params);
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const db = await getDb();
  const body = await request.json();

  const slug = body.slug || slugify(body.name);

  const existing = db.prepare('SELECT id FROM products WHERE slug = ?').get(slug);
  if (existing) {
    return NextResponse.json({ error: 'Product with this slug already exists' }, { status: 409 });
  }

  const result = db.prepare(`
    INSERT INTO products (category_id, name, slug, sku, short_description, full_description, mrp, selling_price, bulk_price, gst_rate, hsn_code, unit_type, min_small_qty, max_small_qty, min_bulk_qty, stock_quantity, status, is_featured, is_best_seller, allow_middle_qty)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    body.category_id || null,
    body.name,
    slug,
    body.sku,
    body.short_description || null,
    body.full_description || null,
    body.mrp || 0,
    body.selling_price || 0,
    body.bulk_price || null,
    body.gst_rate || null,
    body.hsn_code || null,
    body.unit_type || 'Piece',
    body.min_small_qty || 1,
    body.max_small_qty || 2,
    body.min_bulk_qty || 10,
    body.stock_quantity || 0,
    body.status ?? 1,
    body.is_featured || 0,
    body.is_best_seller || 0,
    body.allow_middle_qty || 0
  );

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  return NextResponse.json(product, { status: 201 });
}
