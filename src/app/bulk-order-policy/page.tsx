import type { Metadata } from 'next';
import { Package, IndianRupee, MapPin, ClipboardCheck, CreditCard, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bulk Order Policy',
  description: 'KAAEXIM PRODUCTS PRIVATE LIMITED bulk order policy — minimum quantities, pricing, delivery cities, and payment terms.',
};

export default function BulkOrderPolicyPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary via-primary-light to-primary py-16 md:py-20">
        <div className="container-main">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Bulk Order Policy</h1>
            <p className="text-gray-300 text-lg">
              Everything you need to know about placing bulk orders with KAAEXIM.
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
                KAAEXIM PRODUCTS PRIVATE LIMITED offers bulk ordering for businesses, retailers, and
                institutions looking to purchase products in larger quantities at competitive prices.
                This policy outlines the terms and process for placing and fulfilling bulk orders.
              </p>
            </div>

            <div className="space-y-6">
              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary mb-4">Minimum Quantities</h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>
                        Each product has a specified minimum bulk order quantity, which is clearly
                        displayed on the product page. Typically, the minimum bulk quantity starts from
                        10 units or as specified per product.
                      </p>
                      <p>
                        If the quantity in your cart reaches or exceeds the minimum bulk quantity for all
                        items, the entire order will be treated as a bulk order and eligible for bulk
                        pricing and delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <IndianRupee className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary mb-4">Pricing</h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>
                        Bulk orders are priced at special bulk rates, which are lower than the standard
                        retail selling price. The bulk price for each product is displayed on the product
                        page.
                      </p>
                      <p>
                        GST of 5% is applicable on bulk orders. The GST amount will be calculated on the
                        subtotal and displayed in the order summary during checkout.
                      </p>
                      <p>
                        Prices are subject to change without prior notice, but the price applicable at the
                        time of order placement will be honoured.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary mb-4">Delivery Cities</h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>Bulk delivery is currently available in the following cities:</p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-accent rounded-full" />
                          <span><strong>Lucknow</strong> — Delivery charge: ₹300</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-accent rounded-full" />
                          <span><strong>Barabanki</strong> — Delivery charge: ₹250</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-accent rounded-full" />
                          <span><strong>Ayodhya</strong> — Free delivery</span>
                        </li>
                      </ul>
                      <p className="text-sm italic">
                        Bulk orders are not available for delivery outside these cities at this time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <ClipboardCheck className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary mb-4">Confirmation Process</h2>
                    <div className="space-y-3 text-muted-foreground">
                      <ol className="space-y-3 list-decimal list-inside">
                        <li>Browse products and add items to your cart with quantities meeting the minimum bulk requirement.</li>
                        <li>Proceed to checkout and fill in your delivery details, including business name and GST number (optional).</li>
                        <li>Review the order summary and place your order.</li>
                        <li>Our team will review the order and confirm availability of stock.</li>
                        <li>You will receive an order confirmation with the order number and payment details within 24–48 hours.</li>
                        <li>For bulk orders, we may contact you to confirm the delivery schedule and coordinate logistics.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <CreditCard className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary mb-4">Payment Terms</h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>Bulk orders can be paid using the following methods:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span><strong>Cash on Delivery (COD)</strong> — Available for bulk orders within our delivery areas.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span><strong>Pay on Confirmation</strong> — Pay after our team confirms the order details.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span><strong>Manual UPI Payment</strong> — Pay via UPI using the provided UPI ID.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span><strong>Bank Transfer</strong> — For large bulk orders, payment can be made via NEFT/RTGS/IMPS to our bank account.</span>
                        </li>
                      </ul>
                      <p className="mt-3">
                        For large value bulk orders, advance payment or partial payment may be required
                        before processing. This will be communicated at the time of order confirmation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6 md:p-8 bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-warning" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-amber-800 mb-4">Additional Notes</h2>
                    <ul className="space-y-2 text-amber-800">
                      <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">•</span>
                        <span>Bulk order delivery timelines may vary based on stock availability and logistics coordination.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">•</span>
                        <span>You may be required to provide a GST number for bulk orders above a certain value.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">•</span>
                        <span>Bulk orders are subject to stock availability. We will inform you if any items are unavailable.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">•</span>
                        <span>For any queries regarding bulk orders, please contact us at info@kaaexim.com or +91 9999999999.</span>
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
