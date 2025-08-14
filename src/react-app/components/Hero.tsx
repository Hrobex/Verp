import { Sparkles, ChevronsDown } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';

const translations = {
  badge: {
    en: 'AI-Powered Creative Suite',
    ar: 'مجموعة إبداعية مدعومة بالذكاء الاصطناعي',
  },
  headline1: { en: 'Unleash Your', ar: 'أطلق العنان' },
  headlineHighlight: { en: 'Creative Potential', ar: 'لإمكانياتك الإبداعية' },
  headline2: { en: 'with AI Magic', ar: 'بسحر الذكاء الاصطناعي' },
  signature: { en: 'by AI Convert', ar: 'بواسطة AI Convert' },
  subheadline: {
    en: 'Transform your creative workflow with our suite of cutting-edge AI tools. Generate stunning images, remove backgrounds instantly, convert text to speech, and enhance photos like never before.',
    ar: 'حوّل سير عملك الإبداعي مع مجموعتنا من أدوات الذكاء الاصطناعي المتطورة. أنشئ صورًا مذهلة، وأزل الخلفيات فورًا، وحوّل النصوص إلى كلام، وحسّن الصور كما لم يحدث من قبل.',
  },
  ctaPrimary: { en: 'Start Creating Free', ar: 'ابدأ الإنشاء مجانًا' },
  stat1: { en: 'Images Generated', ar: 'صورة تم توليدها' },
  stat2: { en: 'Happy Creators', ar: 'مُبدع سعيد' },
  stat3: { en: 'Uptime', ar: 'وقت التشغيل' },
  stat4: { en: 'AI Processing', ar: 'معالجة بالذكاء الاصطناعي' },
};

export default function Hero() {
  const { lang, isArabic } = useLanguage();

  return (
    <section 
      dir={isArabic ? 'rtl' : 'ltr'} 
      className="relative min-h-screen pt-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center">
          {/* Badge */}
          <div className={`inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-purple-200 shadow-lg ${isArabic ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">{translations.badge[lang]}</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight">
            {translations.headline1[lang]}{' '}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {translations.headlineHighlight[lang]}
            </span>
            <br />
            {translations.headline2[lang]}
          </h1>

          {/* Signature */}
          <p className="text-lg lg:text-xl text-gray-500 font-serif italic mb-8">
            {translations.signature[lang]}
          </p>

          {/* Subheadline */}
          <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            {translations.subheadline[lang]}
          </p>
          
          {/* CTA Button */}
          <div className="flex justify-center mb-16">
            <a 
              href="#tools"
              className={`group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 ${isArabic ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
            >
              <span>{translations.ctaPrimary[lang]}</span>
              <ChevronsDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">1M+</div>
              <div className="text-gray-600">{translations.stat1[lang]}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">200K+</div>
              <div className="text-gray-600">{translations.stat2[lang]}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">99.9%</div>
              <div className="text-gray-600">{translations.stat3[lang]}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">{translations.stat4[lang]}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
            }
