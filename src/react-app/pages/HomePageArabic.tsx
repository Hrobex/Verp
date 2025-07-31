// src/react-app/pages/HomePageArabic.tsx

// Import the Arabic components we created
import HeroArabic from '@/react-app/components/HeroArabic';
import AIToolsArabic from '@/react-app/components/AIToolsArabic';
import FeaturesArabic from '@/react-app/components/FeaturesArabic';

export default function HomePageArabic() {
  return (
    <>
      {/* --- SEO and hreflang Tags for React 19 (CORRECTED) --- */}
      <title>محول AI: أدوات ذكاء اصطناعي لتوليد الصور وتحويل المحتوى</title>
      <meta 
        name="description" 
        content="أطلق العنان لإبداعك مع محول AI. استخدم أدواتنا لتوليد الصور بالذكاء الاصطناعي، تحويل الصور إلى فن خطي، إزالة الخلفيات، والمزيد. ابدأ مجانًا." 
      />
      <link rel="canonical" href="https://aiconvert.online/ar" />
      {/* The attribute 'hreflang' has been corrected to 'hrefLang' below */}
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/" />
      
      {/*
        This is the main container for the page content.
        It imports and arranges the Arabic components in the correct order.
        Note: The class "pt-24" is intentionally omitted here because the first component,
        HeroArabic, already contains its own top padding.
      */}
      <div className="min-h-screen bg-white">
        <HeroArabic />
        <AIToolsArabic />
        <FeaturesArabic />
      </div>
    </>
  );
}
