// src/react-app/hooks/useLanguage.ts

import { useLocation } from 'react-router-dom';

export function useLanguage() {
  const location = useLocation();
  
  // This is the updated logic.
  // It checks if the path starts with '/ar/' OR if it is exactly '/ar'.
  // This correctly handles '/ar' and '/ar/tool' while ignoring '/artigenv2'.
  const isArabic = location.pathname.startsWith('/ar/') || location.pathname === '/ar';

  // We are explicitly telling TypeScript that 'lang' can ONLY be 'en' or 'ar'.
  // This resolves all the TS7053 errors across the application.
  const lang: 'en' | 'ar' = isArabic ? 'ar' : 'en';

  return { lang, isArabic };
}
