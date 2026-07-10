'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Plus, Minus, RotateCcw, CheckCircle, Package, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const imageUrl = product.images?.[0]?.image_url || '/images/placeholder.svg';
  const inStock = product.stock_quantity > 0 && product.status === 1;
  const orderType = qty <= product.max_small_qty ? 'small' : qty >= product.min_bulk_qty ? 'bulk' : 'invalid';
  const price = orderType === 'bulk' && product.bulk_price ? product.bulk_price : product.selling_price;

  const handleAdd = async () => {
    if (!inStock) return;
    setAdding(true);
    await new Promise(r => setTimeout(r, 300));
    addItem({
      product_id: product.id,
      name: product.name, slug: product.slug, sku: product.sku,
      image: imageUrl, price,
      bulk_price: product.bulk_price, min_bulk_qty: product.min_bulk_qty,
      max_small_qty: product.max_small_qty, quantity: qty,
      unit_type: product.unit_type, stock_quantity: product.stock_quantity,
    });
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-muted disabled:opacity-50 transition-colors" disabled={qty <= 1}><Minus className="w-4 h-4" /></button>
          <input type="number" value={qty} onChange={e => setQty(Math.max(1, Math.min(product.stock_quantity, +e.target.value || 1)))} className="w-16 text-center border-x border-border bg-transparent focus:outline-none text-sm" min={1} max={product.stock_quantity} />
          <button onClick={() => setQty(Math.min(product.stock_quantity, qty + 1))} className="px-3 py-2 hover:bg-muted disabled:opacity-50 transition-colors" disabled={qty >= product.stock_quantity}><Plus className="w-4 h-4" /></button>
        </div>
        <span className="text-xs text-muted-foreground">
          {orderType === 'small' && <span className="badge-success text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Small Order</span>}
          {orderType === 'bulk' && <span className="badge-accent text-xs flex items-center gap-1"><Package className="w-3 h-3" /> Bulk Order</span>}
          {orderType === 'invalid' && <span className="badge-warning text-xs">Qty {qty} not valid</span>}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-lg font-bold">{formatPrice(price)} {product.bulk_price && qty >= product.min_bulk_qty && <span className="text-xs text-accent font-medium">(Bulk Price)</span>}</p>
      </div>
      <div className="flex gap-3">
        {added ? (
          <>
            <Link href="/cart" className="btn-primary flex-1"><ShoppingCart className="w-4 h-4" /> View in Cart</Link>
            <Link href="/products" className="btn-outline flex-1">Continue Shopping</Link>
          </>
        ) : (
          <button onClick={handleAdd} disabled={!inStock || adding || orderType === 'invalid'} className="btn-primary flex-1">
            {adding ? <RotateCcw className="w-5 h-5 animate-spin" /> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
          </button>
        )}
      </div>
      {!inStock && <p className="text-sm text-destructive">Out of Stock</p>}
    </div>
  );
}
