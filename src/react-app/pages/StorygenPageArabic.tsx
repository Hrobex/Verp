// الملف: StorygenPageArabic.tsx (النسخة الجديدة والآمنة)
import { useState, useRef, useEffect } from 'react';

// --- الثوابت العامة (آمنة) ---
const languageOptions = [
    { code: 'ar', name: 'العربية' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'zh', name: '中文 (Chinese)' },
    { code: 'ja', name: '日本語 (Japanese)' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
];

const faqDataArabic = [
  {
    question: 'كيف يقوم الذكاء الاصطناعي بتوليد قصة من صورة؟',
    answer: 'يقوم نظامنا، Storygen، بتحليل العناصر الأساسية في صورتك المرفوعة — مثل الشخصيات، المكان، الأجواء العامة، والأحداث المحتملة. ثم يستخدم هذه المعلومات المرئية كنقطة انطلاق لنسج قصة فريدة ومبتكرة لها بداية ووسط ونهاية.'
  },
  {
    question: 'هل مولد القصص من الصور مجاني للاستخدام؟',
    answer: 'نعم، بكل تأكيد. يمكنك تحويل أي صورة إلى قصة مجانًا بالكامل، بدون أي حدود للاستخدام أو الحاجة للتسجيل. هي أداة صُنعت خصيصًا لدعم الإبداع.'
  },
  {
    question: 'هل يمكنني اختيار لغة القصة التي يتم إنشاؤها؟',
    answer: 'بالطبع! نحن ندعم مجموعة واسعة من اللغات. بكل بساطة، اختر لغتك المفضلة من القائمة المنسدلة قبل الضغط على زر التوليد، وسيقوم الذكاء الاصطناعي بكتابة القصة بتلك اللغة.'
  },
  {
    question: 'ما هو أفضل نوع من الصور للحصول على قصة جيدة؟',
    answer: 'الصور التي تحتوي على مواضيع وشخصيات واضحة أو بيئات مثيرة للاهتمام غالبًا ما تنتج قصصًا أكثر تفصيلاً. ومع ذلك، يتمتع الذكاء الاصطناعي لدينا بقدرة إبداعية ويمكنه إيجاد الإلهام في أي لقطة تقريبًا، من الصور الشخصية والمناظر الطبيعية إلى الفن التجريدي.'
  },
];

// --- دالة مساعدة لتحويل الصورة إلى Base64 ---
async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
}

