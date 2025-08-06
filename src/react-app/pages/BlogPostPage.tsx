// الملف: src/react-app/pages/BlogPostPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '@/data/blogPosts';
import ReactMarkdown from 'react-markdown';
import SmartLink from '@/react-app/components/SmartLink';

// تعريف أبعاد الصور التي زودتني بها
const imageDimensions: { [key: string]: { width: number; height: number } } = {
  '/images/blog/sell-ai-art-online-guide.webp': { width: 1536, height: 864 },
  '/images/blog/selling-ai-generated-art-on-adobe-stock.webp': { width: 1080, height: 957 },
  '/images/blog/sell-ai-generated-art-on-dreamstime.webp': { width: 1310, height: 1536 },
  '/images/blog/sell-images-123Ref.webp': { width: 1080, height: 537 },
  '/images/blog/selling-ai-generated-images-on-vecteezy.webp': { width: 1080, height: 786 },
};

const customComponents = {
  h2: (props: any) => <h2 className="text-3xl font-bold text-white mt-12 mb-6" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-bold text-white mt-10 mb-4" {...props} />,
  p: (props: any) => <p className="mb-6 leading-loose" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside space-y-3 my-6 pl-4" {...props} />,
  li: (props: any) => <li className="mb-2" {...props} />,
  strong: (props: any) => <strong className="font-bold text-white" {...props} />,
  hr: (props: any) => <hr className="my-12 border-gray-700" {...props} />,
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    if (!href) return <>{children}</>;
    // رابط ArtigenV2 الداخلي
    if (href.startsWith('/')) {
        return <SmartLink href={href} className="text-cyan-400 underline hover:text-cyan-300">{children}</SmartLink>;
    }
    // الروابط الخارجية كأزرار
    return (
        <div className="my-6">
            <SmartLink href={href} className="inline-block bg-cyan-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-cyan-700 transition-colors">
                {children}
            </SmartLink>
        </div>
    );
  },
  img: (props: any) => {
    const dims = imageDimensions[props.src] || { width: 1200, height: 675 }; // Default dims
    return (
        <figure className="my-8">
            <img {...props} width={dims.width} height={dims.height} className="w-full h-auto rounded-lg shadow-lg" />
        </figure>
    );
  },
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const postMetadata = blogPosts.find(p => p.slug === slug);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (postMetadata) {
      import(`../../posts/${postMetadata.slug}.md?raw`)
        .then(module => setContent(module.default))
        .catch(err => {
          console.error("Failed to load post content:", err);
          setContent("Failed to load post content.");
        });
    }
  }, [postMetadata]);

  if (!postMetadata) {
    // ... (يبقى قسم "المقال غير موجود" كما هو)
    return <div>Post Not Found</div>;
  }

  return (
    <>
      {/* --- حل مشاكل 3 و 5 باستخدام ميزة React 19 المدمجة --- */}
      <title>{postMetadata.title} - AIConvert Blog</title>
      <meta name="description" content={postMetadata.description} />
      <link rel="canonical" href={`https://aiconvert.online/blog/${postMetadata.slug}`} />
      <link rel="preload" as="image" href={postMetadata.image} />

      <div className="bg-gray-900 text-gray-300 pt-32 pb-20">
        <main className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-lg leading-relaxed">
            <header className="mb-12">
              <div className="flex items-center text-sm text-gray-400">
                <Link to="/blog" className="hover:text-white">Blog</Link>
                <span className="mx-2">&gt;</span>
                <span>{postMetadata.category}</span>
              </div>
              <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold text-white">
                {postMetadata.title}
              </h1>
              <p className="mt-4 text-gray-400">
                Published on <time dateTime={postMetadata.date}>{new Date(postMetadata.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              </p>
            </header>

            <figure className="my-12">
              <img 
                src={postMetadata.image} 
                alt={postMetadata.title} 
                width={imageDimensions[postMetadata.image]?.width || 1536} 
                height={imageDimensions[postMetadata.image]?.height || 864} 
                className="w-full h-auto rounded-2xl shadow-xl" 
              />
            </figure>
            
            <ReactMarkdown components={customComponents}>
              {content}
            </ReactMarkdown>
            
            <div className="mt-16 border-t border-gray-700 pt-8">
                <Link to="/blog" className="text-cyan-400 hover:text-cyan-300 text-lg">
                    &larr; Back to All Posts
                </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
