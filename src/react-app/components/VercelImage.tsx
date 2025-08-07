// src/react-app/components/VercelImage.tsx

interface VercelImageProps {
  src: string;        // مسار الصورة، مثل /images/my-photo.jpg
  alt: string;        // النص البديل الهام لتحسين محركات البحث
  className?: string; // أي تنسيقات CSS إضافية
}

export default function VercelImage({ src, alt, className }: VercelImageProps) {
  // قائمة بأحجام العرض التي سيقوم Vercel بإنشاء نسخ منها لكل صورة
  const widths = [400, 640, 828, 1080, 1200];

  // هذا السطر يقوم بإنشاء السمة "srcset" تلقائيًا.
  // المتصفح سيختار تلقائيًا الصورة بالحجم المناسب من هذه القائمة بناءً على حجم الشاشة.
  const srcset = widths
    .map(width => `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=75 ${width}w`)
    .join(', ');

  return (
    <img
      // المسار الافتراضي للصورة (للمتصفحات القديمة)
      src={`/_vercel/image?url=${encodeURIComponent(src)}&w=${widths[widths.length - 1]}&q=75`}
      // قائمة الصور متعددة الأحجام للمتصفحات الحديثة
      srcSet={srcset}
      // هذه السمة هامة جداً لـ PageSpeed وتخبر المتصفح بالحجم الذي ستشغله الصورة على الشاشة
      sizes="(max-width: 1024px) 90vw, 45vw"
      alt={alt}
      className={className}
      // تحميل الصور فقط عندما يقترب المستخدم من رؤيتها (أهم خاصية للأداء)
      loading="lazy"
      // فك تشفير الصورة بشكل غير متزامن لتجنب إبطاء عرض باقي الصفحة
      decoding="async"
    />
  );
}
