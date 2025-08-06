// الملف: src/react-app/pages/BlogPostPageAr.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPostsAr } from '@/data/blogPostsAr';
import { blogPosts } from '@/data/blogPosts'; // <<< 1. استيراد بيانات المقالات الإنجليزية
import ReactMarkdown from 'react-markdown';
import SmartLink from '@/react-app/components/SmartLink';

export default function BlogPostPageAr() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPostsAr.find(p => p.slug === slug);
  const [content, setContent] = useState('');

  // <<< 2. التحقق من وجود نسخة إنجليزية مطابقة
  const hasEnglishVersion = post ? blogPosts.some(p => p.slug === post.slug) : false;

  const customComponents = {
    h2: (props: any) => <h2 className="text-3xl font-bold text-white mt-12 mb-6 border-r-4 border-amber-500 pr-4" {...props} />,
    h3: (props: any) => <h3 className="text-2xl font-bold text-white mt-10 mb-4" {...props} />,
    p: (props: any) => <p className="mb-6 leading-loose" {...props} />,
    ul: (props: any) => <ul className="list-disc list-inside space-y-3 my-6 pr-4" {...props} />,
    li: (props: any) => <li className="mb-2" {...props} />,
    strong: (props: any) => <strong className="font-bold text-white" {...props} />,
    hr: (props: any) => <hr className="my-12 border-gray-700" {...props} />,
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
      if (!href) return <>{children}</>;
      if (href.startsWith('/')) {
          return <SmartLink href={href} className="text-cyan-400 underline hover:text-cyan-300">{children}</SmartLink>;
      }
      return (
          <div className="my-6">
              <SmartLink href={href} className="inline-block bg-cyan-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-cyan-700 transition-colors">
                  {children}
              </SmartLink>
          </div>
      );
    },
    img: (props: any) => {
      if (!post || !props.src) return null;
      const dims = post.contentImageDims[props.src];
      if (!dims) return <img {...props} alt={props.alt || ''} className="w-full h-auto rounded-lg shadow-lg" />;
      return (
          <figure className="my-8">
              <img {...props} alt={props.alt || ''} width={dims.width} height={dims.height} className="w-full h-auto rounded-lg shadow-lg" />
          </figure>
      );
    },
  };

  useEffect(() => {
    if (post) {
      import(`../../posts/ar/${post.slug}.md?raw`)
        .then(module => setContent(module.default))
        .catch(err => {
          console.error("Failed to load post content:", err);
          setContent("فشل تحميل محتوى المقال.");
        });
    }
  }, [post]);

  if (!post) {
    return (
      <div className="bg-gray-900 text-gray-300 pt-32 pb-20 font-sans">
        <main className="max-w-4xl mx-auto px-6 lg:px-8 text-center" dir="rtl">
          <h1 className="text-4xl font-bold text-white">المقال غير موجود</h1>
          <p className="mt-4 text-lg text-gray-400">عذرًا، لم نتمكن من العثور على المقال الذي تبحث عنه.</p>
          <Link to="/ar/blog" className="mt-8 inline-block text-cyan-400 hover:text-cyan-300">
            &larr; العودة إلى المدونة
          </Link>
        </main>
      </div>
    );
  }

  return (
    <>
      <title>{post.title} - مدونة AIConvert</title>
      <meta name="description" content={post.description} />
      <link rel="canonical" href={`https://aiconvert.online/ar/blog/${post.slug}`} />

      {/* --- 3. إضافة وسوم hreflang بشكل شرطي --- */}
      {hasEnglishVersion && (
        <>
          <link rel="alternate" hrefLang="ar" href={`https://aiconvert.online/ar/blog/${post.slug}`} />
          <link rel="alternate" hrefLang="en" href={`https://aiconvert.online/blog/${post.slug}`} />
          <link rel="alternate" hrefLang="x-default" href={`https://aiconvert.online/blog/${post.slug}`} />
        </>
      )}

      <link rel="preload" as="image" href={post.image} />

      <div className="bg-gray-900 text-gray-300 pt-32 pb-20 font-sans">
        <main className="max-w-3xl mx-auto px-6 lg:px-8" dir="rtl">
          <div className="text-lg leading-relaxed">
            <header className="mb-12">
              <div className="flex items-center text-sm text-gray-400">
                <Link to="/ar/blog" className="hover:text-white">المدونة</Link>
                <span className="mx-2">&gt;</span>
                <span>{post.category}</span>
              </div>
              <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold text-white">
                {post.title}
              </h1>
              <p className="mt-4 text-gray-400">
                نُشر في <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              </p>
            </header>

            <figure className="my-12">
              <img 
                src={post.image} 
                alt={post.title} 
                width={post.imageDims.width} 
                height={post.imageDims.height} 
                className="w-full h-auto rounded-2xl shadow-xl" 
              />
            </figure>
            
            <ReactMarkdown components={customComponents}>
              {content}
            </ReactMarkdown>
            
            <div className="mt-16 border-t border-gray-700 pt-8">
                <Link to="/ar/blog" className="text-cyan-400 hover:text-cyan-300 text-lg">
                    &larr; العودة إلى جميع المقالات
                </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
