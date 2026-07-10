import type { Metadata } from 'next';
import { Shield, Target, Eye, Star, Truck, Package, Users, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about KAAEXIM PRODUCTS PRIVATE LIMITED — our story, mission, and commitment to quality product supply.',
};

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary via-primary-light to-primary py-16 md:py-20">
        <div className="container-main">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">About Us</h1>
            <p className="text-gray-300 text-lg">
              KAAEXIM PRODUCTS PRIVATE LIMITED — your trusted partner for quality products and reliable supply.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                KAAEXIM PRODUCTS PRIVATE LIMITED is a registered company dedicated to providing high-quality products
                across multiple categories including packaged foods, groceries, snacks, beverages, household essentials,
                and institutional supplies. Founded with a vision to bridge the gap between manufacturers and consumers,
                we have built a reliable supply chain that serves both retail and bulk customers.
              </p>
              <p>
                Our journey began with a simple mission — to make quality products accessible to businesses and
                households alike. Today, we serve customers across Ayodhya, Lucknow, and Barabanki with a commitment
                to quality, consistency, and timely delivery. Whether you need a small quantity for personal use or
                bulk supplies for your business, KAAEXIM is here to serve you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card p-8">
              <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide a seamless and reliable product ordering experience for retail and bulk customers,
                ensuring consistent quality, competitive pricing, and timely delivery across our service regions.
              </p>
            </div>
            <div className="card p-8">
              <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become a leading product distribution platform in Uttar Pradesh, known for our commitment to
                quality, customer satisfaction, and supply chain excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-main">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">Why Choose KAAEXIM?</h2>
            <p className="text-muted-foreground">What sets us apart from the rest</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Package, title: 'Quality Products', desc: 'We source and supply only quality-assured products across all categories, ensuring consistency and reliability.' },
              { icon: Truck, title: 'Flexible Delivery', desc: 'Small quantity delivery in Ayodhya and bulk delivery across Lucknow, Barabanki, and Ayodhya.' },
              { icon: Shield, title: 'Trusted Company', desc: 'KAAEXIM PRODUCTS PRIVATE LIMITED is a registered company with a professional approach to supply.' },
              { icon: Star, title: 'Easy Ordering', desc: 'Our online platform makes it simple to browse products, place orders, and track deliveries.' },
              { icon: Users, title: 'Customer First', desc: 'We prioritise customer satisfaction with responsive support and a hassle-free experience.' },
              { icon: Award, title: 'Competitive Pricing', desc: 'We offer fair and transparent pricing with special rates for bulk orders.' },
            ].map((item, i) => (
              <div key={i} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">Contact Information</h2>
            <div className="card p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">KAAEXIM PRODUCTS PRIVATE LIMITED</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong className="text-foreground">Address:</strong> Ayodhya, Uttar Pradesh, India</p>
                    <p><strong className="text-foreground">Phone:</strong> +91 9999999999</p>
                    <p><strong className="text-foreground">Email:</strong> info@kaaexim.com</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Business Hours</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong className="text-foreground">Mon – Sat:</strong> 9:00 AM – 7:00 PM</p>
                    <p><strong className="text-foreground">Sunday:</strong> Closed</p>
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
