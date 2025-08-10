// src/react-app/pages/Home.tsx

import Hero from '@/react-app/components/Hero';
import AITools from '@/react-app/components/AITools';
import Features from '@/react-app/components/Features';

export default function Home() {
  const pageTitle = "AI Convert: Free AI Tools for Image Generation, Photo Editing & More";
  const pageDescription = "Your all-in-one AI toolbox. Generate art, remove backgrounds, restore photos, create voiceovers, and more. 100% free - no sign-up required.";
  const pageUrl = "https://aiconvert.online/";
  // Using the same preview image, can be customized later
  const ogImageUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop";

  return (
    <>
      {/* --- SEO and hreflang Tags for the English Homepage --- */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={pageUrl} />
      <link rel="alternate" hrefLang="en" href={pageUrl} />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar" />
      <link rel="alternate" hrefLang="x-default" href={pageUrl} />

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
      
      {/* 
        The pt-24 is removed from here because the <Hero /> component, 
        which is the first element, handles its own top padding.
      */}
      <div className="min-h-screen bg-white">
        <Hero />
        <AITools />
        <Features />
      </div>
    </>
  );
}
