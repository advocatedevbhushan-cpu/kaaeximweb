import Link from 'next/link';
import { Package, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-6 h-6 text-accent" />
              <span className="font-bold text-lg">KAAEXIM</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              KAAEXIM PRODUCTS PRIVATE LIMITED offers a streamlined product ordering platform for retail and bulk customers across selected delivery locations.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-accent">Policies</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link href="/bulk-order-policy" className="hover:text-white transition-colors">Bulk Order Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-accent">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Ayodhya, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>Contact Sales</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>info@kaaexim.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} KAAEXIM PRODUCTS PRIVATE LIMITED. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
