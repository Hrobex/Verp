export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
}

// في البداية، ستكون هذه المصفوفة فارغة أو تحتوي على مقال وهمي واحد.
// لاحقًا، كلما أردت إضافة مقال، ستضيف كائنًا جديدًا هنا.
export const blogPosts: BlogPost[] = [
  // {
  //   slug: 'my-first-post',
  //   title: 'My First Blog Post Title',
  //   description: 'This is a short summary of my first blog post.',
  //   image: '/images/blog/first-post.jpg', // مسار افتراضي
  //   date: '2025-08-06',
  //   category: 'AI Art'
  // }
];
