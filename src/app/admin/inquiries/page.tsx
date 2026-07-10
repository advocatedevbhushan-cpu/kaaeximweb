'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Eye, X, Save } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Inquiry {
  id: number;
  name: string;
  business_name: string | null;
  mobile: string;
  email: string;
  gst_number: string | null;
  product_name: string;
  quantity: number;
  delivery_city: string;
  expected_delivery_date: string | null;
  message: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const statusOptions = ['pending', 'contacted', 'converted', 'rejected'];
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-blue-100 text-blue-800',
  converted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      setInquiries(await res.json());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const openModal = (inquiry: Inquiry) => {
    setSelected(inquiry);
    setEditStatus(inquiry.status);
    setEditNotes(inquiry.admin_notes || '');
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/inquiries/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: editStatus, admin_notes: editNotes || null }),
      });
      if (res.ok) {
        const updated = await res.json();
        setInquiries((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        setSelected(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update');
      }
    } catch {
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-accent" />
        <h1 className="text-2xl font-bold text-foreground">Bulk Inquiries</h1>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted text-left text-muted-foreground">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Business</th>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium text-right">Qty</th>
                <th className="px-6 py-3 font-medium">City</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
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
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">No inquiries yet</td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{inquiry.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{inquiry.business_name || '—'}</td>
                    <td className="px-6 py-4 max-w-[200px] truncate">{inquiry.product_name}</td>
                    <td className="px-6 py-4 text-right font-medium">{inquiry.quantity}</td>
                    <td className="px-6 py-4 text-muted-foreground">{inquiry.delivery_city}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[inquiry.status] || 'bg-gray-100'}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(inquiry.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openModal(inquiry)} className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold">Inquiry Details</h2>
              <button onClick={() => setSelected(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name</span>
                  <p className="font-medium">{selected.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Business</span>
                  <p className="font-medium">{selected.business_name || '—'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Mobile</span>
                  <p className="font-medium">{selected.mobile}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email</span>
                  <p className="font-medium">{selected.email}</p>
                </div>
                {selected.gst_number && (
                  <div>
                    <span className="text-muted-foreground">GST No.</span>
                    <p className="font-medium">{selected.gst_number}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">City</span>
                  <p className="font-medium">{selected.delivery_city}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Product</span>
                  <p className="font-medium">{selected.product_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Quantity</span>
                  <p className="font-medium">{selected.quantity}</p>
                </div>
                {selected.expected_delivery_date && (
                  <div>
                    <span className="text-muted-foreground">Expected Delivery</span>
                    <p className="font-medium">{selected.expected_delivery_date}</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Date</span>
                  <p className="font-medium">{new Date(selected.created_at).toLocaleString()}</p>
                </div>
              </div>

              {selected.message && (
                <div>
                  <span className="text-sm text-muted-foreground">Message</span>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{selected.message}</p>
                </div>
              )}

              <div className="border-t border-border pt-4 space-y-4">
                <div>
                  <label className="label">Status</label>
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="input-field">
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Admin Notes</label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="input-field min-h-[100px]"
                    placeholder="Add internal notes..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-4 border-t border-border">
              <button onClick={handleUpdate} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Update'}
              </button>
              <button onClick={() => setSelected(null)} className="btn-outline">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
