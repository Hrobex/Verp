// src/react-app/pages/HomePageArabic.tsx

import Hero from '@/react-app/components/Hero';
import AIToolsArabic from '@/react-app/components/AIToolsArabic';
import FeaturesArabic from '@/react-app/components/FeaturesArabic';

export default function HomePageArabic() {
  const pageTitle = "محول AI: أدوات ذكاء اصطناعي لتوليد الصور وتحويل المحتوى";
  const pageDescription = "أطلق العنان لإبداعك مع محول AI. استخدم أدواتنا لتوليد الصور، تحويل الصور لفن خطي، إزالة الخلفيات، والمزيد. ابدأ مجانًا.";
  const pageUrl = "https://aiconvert.online/ar";
  // Using the same preview image for now, this can be customized later
  const ogImageUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop";

  return (
    <>
      {/* --- SEO and hreflang Tags for React 19 --- */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={pageUrl} />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/" />
      <link rel="alternate" hrefLang="ar" href={pageUrl} />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/" />
      
      {/* --- Social Media Meta Tags (Open Graph & Twitter) --- */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="AI Convert" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      {/* Optional: <meta name="twitter:site" content="@YourTwitterHandle" /> */}
      
      <div className="min-h-screen bg-white">
        <Hero />
        <AIToolsArabic />
        <FeaturesArabic />
      </div>
    </>
  );
}
