'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  city: string;
  order_type: string;
  total_amount: number;
  order_status: string;
  created_at: string;
}

const statusOptions = ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async (status?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      const url = `/api/orders${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      setOrders(await res.json());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(statusFilter);
  }, []);

  const handleFilter = (status: string) => {
    setStatusFilter(status);
    fetchOrders(status);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-accent" /> Orders
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm mb-6">
        <div className="p-4 border-b border-border flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => handleFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-gray-200'
              }`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted text-left text-muted-foreground">
                <th className="px-6 py-3 font-medium">Order #</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">City</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">No orders found</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/admin/orders/${order.id}`}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">{order.order_number}</td>
                    <td className="px-6 py-4">{order.customer_name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{order.city}</td>
                    <td className="px-6 py-4">
                      <span className="capitalize">{order.order_type}</span>
                    </td>
                    <td className="px-6 py-4 font-medium">{formatPrice(order.total_amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.order_status] || 'bg-gray-100 text-gray-800'}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
