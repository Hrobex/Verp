'use client';

import React from 'react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { ArrowLeft } from 'lucide-react';

const translations = {
  pageTitle: { en: 'Subscription Confirmed', ar: 'تم تأكيد الاشتراك' },
  mainHeading: { en: 'Thank you for subscribing!', ar: 'شكرًا لانضمامك!' },
  subHeading: { en: "We'll keep you updated with our latest tools and innovations.", ar: 'سنبقيك على اطلاع دائم بآخر أدواتنا وابتكاراتنا.' },
  buttonText: { en: 'Go back to previous page', ar: 'العودة للصفحة السابقة' }
};

export default function ThankYouPage() {
  const { lang, isArabic } = useLanguage();

  React.useEffect(() => {
    document.title = translations.pageTitle[lang];
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      if (document.head.contains(meta)) {
        document.head.removeChild(meta);
      }
    };
  }, [lang]);


  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-6">
      <main className="text-center max-w-2xl">
        
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 animate-fade-in-down">
          {translations.mainHeading[lang]}
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-10 animate-fade-in-up">
          {translations.subHeading[lang]}
        </p>

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-8 py-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          <ArrowLeft className={`h-6 w-6 ${isArabic ? 'ml-3' : 'mr-3'}`} />
          <span className="text-lg font-semibold">{translations.buttonText[lang]}</span>
        </button>
      </main>
    </div>
  );
}
