import { getDb } from './db';
import type { ShippingCity, Product, CartItem } from '@/types';

export function getOrderType(quantity: number, product: { max_small_qty: number; min_bulk_qty: number }): 'small' | 'bulk' | 'invalid' {
  if (quantity <= product.max_small_qty) return 'small';
  if (quantity >= product.min_bulk_qty) return 'bulk';
  return 'invalid';
}

export function isCityAllowedForOrderType(cityName: string, orderType: 'small' | 'bulk'): boolean {
  const db = getDb();
  const city = db.prepare('SELECT * FROM shipping_cities WHERE city_name = ? AND status = 1').get(cityName) as ShippingCity | undefined;
  if (!city) return false;
  if (orderType === 'small' && city.small_order_allowed) return true;
  if (orderType === 'bulk' && city.bulk_order_allowed) return true;
  return false;
}

export function getDeliveryCharge(cityName: string, orderType: 'small' | 'bulk'): number {
  const db = getDb();
  const city = db.prepare('SELECT * FROM shipping_cities WHERE city_name = ? AND status = 1').get(cityName) as ShippingCity | undefined;
  if (!city) return 0;
  return orderType === 'small' ? city.small_delivery_charge : city.bulk_delivery_charge;
}

export function getAvailableCities(): ShippingCity[] {
  const db = getDb();
  return db.prepare('SELECT * FROM shipping_cities WHERE status = 1').all() as ShippingCity[];
}

export function validateCartDelivery(cartItems: CartItem[], cityName: string): { valid: boolean; message: string } {
  const db = getDb();
  const city = db.prepare('SELECT * FROM shipping_cities WHERE city_name = ? AND status = 1').get(cityName) as ShippingCity | undefined;

  if (!city) {
    return { valid: false, message: 'Delivery is currently not available in this city.' };
  }

  const orderTypes = new Set<string>();

  for (const item of cartItems) {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id) as Product | undefined;
    if (!product) continue;

    const qty = item.quantity;
    if (qty <= product.max_small_qty) {
      orderTypes.add('small');
    } else if (qty >= product.min_bulk_qty) {
      orderTypes.add('bulk');
    } else {
      if (!product.allow_middle_qty) {
        return {
          valid: false,
          message: `Invalid quantity for "${product.name}". This quantity (${qty}) does not qualify for small or bulk delivery. Please increase to ${product.min_bulk_qty}+ for bulk or reduce to ${product.max_small_qty} or less for small order.`
        };
      }
      orderTypes.add('bulk');
    }
  }

  if (orderTypes.has('small') && orderTypes.has('bulk')) {
    if (!city.small_order_allowed || !city.bulk_order_allowed) {
      return {
        valid: false,
        message: 'Some items in your cart are not available for delivery to the selected city. Please adjust your cart or change the delivery location.'
      };
    }
  } else if (orderTypes.has('small')) {
    if (!city.small_order_allowed) {
      return {
        valid: false,
        message: 'Small quantity delivery is currently available only in Ayodhya. For Lucknow and Barabanki, please place a bulk order or contact our sales team.'
      };
    }
  } else if (orderTypes.has('bulk')) {
    if (!city.bulk_order_allowed) {
      return {
        valid: false,
        message: 'Bulk delivery is currently available only in Lucknow, Barabanki, and Ayodhya. Please contact our sales team for special delivery requests.'
      };
    }
  }

  return { valid: true, message: '' };
}

export function getCartOrderType(cartItems: CartItem[], products: Product[]): 'small' | 'bulk' | 'mixed' | null {
  if (!cartItems.length) return null;
  const types = new Set<string>();
  for (const item of cartItems) {
    const product = products.find(p => p.id === item.product_id);
    if (!product) continue;
    if (item.quantity <= product.max_small_qty) {
      types.add('small');
    } else if (item.quantity >= product.min_bulk_qty) {
      types.add('bulk');
    } else {
      types.add('invalid');
    }
  }
  if (types.has('mixed') || (types.has('small') && types.has('bulk'))) return 'mixed';
  if (types.has('small')) return 'small';
  if (types.has('bulk')) return 'bulk';
  return null;
}
