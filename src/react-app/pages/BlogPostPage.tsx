// الملف: src/react-app/pages/BlogPostPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '@/data/blogPosts';
import ReactMarkdown from 'react-markdown';
import SmartLink from '@/react-app/components/SmartLink';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);
  const [content, setContent] = useState('');

  // مكونات التنسيق المخصصة للمقال
  const customComponents = {
    h2: (props: any) => <h2 className="text-3xl font-bold text-white mt-12 mb-6 border-l-4 border-amber-500 pl-4" {...props} />,
    h3: (props: any) => <h3 className="text-2xl font-bold text-white mt-10 mb-4" {...props} />,
    p: (props: any) => <p className="mb-6 leading-loose" {...props} />,
    ul: (props: any) => <ul className="list-disc list-inside space-y-3 my-6 pl-4" {...props} />,
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
      import(`../../posts/${post.slug}.md?raw`)
        .then(module => setContent(module.default))
        .catch(err => {
          console.error("Failed to load post content:", err);
          setContent("Failed to load post content.");
        });
    }
  }, [post]);

  if (!post) {
    return (
      <div className="bg-gray-900 text-gray-300 pt-32 pb-20">
        <main className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white">Post Not Found</h1>
          <p className="mt-4 text-lg text-gray-400">Sorry, we couldn't find the blog post you're looking for.</p>
          <Link to="/blog" className="mt-8 inline-block text-cyan-400 hover:text-cyan-300">
            &larr; Back to Blog
          </Link>
        </main>
      </div>
    );
  }

  return (
    <>
      <title>{post.title} - AIConvert Blog</title>
      <meta name="description" content={post.description} />
      <link rel="canonical" href={`https://aiconvert.online/blog/${post.slug}`} />
      <link rel="preload" as="image" href={post.image} />

      <div className="bg-gray-900 text-gray-300 pt-32 pb-20">
        <main className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-lg leading-relaxed">
            <header className="mb-12">
              <div className="flex items-center text-sm text-gray-400">
                <Link to="/blog" className="hover:text-white">Blog</Link>
                <span className="mx-2">&gt;</span>
                <span>{post.category}</span>
              </div>
              <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold text-white">
                {post.title}
              </h1>
              <p className="mt-4 text-gray-400">
                Published on <time dateTime={post.date}>{new Date(post.date).toLocaleDate-String('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
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
