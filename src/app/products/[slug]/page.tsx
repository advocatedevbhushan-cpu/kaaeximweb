import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { initDb, getDb } from '@/lib/db';
import { formatPrice, getImageUrl } from '@/lib/utils';
import type { Product, ProductImage, ShippingCity } from '@/types';
import { Package, Check, X } from 'lucide-react';
import { AddToCartButton } from './add-to-cart-button';

initDb();

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const product = db.prepare('SELECT p.name, p.short_description, p.selling_price FROM products p WHERE p.slug = ?').get(slug) as Pick<Product, 'name' | 'short_description' | 'selling_price'> | undefined;
  if (!product) return { title: 'Product Not Found' };
  return { title: product.name, description: product.short_description || `${product.name} - ${formatPrice(product.selling_price)}` };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const db = getDb();

  const product = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ? AND p.status = 1
  `).get(slug) as (Product & { category_name: string; category_slug: string }) | undefined;
  if (!product) notFound();

  const images = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC').all(product.id) as ProductImage[];
  product.images = images;

  const smallCities = db.prepare("SELECT city_name, state FROM shipping_cities WHERE small_order_allowed = 1 AND status = 1 ORDER BY city_name").all() as Pick<ShippingCity, 'city_name' | 'state'>[];
  const bulkCities = db.prepare("SELECT city_name, state FROM shipping_cities WHERE bulk_order_allowed = 1 AND status = 1 ORDER BY city_name").all() as Pick<ShippingCity, 'city_name' | 'state'>[];

  const inStock = product.stock_quantity > 0;
  const mainImage = product.images?.[0]?.image_url || null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container-main py-8">
        <nav className="text-sm text-muted-foreground mb-6 flex flex-wrap gap-1">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          {product.category_name && (
            <><span className="mx-2">/</span><Link href={`/products?category=${product.category_slug}`} className="hover:text-primary transition-colors">{product.category_name}</Link></>
          )}
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium truncate max-w-[300px]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="aspect-square bg-white rounded-xl overflow-hidden border border-border mb-4">
              <Image src={getImageUrl(mainImage)} alt={product.name} width={600} height={600} className="w-full h-full object-cover" priority />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img) => (
                  <div key={img.id} className="w-20 h-20 shrink-0 bg-white rounded-lg border border-border overflow-hidden cursor-pointer hover:border-accent transition-colors">
                    <Image src={getImageUrl(img.image_url)} alt={`${product.name} ${img.display_order + 1}`} width={80} height={80} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.category_name && <p className="text-sm text-accent font-medium mb-1">{product.category_name}</p>}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-sm text-muted-foreground mb-4">SKU: {product.sku}</p>

            <div className="bg-white rounded-xl p-4 border border-border mb-4">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-bold text-primary">{formatPrice(product.selling_price)}</span>
                {product.mrp > product.selling_price && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.mrp)}</span>}
                {product.mrp > product.selling_price && <span className="text-sm font-medium text-green-600">{Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)}% OFF</span>}
              </div>
              {product.bulk_price && <p className="text-sm text-muted-foreground">Bulk price: <span className="font-semibold text-foreground">{formatPrice(product.bulk_price)}</span> / {product.unit_type} (min. {product.min_bulk_qty} {product.unit_type}s)</p>}
              <p className="text-xs text-muted-foreground mt-1">{product.unit_type}</p>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {inStock ? <><Check className="w-5 h-5 text-green-500" /><span className="text-sm font-medium text-green-700">In Stock ({product.stock_quantity} available)</span></>
                : <><X className="w-5 h-5 text-danger" /><span className="text-sm font-medium text-danger">Out of Stock</span></>}
            </div>

            {product.short_description && <p className="text-muted-foreground mb-6 leading-relaxed">{product.short_description}</p>}

            <AddToCartButton product={product} />

            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="bg-white rounded-lg p-3 border border-border"><p className="text-muted-foreground">Min Small Qty</p><p className="font-semibold text-foreground">{product.min_small_qty}</p></div>
              <div className="bg-white rounded-lg p-3 border border-border"><p className="text-muted-foreground">Max Small Qty</p><p className="font-semibold text-foreground">{product.max_small_qty}</p></div>
              <div className="bg-white rounded-lg p-3 border border-border"><p className="text-muted-foreground">Min Bulk Qty</p><p className="font-semibold text-foreground">{product.min_bulk_qty}</p></div>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-accent" /> Delivery Availability</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-foreground mb-3">Bulk Delivery Cities</h3>
              {bulkCities.length > 0 ? (
                <ul className="space-y-2">
                  {bulkCities.map((city, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> {city.city_name}, {city.state}</li>
                  ))}
                </ul>
              ) : <p className="text-sm text-muted-foreground">No bulk delivery available currently.</p>}
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-3">Small Quantity Delivery Cities</h3>
              {smallCities.length > 0 ? (
                <ul className="space-y-2">
                  {smallCities.map((city, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> {city.city_name}, {city.state}</li>
                  ))}
                </ul>
              ) : <p className="text-sm text-muted-foreground">No small quantity delivery available currently.</p>}
            </div>
          </div>
        </div>

        {product.full_description && (
          <div className="mt-8 bg-white rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-3">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.full_description}</p>
          </div>
        )}

        <div className="mt-8 bg-white rounded-xl p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Specifications</h2>
          <div className="divide-y divide-border">
            {[
              { label: 'SKU', value: product.sku },
              { label: 'Unit Type', value: product.unit_type },
              ...(product.hsn_code ? [{ label: 'HSN Code', value: product.hsn_code }] : []),
              ...(product.gst_rate != null ? [{ label: 'GST Rate', value: `${product.gst_rate}%` }] : []),
              { label: 'Min Small Quantity', value: String(product.min_small_qty) },
              { label: 'Max Small Quantity', value: String(product.max_small_qty) },
              { label: 'Min Bulk Quantity', value: String(product.min_bulk_qty) },
            ].map((spec, i) => (
              <div key={i} className="flex justify-between py-3">
                <span className="text-sm text-muted-foreground">{spec.label}</span>
                <span className="text-sm font-medium text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}