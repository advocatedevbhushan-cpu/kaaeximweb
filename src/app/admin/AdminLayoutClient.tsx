'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, FolderOpen, ShoppingCart,
  MessageCircle, MapPin, Settings, LogOut, Menu, X, Lock, LogIn,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageCircle },
  { label: 'Cities', href: '/admin/cities', icon: MapPin },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (pathname === '/admin/login' && user && !loading) {
      router.replace('/admin/dashboard');
    }
  }, [pathname, user, loading, router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      /* ignore */
    }
    setUser(null);
    setLoggingOut(false);
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-6">Please log in to access the admin panel.</p>
          <Link href="/admin/login" className="btn-primary inline-flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-primary-light">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="font-semibold text-sm tracking-wide">KAAEXIM Admin</span>
        <div className="w-8" />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-primary-light">
          <h1 className="text-xl font-bold tracking-tight">KAAEXIM</h1>
          <p className="text-xs text-gray-300 mt-1">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-accent text-white font-medium'
                    : 'text-gray-300 hover:bg-primary-light hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-light">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{user?.name || 'Admin'}</p>
              <p className="text-gray-400 text-xs truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
          >
            <LogOut className="w-5 h-5" />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <div className="hidden lg:flex items-center justify-between bg-white border-b border-border px-8 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {navItems.find((i) => pathname === i.href || pathname.startsWith(i.href + '/'))?.label || 'Admin'}
          </h2>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{user?.name || 'Admin'}</span>
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-xs">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
        </div>

        <div className="lg:hidden h-14" />

        <div className="flex-1 p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
