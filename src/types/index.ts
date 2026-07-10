export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  status: number;
  display_order: number;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string | null;
  full_description: string | null;
  mrp: number;
  selling_price: number;
  bulk_price: number | null;
  gst_rate: number | null;
  hsn_code: string | null;
  unit_type: string;
  min_small_qty: number;
  max_small_qty: number;
  min_bulk_qty: number;
  stock_quantity: number;
  status: number;
  is_featured: number;
  is_best_seller: number;
  allow_middle_qty: number;
  created_at: string;
  updated_at: string;
  category_name?: string;
  images?: ProductImage[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  display_order: number;
}

export interface ShippingCity {
  id: number;
  city_name: string;
  state: string;
  small_order_allowed: number;
  bulk_order_allowed: number;
  small_delivery_charge: number;
  bulk_delivery_charge: number;
  min_order_value: number;
  status: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number | null;
  customer_name: string;
  customer_mobile: string;
  customer_email: string;
  delivery_address: string;
  city: string;
  state: string;
  pincode: string;
  order_type: string;
  subtotal: number;
  delivery_charge: number;
  gst_amount: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  landmark: string | null;
  delivery_instructions: string | null;
  gst_number: string | null;
  business_name: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

export interface BulkInquiry {
  id: number;
  name: string;
  business_name: string | null;
  mobile: string;
  email: string;
  gst_number: string | null;
  product_id: number | null;
  product_name: string;
  quantity: number;
  delivery_city: string;
  expected_delivery_date: string | null;
  message: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

export interface Customer {
  id: number;
  user_id: number | null;
  name: string;
  mobile: string;
  email: string;
  gst_number: string | null;
  business_name: string | null;
  created_at: string;
}

export interface Address {
  id: number;
  customer_id: number;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  pincode: string;
  landmark: string | null;
  is_default: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  password_hash: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product_id: number;
  name: string;
  slug: string;
  sku: string;
  image: string;
  price: number;
  bulk_price: number | null;
  min_bulk_qty: number;
  max_small_qty: number;
  quantity: number;
  unit_type: string;
  stock_quantity: number;
}

export interface Cart {
  items: CartItem[];
  order_type: 'small' | 'bulk' | 'mixed' | null;
}

export type OrderType = 'small' | 'bulk';
