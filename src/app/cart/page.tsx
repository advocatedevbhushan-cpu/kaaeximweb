'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight,
  AlertTriangle, Package, Truck, CheckCircle, X, Tag, Heart, Clock, ChevronRight
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, getImageUrl } from '@/lib/utils';

const FREE_DELIVERY_THRESHOLD = 5000;
const GST_RATE = 0.05;

function getItemOrderType(item: { quantity: number; max_small_qty: number; min_bulk_qty: number }): 'small' | 'bulk' | 'invalid' {
  if (item.quantity <= item.max_small_qty) return 'small';
  if (item.quantity >= item.min_bulk_qty) return 'bulk';
  return 'invalid';
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, itemCount, subtotal } = useCart();
  const { toast } = useToast();
  const [confirmRemoveId, setConfirmRemoveId] = useState<number | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [savedForLater, setSavedForLater] = useState<Set<number>>(new Set());
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const gstEstimate = useMemo(() => Math.round(subtotal * GST_RATE * 100) / 100, [subtotal]);
  const deliveryCharge = 0;
  const total = subtotal + deliveryCharge + gstEstimate;
  const freeDeliveryRemaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const deliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  const handleRemove = (productId: number) => {
    if (confirmRemoveId === productId) {
      removeItem(productId);
      setConfirmRemoveId(null);
      toast({ title: 'Item removed', description: 'Item has been removed from your cart.', variant: 'success' });
    } else {
      setConfirmRemoveId(productId);
      setTimeout(() => setConfirmRemoveId(null), 3000);
    }
  };

  const handleClear = () => {
    if (confirmClear) {
      clearCart();
      setConfirmClear(false);
      toast({ title: 'Cart cleared', description: 'All items have been removed from your cart.', variant: 'info' });
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const handleQuantityChange = (productId: number, value: number) => {
    if (isNaN(value) || value < 0) return;
    updateQuantity(productId, value);
  };

  const toggleSaveForLater = (productId: number) => {
    setSavedForLater(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        toast({ title: 'Removed from saved items', variant: 'info' });
      } else {
        next.add(productId);
        toast({ title: 'Saved for later', description: 'You can find this item in your saved items.', variant: 'success' });
      }
      return next;
    });
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast({ title: 'Enter a coupon code', variant: 'warning' });
      return;
    }
    toast({ title: 'Invalid coupon code', description: 'This coupon code is not valid or has expired.', variant: 'destructive' });
  };

  if (items.length === 0) {
    return (
      <div className="container-main py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="relative mx-auto mb-8 w-36 h-36">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-full blur-xl" />
            <div className="relative w-full h-full bg-card border border-border rounded-full flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center animate-pulse">
              <Clock className="w-5 h-5 text-accent" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Your cart is empty</h1>
          <p className="text-muted-foreground mb-3 max-w-sm mx-auto">
            Looks like you haven&apos;t added any products yet. Browse our catalogue and find something you need.
          </p>
          <p className="text-xs text-muted-foreground/60 mb-8">
            Free delivery on orders above {formatPrice(FREE_DELIVERY_THRESHOLD)} | Bulk discounts available
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-base">
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="btn-outline inline-flex items-center gap-2 px-8 py-3 text-base">
              Request Bulk Quote
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-6 lg:py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground font-medium">Cart</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} &middot; {formatPrice(subtotal)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClear}
            className={`flex items-center gap-2 text-sm font-medium transition-all px-3 py-2 rounded-lg ${
              confirmClear
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'text-muted-foreground hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            {confirmClear ? 'Confirm Clear?' : 'Clear Cart'}
          </button>
        </div>
      </div>

      {/* Free Delivery Progress */}
      {freeDeliveryRemaining > 0 && (
        <div className="card p-4 mb-6 bg-gradient-to-r from-primary/5 to-accent/5 border-accent/10">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="w-5 h-5 text-accent shrink-0" />
            <p className="text-sm text-foreground font-medium">
              Add <span className="text-accent font-bold">{formatPrice(freeDeliveryRemaining)}</span> more for free delivery!
            </p>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${deliveryProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Free delivery on orders above {formatPrice(FREE_DELIVERY_THRESHOLD)}
          </p>
        </div>
      )}
      {freeDeliveryRemaining <= 0 && subtotal > 0 && (
        <div className="card p-4 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <p className="text-sm text-green-700 font-medium">
              Your order qualifies for free delivery!
            </p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
          {items.map((item, index) => {
            const orderType = getItemOrderType(item);
            const isSaved = savedForLater.has(item.product_id);
            const isConfirmingRemove = confirmRemoveId === item.product_id;

            return (
              <div
                key={item.product_id}
                className="card p-4 md:p-5 hover:shadow-md transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 relative bg-muted rounded-xl overflow-hidden border border-border">
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 80px, 112px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          className="text-sm md:text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.product_id)}
                        className={`shrink-0 p-2 rounded-lg transition-all ${
                          isConfirmingRemove
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'text-muted-foreground hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200'
                        }`}
                        title={isConfirmingRemove ? 'Click to confirm remove' : 'Remove item'}
                      >
                        {isConfirmingRemove ? <X className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Price */}
                    <div className="mt-2">
                      <span className="text-base md:text-lg font-bold text-foreground">{formatPrice(item.price)}</span>
                      <span className="text-xs text-muted-foreground ml-1">/ {item.unit_type}</span>
                    </div>

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {orderType === 'small' && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Small Order
                        </span>
                      )}
                      {orderType === 'bulk' && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                          <Package className="w-3 h-3" />
                          Bulk Order
                        </span>
                      )}
                      {orderType === 'invalid' && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          Invalid quantity &mdash; min bulk: {item.min_bulk_qty}
                        </span>
                      )}
                    </div>

                    {/* Quantity + Subtotal row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-border">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                          className="p-1.5 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product_id, parseInt(e.target.value, 10))}
                          className="w-14 text-center border border-border rounded-lg py-1.5 text-sm font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                          min={0}
                        />
                        <button
                          onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                          className="p-1.5 border border-border rounded-lg hover:bg-muted transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Subtotal</p>
                        <p className="text-base font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>

                    {/* Actions row */}
                    <div className="flex items-center gap-3 mt-3 pt-2 border-t border-border/50">
                      <button
                        onClick={() => toggleSaveForLater(item.product_id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                          isSaved
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-primary'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-primary' : ''}`} />
                        {isSaved ? 'Saved' : 'Save for later'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="card p-5 md:p-6 sticky top-24 space-y-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Order Summary
            </h2>

            {/* Totals */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  Delivery
                </span>
                <span className="font-semibold text-green-600">{formatPrice(deliveryCharge)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  GST (estimated)
                </span>
                <span className="font-semibold text-foreground">{formatPrice(gstEstimate)}</span>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="font-bold text-foreground text-base">Total</span>
                <span className="font-bold text-lg text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="p-3 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Have a coupon?</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 input-field text-sm py-2"
                  disabled={promoApplied}
                />
                <button
                  onClick={promoApplied ? () => { setPromoApplied(false); setPromoCode(''); toast({ title: 'Coupon removed', variant: 'info' }); } : handleApplyPromo}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    promoApplied
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {promoApplied ? 'Remove' : 'Apply'}
                </button>
              </div>
            </div>

            {/* Delivery info note */}
            <div className="flex items-start gap-2.5 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
              <Truck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Delivery charges will be confirmed at checkout based on your location and order type.
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link
                href="/checkout"
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="btn-outline w-full flex items-center justify-center gap-2 py-3 text-sm"
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
