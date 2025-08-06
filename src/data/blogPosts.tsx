// الملف: src/data/blogPosts.tsx
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'sell-ai-art',
    title: 'Sell AI Art: How and where to Sell AI-Generated Images',
    description: 'Turn Your AI Art into Profit! Learn how & where to sell AI-generated images online. This guide unlocks platforms for selling your creations.',
    image: '/images/blog/sell-ai-art-online-guide.webp',
    date: '2025-08-06',
    category: 'AI Monetization',
  }
  // يمكنك إضافة كائنات مقالات أخرى هنا في المستقبل
];
