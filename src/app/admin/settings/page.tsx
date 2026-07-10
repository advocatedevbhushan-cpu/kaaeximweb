'use client';
import { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    company_name: 'KAAEXIM PRODUCTS PRIVATE LIMITED',
    company_email: 'info@kaaexim.com',
    company_phone: '',
    company_address: 'Ayodhya, Uttar Pradesh, India',
    gst_number: '',
    whatsapp_number: '919999999999',
    small_delivery_note: 'Small quantity delivery is currently available only in Ayodhya.',
    bulk_delivery_note: 'Bulk delivery is available in Lucknow, Barabanki, and Ayodhya.',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('kaaexim_settings', JSON.stringify(settings));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kaaexim_settings');
      if (saved) {
        try { setSettings(JSON.parse(saved)); } catch {}
      }
    }
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Settings</h1>
          <p className="text-muted-foreground text-sm">Manage company information and configuration</p>
        </div>
        <SettingsIcon className="w-8 h-8 text-muted-foreground" />
      </div>

      <form onSubmit={handleSave} className="card p-6 max-w-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Company Name</label>
            <input name="company_name" value={settings.company_name} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Company Email</label>
            <input name="company_email" type="email" value={settings.company_email} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">Company Phone</label>
            <input name="company_phone" value={settings.company_phone} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">WhatsApp Number</label>
            <input name="whatsapp_number" value={settings.whatsapp_number} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label">GST Number</label>
            <input name="gst_number" value={settings.gst_number} onChange={handleChange} className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label className="label">Company Address</label>
            <textarea name="company_address" value={settings.company_address} onChange={handleChange} className="input-field" rows={2} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Small Delivery Notice</label>
            <textarea name="small_delivery_note" value={settings.small_delivery_note} onChange={handleChange} className="input-field" rows={2} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Bulk Delivery Notice</label>
            <textarea name="bulk_delivery_note" value={settings.bulk_delivery_note} onChange={handleChange} className="input-field" rows={2} />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
          {saved && <span className="text-sm text-success">Settings saved successfully</span>}
        </div>
      </form>
    </div>
  );
}
