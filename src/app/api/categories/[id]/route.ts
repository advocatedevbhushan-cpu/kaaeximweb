import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';

await initDb();

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const db = await getDb();

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(parseInt(id));
  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  return NextResponse.json(category);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const db = await getDb();
  const body = await request.json();

  const existing = db.prepare('SELECT id FROM categories WHERE id = ?').get(parseInt(id)) as any;
  if (!existing) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  const fields: string[] = [];
  const values: any[] = [];

  const updatableFields = ['name', 'slug', 'image', 'description', 'status', 'display_order'];

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
  db.prepare(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`).run(...values);

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(parseInt(id));
  return NextResponse.json(category);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const db = await getDb();

  const category = db.prepare('SELECT id, name FROM categories WHERE id = ?').get(parseInt(id)) as any;
  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  const productCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?').get(parseInt(id)) as any;
  if (productCount.count > 0) {
    return NextResponse.json({ error: 'Cannot delete category with existing products' }, { status: 409 });
  }

  db.prepare('DELETE FROM categories WHERE id = ?').run(parseInt(id));

  return NextResponse.json({ message: `Category "${category.name}" deleted successfully` });
}
