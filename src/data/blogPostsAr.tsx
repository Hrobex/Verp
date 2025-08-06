// الملف: src/data/blogPostsAr.tsx
export interface ImageDimensions {
  width: number;
  height: number;
}

export interface BlogPostAr {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageDims: ImageDimensions;
  date: string;
  category: string;
  contentImageDims: { [src: string]: ImageDimensions }; 
}

// قمنا الآن بإضافة بيانات المقال الأول إلى المصفوفة
export const blogPostsAr: BlogPostAr[] = [
  {
    slug: 'sell-ai-art',
    title: 'بيع الفن المصنوع بالذكاء الاصطناعي: دليل شامل لعام 2025',
    description: 'لا تدع أعمالك تُرفض. تعلم الفرق الحاسم بين الأسواق المفتوحة (مثل Adobe Stock) والأنظمة المغلقة (مثل Shutterstock) لبيع فنك المولد بالذكاء الاصطناعي.',
    image: '/images/blog/sell-ai-art-online-guide.webp',
    imageDims: { width: 1536, height: 864 },
    date: '2025-08-07',
    category: 'الربح من الذكاء الاصطناعي',
    contentImageDims: {
      '/images/blog/selling-ai-generated-art-on-adobe-stock.webp': { width: 1080, height: 957 },
      '/images/blog/sell-ai-generated-art-on-dreamstime.webp': { width: 1310, height: 1536 },
      '/images/blog/sell-images-123Ref.webp': { width: 1080, height: 537 },
      '/images/blog/selling-ai-generated-images-on-vecteezy.webp': { width: 1080, height: 786 },
    }
  }
];
