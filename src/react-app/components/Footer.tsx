// src/react-app/components/Footer.tsx

import { useLocation } from 'react-router-dom';
import { Twitter, Github, Mail, Heart } from 'lucide-react'; // Removed Sparkles

// Main translations for static text
const translations = {
  logoAlt: { en: 'AI Convert Logo', ar: 'شعار محول AI' },
  brandName: { en: 'AI Convert', ar: 'محول AI' },
  description: {
    en: 'Unleash your creative potential with our suite of AI-powered tools. Create, enhance, and transform your content like never before.',
    ar: 'أطلق العنان لإمكانياتك الإبداعية مع مجموعتنا من الأدوات المدعومة بالذكاء الاصطناعي. أنشئ المحتوى الخاص بك وحسّنه وحوّله كما لم يحدث من قبل.',
  },
  newsletterTitle: { en: 'Stay in the loop', ar: 'ابق على اطلاع' },
  newsletterText: {
    en: 'Get the latest updates on new features and AI innovations.',
    ar: 'احصل على آخر التحديثات حول الميزات الجديدة وابتكارات الذكاء الاصطناعي.',
  },
  emailPlaceholder: { en: 'Enter your email', ar: 'أدخل بريدك الإلكتروني' },
  subscribe: { en: 'Subscribe', ar: 'اشترك' },
  copyright: { en: '© 2025 AI Convert. All rights reserved.', ar: '© 2025 محول AI. جميع الحقوق محفوظة.' },
  madeWith: { en: 'Made with', ar: 'صُنع بـ' },
  forCreators: { en: 'for creators everywhere', ar: 'للمبدعين في كل مكان' },
};

// Structured translations for footer links
const footerTranslations = {
  en: {
    Product: [
      { name: 'AI Tools', href: '#tools' },
      { name: 'Features', href: '#features' },
    ],
    Company: [
      { name: 'About', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Contact', href: 'mailto:info@aiconvert.online' },
    ],
    Legal: [
      { name: 'Privacy', href: '/privacy-policy' },
      { name: 'Terms', href: '/terms-of-service' },
    ],
  },
  ar: {
    المنتجات: [
      { name: 'أدوات AI', href: '#tools' },
      { name: 'المميزات', href: '#features' },
    ],
    الشركة: [
      { name: 'حولنا', href: '#about' },
      { name: 'المدونة', href: '#blog' },
      { name: 'تواصل', href: 'mailto:info@aiconvert.online' },
    ],
    قانوني: [
      { name: 'الخصوصية', href: '/ar/privacy-policy' },
      { name: 'الشروط', href: '/ar/terms-of-service' },
    ],
  },
};

export default function Footer() {
  const location = useLocation();
  const isArabic = location.pathname.startsWith('/ar');
  const lang = isArabic ? 'ar' : 'en';
  const currentLinks = footerTranslations[lang];

  return (
    <footer className="bg-gray-900 text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className={`flex items-center mb-6 ${isArabic ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              <img 
                src="/favicon.svg" 
                alt={translations.logoAlt[lang]}
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {translations.brandName[lang]}
              </span>
            </div>
            
            <p className={`text-gray-400 mb-6 leading-relaxed ${isArabic ? 'text-right' : 'text-left'}`}>
              {translations.description[lang]}
            </p>
            
            {/* Social Links */}
            <div className={`flex ${isArabic ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:info@aiconvert.online" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Links (The rest of the component remains the same) */}
          {Object.entries(currentLinks).map(([category, links]) => (
            <div key={category} className={isArabic ? 'text-right' : 'text-left'}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter and Bottom Bar (The rest of the component remains the same) */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className={`lg:flex lg:items-center lg:justify-between ${isArabic ? 'lg:flex-row-reverse' : ''}`}>
            <div className={`mb-6 lg:mb-0 ${isArabic ? 'text-right' : 'text-left'}`}>
              <h3 className="text-xl font-semibold mb-2">{translations.newsletterTitle[lang]}</h3>
              <p className="text-gray-400">
                {translations.newsletterText[lang]}
              </p>
            </div>
            <div className={`flex flex-col sm:flex-row space-y-3 sm:space-y-0 ${isArabic ? 'sm:flex-row-reverse sm:space-x-reverse sm:space-x-3' : 'sm:space-x-3'}`}>
              <input
                type="email"
                placeholder={translations.emailPlaceholder[lang]}
                className={`w-full sm:w-auto px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 ${isArabic ? 'text-right' : 'text-left'}`}
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                {translations.subscribe[lang]}
              </button>
            </div>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t border-gray-800 flex flex-col items-center lg:flex-row lg:justify-between space-y-4 lg:space-y-0 ${isArabic ? 'lg:flex-row-reverse' : ''}`}>
          <div className="text-gray-400 text-sm">
            {translations.copyright[lang]}
          </div>
          <div className={`flex items-center text-gray-400 text-sm ${isArabic ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
            <span>{translations.madeWith[lang]}</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>{translations.forCreators[lang]}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
