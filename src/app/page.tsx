import Link from 'next/link';
import Image from 'next/image';
import { getDb } from '@/lib/db';
import { initDb } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';
import { ArrowRight, Truck, Shield, Star, Package, CheckCircle, Users, Award, Zap, Heart, Search, ChevronRight, ChevronLeft } from 'lucide-react';

await initDb();

const stats = [
  { icon: Package, label: 'Products', value: '500+', desc: 'Quality items' },
  { icon: Users, label: 'Happy Clients', value: '2,500+', desc: 'Across regions' },
  { icon: Award, label: 'Years Experience', value: '15+', desc: 'In supply chain' },
  { icon: Truck, label: 'Cities Served', value: '3', desc: 'Active locations' },
];

const features = [
  { icon: Zap, title: 'Fast Ordering', desc: 'Streamlined platform for quick product selection and checkout' },
  { icon: Shield, title: 'Quality Assured', desc: 'All products verified for quality and compliance standards' },
  { icon: Truck, title: 'Reliable Delivery', desc: 'Timely delivery across Lucknow, Barabanki, and Ayodhya' },
  { icon: Star, title: 'Bulk Pricing', desc: 'Competitive wholesale rates for institutional buyers' },
  { icon: Heart, title: 'Customer First', desc: 'Dedicated support for retail and bulk customers alike' },
  { icon: Award, title: 'Trusted Partner', desc: 'Private Limited company with proven track record' },
];

const testimonials = [
  { name: 'Rajesh Kumar', role: 'Store Owner, Ayodhya', content: 'KAAEXIM has transformed how I stock my store. The bulk pricing is excellent and delivery is always on time.', avatar: 'RK' },
  { name: 'Priya Sharma', role: 'Procurement Manager, Lucknow', content: 'We order institutional supplies monthly. The platform is intuitive and their customer service is outstanding.', avatar: 'PS' },
  { name: 'Amit Singh', role: 'Distributor, Barabanki', content: 'Best wholesale platform in the region. Product range is comprehensive and pricing is transparent.', avatar: 'AS' },
];

