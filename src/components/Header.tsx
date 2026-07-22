'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Menu, X, ShoppingCart, Search, User, Package, ChevronDown, ChevronRight, Truck, Shield, Star } from 'lucide-react';

const categories = [
  { name: 'Packaged Food', slug: 'packaged-food', icon: Package, items: ['Breakfast Cereals', 'Biscuits & Cookies', 'Noodles & Pasta', 'Ready to Eat'] },
  { name: 'Grocery Items', slug: 'grocery', icon: Package, items: ['Rice & Grains', 'Dals & Pulses', 'Flours', 'Spices'] },
  { name: 'Snacks', slug: 'snacks', icon: Package, items: ['Namkeen', 'Chips', 'Chocolates', 'Healthy Snacks'] },
  { name: 'Beverages', slug: 'beverages', icon: Package, items: ['Tea & Coffee', 'Juices', 'Soft Drinks', 'Health Drinks'] },
  { name: 'Household', slug: 'household', icon: Package, items: ['Cleaning', 'Personal Care', 'Paper Products', 'Kitchen Essentials'] },
  { name: 'Institutional', slug: 'institutional-supply', icon: Package, items: ['Bulk Tea/Coffee', 'Disposables', 'Cleaning Supplies', 'Office Pantry'] },
];

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products', hasMegaMenu: true },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { itemCount } = useCart();

  const handleMegaEnter = (href: string) => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setActiveMegaMenu(href);
  };
  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setActiveMegaMenu(null), 150);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <nav className="container-main" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link href="/" className="flex items-center gap-2" aria-label="KAAEXIM Home">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-primary leading-tight block">KAAEXIM</span>
              <span className="text-[10px] text-muted-foreground tracking-wider block leading-tight">PRODUCTS PVT. LTD.</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.href} className="relative">
                {link.hasMegaMenu ? (
                  <div
                    className="relative"
                    onMouseEnter={() => handleMegaEnter(link.href)}
                    onMouseLeave={handleMegaLeave}
                  >
                    <button
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors rounded-md"
                      aria-expanded={activeMegaMenu === link.href}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeMegaMenu === link.href ? 'rotate-180' : ''}`} />
                    </button>
                    {activeMegaMenu === link.href && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[640px] bg-white border border-border rounded-2xl shadow-2xl p-5 lg:p-7 animate-slide-down z-50 origin-top"
                        role="menu"
                      >
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
                          {categories.map((cat) => (
                            <div key={cat.slug} className="group/cat space-y-2.5">
                              <Link
                                href={`/products?category=${cat.slug}`}
                                className="flex items-center gap-2 text-sm font-semibold text-primary group-hover/cat:text-accent transition-colors"
                              >
                                <span className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center">
                                  <cat.icon className="w-3.5 h-3.5 text-accent" />
                                </span>
                                {cat.name}
                              </Link>
                              <ul className="space-y-1" role="menu">
                                {cat.items.map((item, idx) => (
                                  <li key={item} role="menuitem" style={{ animationDelay: `${idx * 40}ms` }}>
                                    <Link
                                      href={`/products?category=${cat.slug}&search=${encodeURIComponent(item)}`}
                                      className="text-sm text-muted-foreground hover:text-foreground transition-colors block py-1 px-2 rounded hover:bg-muted/70"
                                    >
                                      {item}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-border">
                          <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-dark transition-colors group"
                          >
                            View All Categories
                            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors rounded-md relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-200 hover:after:w-3/4"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-sm font-medium rounded-lg transition-colors"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Search products...</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-background border border-border rounded">⌘K</kbd>
            </button>

            <Link
              href="/cart"
              className="relative p-2 lg:p-2.5 text-foreground hover:text-accent transition-colors rounded-lg hover:bg-muted"
              aria-label={`Cart, ${itemCount} items`}
            >
              <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            <div className="relative" ref={userMenuRef}>
              <button
                className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors rounded-lg hover:bg-muted"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <User className="w-4 h-4" />
                <span>Account</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-xl py-2 animate-scale-in z-50">
                  <Link href="/account" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-accent">My Account</Link>
                  <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-accent">My Orders</Link>
                  <Link href="/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-accent">Wishlist</Link>
                  <hr className="my-2 border-border" />
                  <Link href="/admin/login" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-accent">Admin Panel</Link>
                </div>
              )}
            </div>

            <button
              className="lg:hidden p-2 text-foreground hover:text-accent transition-colors rounded-lg hover:bg-muted"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="lg:hidden border-t border-border animate-slide-down">
            <div className="py-4 space-y-1">
              <Link href="/" className="block px-2 py-2 text-sm font-medium hover:text-accent">Home</Link>
              <button
                className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium hover:text-accent"
                onClick={() => setMobileSubmenu(mobileSubmenu === 'products' ? null : 'products')}
              >
                <span>Products</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubmenu === 'products' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubmenu === 'products' && (
                <div className="pl-4 space-y-1 border-l border-border ml-6 mt-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      className="block px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
              <Link href="/about" className="block px-2 py-2 text-sm font-medium hover:text-accent">About Us</Link>
              <Link href="/contact" className="block px-2 py-2 text-sm font-medium hover:text-accent">Contact</Link>
              <hr className="my-3 border-border" />
              <Link href="/cart" className="flex items-center gap-2 px-2 py-2 text-sm font-medium hover:text-accent">
                <ShoppingCart className="w-5 h-5" /> Cart ({itemCount})
              </Link>
              <Link href="/admin/login" className="flex items-center gap-2 px-2 py-2 text-sm font-medium hover:text-accent">
                <User className="w-5 h-5" /> Admin Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 animate-fade-in lg:hidden" onClick={() => setSearchOpen(false)} />
      )}

      <div
        className={`fixed inset-0 z-[100] lg:hidden ${searchOpen ? 'block' : 'hidden'}`}
        onClick={() => setSearchOpen(false)}
      >
        <div className="absolute top-20 left-4 right-4 lg:left-auto lg:right-4 lg:w-96 lg:top-24 animate-scale-in bg-white border border-border rounded-xl shadow-xl p-4" onClick={(e) => e.stopPropagation()}>
          <form action="/products" className="flex gap-2">
            <label htmlFor="mobile-search" className="visually-hidden">Search products</label>
            <input
              ref={searchRef}
              id="mobile-search"
              type="search"
              name="search"
              placeholder="Search products..."
              className="flex-1 input-field"
              autoFocus
            />
            <button type="submit" className="btn-primary">Search</button>
          </form>
          <p className="mt-3 text-sm text-muted-foreground text-center">Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[11px] font-mono">Esc</kbd> to close</p>
        </div>
      </div>
    </header>
  );
}
