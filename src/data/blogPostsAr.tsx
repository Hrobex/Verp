// الملف: src/react-app/pages/BlogPageAr.tsx
import { blogPostsAr, BlogPostAr } from '@/data/blogPostsAr'; // سيتم إنشاء هذا الملف لاحقًا
import SmartLink from '@/react-app/components/SmartLink';

// مكون بطاقة المقال (Post Card Component) باللغة العربية
const PostCardAr = ({ post }: { post: BlogPostAr }) => {
  return (
    <SmartLink href={`/ar/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-xl bg-gray-800/50 hover:bg-gray-800/80 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 transform hover:-translate-y-1">
      <div className="aspect-video overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <p className="rounded-full bg-cyan-500/10 px-3 py-1 font-medium text-cyan-400">{post.category}</p>
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        </div>
        <h3 className="mt-4 text-xl font-bold text-white group-hover:text-cyan-300">
          {post.title}
        </h3>
        <p className="mt-2 text-gray-400 flex-1">
          {post.description}
        </p>
        <div className="mt-6 text-cyan-400 font-semibold group-hover:text-white">
          اقرأ المزيد &larr;
        </div>
      </div>
    </SmartLink>
  );
};

export default function BlogPageAr() {
  const sortedPosts = blogPostsAr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const featuredPost = sortedPosts[0];
  const latestPosts = sortedPosts.slice(1);

  return (
    <>
      <title>المدونة - AIConvert</title>
      <meta name="description" content="مقالات تعليمية، شروحات، وآخر الأخبار في عالم الإبداع بالذكاء الاصطناعي. دليلك لإتقان فن المحتوى الرقمي." />
      <link rel="canonical" href="https://aiconvert.online/ar/blog" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/blog" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/blog" />
      
      <div className="bg-gray-900 text-gray-300 pt-32 pb-20 font-sans">
        <main className="max-w-7xl mx-auto px-6 lg:px-8" dir="rtl">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
              مدونة AIConvert
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
              مقالات تعليمية، شروحات، وآخر الأخبار في عالم الإبداع بالذكاء الاصطناعي. دليلك لإتقان فن المحتوى الرقمي.
            </p>
          </div>

          {sortedPosts.length > 0 ? (
            <div className="space-y-16">
              {featuredPost && (
                <section>
                  <h2 className="text-3xl font-bold text-white mb-8 border-r-4 border-amber-500 pr-4">المقال المميز</h2>
                  <SmartLink href={`/ar/blog/${featuredPost.slug}`} className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-800/50 p-8 rounded-2xl hover:bg-gray-800/80 transition-all duration-300">
                    <div className="aspect-video overflow-hidden rounded-xl">
                      <img 
                        src={featuredPost.image} 
                        alt={featuredPost.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-400">
                        <span className="rounded-full bg-amber-500/10 px-3 py-1 font-medium text-amber-400">{featuredPost.category}</span>
                         <span className="mx-2">&bull;</span>
                        <time dateTime={featuredPost.date}>{new Date(featuredPost.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                      </p>
                      <h3 className="mt-4 text-2xl lg:text-3xl font-bold text-white group-hover:text-amber-300">
                        {featuredPost.title}
                      </h3>
                      <p className="mt-4 text-gray-400 text-lg leading-relaxed">
                        {featuredPost.description}
                      </p>
                      <div className="mt-6 text-amber-400 font-semibold text-lg group-hover:text-white">
                        اقرأ القصة كاملة &larr;
                      </div>
                    </div>
                  </SmartLink>
                </section>
              )}

              {latestPosts.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold text-white mb-8 border-r-4 border-cyan-500 pr-4">أحدث المقالات</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestPosts.map((post) => (
                      <PostCardAr key={post.slug} post={post} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="text-center bg-gray-800/50 rounded-2xl py-20 px-6">
              <h2 className="text-3xl font-bold text-white">أهلاً بك في مدونة AIConvert!</h2>
              <p className="text-xl text-gray-400 mt-4 mb-8 max-w-2xl mx-auto">
                نعمل حاليًا على تحضير مقالات وشروحات شيقة لك. يرجى العودة قريبًا!
              </p>
              <SmartLink 
                href="/ar#tools" 
                className="inline-block bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg py-4 px-10 rounded-lg hover:shadow-xl hover:shadow-cyan-500/20 transform hover:-translate-y-1 transition-all duration-300"
              >
                استكشف أدواتنا المجانية
              </SmartLink>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
