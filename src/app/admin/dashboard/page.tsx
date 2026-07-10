import { initDb, getDb } from '@/lib/db';
import { Package, ShoppingCart, Clock, CheckCircle, XCircle, MessageCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-border p-6 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  initDb();
  const db = getDb();

  const totalProducts = (db.prepare('SELECT COUNT(*) as count FROM products WHERE status = 1').get() as any).count;
  const totalOrders = (db.prepare('SELECT COUNT(*) as count FROM orders').get() as any).count;
  const pendingOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'pending'").get() as any).count;
  const completedOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'delivered'").get() as any).count;
  const cancelledOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'cancelled'").get() as any).count;
  const totalInquiries = (db.prepare('SELECT COUNT(*) as count FROM bulk_inquiries').get() as any).count;
  const lowStockProducts = (db.prepare('SELECT COUNT(*) as count FROM products WHERE stock_quantity < 10 AND status = 1').get() as any).count;
  const recentOrders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5').all() as any[];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Products" value={totalProducts} icon={Package} color="bg-blue-600" />
        <StatCard title="Total Orders" value={totalOrders} icon={ShoppingCart} color="bg-purple-600" />
        <StatCard title="Pending Orders" value={pendingOrders} icon={Clock} color="bg-yellow-600" />
        <StatCard title="Completed Orders" value={completedOrders} icon={CheckCircle} color="bg-green-600" />
        <StatCard title="Cancelled Orders" value={cancelledOrders} icon={XCircle} color="bg-red-600" />
        <StatCard title="Bulk Inquiries" value={totalInquiries} icon={MessageCircle} color="bg-teal-600" />
        <StatCard title="Low Stock Items" value={lowStockProducts} icon={AlertTriangle} color="bg-orange-600" />
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-accent hover:text-accent-dark flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted text-left text-muted-foreground">
                <th className="px-6 py-3 font-medium">Order #</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No orders yet</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{order.order_number}</td>
                    <td className="px-6 py-4">{order.customer_name}</td>
                    <td className="px-6 py-4">{formatPrice(order.total_amount)}</td>
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
