'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle, Loader2 } from 'lucide-react';

const inquiryTypes = [
  'Product Inquiry',
  'Bulk Order',
  'Delivery Question',
  'Complaint',
  'Other',
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    subject: '',
    message: '',
    inquiry_type: 'Product Inquiry',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          mobile: form.mobile,
          email: form.email,
          product_name: form.subject || 'General Inquiry',
          quantity: 1,
          delivery_city: 'Ayodhya',
          message: `${form.inquiry_type}: ${form.message}`,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to submit. Please try again.');
      }

      setSuccess(true);
      setForm({ name: '', mobile: '', email: '', subject: '', message: '', inquiry_type: 'Product Inquiry' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary via-primary-light to-primary py-16 md:py-20">
        <div className="container-main">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-gray-300 text-lg">
              Have a question or want to place a bulk order? We are here to help.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-main">
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="lg:col-span-2">
              <div className="card p-6 md:p-8">
                <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  Send us a Message
                </h2>

                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">Message Sent Successfully!</p>
                      <p className="text-sm text-green-700">We will get back to you shortly.</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="label">Full Name <span className="text-danger">*</span></label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="input-field"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="mobile" className="label">Mobile Number <span className="text-danger">*</span></label>
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        className="input-field"
                        value={form.mobile}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="label">Email Address <span className="text-danger">*</span></label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="input-field"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="inquiry_type" className="label">Inquiry Type <span className="text-danger">*</span></label>
                      <select
                        id="inquiry_type"
                        name="inquiry_type"
                        className="input-field"
                        value={form.inquiry_type}
                        onChange={handleChange}
                      >
                        {inquiryTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="label">Subject</label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      className="input-field"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Brief subject of your message"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="label">Message <span className="text-danger">*</span></label>
                    <textarea
                      id="message"
                      name="message"
                      className="input-field resize-none"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      rows={5}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-bold text-primary mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Address</p>
                      <p className="text-sm text-muted-foreground">Ayodhya, Uttar Pradesh, India</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <p className="text-sm text-muted-foreground">+91 9999999999</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">info@kaaexim.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-bold text-primary mb-4">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mon – Sat</span>
                    <span className="font-medium">9:00 AM – 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>

              <div className="card p-6 bg-green-50 border border-green-200">
                <h3 className="font-bold text-green-800 mb-3">WhatsApp</h3>
                <p className="text-sm text-green-700 mb-3">
                  Prefer instant messaging? Reach out to us on WhatsApp for quick responses.
                </p>
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary bg-green-600 hover:bg-green-700 w-full flex items-center justify-center gap-2 py-3"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
