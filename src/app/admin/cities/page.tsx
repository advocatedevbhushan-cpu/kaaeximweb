'use client';

import { useEffect, useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, X, Save } from 'lucide-react';

interface City {
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

const emptyForm = {
  city_name: '',
  state: '',
  small_order_allowed: false,
  bulk_order_allowed: false,
  small_delivery_charge: '0',
  bulk_delivery_charge: '0',
  min_order_value: '0',
  status: '1',
};

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<City | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCities = async () => {
    try {
      const res = await fetch('/api/cities?all=true');
      setCities(await res.json());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (city: City) => {
    setEditing(city);
    setForm({
      city_name: city.city_name,
      state: city.state,
      small_order_allowed: city.small_order_allowed === 1,
      bulk_order_allowed: city.bulk_order_allowed === 1,
      small_delivery_charge: city.small_delivery_charge.toString(),
      bulk_delivery_charge: city.bulk_delivery_charge.toString(),
      min_order_value: city.min_order_value.toString(),
      status: city.status.toString(),
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.city_name.trim() || !form.state.trim()) {
      setError('City name and state are required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        city_name: form.city_name.trim(),
        state: form.state.trim(),
        small_order_allowed: form.small_order_allowed ? 1 : 0,
        bulk_order_allowed: form.bulk_order_allowed ? 1 : 0,
        small_delivery_charge: parseFloat(form.small_delivery_charge) || 0,
        bulk_delivery_charge: parseFloat(form.bulk_delivery_charge) || 0,
        min_order_value: parseFloat(form.min_order_value) || 0,
        status: parseInt(form.status),
      };

      let res: Response;
      if (editing) {
        res = await fetch(`/api/cities/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save city');
        return;
      }

      setShowModal(false);
      fetchCities();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (city: City) => {
    if (!window.confirm(`Delete city "${city.city_name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/cities/${city.id}`, { method: 'DELETE' });
      if (res.ok) {
        setCities((prev) => prev.filter((c) => c.id !== city.id));
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
          <MapPin className="w-6 h-6 text-accent" /> Shipping Cities
        </h1>
        <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add City
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted text-left text-muted-foreground">
                <th className="px-6 py-3 font-medium">City</th>
                <th className="px-6 py-3 font-medium">State</th>
                <th className="px-6 py-3 font-medium text-right">Small Delivery</th>
                <th className="px-6 py-3 font-medium text-right">Bulk Delivery</th>
                <th className="px-6 py-3 font-medium text-right">Min Order</th>
                <th className="px-6 py-3 font-medium">Order Types</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : cities.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">No cities configured</td>
                </tr>
              ) : (
                cities.map((city) => (
                  <tr key={city.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{city.city_name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{city.state}</td>
                    <td className="px-6 py-4 text-right">₹{city.small_delivery_charge.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">₹{city.bulk_delivery_charge.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">₹{city.min_order_value.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5">
                        {city.small_order_allowed === 1 && (
                          <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">Small</span>
                        )}
                        {city.bulk_order_allowed === 1 && (
                          <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">Bulk</span>
                        )}
                        {city.small_order_allowed === 0 && city.bulk_order_allowed === 0 && (
                          <span className="text-xs text-muted-foreground">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        city.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${city.status === 1 ? 'bg-green-500' : 'bg-red-500'}`} />
                        {city.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(city)} className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(city)} className="p-2 text-muted-foreground hover:text-danger hover:bg-red-50 rounded-lg transition-colors">
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
              <h2 className="text-lg font-semibold">{editing ? 'Edit City' : 'Add City'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">City Name <span className="text-danger">*</span></label>
                  <input type="text" value={form.city_name} onChange={(e) => setForm({ ...form, city_name: e.target.value })} className="input-field" placeholder="e.g. Lucknow" />
                </div>
                <div>
                  <label className="label">State <span className="text-danger">*</span></label>
                  <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field" placeholder="e.g. Uttar Pradesh" />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.small_order_allowed} onChange={(e) => setForm({ ...form, small_order_allowed: e.target.checked })} className="w-4 h-4 rounded border-border text-accent focus:ring-accent" />
                  <span className="text-sm">Small Order Allowed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.bulk_order_allowed} onChange={(e) => setForm({ ...form, bulk_order_allowed: e.target.checked })} className="w-4 h-4 rounded border-border text-accent focus:ring-accent" />
                  <span className="text-sm">Bulk Order Allowed</span>
                </label>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="label">Small Delivery Charge</label>
                  <input type="number" step="0.01" value={form.small_delivery_charge} onChange={(e) => setForm({ ...form, small_delivery_charge: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Bulk Delivery Charge</label>
                  <input type="number" step="0.01" value={form.bulk_delivery_charge} onChange={(e) => setForm({ ...form, bulk_delivery_charge: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Min Order Value</label>
                  <input type="number" step="0.01" value={form.min_order_value} onChange={(e) => setForm({ ...form, min_order_value: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
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
