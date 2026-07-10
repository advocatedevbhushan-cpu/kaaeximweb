import type { Metadata } from 'next';
import { Truck, MapPin, Clock, IndianRupee, Package, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'KAAEXIM PRODUCTS PRIVATE LIMITED shipping policy — delivery areas, charges, and timelines for small and bulk orders.',
};

export default function ShippingPolicyPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary via-primary-light to-primary py-16 md:py-20">
        <div className="container-main">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Shipping Policy</h1>
            <p className="text-gray-300 text-lg">
              Understand our delivery areas, charges, and timelines.
            </p>
            <p className="text-gray-400 text-sm mt-2">Last updated: July 2026</p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 mb-8">
              <p className="text-muted-foreground leading-relaxed">
                At KAAEXIM PRODUCTS PRIVATE LIMITED, we strive to ensure timely and reliable delivery
                of all orders. Please read our shipping policy carefully to understand delivery
                availability, charges, and timelines based on your location and order type.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="card p-6 border-t-4 border-t-accent">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">Small Quantity Delivery</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Available In</p>
                      <p>Ayodhya only</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <IndianRupee className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Delivery Charge</p>
                      <p>₹40 per order</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    Small quantity orders are limited to a maximum of 2 units per product (or as specified per product).
                  </p>
                </div>
              </div>

              <div className="card p-6 border-t-4 border-t-primary">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">Bulk Delivery</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Available In</p>
                      <p>Lucknow, Barabanki, Ayodhya</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <IndianRupee className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Delivery Charges</p>
                      <p>Lucknow: ₹300 | Barabanki: ₹250 | Ayodhya: Free</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    Bulk orders require a minimum quantity as specified per product.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary mb-4">Processing Time</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Orders are processed within 24–48 hours after confirmation. During peak periods or for
                      bulk orders, processing may take up to 72 hours. You will be notified once your order
                      is processed and ready for dispatch.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary mb-4">Delivery Timelines</h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p className="leading-relaxed">
                        Delivery is typically completed within 2–5 business days from the date of dispatch,
                        depending on the delivery location and order type.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 font-medium text-foreground">City</th>
                              <th className="text-left py-2 font-medium text-foreground">Order Type</th>
                              <th className="text-left py-2 font-medium text-foreground">Estimated Timeline</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border">
                              <td className="py-2">Ayodhya</td>
                              <td className="py-2">Small / Bulk</td>
                              <td className="py-2">1–3 business days</td>
                            </tr>
                            <tr className="border-b border-border">
                              <td className="py-2">Lucknow</td>
                              <td className="py-2">Bulk</td>
                              <td className="py-2">2–4 business days</td>
                            </tr>
                            <tr>
                              <td className="py-2">Barabanki</td>
                              <td className="py-2">Bulk</td>
                              <td className="py-2">2–5 business days</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-warning" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary mb-4">Important Notes</h2>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-accent font-bold mt-0.5">•</span>
                        <span>Delivery is available only within the designated service areas listed above.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent font-bold mt-0.5">•</span>
                        <span>Delivery charges are non-refundable once the order has been dispatched.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent font-bold mt-0.5">•</span>
                        <span>We are not liable for delays caused by unforeseen circumstances such as weather, traffic, or regulatory issues.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent font-bold mt-0.5">•</span>
                        <span>Customers will receive a notification once the order is dispatched.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent font-bold mt-0.5">•</span>
                        <span>For any delivery-related concerns, please contact us at info@kaaexim.com or +91 9999999999.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
