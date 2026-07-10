'use client';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '919999999999';

export default function WhatsAppButton() {
  const message = encodeURIComponent('Hello KAAEXIM PRODUCTS PRIVATE LIMITED, I am interested in your products. Please share more details.');
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
