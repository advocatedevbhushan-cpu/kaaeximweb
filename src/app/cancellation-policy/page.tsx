import type { Metadata } from 'next';
import { XCircle, Clock, RefreshCw, CreditCard, AlertCircle, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cancellation Policy',
  description: 'KAAEXIM PRODUCTS PRIVATE LIMITED order cancellation policy — how to cancel, refund process, and timeframes.',
};

export default function CancellationPolicyPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary via-primary-light to-primary py-16 md:py-20">
        <div className="container-main">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Cancellation Policy</h1>
            <p className="text-gray-300 text-lg">
              Learn about order cancellation, refunds, and timelines.
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
                At KAAEXIM PRODUCTS PRIVATE LIMITED, we understand that circumstances may change.
                This policy outlines the terms and process for cancelling an order and obtaining a refund.
              </p>
            </div>

            <div className="space-y-6">
              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                    <XCircle className="w-6 h-6 text-danger" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary mb-4">Order Cancellation</h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>You may cancel your order under the following conditions:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span><strong>Before processing:</strong> Orders can be cancelled free of charge if the request is made before processing begins (within 2 hours of placing the order).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span><strong>After processing:</strong> Once an order has been processed or dispatched, cancellation may not be possible. Please contact us immediately, and we will assess the situation on a case-by-case basis.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span><strong>Bulk orders:</strong> Cancellation of bulk orders is subject to mutual agreement and may incur charges for any costs already incurred.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary mb-4">How to Cancel</h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>To request a cancellation, please use one of the following methods:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>Call us at <strong>+91 9999999999</strong> with your order number.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>Email us at <strong>info@kaaexim.com</strong> with your order number and cancellation request.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>Use the contact form on our website with your order details and cancellation request.</span>
                        </li>
                      </ul>
                      <p className="mt-3">Please include your order number and reason for cancellation to help us process your request faster.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <RefreshCw className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-primary mb-4">Refund Process</h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>Once your cancellation is approved, the refund process works as follows:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>Refunds will be processed within <strong>5–7 business days</strong> after cancellation approval.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>Refunds will be issued via the <strong>same payment method</strong> used for the original transaction.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold mt-0.5">•</span>
                          <span>If the order has already been dispatched, the refund will be processed after the product is returned to us in its original condition.</span>
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
                    <h2 className="text-xl font-bold text-primary mb-4">Cancellation Timeframes</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 font-medium text-foreground">Scenario</th>
                            <th className="text-left py-2 font-medium text-foreground">Cancellation Possible</th>
                            <th className="text-left py-2 font-medium text-foreground">Refund</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border">
                            <td className="py-2">Within 2 hours of placing order</td>
                            <td className="py-2 text-success font-medium">Yes</td>
                            <td className="py-2">Full refund</td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-2">After processing started</td>
                            <td className="py-2 text-warning font-medium">Case-by-case</td>
                            <td className="py-2">Partial or full</td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-2">After dispatch</td>
                            <td className="py-2 text-danger font-medium">Limited</td>
                            <td className="py-2">After return received</td>
                          </tr>
                          <tr>
                            <td className="py-2">Bulk orders</td>
                            <td className="py-2 text-warning font-medium">Subject to agreement</td>
                            <td className="py-2">As mutually decided</td>
                          </tr>
                        </tbody>
                      </table>
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
                        <span>Cancellation is not guaranteed once the order has entered the processing or dispatch stage.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">•</span>
                        <span>Delivery charges are non-refundable if the order has been dispatched.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">•</span>
                        <span>We reserve the right to cancel any order at our discretion in cases of suspected fraud, pricing errors, or stock unavailability.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold mt-0.5">•</span>
                        <span>In case of cancellation by KAAEXIM, a full refund will be issued promptly.</span>
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
