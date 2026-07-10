import type { Metadata } from 'next';
import { RotateCcw, Clock, ClipboardList, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Return Policy',
  description: 'KAAEXIM PRODUCTS PRIVATE LIMITED return and replacement policy — conditions, process, and timelines.',
};

export default function ReturnPolicyPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary via-primary-light to-primary py-16 md:py-20">
        <div className="container-main">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Return & Replacement Policy</h1>
            <p className="text-gray-300 text-lg">
              Understand our process for returns and replacements.
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
                At KAAEXIM PRODUCTS PRIVATE LIMITED, we are committed to delivering quality products.
                If you receive a product that is defective, damaged, or not as described, we will assist
                you with a return or replacement in accordance with this policy.
              </p>
            </div>

            <div className="space-y-6">
              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary mb-4">Conditions for Return / Replacement</h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>The following conditions apply for returns and replacements:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>Product is damaged, defective, or tampered at the time of delivery.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>Product delivered does not match the ordered item (wrong product, size, or variant).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>Product is past its expiration date (for consumable items).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>Quantity delivered is less than what was ordered.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                    <XCircle className="w-6 h-6 text-danger" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary mb-4">Non-Returnable Items</h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>The following items are not eligible for return or replacement:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>Products that have been opened, used, or consumed after delivery.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>Products damaged due to improper handling or storage after delivery.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>Free samples or promotional items.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>Bulk orders — returns are handled on a case-by-case basis in consultation with the customer.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary mb-4">Return Timeframe</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Return or replacement requests must be reported within <strong>48 hours</strong> of delivery.
                      Requests made after this period may not be accepted unless the defect or issue was not
                      reasonably detectable at the time of delivery.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <ClipboardList className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary mb-4">Return / Replacement Process</h2>
                    <div className="space-y-3 text-muted-foreground">
                      <ol className="space-y-3 list-decimal list-inside">
                        <li>Contact us within 48 hours of delivery via phone (+91 9999999999) or email (info@kaaexim.com) with your order number and details of the issue.</li>
                        <li>Provide photographic evidence (if applicable) showing the defect, damage, or discrepancy.</li>
                        <li>Our team will review your request and respond within 24–48 hours.</li>
                        <li>If approved, we will arrange for pickup of the returned product and issue a replacement or refund as applicable.</li>
                        <li>Refunds will be processed within 5–7 business days after the returned product is received and inspected.</li>
                      </ol>
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
                    <h2 className="text-xl font-bold text-amber-800 mb-4">Important Notes</h2>
                    <ul className="space-y-2 text-amber-800">
                      <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">•</span>
                        <span>Return shipping costs will be borne by KAAEXIM if the return is due to our error.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">•</span>
                        <span>Refunds will be issued via the same payment method used at the time of purchase.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">•</span>
                        <span>Delivery charges are non-refundable unless the return is due to our error.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">•</span>
                        <span>We reserve the right to reject return requests that do not meet our policy criteria.</span>
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
