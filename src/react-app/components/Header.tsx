// الملف: src/react-app/components/Header.tsx

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import SmartLink from './SmartLink';

const translations = {
  logoAlt: { en: 'AI Convert Logo', ar: 'شعار AI Convert' },
  aiTools: { en: 'AI Tools', ar: 'أدوات الذكاء الاصطناعي' },
  features: { en: 'Features', ar: 'المميزات' },
  about: { en: 'About', ar: 'حولنا' },
  getStarted: { en: 'Get Started Free', ar: 'ابدأ مجانًا' },
  langSwitcher: { en: 'العربية', ar: 'English' },
  brandName: { en: 'AI Convert', ar: 'AI Convert' }
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { lang, isArabic } = useLanguage();

  const languageSwitcherPath = isArabic ? '/' : '/ar';
  const homeLink = isArabic ? '/ar' : '/';

  const navLinks = [
    { name: translations.aiTools[lang], href: `${homeLink}#tools` },
    { name: translations.features[lang], href: `${homeLink}#features` },
    { name: 'About', href: isArabic ? '/ar/about' : '/about' }
  ];
  
  const getStartedLink = `${homeLink}#tools`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50">
      <div className={`mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
        {/* --- تم تصحيح `to` إلى `href` هنا --- */}
        <SmartLink href={homeLink} className={`flex items-center ${isArabic ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
          <img 
            src="/favicon.svg" 
            alt={translations.logoAlt[lang]} 
            className="h-8 w-8 object-contain"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {translations.brandName[lang]}
          </span>
        </SmartLink>

        <nav className={`hidden lg:flex items-center ${isArabic ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
          {navLinks.map((link) => (
            <SmartLink key={link.name} href={link.href} className="text-gray-700 hover:text-purple-600 transition-colors">
              {link.name === 'About' ? translations.about[lang] : link.name}
            </SmartLink>
          ))}
        </nav>
        
        <div className={`hidden lg:flex items-center ${isArabic ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
          {/* --- تم تصحيح `to` إلى `href` هنا --- */}
          <SmartLink href={languageSwitcherPath} className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
            {translations.langSwitcher[lang]}
          </SmartLink>
          <SmartLink href={getStartedLink} className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            {translations.getStarted[lang]}
          </SmartLink>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className={`px-6 py-4 space-y-4 ${isArabic ? 'text-right' : 'text-left'}`}>
            {navLinks.map((link) => (
              <SmartLink key={link.name} href={link.href} className="block text-gray-700 hover:text-purple-600 transition-colors">
                {link.name === 'About' ? translations.about[lang] : link.name}
              </SmartLink>
            ))}
            <hr />
            {/* --- تم تصحيح `to` إلى `href` هنا --- */}
            <SmartLink href={languageSwitcherPath} className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">
              {translations.langSwitcher[lang]}
            </SmartLink>
            <SmartLink href={getStartedLink} className="block w-full text-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
              {translations.getStarted[lang]}
            </SmartLink>
          </div>
        </div>
      )}
    </header>
  );
}
