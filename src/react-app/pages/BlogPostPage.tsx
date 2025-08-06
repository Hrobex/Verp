// الملف: src/react-app/pages/BlogPostPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '@/data/blogPosts';
import ReactMarkdown from 'react-markdown';
import SmartLink from '@/react-app/components/SmartLink';

const MarkdownLink = ({ href, children }: { href?: string; children?: React.ReactNode }) => {
  if (!href) return <>{children}</>;
  return <SmartLink href={href}>{children}</SmartLink>;
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const postMetadata = blogPosts.find(p => p.slug === slug);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (postMetadata) {
      // استيراد ملف الـ Markdown ديناميكيًا كـ "نص خام"
      import(`../../posts/${postMetadata.slug}.md?raw`)
        .then(module => {
          setContent(module.default);
        })
        .catch(err => {
          console.error("Failed to load post content:", err);
          setContent("Failed to load post content.");
        });
    }
  }, [postMetadata]);

  if (!postMetadata) {
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
      <title>{postMetadata.title} - AIConvert Blog</title>
      <meta name="description" content={postMetadata.description} />
      <link rel="canonical" href={`https://aiconvert.online/blog/${postMetadata.slug}`} />

      <div className="bg-gray-900 text-gray-300 pt-32 pb-20">
        <main className="max-w-3xl mx-auto px-6 lg:px-8">
          <article className="prose prose-invert prose-lg lg:prose-xl mx-auto">
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
              <img src={postMetadata.image} alt={postMetadata.title} className="w-full rounded-2xl shadow-xl" />
            </figure>
            
            <ReactMarkdown components={{ a: MarkdownLink }}>
              {content}
            </ReactMarkdown>
            
            <div className="mt-16 border-t border-gray-700 pt-8">
                <Link to="/blog" className="text-cyan-400 hover:text-cyan-300 text-lg">
                    &larr; Back to All Posts
                </Link>
            </div>
          </article>
        </main>
      </div>
    </>
  );
}
