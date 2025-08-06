// الملف: src/data/blogPosts.tsx
export interface ImageDimensions {
  width: number;
  height: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageDims: ImageDimensions; // أبعاد الصورة المميزة
  date: string;
  category: string;
  // كائن لتخزين أبعاد الصور داخل المقال
  contentImageDims: { [src: string]: ImageDimensions }; 
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'sell-ai-art',
    title: 'Sell AI Art: How and where to Sell AI-Generated Images',
    description: 'Turn Your AI Art into Profit! Learn how & where to sell AI-generated images online. This guide unlocks platforms for selling your creations.',
    image: '/images/blog/sell-ai-art-online-guide.webp',
    imageDims: { width: 1536, height: 864 },
    date: '2025-08-06',
    category: 'AI Monetization',
    contentImageDims: {
      '/images/blog/selling-ai-generated-art-on-adobe-stock.webp': { width: 1080, height: 957 },
      '/images/blog/sell-ai-generated-art-on-dreamstime.webp': { width: 1310, height: 1536 },
      '/images/blog/sell-images-123Ref.webp': { width: 1080, height: 537 },
      '/images/blog/selling-ai-generated-images-on-vecteezy.webp': { width: 1080, height: 786 },
    }
  }
  // لإضافة مقال جديد، ستضيف كائنًا جديدًا هنا بكل معلوماته
];
