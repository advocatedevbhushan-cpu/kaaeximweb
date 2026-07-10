'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Plus, Edit, Trash2, Search, ChevronDown } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category_name: string | null;
  selling_price: number;
  mrp: number;
  stock_quantity: number;
  status: number;
  first_image: string | null;
  unit_type: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (slug: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    setDeleting(products.find((p) => p.slug === slug)?.id ?? null);
    try {
      const res = await fetch(`/api/products/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.slug !== slug));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete product');
      }
    } catch {
      alert('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const toggleStatus = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: product.status === 1 ? 0 : 1 }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, status: p.status === 1 ? 0 : 1 } : p))
        );
      }
    } catch {
      alert('Failed to update status');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Package className="w-6 h-6 text-accent" /> Products
        </h1>
        <Link href="/admin/products/new" className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm mb-6">
        <div className="p-4 border-b border-border">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name, SKU..."
                className="input-field pl-10"
              />
            </div>
            <button type="submit" className="btn-secondary text-sm">
              Search
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium w-14">Image</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                      Loading products...
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    No products found. {!search && 'Click "Add New Product" to create one.'}
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden">
                        {product.first_image ? (
                          <img src={product.first_image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate">{product.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{product.sku}</td>
                    <td className="px-4 py-3 text-muted-foreground">{product.category_name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{formatPrice(product.selling_price)}</span>
                      {product.mrp > product.selling_price && (
                        <span className="text-xs text-muted-foreground line-through ml-1">{formatPrice(product.mrp)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${product.stock_quantity < 10 ? 'text-danger' : 'text-foreground'}`}>
                        {product.stock_quantity} {product.unit_type?.toLowerCase() || 'units'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(product)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          product.status === 1
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${product.status === 1 ? 'bg-green-500' : 'bg-red-500'}`} />
                        {product.status === 1 ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${product.slug}/edit`}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.slug, product.name)}
                          disabled={deleting === product.id}
                          className="p-2 text-muted-foreground hover:text-danger hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
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
