import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { slugify } from '@/lib/utils';

initDb();

export async function GET() {
  const db = getDb();
  const categories = db.prepare('SELECT * FROM categories ORDER BY display_order ASC').all();
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body = await request.json();

  const slug = body.slug || slugify(body.name);

  const existing = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug);
  if (existing) {
    return NextResponse.json({ error: 'Category with this slug already exists' }, { status: 409 });
  }

  const result = db.prepare(`
    INSERT INTO categories (name, slug, image, description, status, display_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    body.name,
    slug,
    body.image || null,
    body.description || null,
    body.status ?? 1,
    body.display_order || 0
  );

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
  return NextResponse.json(category, { status: 201 });
}
