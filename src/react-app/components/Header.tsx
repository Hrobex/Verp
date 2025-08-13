import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import SmartLink from './SmartLink';
import { useLocation } from 'react-router-dom';
import { UaeFlag } from './UaeFlag'; // <-- Import UAE Flag
import { UsaFlag } from './UsaFlag'; // <-- Import USA Flag

const translations = {
  logoAlt: { en: 'AI Convert Logo', ar: 'شعار AI Convert' },
  aiTools: { en: 'AI Tools', ar: 'أدوات الذكاء الاصطناعي' },
  allAiTools: { en: 'All AI Tools', ar: 'كل أدوات الذكاء الاصطناعي' },
  features: { en: 'Features', ar: 'المميزات' },
  about: { en: 'About', ar: 'حولنا' },
  getStarted: { en: 'Get Started Free', ar: 'ابدأ مجانًا' },
  langSwitcher: { en: 'العربية', ar: 'English' },
  brandName: { en: 'AI Convert', ar: 'AI Convert' },
};

const allTools = [
  { id: 'artigenv2', name: { en: 'AI Art Generator', ar: 'مولد الفن' } },
  { id: 'generate-image-pro', name: { en: 'AI Image Generator', ar: 'مولد الصور' } },
  { id: 'anime-ai', name: { en: 'AI Anime Generator', ar: 'مولد صور الأنمي' } },
  { id: 'image-to-sketch', name: { en: 'Photo to Sketch', ar: 'تحويل الصور لاسكتش' } },
  { id: 'line-drawing', name: { en: 'Photo to Line Drawing', ar: 'تحويل الصور لرسم' } },
  { id: 'ai-video-prompt-generator', name: { en: 'AI Video Prompt Generator', ar: 'مولد وصف الفيديو' } },
  { id: 'prompt-generator', name: { en: 'Image to Prompt Generator', ar: 'مولد الأوصاف من الصور' } },
  { id: 'remove-background', name: { en: 'Background Remover', ar: 'إزالة الخلفية' } },
  { id: 'text-to-speech', name: { en: 'Text to Speech', ar: 'تحويل النص إلى صوت' } },
  { id: 'ai-face-merge', name: { en: 'AI Face Swap', ar: 'تبديل ودمج الوجوه' } },
  { id: 'llama-4', name: { en: 'Llama-4 AI Chat', ar: 'شات Llama-4' } },
  { id: 'cartoonify', name: { en: 'Cartoonify Yourself', ar: 'حوّل صورتك لكرتون' } },
  { id: 'cartoony-art', name: { en: 'Photo to Digital Art', ar: 'تحويل الصور لفن رقمي' } },
  { id: 'ai-story-generator', name: { en: 'AI Story Generator', ar: 'مولد القصص' } },
  { id: 'ai-photo-colorizer', name: { en: 'AI Photo Colorizer', ar: 'تلوين الصور' } },
  { id: 'ai-image-enhancer', name: { en: 'AI Image Enhancer', ar: 'تحسين جودة الصور' } },
  { id: 'restore-and-repair-old-photos', name: { en: 'Photo Restoration', ar: 'ترميم الصور القديمة' } },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { lang, isArabic } = useLanguage();
  const location = useLocation();

  const languageSwitcherPath = isArabic ? '/' : '/ar';
  const homeLink = isArabic ? '/ar' : '/';

  const navLinks = [
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

  const linkPathPrefix = isArabic ? '/ar/' : '/';
  
  const LanguageSwitcher = () => (
    <SmartLink href={languageSwitcherPath} className={`flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}>
      {isArabic ? (
        <UsaFlag className="h-5 w-5 rounded-full object-cover" />
      ) : (
        <UaeFlag className="h-5 w-5 rounded-full object-cover" />
      )}
      <span>{translations.langSwitcher[lang]}</span>
    </SmartLink>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50">
        <div className={`mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <SmartLink href={homeLink} className={`flex items-center ${isArabic ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <img src="/favicon.svg" alt={translations.logoAlt[lang]} className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {translations.brandName[lang]}
            </span>
          </SmartLink>

          <nav className={`hidden lg:flex items-center ${isArabic ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
            <div className="group relative">
              <button className={`flex items-center gap-1 text-gray-700 hover:text-purple-600 transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span>{translations.aiTools[lang]}</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className={`absolute top-full pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible ${isArabic ? 'left-0' : '-left-1/2'}`}>
                <div className={`bg-white rounded-lg shadow-xl border border-gray-100 p-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                  <SmartLink
                    href={`${homeLink}#tools`}
                    onClick={(e) => handleSmartScroll(e, 'tools')}
                    className="block px-3 py-2 font-semibold text-gray-800 hover:bg-gray-50 hover:text-purple-600 transition-colors rounded-md"
                  >
                    {translations.allAiTools[lang]}
                  </SmartLink>
                  <hr className="my-2" />
                  <div className="grid grid-cols-2 gap-x-4">
                    {allTools.map(tool => (
                        <SmartLink
                            key={tool.id}
                            href={`${linkPathPrefix}${tool.id}`}
                            className="block px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-purple-600 transition-colors rounded-md"
                        >
                            {tool.name[lang]}
                        </SmartLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {navLinks.map((link) => (
              <SmartLink key={link.name} href={link.href} className="text-gray-700 hover:text-purple-600 transition-colors">
                {link.name === 'About' ? translations.about[lang] : link.name}
              </SmartLink>
            ))}
          </nav>
          
          <div className={`hidden lg:flex items-center ${isArabic ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <LanguageSwitcher />
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
          
          <div className={`fixed top-0 bottom-0 w-full max-w-xs bg-white shadow-xl flex flex-col ${isArabic ? 'left-0' : 'right-0'}`}>
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
            
            <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${isArabic ? 'text-right' : ''}`}>
                <SmartLink
                    href={`${homeLink}#tools`}
                    className="block text-gray-700 hover:text-purple-600 transition-colors py-2 text-lg font-bold"
                    onClick={(e) => { handleSmartScroll(e, 'tools'); setIsMenuOpen(false); }}
                >
                    {translations.aiTools[lang]}
                </SmartLink>
                <div className={`${isArabic ? 'pr-4 border-r-2' : 'pl-4 border-l-2'} border-gray-200 space-y-2`}>
                    {allTools.map(tool => (
                        <SmartLink
                            key={tool.id}
                            href={`${linkPathPrefix}${tool.id}`}
                            className="block text-sm text-gray-600 hover:text-purple-600 transition-colors py-1.5"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {tool.name[lang]}
                        </SmartLink>
                    ))}
                </div>

              {navLinks.map((link) => (
                  <SmartLink 
                    key={link.name} 
                    href={link.href} 
                    className="block text-gray-700 hover:text-purple-600 transition-colors py-2 text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name === 'About' ? translations.about[lang] : link.name}
                  </SmartLink>
              ))}
              <hr className="border-gray-200" />
              <div className="py-2" onClick={() => setIsMenuOpen(false)}>
                  <LanguageSwitcher />
              </div>
              <SmartLink 
                href={getStartedLink} 
                className="block w-full text-center mt-4 px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                onClick={(e) => { handleSmartScroll(e, 'tools'); setIsMenuOpen(false); }}
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
