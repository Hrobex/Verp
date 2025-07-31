// src/react-app/hooks/useLanguage.ts

import { useLocation } from 'react-router-dom';

export function useLanguage() {
  const location = useLocation();
  const isArabic = location.pathname.startsWith('/ar');

  // --- THE FIX IS HERE ---
  // We are explicitly telling TypeScript that 'lang' can ONLY be 'en' or 'ar'.
  // This resolves all the TS7053 errors across the application.
  const lang: 'en' | 'ar' = isArabic ? 'ar' : 'en';

  return { lang, isArabic };
}
