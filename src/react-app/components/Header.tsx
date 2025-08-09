import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import SmartLink from './SmartLink';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();

  const languageSwitcherPath = isArabic ? '/' : '/ar';
  const homeLink = isArabic ? '/ar' : '/';

  const navLinks = [
    { name: translations.aiTools[lang], href: `${homeLink}#tools` },
    { name: translations.features[lang], href: `${homeLink}#features` },
    { name: 'About', href: isArabic ? '/ar/about' : '/about' }
  ];
  
  const getStartedLink = `${homeLink}#tools`;

  const handleSmartScroll = (event: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    const targetPath = isArabic ? '/ar' : '/';
    if (location.pathname === targetPath) {
      event.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        if (window.history.pushState) {
          window.history.pushState(null, '', `#${targetId}`);
        } else {
          window.location.hash = targetId;
        }
      }
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50">
        <div className={`mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
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
            {navLinks.map((link) => {
              const targetId = link.href.includes('#') ? link.href.split('#')[1] : null;
              return (
                <SmartLink 
                  key={link.name} 
                  href={link.href} 
                  onClick={targetId ? (e) => handleSmartScroll(e, targetId) : undefined}
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                >
                  {link.name === 'About' ? translations.about[lang] : link.name}
                </SmartLink>
              );
            })}
          </nav>
          
          <div className={`hidden lg:flex items-center ${isArabic ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <SmartLink href={languageSwitcherPath} className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
              {translations.langSwitcher[lang]}
            </SmartLink>
            <SmartLink 
              href={getStartedLink} 
              onClick={(e) => handleSmartScroll(e, 'tools')}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {translations.getStarted[lang]}
            </SmartLink>
          </div>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          ></div>
          
          <div 
            className={`fixed top-0 bottom-0 w-full max-w-xs bg-white shadow-xl ${isArabic ? 'left-0' : 'right-0'}`}
          >
            <div className={`flex items-center justify-between p-6 border-b ${isArabic ? 'flex-row-reverse' : ''}`}>
              <SmartLink href={homeLink} onClick={() => setIsMenuOpen(false)}>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {translations.brandName[lang]}
                </span>
              </SmartLink>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className={`p-6 space-y-4 ${isArabic ? 'text-right' : 'text-left'}`}>
              {navLinks.map((link) => {
                const targetId = link.href.includes('#') ? link.href.split('#')[1] : null;
                return (
                  <SmartLink 
                    key={link.name} 
                    href={link.href} 
                    className="block text-gray-700 hover:text-purple-600 transition-colors py-2 text-lg"
                    onClick={(e) => { 
                      if (targetId) handleSmartScroll(e, targetId);
                      setIsMenuOpen(false); 
                    }}
                  >
                    {link.name === 'About' ? translations.about[lang] : link.name}
                  </SmartLink>
                );
              })}
              <hr className="border-gray-200" />
              <SmartLink 
                href={languageSwitcherPath} 
                className="block text-gray-700 hover:text-purple-600 transition-colors font-medium py-2 text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {translations.langSwitcher[lang]}
              </SmartLink>
              <SmartLink 
                href={getStartedLink} 
                className="block w-full text-center mt-4 px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                onClick={(e) => { 
                  handleSmartScroll(e, 'tools'); 
                  setIsMenuOpen(false); 
                }}
              >
                {translations.getStarted[lang]}
              </SmartLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
