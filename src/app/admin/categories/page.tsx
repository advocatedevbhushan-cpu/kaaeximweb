'use client';

import { useEffect, useState } from 'react';
import { FolderOpen, Plus, Edit2, Trash2, X, Save } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: number;
  display_order: number;
}

const emptyForm = { name: '', description: '', display_order: '0', status: '1' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      setCategories(await res.json());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      description: cat.description || '',
      display_order: cat.display_order.toString(),
      status: cat.status.toString(),
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Category name is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        display_order: parseInt(form.display_order) || 0,
        status: parseInt(form.status),
      };

      let res: Response;
      if (editing) {
        res = await fetch(`/api/categories/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save category');
        return;
      }

      setShowModal(false);
      fetchCategories();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${cat.id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-accent" /> Categories
        </h1>
        <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted text-left text-muted-foreground">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Display Order</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No categories found</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{cat.name}</td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="px-6 py-4 text-muted-foreground">{cat.display_order}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        cat.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.status === 1 ? 'bg-green-500' : 'bg-red-500'}`} />
                        {cat.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(cat)} className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(cat)} className="p-2 text-muted-foreground hover:text-danger hover:bg-red-50 rounded-lg transition-colors">
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}
              <div>
                <label className="label">Name <span className="text-danger">*</span></label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Category name" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px]" placeholder="Optional description" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Display Order</label>
                  <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
