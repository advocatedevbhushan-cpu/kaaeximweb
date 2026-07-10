'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

const unitTypes = ['Piece', 'Box', 'Carton', 'Packet', 'Kg', 'Gram', 'Litre'];

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category_id: '',
    short_description: '',
    full_description: '',
    mrp: '',
    selling_price: '',
    bulk_price: '',
    gst_rate: '',
    hsn_code: '',
    unit_type: 'Piece',
    min_small_qty: '1',
    max_small_qty: '2',
    min_bulk_qty: '10',
    stock_quantity: '',
    allow_middle_qty: false,
    is_featured: false,
    is_best_seller: false,
    status: '1',
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch(`/api/products/${slug}`).then((r) => r.json()),
    ])
      .then(([cats, product]) => {
        setCategories(cats);
        if (product.error) {
          setErrors({ form: 'Product not found' });
          return;
        }
        setForm({
          name: product.name || '',
          sku: product.sku || '',
          category_id: product.category_id ? String(product.category_id) : '',
          short_description: product.short_description || '',
          full_description: product.full_description || '',
          mrp: product.mrp?.toString() || '',
          selling_price: product.selling_price?.toString() || '',
          bulk_price: product.bulk_price?.toString() || '',
          gst_rate: product.gst_rate?.toString() || '',
          hsn_code: product.hsn_code || '',
          unit_type: product.unit_type || 'Piece',
          min_small_qty: product.min_small_qty?.toString() || '1',
          max_small_qty: product.max_small_qty?.toString() || '2',
          min_bulk_qty: product.min_bulk_qty?.toString() || '10',
          stock_quantity: product.stock_quantity?.toString() || '0',
          allow_middle_qty: product.allow_middle_qty === 1,
          is_featured: product.is_featured === 1,
          is_best_seller: product.is_best_seller === 1,
          status: product.status?.toString() || '1',
        });
      })
      .catch(() => setErrors({ form: 'Failed to load product' }))
      .finally(() => setLoading(false));
  }, [slug]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.sku.trim()) errs.sku = 'SKU is required';
    if (!form.selling_price || parseFloat(form.selling_price) <= 0) errs.selling_price = 'Valid selling price is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        category_id: form.category_id ? parseInt(form.category_id) : null,
        short_description: form.short_description.trim() || null,
        full_description: form.full_description.trim() || null,
        mrp: parseFloat(form.mrp) || 0,
        selling_price: parseFloat(form.selling_price) || 0,
        bulk_price: form.bulk_price ? parseFloat(form.bulk_price) : null,
        gst_rate: form.gst_rate ? parseFloat(form.gst_rate) : null,
        hsn_code: form.hsn_code.trim() || null,
        unit_type: form.unit_type,
        min_small_qty: parseInt(form.min_small_qty) || 1,
        max_small_qty: parseInt(form.max_small_qty) || 2,
        min_bulk_qty: parseInt(form.min_bulk_qty) || 10,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        allow_middle_qty: form.allow_middle_qty ? 1 : 0,
        is_featured: form.is_featured ? 1 : 0,
        is_best_seller: form.is_best_seller ? 1 : 0,
        status: parseInt(form.status),
      };

      const res = await fetch(`/api/products/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors({ form: data.error || 'Failed to update product' });
        return;
      }

      router.push('/admin/products');
    } catch {
      setErrors({ form: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6">
        {errors.form && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Product Name <span className="text-danger">*</span></label>
              <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} className={`input-field ${errors.name ? 'border-danger' : ''}`} />
              {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label">SKU <span className="text-danger">*</span></label>
              <input type="text" value={form.sku} onChange={(e) => updateField('sku', e.target.value)} className={`input-field ${errors.sku ? 'border-danger' : ''}`} />
              {errors.sku && <p className="text-xs text-danger mt-1">{errors.sku}</p>}
            </div>
            <div>
              <label className="label">Category</label>
              <select value={form.category_id} onChange={(e) => updateField('category_id', e.target.value)} className="input-field">
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Unit Type</label>
              <select value={form.unit_type} onChange={(e) => updateField('unit_type', e.target.value)} className="input-field">
                {unitTypes.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label">Short Description</label>
              <input type="text" value={form.short_description} onChange={(e) => updateField('short_description', e.target.value)} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Full Description</label>
              <textarea value={form.full_description} onChange={(e) => updateField('full_description', e.target.value)} className="input-field min-h-[100px]" rows={4} />
            </div>
            <div>
              <label className="label">MRP (₹)</label>
              <input type="number" step="0.01" value={form.mrp} onChange={(e) => updateField('mrp', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Selling Price (₹) <span className="text-danger">*</span></label>
              <input type="number" step="0.01" value={form.selling_price} onChange={(e) => updateField('selling_price', e.target.value)} className={`input-field ${errors.selling_price ? 'border-danger' : ''}`} />
              {errors.selling_price && <p className="text-xs text-danger mt-1">{errors.selling_price}</p>}
            </div>
            <div>
              <label className="label">Bulk Price (₹)</label>
              <input type="number" step="0.01" value={form.bulk_price} onChange={(e) => updateField('bulk_price', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">GST Rate (%)</label>
              <input type="number" step="0.01" value={form.gst_rate} onChange={(e) => updateField('gst_rate', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">HSN Code</label>
              <input type="text" value={form.hsn_code} onChange={(e) => updateField('hsn_code', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Stock Quantity</label>
              <input type="number" value={form.stock_quantity} onChange={(e) => updateField('stock_quantity', e.target.value)} className="input-field" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Min Small Qty</label>
                <input type="number" value={form.min_small_qty} onChange={(e) => updateField('min_small_qty', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="label">Max Small Qty</label>
                <input type="number" value={form.max_small_qty} onChange={(e) => updateField('max_small_qty', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="label">Min Bulk Qty</label>
                <input type="number" value={form.min_bulk_qty} onChange={(e) => updateField('min_bulk_qty', e.target.value)} className="input-field" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.allow_middle_qty} onChange={(e) => updateField('allow_middle_qty', e.target.checked)} className="w-4 h-4 rounded border-border text-accent focus:ring-accent" />
              <span className="text-sm">Allow Middle Quantity</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => updateField('is_featured', e.target.checked)} className="w-4 h-4 rounded border-border text-accent focus:ring-accent" />
              <span className="text-sm">Featured Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_best_seller} onChange={(e) => updateField('is_best_seller', e.target.checked)} className="w-4 h-4 rounded border-border text-accent focus:ring-accent" />
              <span className="text-sm">Best Seller</span>
            </label>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <div>
              <label className="label">Status</label>
              <select value={form.status} onChange={(e) => updateField('status', e.target.value)} className="input-field">
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Update Product'}
            </button>
            <Link href="/admin/products" className="btn-outline">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
