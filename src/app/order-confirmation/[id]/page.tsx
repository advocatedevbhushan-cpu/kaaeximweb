import Link from 'next/link';
import { getDb, initDb } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, Package, MapPin, CreditCard, Truck, ArrowRight } from 'lucide-react';
import type { Order, OrderItem } from '@/types';
import type { Metadata } from 'next';

initDb();

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order Confirmation #${id} | KAAEXIM PRODUCTS PRIVATE LIMITED`,
  };
}

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(parseInt(id)) as Order | undefined;

  if (!order) {
    return (
      <div className="container-main py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">We could not find an order with that ID.</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            <ArrowRight className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id) as OrderItem[];

  const paymentLabel: Record<string, string> = {
    cod: 'Cash on Delivery',
    pay_on_confirmation: 'Pay on Confirmation',
    manual_upi: 'Manual UPI Payment',
    bank_transfer: 'Bank Transfer',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="container-main py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground">Thank you for your order. We will process it shortly.</p>
        </div>

        <div className="card p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-lg font-bold text-primary">{order.order_number}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                Delivery Details
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">{order.customer_name}</p>
                <p>{order.delivery_address}</p>
                {order.landmark && <p>Landmark: {order.landmark}</p>}
                <p>{order.city}, {order.state} - {order.pincode}</p>
                <p>Phone: {order.customer_mobile}</p>
                <p>Email: {order.customer_email}</p>
                {order.business_name && <p>Business: {order.business_name}</p>}
                {order.gst_number && <p>GST: {order.gst_number}</p>}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-accent" />
                Payment Details
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Method: {paymentLabel[order.payment_method] || order.payment_method}</p>
                <p>
                  Status:{' '}
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.payment_status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </span>
                </p>
                <p>
                  Order Status:{' '}
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.order_status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                  </span>
                </p>
                {order.delivery_instructions && <p>Instructions: {order.delivery_instructions}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-accent" />
            Order Items
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-medium text-muted-foreground">Product</th>
                  <th className="text-center py-3 font-medium text-muted-foreground">Qty</th>
                  <th className="text-right py-3 font-medium text-muted-foreground">Price</th>
                  <th className="text-right py-3 font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium text-foreground">{item.product_name}</td>
                    <td className="py-3 text-center text-muted-foreground">{item.quantity}</td>
                    <td className="py-3 text-right text-muted-foreground">{formatPrice(item.price)}</td>
                    <td className="py-3 text-right font-semibold text-foreground">{formatPrice(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-6 mb-8">
          <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Delivery Charge</span>
              <span className="font-medium">{order.delivery_charge > 0 ? formatPrice(order.delivery_charge) : 'Free'}</span>
            </div>
            {order.gst_amount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">GST</span>
                <span className="font-medium">{formatPrice(order.gst_amount)}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex items-center justify-between">
              <span className="font-bold text-foreground">Total</span>
              <span className="font-bold text-lg text-primary">{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            <ArrowRight className="w-4 h-4" />
            Continue Shopping
          </Link>
          <span className="btn-outline inline-flex items-center gap-2 px-8 py-3 cursor-not-allowed opacity-60">
            <Truck className="w-4 h-4" />
            Track Order
          </span>
        </div>
      </div>
    </div>
  );
}
