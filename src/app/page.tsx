import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeIndianRupee,
  Building2,
  CheckCircle2,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getDb, initDb } from '@/lib/db';
import type { Product } from '@/types';

await initDb();

const heroProducts = [
  { src: '/images/products/items/kae-tcp-001.webp', alt: "Ching's Chowmein Noodles", className: 'col-span-2 row-span-2' },
  { src: '/images/products/items/kae-tcp-060.webp', alt: 'Tata Salt', className: '' },
  { src: '/images/products/items/kae-tcp-204.webp', alt: 'Tata Soulfull Millet Muesli', className: '' },
  { src: '/images/products/items/kae-tcp-403.webp', alt: 'Tata Coffee Gold', className: 'col-span-2' },
];

const collections = [
  {
    title: 'Kitchen essentials',
    eyebrow: 'Dals, salt & spices',
    image: '/images/products/items/kae-tcp-097.webp',
    href: '/products?search=Tata+Sampann',
    tint: 'from-amber-50 to-orange-100/70',
  },
  {
    title: 'Tea & coffee',
    eyebrow: 'Everyday beverages',
    image: '/images/products/items/kae-tcp-298.webp',
    href: '/products?search=Tea',
    tint: 'from-emerald-50 to-teal-100/70',
  },
  {
    title: 'Breakfast & cereals',
    eyebrow: 'Wholesome mornings',
    image: '/images/products/items/kae-tcp-214.webp',
    href: '/products?search=Soulfull',
    tint: 'from-rose-50 to-orange-100/70',
  },
  {
    title: 'Wellness',
    eyebrow: 'Teas & supplements',
    image: '/images/products/items/kae-tcp-249.webp',
    href: '/products?search=Organic+India',
    tint: 'from-lime-50 to-green-100/70',
  },
];

function withImage(product: Product & { first_image?: string }) {
  return {
    ...product,
    images: product.first_image
      ? [{ id: 0, product_id: product.id, image_url: product.first_image, display_order: 0 }]
      : [],
  };
}

