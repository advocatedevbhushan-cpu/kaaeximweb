import type { Metadata } from 'next';
import { CheckCircle, Package, IndianRupee, ShoppingCart, Truck, RotateCcw, Shield, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using the KAAEXIM PRODUCTS PRIVATE LIMITED e-commerce platform.',
};

const sections = [
  {
    icon: CheckCircle,
    title: '1. Acceptance of Terms',
    content: [
      'By accessing and using the KAAEXIM PRODUCTS PRIVATE LIMITED website and services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use our platform.',
      'We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the platform after any changes constitutes acceptance of the new terms.',
    ],
  },
  {
    icon: Package,
    title: '2. Products and Availability',
    content: [
      'All products listed on our platform are subject to availability. We strive to ensure accurate product descriptions, pricing, and images, but we do not warrant that product descriptions or other content are error-free.',
      'We reserve the right to discontinue any product at any time without notice. Product images are for illustrative purposes only; actual products may vary.',
      'We reserve the right to limit the quantity of any product we supply, and to refuse any order at our discretion.',
    ],
  },
  {
    icon: IndianRupee,
    title: '3. Pricing',
    content: [
      'All prices displayed on our platform are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.',
      'Bulk pricing may differ from standard retail pricing. The applicable price will be shown based on the quantity selected.',
      'We reserve the right to modify prices at any time without prior notice. However, the price charged will be the price in effect at the time of order placement.',
    ],
  },
  {
    icon: ShoppingCart,
    title: '4. Orders',
    content: [
      'When you place an order through our platform, you are making an offer to purchase the selected products. We reserve the right to accept or decline this offer.',
      'Order confirmation does not constitute acceptance of your order. We may require additional verification or information before processing.',
      'We reserve the right to cancel any order if we suspect fraudulent activity, incorrect pricing, or any violation of these terms.',
      'For bulk orders, a separate confirmation process may apply, and the order will only be confirmed upon mutual agreement.',
    ],
  },
  {
    icon: Truck,
    title: '5. Delivery',
    content: [
      'Delivery is available only in our designated service areas as specified on our website.',
      'Small quantity delivery is available only in Ayodhya. Bulk delivery is available in Lucknow, Barabanki, and Ayodhya.',
      'Delivery timelines are estimates and not guaranteed. We will make every effort to deliver within the stated timeframe but shall not be liable for delays beyond our control.',
      'Risk of loss or damage to products passes to you upon delivery.',
    ],
  },
  {
    icon: RotateCcw,
    title: '6. Returns and Replacements',
    content: [
      'Our return and replacement policy is governed by the specific terms outlined in our Return Policy page, which is incorporated by reference into these terms.',
      'Products must be returned in their original condition and packaging, subject to the conditions specified in our Return Policy.',
      'We reserve the right to reject return requests that do not meet our policy criteria.',
    ],
  },
  {
    icon: Shield,
    title: '7. Limitation of Liability',
    content: [
      'KAAEXIM PRODUCTS PRIVATE LIMITED shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our platform or products.',
      'Our total liability for any claim arising from the use of our services shall not exceed the amount paid by you for the specific product giving rise to the claim.',
      'We are not responsible for any delays or failures in performance caused by events beyond our reasonable control, including but not limited to natural disasters, strikes, government actions, or supply chain disruptions.',
    ],
  },
  {
    icon: Scale,
    title: '8. Governing Law',
    content: [
      'These Terms & Conditions shall be governed by and construed in accordance with the laws of India.',
      'Any disputes arising out of or relating to these terms or your use of our platform shall be subject to the exclusive jurisdiction of the courts in Ayodhya, Uttar Pradesh.',
      'Any claim or cause of action arising out of or related to these terms must be filed within one year after such claim or cause of action arose.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary via-primary-light to-primary py-16 md:py-20">
        <div className="container-main">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
            <p className="text-gray-300 text-lg">
              Please read these terms carefully before using our platform.
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
                Welcome to KAAEXIM PRODUCTS PRIVATE LIMITED. These Terms & Conditions govern your use of
                our website and services. By accessing or using our platform, you agree to abide by these
                terms. If you do not agree, please do not use our services.
              </p>
            </div>

            <div className="space-y-6">
              {sections.map((section, i) => (
                <div key={i} className="card p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                      <section.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-primary mb-4">{section.title}</h2>
                      <div className="space-y-3">
                        {section.content.map((para, j) => (
                          <p key={j} className="text-muted-foreground leading-relaxed">{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
