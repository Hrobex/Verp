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
    title: 'Sell AI Art in 2025: Open Marketplaces vs. Closed Ecosystems',
    description: 'Don\'t get rejected. Learn the crucial difference between open marketplaces (like Adobe Stock) and closed ecosystems (like Shutterstock) for selling your AI-generated art.',
    image: '/images/blog/sell-ai-art-online-guide.webp',
    imageDims: { width: 1536, height: 864 },
    date: '2025-08-06',
    category: 'AI Monetization',
    contentImageDims: {
      '/images/blog/selling-ai-generated-art-on-adobe-stock.webp': { width: 1080, height: 957 },
      '/images/blog/sell-ai-generated-art-on-dreamstime.webp': { width: 1310, height: 1536 }
    }
  }
];
