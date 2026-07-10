'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: number;
  order_number: string;
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
  items: OrderItem[];
}

const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setOrder(data);
        setOrderStatus(data.order_status);
        setPaymentStatus(data.payment_status);
      })
      .catch(() => setError('Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: orderStatus, payment_status: paymentStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrder(updated);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update');
      }
    } catch {
      alert('Network error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground">{error}</p>
        <Link href="/admin/orders" className="btn-outline mt-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/orders" className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-accent" /> Order {order.order_number}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <h3 className="font-semibold text-foreground mb-4">Customer Information</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Name</span>
              <p className="font-medium">{order.customer_name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Mobile</span>
              <p className="font-medium">{order.customer_mobile}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Email</span>
              <p className="font-medium">{order.customer_email}</p>
            </div>
            {order.business_name && (
              <div>
                <span className="text-muted-foreground">Business</span>
                <p className="font-medium">{order.business_name}</p>
              </div>
            )}
            {order.gst_number && (
              <div>
                <span className="text-muted-foreground">GST No.</span>
                <p className="font-medium">{order.gst_number}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <h3 className="font-semibold text-foreground mb-4">Delivery Address</h3>
          <div className="space-y-3 text-sm">
            <p className="font-medium">{order.delivery_address}</p>
            {order.landmark && <p className="text-muted-foreground">Landmark: {order.landmark}</p>}
            <p className="font-medium">{order.city}, {order.state} - {order.pincode}</p>
            {order.delivery_instructions && (
              <div>
                <span className="text-muted-foreground">Instructions</span>
                <p className="font-medium">{order.delivery_instructions}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <h3 className="font-semibold text-foreground mb-4">Order Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Type</span>
              <span className="font-medium capitalize">{order.order_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium uppercase">{order.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{new Date(order.created_at).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment Status</span>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${paymentStatusColors[order.payment_status] || 'bg-gray-100'}`}>
                {order.payment_status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Order Status</span>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.order_status] || 'bg-gray-100'}`}>
                {order.order_status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Order Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted text-left text-muted-foreground">
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">SKU</th>
                <th className="px-6 py-3 font-medium text-right">Qty</th>
                <th className="px-6 py-3 font-medium text-right">Price</th>
                <th className="px-6 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {order.items?.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 font-medium text-foreground">{item.product_name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.sku}</td>
                  <td className="px-6 py-4 text-right">{item.quantity}</td>
                  <td className="px-6 py-4 text-right">{formatPrice(item.price)}</td>
                  <td className="px-6 py-4 text-right font-medium">{formatPrice(item.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/50">
              <tr>
                <td colSpan={4} className="px-6 py-3 text-right text-muted-foreground">Subtotal</td>
                <td className="px-6 py-3 text-right font-medium">{formatPrice(order.subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={4} className="px-6 py-3 text-right text-muted-foreground">Delivery Charge</td>
                <td className="px-6 py-3 text-right font-medium">{formatPrice(order.delivery_charge)}</td>
              </tr>
              <tr>
                <td colSpan={4} className="px-6 py-3 text-right text-muted-foreground">GST Amount</td>
                <td className="px-6 py-3 text-right font-medium">{formatPrice(order.gst_amount)}</td>
              </tr>
              <tr className="border-t-2 border-border">
                <td colSpan={4} className="px-6 py-3 text-right font-semibold text-foreground">Total</td>
                <td className="px-6 py-3 text-right font-bold text-foreground text-base">{formatPrice(order.total_amount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6">
        <h3 className="font-semibold text-foreground mb-4">Update Order</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <div>
            <label className="label">Order Status</label>
            <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="input-field">
              {orderStatuses.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Payment Status</label>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="input-field">
              {paymentStatuses.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <button onClick={handleUpdateStatus} disabled={updating} className="btn-primary flex items-center gap-2">
              {updating ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {updating ? 'Updating...' : 'Update Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
