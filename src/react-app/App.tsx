// src/react-app/App.tsx

import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { useLanguage } from './hooks/useLanguage'; // 1. استيراد المُخَطَّط

function App() {
  // 2. استخدام المُخَطَّط لمعرفة اللغة الحالية
  const { isArabic } = useLanguage();

  return (
    // 3. تطبيق اتجاه اللغة على الغلاف الرئيسي للتطبيق بالكامل
    // هذا هو "القالب" الذي سيحتوي على كل شيء
    <div dir={isArabic ? 'rtl' : 'ltr'}>
      <Header />
      <main> 
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
