// src/react-app/components/VercelImage.tsx

interface VercelImageProps {
  src: string;
  alt: string;
  className?: string;
}

// هذا المتغير يساعدنا على معرفة ما إذا كنا في بيئة التطوير المحلية أم لا
const isDevelopment = import.meta.env.DEV;

export default function VercelImage({ src, alt, className }: VercelImageProps) {
  // إذا كنا نختبر الموقع محليًا
  if (isDevelopment) {
    // اعرض الصورة مباشرة بدون تحسين (لحل مشكلة الصور المكسورة محليًا)
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
      />
    );
  }

  // أما إذا كان الموقع على Vercel للزوار
  // فاستخدم كود Vercel لتحسين الصور
  const widths = [400, 640, 828, 1080, 1200];

  const srcset = widths
    .map(width => `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=75 ${width}w`)
    .join(', ');

  return (
    <img
      src={`/_vercel/image?url=${encodeURIComponent(src)}&w=${widths[widths.length - 1]}&q=75`}
      srcSet={srcset}
      sizes="(max-width: 1024px) 90vw, 45vw"
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
