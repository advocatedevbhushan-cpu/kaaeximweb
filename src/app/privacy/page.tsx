import type { Metadata } from 'next';
import { Shield, FileText, Cookie, Share2, Database, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'KAAEXIM PRODUCTS PRIVATE LIMITED privacy policy — how we collect, use, and protect your personal information.',
};

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      'We collect personal information that you voluntarily provide when using our platform, including but not limited to your name, email address, phone number, shipping address, payment details, and business information such as GST number and business name.',
      'We also collect non-personal information automatically, such as your IP address, browser type, device information, and browsing behaviour on our website to improve your experience.',
    ],
  },
  {
    icon: FileText,
    title: 'Use of Information',
    content: [
      'The information we collect is used to process your orders, communicate with you regarding your purchases, provide customer support, improve our products and services, and comply with legal obligations.',
      'We may use your contact information to send order updates, promotional offers (with your consent), and respond to inquiries or complaints.',
      'Your data will not be used for purposes other than those for which it was collected without obtaining your prior consent.',
    ],
  },
  {
    icon: Shield,
    title: 'Data Protection and Security',
    content: [
      'We implement appropriate technical and organisational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.',
      'All payment transactions are processed securely. We do not store complete payment card information on our servers.',
      'Access to your personal data is restricted to authorised personnel only, and we regularly review our security practices.',
    ],
  },
  {
    icon: Cookie,
    title: 'Cookies',
    content: [
      'Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyse site traffic, and understand where our visitors come from.',
      'You can control cookie preferences through your browser settings. Please note that disabling cookies may affect the functionality of certain features on our website.',
      'We do not use cookies to collect personally identifiable information without your explicit consent.',
    ],
  },
  {
    icon: Share2,
    title: 'Third-Party Services',
    content: [
      'We may share your information with trusted third-party service providers who assist us in operating our website, processing payments, delivering orders, and conducting business operations.',
      'These third parties are contractually obligated to keep your information confidential and use it only for the purposes we specify.',
      'We do not sell, trade, or rent your personal information to third parties for their marketing purposes.',
    ],
  },
  {
    icon: Mail,
    title: 'Contact Us',
    content: [
      'If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:',
      'Email: info@kaaexim.com',
      'Phone: +91 9999999999',
      'Address: Ayodhya, Uttar Pradesh, India',
      'You have the right to request access to, correction of, or deletion of your personal data held by us.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary via-primary-light to-primary py-16 md:py-20">
        <div className="container-main">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-gray-300 text-lg">
              How we collect, use, and protect your personal information.
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
                At KAAEXIM PRODUCTS PRIVATE LIMITED, we take your privacy seriously. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you visit our
                website and use our services. By using our platform, you consent to the practices described
                in this policy.
              </p>
            </div>

            <div className="space-y-8">
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
