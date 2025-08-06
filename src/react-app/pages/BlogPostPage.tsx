// الملف: src/react-app/pages/BlogPostPage.tsx
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '@/data/blogPosts';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

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

      <div className="bg-gray-900 text-gray-300 pt-32 pb-20">
        <main className="max-w-3xl mx-auto px-6 lg:px-8">
          <article className="prose prose-invert prose-lg lg:prose-xl mx-auto">
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
                Published on <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              </p>
            </header>

            <figure className="my-12">
              <img src={post.image} alt={post.title} className="w-full rounded-2xl shadow-xl" />
            </figure>

            <p>{post.description}</p>
            <p><strong>[More content for this article will be added here...]</strong></p>
            
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
