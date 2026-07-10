'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getImageUrl } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, itemCount, subtotal } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container-main py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added any products to your cart yet.</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            <ArrowLeft className="w-4 h-4" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Cart</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Shopping Cart</h1>
        <button
          onClick={() => {
            if (confirmClear) {
              clearCart();
              setConfirmClear(false);
            } else {
              setConfirmClear(true);
              setTimeout(() => setConfirmClear(false), 3000);
            }
          }}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            confirmClear ? 'text-red-600' : 'text-muted-foreground hover:text-red-600'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          {confirmClear ? 'Confirm Clear Cart?' : 'Clear Cart'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const isSmallOrder = item.quantity <= item.max_small_qty;
            const isBulkOrder = item.quantity >= item.min_bulk_qty;
            const needsWarning = !isSmallOrder && !isBulkOrder;

            return (
              <div key={item.product_id} className="card p-4 md:p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 relative bg-muted rounded-md overflow-hidden">
                    <Image
                      src={getImageUrl(item.image) || '/images/placeholder.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="text-sm md:text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">SKU: {item.sku}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="shrink-0 p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Order Type Badge */}
                    <div className="mt-2">
                      {isSmallOrder && (
                        <span className="inline-block text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          Small Order
                        </span>
                      )}
                      {isBulkOrder && (
                        <span className="inline-block text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          Bulk Order
                        </span>
                      )}
                      {needsWarning && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          Invalid quantity (min bulk: {item.min_bulk_qty})
                        </span>
                      )}
                    </div>

                    {/* Price & Quantity Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
                      <div className="text-sm text-muted-foreground">
                        Unit Price: <span className="text-foreground font-medium">{formatPrice(item.price)}</span>
                        {item.bulk_price && isBulkOrder && (
                          <span className="ml-2 text-xs text-blue-600">({formatPrice(item.bulk_price)} bulk)</span>
                        )}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-1.5 border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-40"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val >= 0) {
                              updateQuantity(item.product_id, val);
                            }
                          }}
                          className="w-14 text-center border border-border rounded-md py-1 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min="0"
                        />
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="p-1.5 border border-border rounded-md hover:bg-muted transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-sm font-medium">Subtotal</span>
                      <span className="text-base font-bold text-primary">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-primary mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Items</span>
                <span className="font-semibold">{itemCount}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted rounded-md text-xs text-muted-foreground">
              Delivery charges will be calculated at checkout based on your delivery location and order type.
            </div>

            <div className="mt-6 space-y-3">
              <Link
                href="/checkout"
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="btn-outline w-full flex items-center justify-center gap-2 py-3"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
