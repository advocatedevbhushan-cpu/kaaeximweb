'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { formatPrice, getImageUrl, truncate } from '@/lib/utils';
import { Heart, Eye, ShoppingCart, Plus, Minus, Tag, Package, RotateCcw, Share2, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  showWishlist?: boolean;
  showQuickView?: boolean;
}

export default function ProductCard({ product, variant = 'default', showWishlist = true, showQuickView = true }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const imageUrl = product.images?.[0]?.image_url || '/images/placeholder.svg';
  const inStock = product.stock_quantity > 0 && product.status === 1;
  const isBestSeller = product.is_best_seller === 1;
  const isFeatured = product.is_featured === 1;
  const discountPercent = product.mrp > product.selling_price
    ? Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) {
      toast({ title: 'Out of Stock', description: 'This product is currently unavailable', variant: 'destructive' });
      return;
    }

    setAdding(true);
    try {
      addItem({
        product_id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        image: imageUrl,
        price: quantity >= product.min_bulk_qty && product.bulk_price ? product.bulk_price : product.selling_price,
        bulk_price: product.bulk_price,
        min_bulk_qty: product.min_bulk_qty,
        max_small_qty: product.max_small_qty,
        quantity,
        unit_type: product.unit_type,
        stock_quantity: product.stock_quantity,
      });
      toast({
        title: 'Added to Cart',
        description: `${product.name} (${quantity} ${product.unit_type}) added to your cart`,
        variant: 'success',
      });
      setQuantity(1);
    } catch {
      toast({ title: 'Error', description: 'Failed to add item to cart', variant: 'destructive' });
    } finally {
      setAdding(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(product.stock_quantity, prev + delta)));
  };

  if (variant === 'compact') {
    return (
      <div className="card p-3 flex gap-3">
        <Link href={`/products/${product.slug}`} className="relative w-20 h-20 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
          <Image src={getImageUrl(imageUrl)} alt={product.name} fill className="object-cover" sizes="80px" />
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <Link href={`/products/${product.slug}`} className="font-medium text-sm hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5">{product.sku}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-primary">{formatPrice(product.selling_price)}</span>
            <button onClick={handleAddToCart} disabled={!inStock || adding} className="btn-primary btn-sm px-3 h-8">
              {adding ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card flex flex-col group relative overflow-hidden">
      <Link href={`/products/${product.slug}`} className="relative aspect-square bg-[#f7f4ed] overflow-hidden">
        <Image
          src={getImageUrl(imageUrl)}
          alt={product.name}
          fill
          className="object-contain bg-white p-4 transition-all duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-destructive px-4 py-2 rounded-lg">Out of Stock</span>
          </div>
        )}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-destructive text-white text-xs font-semibold px-2 py-1 rounded">
            -{discountPercent}%
          </span>
        )}
        {isBestSeller && (
          <span className="absolute top-2 left-2 bg-accent text-white text-xs font-semibold px-2 py-1 rounded">
            <Tag className="w-3 h-3 inline mr-1" /> Best Seller
          </span>
        )}
        {isFeatured && !isBestSeller && (
          <span className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
            <Star className="w-3 h-3 inline mr-1" /> Featured
          </span>
        )}

        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 flex gap-2 justify-center">
          {showQuickView && (
            <button className="btn-ghost bg-white/90 hover:bg-white p-2 rounded-lg shadow-lg" aria-label="Quick view">
              <Eye className="w-5 h-5" />
            </button>
          )}
          {showWishlist && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
              className={`btn-ghost bg-white/90 hover:bg-white p-2 rounded-lg shadow-lg transition-colors ${isWishlisted ? 'text-destructive' : ''}`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          )}
          <button className="btn-ghost bg-white/90 hover:bg-white p-2 rounded-lg shadow-lg" aria-label="Share product">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
          <Package className="w-3 h-3" />
          {product.category_name || 'General'}
        </p>

        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-semibold text-base text-foreground hover:text-primary transition-colors leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">{truncate(product.short_description || '', 90)}</p>

        <div className="mt-auto space-y-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg font-bold text-foreground">{formatPrice(product.selling_price)}</span>
            {product.mrp > product.selling_price && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.mrp)}</span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-0.5 rounded-full">{discountPercent}% OFF</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <span>{product.unit_type}</span>
            <span className="text-border">•</span>
            <span>Min. Bulk: {product.min_bulk_qty} {product.unit_type}s</span>
            {product.bulk_price && (
              <>
                <span className="text-border">•</span>
                <span className="text-accent font-medium">Bulk: {formatPrice(product.bulk_price)}/{product.unit_type}</span>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex-1 flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock_quantity, parseInt(e.target.value) || 1)))}
                className="w-16 text-center border-x border-border bg-transparent focus:outline-none"
                min={1}
                max={product.stock_quantity}
                aria-label="Quantity"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50"
                disabled={quantity >= product.stock_quantity}
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!inStock || adding}
              className="btn-primary flex-1 justify-center"
            >
              {adding ? (
                <RotateCcw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden sm:inline">Add to Cart</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>{inStock ? `In Stock (${product.stock_quantity} available)` : 'Out of Stock'}</span>
            <span className="font-medium text-primary">{product.sku}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
