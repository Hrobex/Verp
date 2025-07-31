// src/react-app/hooks/useLanguage.ts

import { useLocation } from 'react-router-dom';

export function useLanguage() {
  const location = useLocation();
  const isArabic = location.pathname.startsWith('/ar');
  const lang = isArabic ? 'ar' : 'en';

  return { lang, isArabic };
}
