import Link from 'next/link';
import type { Metadata } from 'next';
import { initDb, getDb } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import type { Product, Category } from '@/types';
import { Package } from 'lucide-react';

initDb();

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Products | KAAEXIM PRODUCTS PRIVATE LIMITED',
    description: 'Browse our complete product catalog',
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; minPrice?: string; maxPrice?: string; sort?: string; bulkOnly?: string; inStock?: string }>;
}) {
  const params = await searchParams;

  const db = getDb();

  const categories = db.prepare('SELECT * FROM categories WHERE status = 1 ORDER BY display_order').all() as Category[];

  const conditions: string[] = ['p.status = 1'];
  const queryParams: (string | number)[] = [];

  if (params.category) {
    conditions.push('c.slug = ?');
    queryParams.push(params.category);
  }

  if (params.search) {
    conditions.push('(p.name LIKE ? OR p.sku LIKE ?)');
    const pattern = `%${params.search}%`;
    queryParams.push(pattern, pattern);
  }

  if (params.minPrice) {
    conditions.push('p.selling_price >= ?');
    queryParams.push(Number(params.minPrice));
  }

  if (params.maxPrice) {
    conditions.push('p.selling_price <= ?');
    queryParams.push(Number(params.maxPrice));
  }

  if (params.bulkOnly === 'true') {
    conditions.push('p.bulk_price IS NOT NULL');
  }

  if (params.inStock === 'true') {
    conditions.push('p.stock_quantity > 0');
  }

  const whereClause = 'WHERE ' + conditions.join(' AND ');

  let orderClause = 'ORDER BY p.created_at DESC';
  if (params.sort === 'price_asc') {
    orderClause = 'ORDER BY p.selling_price ASC';
  } else if (params.sort === 'price_desc') {
    orderClause = 'ORDER BY p.selling_price DESC';
  } else if (params.sort === 'name') {
    orderClause = 'ORDER BY p.name ASC';
  }

  const rows = db.prepare(`
    SELECT p.*, c.name as category_name, pi.image_url as first_image
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN (
      SELECT product_id, MIN(display_order) as min_order
      FROM product_images
      GROUP BY product_id
    ) first_img ON first_img.product_id = p.id
    LEFT JOIN product_images pi ON pi.product_id = first_img.product_id AND pi.display_order = first_img.min_order
    ${whereClause}
    ${orderClause}
  `).all(...queryParams) as any[];

  const products: Product[] = rows.map((row) => ({
    id: row.id,
    category_id: row.category_id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    short_description: row.short_description,
    full_description: row.full_description,
    mrp: row.mrp,
    selling_price: row.selling_price,
    bulk_price: row.bulk_price,
    gst_rate: row.gst_rate,
    hsn_code: row.hsn_code,
    unit_type: row.unit_type,
    min_small_qty: row.min_small_qty,
    max_small_qty: row.max_small_qty,
    min_bulk_qty: row.min_bulk_qty,
    stock_quantity: row.stock_quantity,
    status: row.status,
    is_featured: row.is_featured,
    is_best_seller: row.is_best_seller,
    allow_middle_qty: row.allow_middle_qty,
    created_at: row.created_at,
    updated_at: row.updated_at,
    category_name: row.category_name,
    images: row.first_image
      ? [{ id: 0, product_id: row.id, image_url: row.first_image, display_order: 0 }]
      : [],
  }));

  const selectedCategory = params.category || '';
  const selectedSort = params.sort || 'newest';

  return (
    <div className="container-main py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Products</h1>
        <p className="text-muted-foreground mt-2">Browse our complete product catalog</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="font-bold text-lg mb-4 text-foreground">Filters</h2>

            <form method="GET" action="/products" className="space-y-5">
              <div>
                <label htmlFor="category" className="label">Category</label>
                <select
                  id="category"
                  name="category"
                  className="input-field"
                  defaultValue={selectedCategory}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="search" className="label">Search</label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  className="input-field"
                  placeholder="Name or SKU..."
                  defaultValue={params.search || ''}
                />
              </div>

              <div>
                <p className="label">Price Range</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    className="input-field w-1/2"
                    placeholder="Min"
                    min="0"
                    step="1"
                    defaultValue={params.minPrice || ''}
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    className="input-field w-1/2"
                    placeholder="Max"
                    min="0"
                    step="1"
                    defaultValue={params.maxPrice || ''}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bulkOnly"
                  name="bulkOnly"
                  value="true"
                  className="w-4 h-4 text-accent focus:ring-accent border-gray-300 rounded"
                  defaultChecked={params.bulkOnly === 'true'}
                />
                <label htmlFor="bulkOnly" className="text-sm text-foreground">Bulk Available</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  value="true"
                  className="w-4 h-4 text-accent focus:ring-accent border-gray-300 rounded"
                  defaultChecked={params.inStock === 'true'}
                />
                <label htmlFor="inStock" className="text-sm text-foreground">In Stock Only</label>
              </div>

              <div>
                <label htmlFor="sort" className="label">Sort By</label>
                <select
                  id="sort"
                  name="sort"
                  className="input-field"
                  defaultValue={selectedSort}
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary text-sm py-2 px-4 flex-1 text-center">
                  Apply Filters
                </button>
                <Link href="/products" className="btn-outline text-sm py-2 px-4 flex-1 text-center">
                  Clear Filters
                </Link>
              </div>
            </form>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms.</p>
              <Link href="/products" className="btn-primary text-sm py-2 px-6">
                Clear Filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
