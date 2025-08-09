import { useLanguage } from '@/react-app/hooks/useLanguage';
import { Facebook, Github, Mail, Heart } from 'lucide-react'; 
import SmartLink from './SmartLink';

const HuggingFaceIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21.5 8.5c.3-1.6-1.6-3-3.3-2.2" />
    <path d="M2.5 8.5c-.3-1.6 1.6-3 3.3-2.2" />
    <path d="M12 12a3.5 3.5 0 0 0-7 0" />
    <path d="M19 12a3.5 3.5 0 0 1-7 0" />
    <path d="M12 18.5a2.5 2.5 0 0 1-5 0" />
    <path d="M17 18.5a2.5 2.5 0 0 0-5 0" />
  </svg>
);


const translations = {
    logoAlt: { en: 'AI Convert Logo', ar: 'شعار AI Convert' },
    brandName: { en: 'AI Convert', ar: 'AI Convert' },
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
    copyright: { en: '© 2025 AI Convert. All rights reserved.', ar: '© 2025 AI Convert. جميع الحقوق محفوظة.' },
    madeWith: { en: 'Made with', ar: 'صُنع بـ' },
    forCreators: { en: 'for creators everywhere', ar: 'للمبدعين في كل مكان' },
    socials: {
        facebook: { en: 'Visit our Facebook page', ar: 'تفضل بزيارة صفحتنا على Facebook' },
        github: { en: 'Explore our GitHub repository', ar: 'تصفح مستودعاتنا على GitHub' },
        huggingface: { en: 'Check out our Hugging Face profile', ar: 'اطلع على ملفنا الشخصي في Hugging Face' },
        email: { en: 'Send us an email', ar: 'أرسل لنا بريدًا إلكترونيًا' }
    }
};

const footerTranslations = {
  en: {
    Product: [
      { name: 'AI Tools', href: '/#tools' },
      { name: 'Features', href: '/#features' },
    ],
    Company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' }, 
      { name: 'Contact', href: 'mailto:info@aiconvert.online' },
    ],
    Legal: [
      { name: 'Privacy', href: '/privacy-policy' },
      { name: 'Terms', href: '/terms-of-service' },
    ],
  },
  ar: {
    المنتجات: [
      { name: 'أدوات AI', href: '/ar#tools' },
      { name: 'المميزات', href: '/ar#features' },
    ],
    الشركة: [
      { name: 'حولنا', href: '/ar/about' },
      { name: 'المدونة', href: '/ar/blog' },
      { name: 'تواصل', href: 'mailto:info@aiconvert.online' },
    ],
    قانوني: [
      { name: 'الخصوصية', href: '/ar/privacy-policy' },
      { name: 'الشروط', href: '/ar/terms-of-service' },
    ],
  },
};

export default function Footer() {
  const { lang, isArabic } = useLanguage();
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
            
            <div className={`flex ${isArabic ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <a 
                href="https://www.facebook.com/aiconvert" 
                aria-label={translations.socials.facebook[lang]}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/Aiconvert/aiconvert" 
                aria-label={translations.socials.github[lang]}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://huggingface.co/Aiconvert" 
                aria-label={translations.socials.huggingface[lang]}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <HuggingFaceIcon className="h-5 w-5" />
              </a>
              <a 
                href="mailto:info@aiconvert.online" 
                aria-label={translations.socials.email[lang]}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(currentLinks).map(([category, links]) => (
            <div key={category} className={isArabic ? 'text-right' : 'text-left'}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <SmartLink
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className={`lg:flex lg:items-center lg:justify-between ${isArabic ? 'lg:flex-row-reverse' : ''}`}>
            <div className={`mb-6 lg:mb-0 ${isArabic ? 'text-right' : 'text-left'}`}>
              <h3 className="text-xl font-semibold mb-2">{translations.newsletterTitle[lang]}</h3>
              <p className="text-gray-400">
                {translations.newsletterText[lang]}
              </p>
            </div>
            
            <form 
              method="POST" 
              action="https://29bd575d.sibforms.com/serve/MUIFAGmVZ_WK9i_7gek2AEwcoanp0Tjy3zZLWVhjRecctryIaHaHbK-nwziqsPUSCUlpSnMsbjCWuLhqh8S_gJDhPlf4HQpZ-RlSjFAx46gCQSlTfpxCMSNgvaMbz_CHOT5VUOXWjuyBoa8DBHsdw7-_yIviyKOsU4jTVG-3RA9YiNefWv8UC9KH-O1QA64UHCgqWv96of1k5EsA"
              target="_blank"
            >
              <div className={`flex flex-col sm:flex-row space-y-3 sm:space-y-0 ${isArabic ? 'sm:flex-row-reverse sm:space-x-reverse sm:space-x-3' : 'sm:space-x-3'}`}>
                <input
                  type="email" 
                  name="EMAIL" 
                  placeholder={translations.emailPlaceholder[lang]}
                  className={`w-full sm:w-auto px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 ${isArabic ? 'text-right' : 'text-left'}`}
                  required
                />
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {translations.subscribe[lang]}
                </button>
              </div>
              <input type="hidden" name="locale" value="en" />
              <input type="hidden" name="html_type" value="simple" />
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
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
