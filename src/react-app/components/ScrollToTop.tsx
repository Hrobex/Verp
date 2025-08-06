// الملف: ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  // نحن الآن نراقب كلاً من مسار الصفحة (pathname) والقسم (hash)
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // الحالة الأولى: إذا كان هناك هاش في الرابط (مثل #tools)
    if (hash) {
      const id = hash.replace('#', ''); // نزيل علامة # لنحصل على الـ ID
      
      // ننتظر لحظة قصيرة (100ms) لضمان أن مكونات الصفحة الجديدة قد تم عرضها
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          // نقوم بالتمرير بسلاسة إلى العنصر المطلوب
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // الحالة الثانية: إذا لم يكن هناك هاش، نقوم بالسلوك الافتراضي (الصعود للأعلى)
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]); // نجعل هذا التأثير يعمل عند تغيير المسار أو الهاش

  return null; // هذا المكون لا يعرض أي شيء
}

export default ScrollToTop;
