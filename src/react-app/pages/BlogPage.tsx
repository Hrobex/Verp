// الملف: BlogPage.tsx
import { blogPosts, BlogPost } from '@/data/blogPosts'; // 1. استيراد بيانات المقالات
import SmartLink from '@/react-app/components/SmartLink'; // 2. استيراد الرابط الذكي

// مكون بطاقة المقال (Post Card Component)
const PostCard = ({ post }: { post: BlogPost }) => {
  return (
    <SmartLink href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-xl bg-gray-800/50 hover:bg-gray-800/80 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 transform hover:-translate-y-1">
      {/* صورة المقال */}
      <div className="aspect-video overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      {/* محتوى البطاقة */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <p className="rounded-full bg-cyan-500/10 px-3 py-1 font-medium text-cyan-400">{post.category}</p>
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        </div>
        <h3 className="mt-4 text-xl font-bold text-white group-hover:text-cyan-300">
          {post.title}
        </h3>
        <p className="mt-2 text-gray-400 flex-1">
          {post.description}
        </p>
        <div className="mt-6 text-cyan-400 font-semibold group-hover:text-white">
          Read More &rarr;
        </div>
      </div>
    </SmartLink>
  );
};


export default function BlogPage() {
  // فرز المقالات لعرض الأحدث أولاً
  const sortedPosts = blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const featuredPost = sortedPosts[0]; // المقال المميز هو أول مقال (الأحدث)
  const latestPosts = sortedPosts.slice(1); // باقي المقالات

  return (
    <>
      <title>Blog - AIConvert</title>
      <meta name="description" content="Insights, tutorials, and the latest in AI creativity. Your guide to mastering the world of digital art and content creation." />
      <link rel="canonical" href="https://aiconvert.online/blog" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/blog" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/blog" />
      
      
      <div className="bg-gray-900 text-gray-300 pt-32 pb-20">
        <main className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* قسم المقدمة */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
              AIConvert Blog
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
              Insights, tutorials, and the latest in AI creativity. Your guide to mastering the world of digital art and content creation.
            </p>
          </div>

          {/* منطق العرض */}
          {sortedPosts.length > 0 ? (
            <div className="space-y-16">
              {/* المقال المميز (إذا كان هناك مقالات) */}
              {featuredPost && (
                <section>
                  <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-amber-500 pl-4">Featured Post</h2>
                  <SmartLink href={`/blog/${featuredPost.slug}`} className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-800/50 p-8 rounded-2xl hover:bg-gray-800/80 transition-all duration-300">
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
                        <time dateTime={featuredPost.date}>{new Date(featuredPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                      </p>
                      <h3 className="mt-4 text-2xl lg:text-3xl font-bold text-white group-hover:text-amber-300">
                        {featuredPost.title}
                      </h3>
                      <p className="mt-4 text-gray-400 text-lg leading-relaxed">
                        {featuredPost.description}
                      </p>
                      <div className="mt-6 text-amber-400 font-semibold text-lg group-hover:text-white">
                        Read Full Story &rarr;
                      </div>
                    </div>
                  </SmartLink>
                </section>
              )}

              {/* أحدث المقالات (إذا كان هناك أكثر من مقال) */}
              {latestPosts.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-cyan-500 pl-4">Latest Posts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestPosts.map((post) => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            // الرسالة الترحيبية (إذا لم تكن هناك مقالات)
            <div className="text-center bg-gray-800/50 rounded-2xl py-20 px-6">
              <h2 className="text-3xl font-bold text-white">Welcome to the AIConvert Blog!</h2>
              <p className="text-xl text-gray-400 mt-4 mb-8 max-w-2xl mx-auto">
                We're currently brewing some exciting articles, tutorials, and insights for you. Please check back soon!
              </p>
              <SmartLink 
                href="/#tools" 
                className="inline-block bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg py-4 px-10 rounded-lg hover:shadow-xl hover:shadow-cyan-500/20 transform hover:-translate-y-1 transition-all duration-300"
              >
                Explore Our Free AI Tools
              </SmartLink>
            </div>
          )}
        </main>
      </div>
    </>
  );
                                                                                                                     }