function StorygenPageArabic() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedStory, setGeneratedStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]); // العربية هي الافتراضية
  const [loadingText, setLoadingText] = useState('جاري نسج قصتك...');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      const baseText = "جاري نسج قصتك";
      let dotCount = 1;
      setLoadingText(`${baseText}${'.'.repeat(dotCount)}`);
      interval = setInterval(() => {
        dotCount = (dotCount % 3) + 1;
        setLoadingText(`${baseText}${'.'.repeat(dotCount)}`);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setGeneratedStory('');
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateStory = async () => {
    if (!selectedFile) {
      setError('يرجى رفع صورة أولاً.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedStory('');

    try {
        const imageData = await fileToBase64(selectedFile);

        const response = await fetch('/api/stvid?tool=story', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imageData: imageData,
                mimeType: selectedFile.type,
                language: selectedLanguage,
            }),
        });
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'حدث خطأ غير معروف.');
        }

        setGeneratedStory(result.story);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyStory = () => {
    if (!generatedStory) return;
    navigator.clipboard.writeText(generatedStory).catch(() => setError('فشل نسخ القصة.'));
  };

  const getButtonText = () => {
    if (isLoading) return 'جاري كتابة القصة...';
    return 'ولّد قصة من الصورة';
  };
    
  return (
    <>
      <title>مولد قصص بالذكاء الاصطناعي من الصور | تحويل الصورة إلى قصة</title>
      <meta name="description" content="حوّل أي صورة إلى قصة آسرة! أداة Storygen المجانية، صانع القصص بالذكاء الاصطناعي، تحلل صورتك وتكتب لك حكاية فريدة ومبتكرة في ثوانٍ." />
      <link rel="canonical" href="https://aiconvert.online/ar/ai-story-generator" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/ai-story-generator" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/ai-story-generator" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/ai-story-generator" />
       <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Storygen: مولد قصص بالذكاء الاصطناعي",
            "operatingSystem": "WEB",
            "applicationCategory": "ProductivityApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "2158"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "inLanguage": "ar"
          }
        `}
      </script>

      <div className="pt-24 bg-gray-900 text-white min-h-screen">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">
              Storygen: مولد القصص بالذكاء الاصطناعي
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              كل صورة تخفي وراءها حكاية. ارفع أي لقطة ودع كاتبنا الذكي ينسج لك قصة فريدة من وحي صورتك.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* عمود التحكم */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <h2 className="sr-only">أداة تحويل الصورة إلى قصة</h2>
              <div>
                <p className="block text-lg font-semibold text-gray-200 mb-2">١. ارفع صورة</p>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:border-indigo-400 hover:bg-gray-700/50 transition"
                >
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  {imagePreview ? (
                    <img src={imagePreview} alt="معاينة الصورة لتوليد قصة" className="max-w-full max-h-full object-contain rounded-md" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <p>انقر هنا أو اسحب صورة وأفلتها</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="language-select" className="block text-lg font-semibold text-gray-200 mb-2">٢. اختر لغة القصة</label>
                 <select
                    id="language-select"
                    value={selectedLanguage.code}
                    onChange={(e) => setSelectedLanguage(languageOptions.find(lang => lang.code === e.target.value) || languageOptions[0])}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
                >
                    {languageOptions.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>
              </div>

              <button
                onClick={handleGenerateStory}
                disabled={isLoading || !selectedFile}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-lg hover:from-indigo-600 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {getButtonText()}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>
            
            {/* عمود النتائج */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col min-h-[28rem]">
              <label htmlFor="story-output" className="block text-lg font-semibold text-gray-200 mb-2">٣. اقرأ قصتك</label>
              <div className="relative w-full h-full flex flex-col">
                <textarea
                  id="story-output"
                  readOnly
                  value={isLoading ? loadingText : generatedStory}
                  placeholder="قصتك الفريدة ستظهر هنا..."
                  className="w-full flex-grow p-4 bg-gray-700 border border-gray-600 rounded-lg resize-none text-gray-200 placeholder-gray-400 leading-relaxed"
                />
                {generatedStory && !isLoading && (
                   <button onClick={handleCopyStory} className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all">
                      نسخ القصة
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* أقسام المحتوى */}
          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">حوّل أي مشهد إلى سرد قصصي حي</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-indigo-400 mb-2">إلهام فوري</h3>
                          <p className="text-gray-300">هل تعاني من قفلة الكاتب؟ استخدم أي صورة كمصدر إلهام ودع صانع القصص لدينا يطلق العنان لإبداعك.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-indigo-400 mb-2">سرد قصصي عميق</h3>
                          <p className="text-gray-300">الذكاء الاصطناعي لا يصف الصورة فقط، بل ينسج حكاية كاملة بشخصياتها وحبكتها ونهايتها المرضية.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-indigo-400 mb-2">كاتب متعدد اللغات</h3>
                          <p className="text-gray-300">أنشئ قصصًا بلغات متعددة، من العربية والإنجليزية إلى اليابانية والهندية، مما يجعلها مثالية لجمهور عالمي.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-indigo-400 mb-2">مجاني للجميع</h3>
                          <p className="text-gray-300">أداة تحويل الصور إلى قصص قوية ومجانية بالكامل وغير محدودة. حوّل صورًا لا نهائية إلى قصص اليوم.</p>
                      </div>
                  </div>
              </section>

            <section className="mt-20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">كيفية إنشاء قصة من صورة</h2>
                    <p className="max-w-3xl mx-auto text-gray-400 mb-12">
                        صانع القصص المرئي لدينا يجعل العملية بسيطة بشكل لا يصدق. فقط اتبع هذه الخطوات الثلاث.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-indigo-400 font-bold text-lg mb-2">١. ارفع صورتك</p>
                        <p className="text-gray-300">
                           اختر أي صورة من جهازك. يمكن أن تكون صورة شخصية، منظرًا طبيعيًا، أو حتى قطعة فنية تجريدية.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-indigo-400 font-bold text-lg mb-2">٢. اختر اللغة</p>
                        <p className="text-gray-300">
                           اختر لغة القصة التي تفضلها من القائمة المنسدلة. اللغة الافتراضية هي العربية.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-indigo-400 font-bold text-lg mb-2">٣. ولّد واقرأ</p>
                        <p className="text-gray-300">
                           اضغط على زر التوليد وشاهد الذكاء الاصطناعي وهو يكتب قصة كاملة بناءً على صورتك، جاهزة للقراءة والمشاركة.
                        </p>
                    </div>
                </div>
            </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">الأسئلة الشائعة</h2>
                  <div className="space-y-4">
                      {faqDataArabic.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-indigo-400 mb-2">{faq.question}</h3>
                              <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                          </div>
                      ))}
                  </div>
              </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default StorygenPageArabic;