export default async function HomePage() {
  const db = await getDb();

  const featuredProducts = db.prepare(`
    SELECT p.*, c.name as category_name,
      (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as first_image
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_featured = 1 AND p.status = 1
    ORDER BY p.created_at DESC
    LIMIT 8
  `).all() as (Product & { first_image?: string; category_name?: string })[];

  const bestSellers = db.prepare(`
    SELECT p.*, c.name as category_name,
      (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as first_image
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_best_seller = 1 AND p.status = 1
    ORDER BY p.created_at DESC
    LIMIT 4
  `).all() as (Product & { first_image?: string; category_name?: string })[];

  const categories = db.prepare('SELECT * FROM categories WHERE status = 1 ORDER BY display_order').all();

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-primary pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
        <div className="container-main relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                Now delivering to Lucknow, Barabanki & Ayodhya
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 text-balance">
                Quality Products.<br />
                <span className="gradient-text">Reliable Supply.</span><br />
                Delivered Where Your Business Needs Them.
              </h1>
              <p className="text-lg lg:text-xl text-gray-300 mb-8 max-w-xl">
                KAAEXIM PRODUCTS PRIVATE LIMITED offers a streamlined product ordering platform for retail and bulk customers across selected delivery locations.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <Link href="/products" className="btn-primary btn-lg group">
                  Browse Products
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/contact" className="btn-lg border-2 border-white/30 text-white hover:bg-white/10 transition-all px-8 py-3 rounded-lg font-medium">
                  Request Bulk Quote
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-8 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>No minimum order for Ayodhya delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>Bulk discounts available</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>GST compliant invoicing</span>
                </div>
              </div>
            </div>
            <div className="relative animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2">
                <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl p-8 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <Package className="w-20 h-20 mx-auto mb-4 text-accent" />
                    <h3 className="text-2xl font-bold text-white mb-2">Product Catalogue</h3>
                    <p className="text-gray-300">500+ products across 6 categories</p>
                    <div className="mt-6 flex justify-center gap-4 text-sm">
                      <div className="bg-white/10 px-4 py-2 rounded-full">
                        <span className="text-accent font-bold">12</span> Categories
                      </div>
                      <div className="bg-white/10 px-4 py-2 rounded-full">
                        <span className="text-accent font-bold">500+</span> Products
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 lg:-bottom-8 lg:-right-8 bg-white rounded-xl shadow-2xl p-6 min-w-[280px] animate-scale-in" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Delivery Coverage</p>
                    <p className="text-sm text-muted-foreground">3 Active Cities</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {['Ayodhya', 'Lucknow', 'Barabanki'].map((city, i) => (
                    <div key={city} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">{city}</span>
                      <span className="text-xs text-accent font-semibold">
                        {city === 'Ayodhya' ? 'Small + Bulk' : 'Bulk Only'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container-main">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={stat.label} className="card p-6 text-center animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-14 h-14 mx-auto mb-4 bg-accent/10 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-accent" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground/70 mt-1">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-main">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Browse by Category</h2>
            <p className="text-lg text-muted-foreground">Explore our comprehensive product range across all categories</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="card p-6 text-center hover:border-accent transition-all group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                  <Package className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{cat.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">View products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container-main">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Featured Products</h2>
              <p className="text-lg text-muted-foreground">Handpicked selections for quality and value</p>
            </div>
            <Link href="/products" className="btn-outline self-center">
              View All Products
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={{ ...product, images: product.first_image ? [{ id: 0, product_id: product.id, image_url: product.first_image, display_order: 0 }] : [] }} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-main">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Best Selling Products</h2>
              <p className="text-lg text-muted-foreground">Most loved by our customers</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={{ ...product, images: product.first_image ? [{ id: 0, product_id: product.id, image_url: product.first_image, display_order: 0 }] : [] }} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="lg:order-2">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 lg:p-12">
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Zap className="w-4 h-4" />
                  Bulk Orders Welcome
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">Wholesale Pricing for Your Business</h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Whether you run a retail store, office canteen, or institutional kitchen, KAAEXIM offers competitive bulk pricing with reliable delivery across our service areas.
                </p>
                <ul className="space-y-4 mb-8">
                  {['Volume-based pricing tiers', 'Flexible minimum order quantities', 'Priority delivery scheduling', 'Dedicated account management', 'GST-compliant invoicing'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-200">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-4">
                  <Link href="/products" className="bg-accent hover:bg-accent-dark text-white font-medium px-6 py-3 rounded-lg transition-colors">
                    Browse Bulk Products
                  </Link>
                  <Link href="/contact" className="border-2 border-white/30 text-white hover:bg-white/10 font-medium px-6 py-3 rounded-lg transition-all">
                    Contact Sales Team
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:order-1 relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl blur-2xl" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 aspect-square flex items-center justify-center">
                  <Truck className="w-32 h-32 text-accent" />
                </div>
                <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 bg-white rounded-xl shadow-2xl p-6 min-w-[280px] animate-scale-in">
                  <h4 className="font-bold text-foreground mb-4">Delivery Zones</h4>
                  <div className="space-y-3">
                    {[
                      { city: 'Ayodhya', types: 'Small (1-2) + Bulk', color: 'text-success' },
                      { city: 'Lucknow', types: 'Bulk Orders Only', color: 'text-accent' },
                      { city: 'Barabanki', types: 'Bulk Orders Only', color: 'text-accent' },
                    ].map((zone) => (
                      <div key={zone.city} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium">{zone.city}</span>
                        <span className={`text-sm font-semibold ${zone.color}`}>{zone.types}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-main">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Why Choose KAAEXIM?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Built for simple ordering and reliable fulfilment</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="card p-6 hover:border-accent transition-all animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container-main">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Trusted by Businesses Across UP</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">See what our customers have to say about their experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="card p-6 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Ready to Start Ordering?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of satisfied customers who trust KAAEXIM for their product supply needs. Create an account or browse as a guest.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="btn-primary btn-lg">
                  Start Shopping
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/contact" className="btn-outline btn-lg">
                  Talk to Sales
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 lg:p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/cta-pattern.svg')] opacity-5" />
              <div className="relative">
                <h3 className="text-2xl lg:text-3xl font-bold mb-6">Stay Updated</h3>
                <p className="text-gray-300 mb-6">Subscribe to our newsletter for product updates, bulk offers, and industry insights.</p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md" action="/newsletter" method="POST">
                  <label htmlFor="email" className="visually-hidden">Email address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="flex-1 input-field bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-accent focus:ring-accent/20"
                    required
                  />
                  <button type="submit" className="btn-primary whitespace-nowrap">
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-4">No spam. Unsubscribe anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <Truck className="w-10 h-10 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold text-lg mb-1">Free Delivery</h3>
              <p className="text-gray-400 text-sm">On bulk orders above ₹5000</p>
            </div>
            <div className="p-4">
              <Shield className="w-10 h-10 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold text-lg mb-1">Quality Guaranteed</h3>
              <p className="text-gray-400 text-sm">Verified products only</p>
            </div>
            <div className="p-4">
              <Users className="w-10 h-10 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold text-lg mb-1">24/7 Support</h3>
              <p className="text-gray-400 text-sm">Dedicated customer care</p>
            </div>
            <div className="p-4">
              <Award className="w-10 h-10 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold text-lg mb-1">Easy Returns</h3>
              <p className="text-gray-400 text-sm">Hassle-free return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}