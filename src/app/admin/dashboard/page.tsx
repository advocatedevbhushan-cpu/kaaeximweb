import { initDb, getDb } from '@/lib/db';
import { DollarSign, ShoppingCart, Clock, AlertTriangle, Package, TrendingUp, Users, ArrowRight, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  total_amount: number;
  order_status: string;
  created_at: string;
}

interface LowStockItem {
  id: number;
  name: string;
  sku: string;
  stock_quantity: number;
  unit_type: string;
}

interface StatusCount {
  count: number;
}

interface CategoryProductCount {
  category_name: string;
  count: number;
}

function StatCard({ title, value, icon: Icon, bgColor, iconColor }: { title: string; value: string | number; icon: React.ElementType; bgColor: string; iconColor: string }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    packed: 'bg-purple-100 text-purple-800',
    out_for_delivery: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorMap[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function HorizontalBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground w-32 shrink-0 capitalize">{label.replace(/_/g, ' ')}</span>
      <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold text-foreground w-10 text-right">{value}</span>
    </div>
  );
}

export default async function AdminDashboard() {
  initDb();
  await initDb();
  const db = await getDb();

  const totalProducts = (db.prepare('SELECT COUNT(*) as count FROM products WHERE status = 1').get() as StatusCount).count;
  const totalOrders = (db.prepare('SELECT COUNT(*) as count FROM orders').get() as StatusCount).count;
  const pendingOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'pending'").get() as StatusCount).count;
  const completedOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'delivered'").get() as StatusCount).count;
  const cancelledOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'cancelled'").get() as StatusCount).count;
  const totalInquiries = (db.prepare('SELECT COUNT(*) as count FROM bulk_inquiries').get() as StatusCount).count;
  const totalRevenueRow = db.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE order_status != 'cancelled'").get() as { total: number };
  const totalRevenue = totalRevenueRow.total;
  const lowStockItems = db.prepare("SELECT id, name, sku, stock_quantity, unit_type FROM products WHERE stock_quantity < 10 AND status = 1 ORDER BY stock_quantity ASC LIMIT 5").all() as LowStockItem[];
  const recentOrders = db.prepare("SELECT id, order_number, customer_name, total_amount, order_status, created_at FROM orders ORDER BY created_at DESC LIMIT 5").all() as Order[];
  const ordersByStatus = db.prepare("SELECT order_status, COUNT(*) as count FROM orders GROUP BY order_status ORDER BY count DESC").all() as { order_status: string; count: number }[];
  const categoryDistribution = db.prepare(`
    SELECT c.name as category_name, COUNT(p.id) as count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id AND p.status = 1
    GROUP BY c.id, c.name
    ORDER BY count DESC
  `).all() as CategoryProductCount[];

  const maxStatusCount = ordersByStatus.length > 0 ? Math.max(...ordersByStatus.map(s => s.count)) : 1;
  const maxCategoryCount = categoryDistribution.length > 0 ? Math.max(...categoryDistribution.map(c => c.count)) : 1;

  const statusBarColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    packed: 'bg-purple-500',
    out_for_delivery: 'bg-orange-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
  };

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg border border-border">
          <TrendingUp className="w-5 h-5 text-accent" />
          <span className="text-sm font-semibold text-foreground">KAAEXIM Admin</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Revenue" value={formatPrice(totalRevenue)} icon={IndianRupee} bgColor="bg-amber-50" iconColor="text-amber-600" />
        <StatCard title="Total Orders" value={totalOrders} icon={ShoppingCart} bgColor="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Pending Orders" value={pendingOrders} icon={Clock} bgColor="bg-amber-50" iconColor="text-amber-600" />
        <StatCard title="Low Stock Items" value={lowStockItems.length > 0 ? `${lowStockItems.length} items` : '0'} icon={AlertTriangle} bgColor="bg-red-50" iconColor="text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-accent" />
            Order Status Distribution
          </h2>
          <div className="space-y-3">
            {ordersByStatus.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No orders yet</p>
            ) : (
              ordersByStatus.map((s) => (
                <HorizontalBar
                  key={s.order_status}
                  label={s.order_status}
                  value={s.count}
                  max={maxStatusCount}
                  color={statusBarColors[s.order_status] || 'bg-gray-400'}
                />
              ))
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Category Distribution
          </h2>
          <div className="space-y-3">
            {categoryDistribution.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No categories yet</p>
            ) : (
              categoryDistribution.map((c) => (
                <HorizontalBar
                  key={c.category_name}
                  label={c.category_name}
                  value={c.count}
                  max={maxCategoryCount}
                  color="bg-accent"
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-accent" />
              Recent Orders
            </h2>
            <Link href="/admin/orders" className="text-sm text-accent hover:text-accent-dark flex items-center gap-1 font-medium">
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
                      <td className="px-6 py-4 font-medium text-foreground">{order.order_number}</td>
                      <td className="px-6 py-4 text-muted-foreground">{order.customer_name}</td>
                      <td className="px-6 py-4 font-medium">{formatPrice(order.total_amount)}</td>
                      <td className="px-6 py-4"><StatusBadge status={order.order_status} /></td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger" />
            Low Stock Alerts
          </h2>
          {lowStockItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">All items are well stocked</p>
          ) : (
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.sku}</p>
                  </div>
                  <span className="text-sm font-bold text-danger whitespace-nowrap ml-3">
                    {item.stock_quantity} {item.unit_type?.toLowerCase() || 'units'}
                  </span>
                </div>
              ))}
              <Link
                href="/admin/products"
                className="flex items-center justify-center gap-1 mt-3 w-full py-2 text-sm font-medium text-accent hover:text-accent-dark border border-accent/30 rounded-lg hover:bg-amber-50 transition-colors"
              >
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <hr className="my-5 border-border" />

          <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-accent" />
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link href="/admin/products/new" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm font-medium text-foreground">
              <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-lg">+</span>
              Add New Product
            </Link>
            <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm font-medium text-foreground">
              <span className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <ShoppingCart className="w-4 h-4" />
              </span>
              Manage Orders
            </Link>
            <Link href="/admin/inquiries" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm font-medium text-foreground">
              <span className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <Users className="w-4 h-4" />
              </span>
              Bulk Inquiries ({totalInquiries})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