export default async function HomePage() {
  const db = await getDb();

  const featuredProducts = db.prepare(`
    SELECT p.*, c.name as category_name,
      (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as first_image
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.sku IN ('KAE-TCP-001','KAE-TCP-043','KAE-TCP-075','KAE-TCP-097','KAE-TCP-204','KAE-TCP-229','KAE-TCP-279','KAE-TCP-403')
      AND p.status = 1
    ORDER BY CASE p.sku
      WHEN 'KAE-TCP-001' THEN 1 WHEN 'KAE-TCP-043' THEN 2 WHEN 'KAE-TCP-075' THEN 3
      WHEN 'KAE-TCP-097' THEN 4 WHEN 'KAE-TCP-204' THEN 5 WHEN 'KAE-TCP-229' THEN 6
      WHEN 'KAE-TCP-279' THEN 7 ELSE 8 END
    LIMIT 8
  `).all() as (Product & { first_image?: string; category_name?: string })[];

  return (
    <div className="overflow-hidden bg-[#fbfaf6]">
      <section className="relative border-b border-[#e8e2d7] bg-[#f3eee3]">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_15%_20%,rgba(232,122,63,.18),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(30,94,76,.16),transparent_25%)]" />
        <div className="container-main relative grid min-h-[670px] items-center gap-12 py-14 lg:grid-cols-[1.02fr_.98fr] lg:py-20">
          <div className="max-w-2xl animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-accent" />
              421 everyday products, ready to order
            </div>
            <h1 className="text-balance text-5xl font-bold leading-[1.02] tracking-[-0.045em] text-primary sm:text-6xl lg:text-7xl">
              Everyday essentials for homes and businesses.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#5f665f] sm:text-xl">
              Shop trusted food, beverage and wellness brands with clear retail and bulk pricing, delivered across Ayodhya, Lucknow and Barabanki.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="btn-primary btn-lg group rounded-full px-7 py-3.5 shadow-lg shadow-accent/20">
                Shop all products
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-white/70 px-7 py-3.5 font-semibold text-primary transition hover:border-primary hover:bg-white">
                Request a bulk quote
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#59645f]">
              {['GST-ready invoices', 'Bulk rates shown clearly', 'Local delivery support'].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[590px] animate-slide-up lg:mx-0" style={{ animationDelay: '120ms' }}>
            <div className="absolute -inset-8 rounded-[3rem] bg-white/50 blur-2xl" />
            <div className="relative grid h-[520px] grid-cols-4 grid-rows-3 gap-3 rounded-[2rem] border border-white/80 bg-white/55 p-3 shadow-[0_30px_80px_rgba(43,56,49,.16)] backdrop-blur-sm sm:gap-4 sm:p-4">
              {heroProducts.map((product, index) => (
                <div
                  key={product.src}
                  className={`relative overflow-hidden rounded-[1.35rem] bg-white shadow-sm ${product.className} ${index === 0 ? 'col-span-2 row-span-3' : index === 3 ? 'col-span-2 row-span-2' : ''}`}
                >
                  <Image src={product.src} alt={product.alt} fill priority={index === 0} className="object-contain p-3 sm:p-5" sizes="(max-width: 1024px) 45vw, 25vw" />
                </div>
              ))}
            </div>
            <div className="absolute -bottom-5 left-6 right-6 flex items-center justify-between rounded-2xl border border-[#e5ded2] bg-white px-5 py-4 shadow-xl sm:left-auto sm:right-6 sm:w-[285px]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.18em] text-accent">Delivery area</p>
                <p className="mt-1 font-bold text-primary">3 cities in Uttar Pradesh</p>
              </div>
              <div className="rounded-xl bg-primary/8 p-3"><Truck className="h-6 w-6 text-primary" /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#ece7dd] bg-white">
        <div className="container-main grid divide-y divide-[#ece7dd] py-2 md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            { icon: PackageCheck, title: 'Original catalogue range', copy: 'Individual product listings and pack details' },
            { icon: BadgeIndianRupee, title: 'Retail and bulk prices', copy: 'Choose the quantity that fits your order' },
            { icon: Truck, title: 'Local fulfilment', copy: 'Support for Ayodhya, Lucknow and Barabanki' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4 px-3 py-6 md:px-8">
              <div className="rounded-2xl bg-[#f3eee3] p-3"><item.icon className="h-6 w-6 text-primary" /></div>
              <div><p className="font-bold text-primary">{item.title}</p><p className="mt-1 text-sm text-muted-foreground">{item.copy}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-main">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.2em] text-accent">Shop by collection</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-.035em] text-primary lg:text-5xl">A useful range, not a crowded shelf.</h2>
            </div>
            <p className="max-w-md text-base leading-7 text-muted-foreground">Start with what you need today. Every collection opens into individual products with pack size, pricing and stock details.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((collection) => (
              <Link key={collection.title} href={collection.href} className={`group relative min-h-[390px] overflow-hidden rounded-[1.75rem] border border-white bg-gradient-to-br ${collection.tint} p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl`}>
                <div className="relative z-10">
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-primary/60">{collection.eyebrow}</p>
                  <h3 className="mt-2 text-2xl font-bold text-primary">{collection.title}</h3>
                </div>
                <div className="absolute inset-x-5 bottom-14 top-24">
                  <Image src={collection.image} alt="" fill className="object-contain transition duration-500 group-hover:scale-105" sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw" />
                </div>
                <span className="absolute bottom-6 left-6 z-10 inline-flex items-center gap-2 font-semibold text-primary">Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container-main">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.2em] text-accent">Popular picks</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-.035em] text-primary lg:text-5xl">Products worth reaching for.</h2>
            </div>
            <Link href="/products" className="hidden items-center gap-2 font-semibold text-primary hover:text-accent sm:inline-flex">View all 421 <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => <ProductCard key={product.id} product={withImage(product)} showQuickView={false} />)}
          </div>
          <Link href="/products" className="btn-outline mt-8 w-full rounded-full sm:hidden">View all products</Link>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-main">
          <div className="grid overflow-hidden rounded-[2.25rem] bg-primary text-white shadow-2xl lg:grid-cols-[.9fr_1.1fr]">
            <div className="relative min-h-[430px] bg-[#e9e2d4]">
              <div className="absolute left-[7%] top-[10%] h-[58%] w-[42%] rotate-[-4deg] overflow-hidden rounded-3xl bg-white shadow-xl">
                <Image src="/images/products/items/kae-tcp-153.webp" alt="Tata Sampann chilli powder" fill className="object-contain p-5" sizes="320px" />
              </div>
              <div className="absolute right-[7%] top-[16%] h-[58%] w-[42%] rotate-[4deg] overflow-hidden rounded-3xl bg-white shadow-xl">
                <Image src="/images/products/items/kae-tcp-298.webp" alt="Tata Tea Gold" fill className="object-contain p-5" sizes="320px" />
              </div>
              <div className="absolute bottom-[6%] left-1/2 h-[48%] w-[40%] -translate-x-1/2 overflow-hidden rounded-3xl border-4 border-[#e9e2d4] bg-white shadow-2xl">
                <Image src="/images/products/items/kae-tcp-403.webp" alt="Tata Coffee Gold" fill className="object-contain p-5" sizes="300px" />
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <p className="text-sm font-bold uppercase tracking-[.2em] text-[#f1a46f]">For shops, offices and institutions</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-.035em] lg:text-5xl">Bulk ordering without the back-and-forth.</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">See minimum bulk quantities and business pricing on the product itself. For larger requirements, send us your list and delivery city for a tailored quote.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Building2, text: 'Retailers, offices and institutions' },
                  { icon: ShoppingBag, text: 'Mixed-product order support' },
                  { icon: MapPin, text: 'Delivery across three active cities' },
                  { icon: BadgeIndianRupee, text: 'Clear volume-based pricing' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 rounded-2xl bg-white/8 p-4 text-sm font-medium text-white/90">
                    <item.icon className="h-5 w-5 shrink-0 text-[#f1a46f]" /> {item.text}
                  </div>
                ))}
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-dark">Get a bulk quote <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/bulk-order-policy" className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10">How bulk orders work</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
