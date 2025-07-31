// src/react-app/components/Header.tsx

import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';

// Define translations for the component
const translations = {
  aiTools: {
    en: 'AI Tools',
    ar: 'أدوات الذكاء الاصطناعي',
  },
  features: {
    en: 'Features',
    ar: 'المميزات',
  },
  about: {
    en: 'About',
    ar: 'حولنا',
  },
  getStarted: {
    en: 'Get Started Free',
    ar: 'ابدأ مجانًا',
  },
  langSwitcher: {
    en: 'العربية',
    ar: 'English',
  },
  brandName: {
    en: 'AI Convert',
    ar: 'محول AI',
  }
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // --- Language Detection Logic ---
  const isArabic = location.pathname.startsWith('/ar');
  const lang = isArabic ? 'ar' : 'en';

  // --- Language Switcher URL Logic ---
  const currentPath = location.pathname;
  let languageSwitcherPath: string;

  if (isArabic) {
    // From Arabic to English
    // if path is '/ar', target is '/', otherwise remove '/ar' prefix
    languageSwitcherPath = currentPath === '/ar' ? '/' : currentPath.substring(3);
  } else {
    // From English to Arabic
    // if path is '/', target is '/ar', otherwise prepend '/ar'
    languageSwitcherPath = currentPath === '/' ? '/ar' : `/ar${currentPath}`;
  }


  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50">
      <div className={`mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
        {/* Logo */}
        <div className={`flex items-center ${isArabic ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {translations.brandName[lang]}
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className={`hidden lg:flex items-center ${isArabic ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
          <a href="#tools" className="text-gray-700 hover:text-purple-600 transition-colors">
            {translations.aiTools[lang]}
          </a>
          <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
            {translations.features[lang]}
          </a>
          <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors">
            {translations.about[lang]}
          </a>
        </nav>

        {/* CTA Button & Language Switcher */}
        <div className={`hidden lg:flex items-center ${isArabic ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
          <Link to={languageSwitcherPath} className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
            {translations.langSwitcher[lang]}
          </Link>
          <button className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            {translations.getStarted[lang]}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className={`px-6 py-4 space-y-4 ${isArabic ? 'text-right' : 'text-left'}`}>
            <a href="#tools" className="block text-gray-700 hover:text-purple-600 transition-colors">
              {translations.aiTools[lang]}
            </a>
            <a href="#features" className="block text-gray-700 hover:text-purple-600 transition-colors">
              {translations.features[lang]}
            </a>
            <a href="#about" className="block text-gray-700 hover:text-purple-600 transition-colors">
              {translations.about[lang]}
            </a>
            <hr />
            <Link to={languageSwitcherPath} className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">
              {translations.langSwitcher[lang]}
            </Link>
            <button className="w-full px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
              {translations.getStarted[lang]}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
