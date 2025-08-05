import { useState, useRef, useEffect, ChangeEvent } from 'react';

// FAQ Data - Translated to Arabic
const faqData = [
  {
    question: 'هل أداة إزالة الخلفية هذه مجانية بالكامل؟',
    answer: 'نعم، 100%. أداتنا مجانية تمامًا للاستخدام، بدون أي حدود على عدد الصور التي يمكنك معالجتها أو تحميلها، وبدون الحاجة للتسجيل أو إدخال بيانات دفع.'
  },
  {
    question: 'ما هو نوع الصور الذي يعطي أفضل النتائج؟',
    answer: 'للحصول على أفضل النتائج، استخدم صورًا ذات عنصر أساسي واضح وخلفية مميزة. الصور عالية الدقة بشكل عام تنتج قصًا أكثر نظافة ودقة.'
  },
  {
    question: 'كيف تعمل تقنية الذكاء الاصطناعي في الأداة؟',
    answer: 'تستخدم أداتنا نموذج رؤية حاسوبية متقدم تم تدريبه على تحديد العنصر الرئيسي في الصورة (مثل شخص، منتج، أو حيوان) وفصله بدقة تامة عن الخلفية.'
  },
  {
    question: 'هل يمكنني استخدام الصور النهائية في مشاريع تجارية؟',
    answer: 'نعم. بمجرد معالجة صورتك وتحميلها، لك كامل الحرية في استخدامها لأي غرض شخصي أو تجاري دون الحاجة لذكر المصدر.'
  },
];

function ImageBackgroundToolPageArabic() {
  // State for file handling and API interaction
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string>('');
  const [processedImageUrl, setProcessedImageUrl] = useState<string>(''); // URL from API
  const [finalImageUrl, setFinalImageUrl] = useState<string>(''); // URL from canvas after bg apply
  
  // State for UI control
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for background customization
  const [backgroundOption, setBackgroundOption] = useState<'transparent' | 'color' | 'custom'>('transparent');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [customBgFile, setCustomBgFile] = useState<File | null>(null);

  // Refs for file inputs
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  // Effect to clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
      if (processedImageUrl) URL.revokeObjectURL(processedImageUrl);
      if (finalImageUrl) URL.revokeObjectURL(finalImageUrl);
    };
  }, [originalPreviewUrl, processedImageUrl, finalImageUrl]);

  const handleMainFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFile(file);
      setProcessedImageUrl('');
      setFinalImageUrl('');
      setError(null);
      if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
      setOriginalPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleCustomBgFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomBgFile(file);
    }
  };

  const handleProcessImage = async () => {
    if (!originalFile) {
      setError('الرجاء رفع صورة أولاً.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProcessedImageUrl('');
    setFinalImageUrl('');
    
    const formData = new FormData();
    formData.append('file', originalFile);

    try {
      // تم تغيير هذا السطر فقط للاتصال بالـ API الداخلي الآمن
        const response = await fetch('/api/tools?tool=background-remover', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('فشلت معالجة الصورة. قد تكون الخدمة مشغولة. الرجاء المحاولة مرة أخرى.');
      }

      const blob = await response.blob();
      const processedUrl = URL.createObjectURL(blob);
      setProcessedImageUrl(processedUrl);
      setFinalImageUrl(processedUrl);

    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير معروف.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyBackground = () => {
    if (!processedImageUrl) {
      setError('الرجاء معالجة الصورة أولاً للحصول على القَصّة.');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (backgroundOption === 'color') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (backgroundOption === 'custom' && customBgFile) {
        const bgImg = new Image();
        bgImg.onload = () => {
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          setFinalImageUrl(canvas.toDataURL('image/png'));
        };
        bgImg.src = URL.createObjectURL(customBgFile);
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      setFinalImageUrl(canvas.toDataURL('image/png'));
    };
    img.src = processedImageUrl;
  };

  const handleDownloadImage = () => {
    if (!finalImageUrl) return;
    const link = document.createElement('a');
    link.href = finalImageUrl;
    link.download = 'صورة-معالجة.png'; // تم تعديل اسم الملف
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* SEO Section - Arabic */}
      <title>إزالة خلفية الصورة بالذكاء الاصطناعي مجاناً | تغيير خلفية الصور اون لاين</title>
      <meta name="description" content="أزل خلفية أي صورة فورًا باستخدام أداتنا المجانية لإزالة الخلفية بالذكاء الاصطناعي. احصل على خلفية شفافة (PNG) أو قم بتغييرها إلى لون ثابت أو صورة من اختيارك بسهولة." />
      <link rel="canonical" href="https://aiconvert.online/ar/remove-background" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/remove-background" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/remove-background" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/remove-background" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "أداة إزالة الخلفية بالذكاء الاصطناعي",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "ratingCount": "1549"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        `}
      </script>

      <div className="pt-24 bg-gray-900 text-white min-h-screen">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-500">
              أداة إزالة وتغيير خلفية الصور
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              أزل وغيّر خلفية صورك بسهولة وبنقرة زر واحدة. كل ما عليك هو رفع صورتك للحصول على خلفية شفافة، أو استبدالها بخلفية جديدة تمامًا من اختيارك.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Controls Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-200">
                  <span className="text-lime-400 font-bold">الخطوة 1:</span> ارفع صورتك
                </h3>
                <input type="file" accept="image/*" onChange={handleMainFileSelect} ref={mainFileInputRef} className="hidden" />
                <button 
                  onClick={() => mainFileInputRef.current?.click()}
                  className="w-full py-3 px-4 font-bold text-gray-900 bg-gray-300 rounded-lg hover:bg-white transition-all"
                >
                  {originalFile ? 'تغيير الصورة' : 'اختر صورة'}
                </button>
                {originalFile && <p className="text-sm text-gray-400 text-center truncate">الملف المختار: {originalFile.name}</p>}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-200">
                    <span className="text-lime-400 font-bold">الخطوة 2:</span> إزالة الخلفية
                </h3>
                <button
                  onClick={handleProcessImage}
                  disabled={!originalFile || isLoading}
                  className="w-full py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-lime-600 rounded-lg hover:from-green-600 hover:to-lime-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? 'جاري المعالجة...' : 'إزالة الخلفية'}
                </button>
              </div>

              {processedImageUrl && (
                  <div className="space-y-4 border-t border-gray-700 pt-4">
                      <h3 className="text-lg font-semibold text-gray-200">
                          <span className="text-lime-400 font-bold">الخطوة 3:</span> تخصيص الخلفية الجديدة
                      </h3>
                      <select
                          value={backgroundOption}
                          onChange={(e) => setBackgroundOption(e.target.value as any)}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500"
                      >
                          <option value="transparent">خلفية شفافة</option>
                          <option value="color">لون ثابت</option>
                          <option value="custom">صورة مخصصة</option>
                      </select>

                      {backgroundOption === 'color' && (
                          <input
                              type="color"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="w-full h-12 p-1 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
                          />
                      )}
                      {backgroundOption === 'custom' && (
                          <>
                              <input type="file" accept="image/*" onChange={handleCustomBgFileSelect} ref={bgFileInputRef} className="hidden" />
                              <button onClick={() => bgFileInputRef.current?.click()} className="w-full py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded-lg">
                                  {customBgFile ? `الملف المختار: ${customBgFile.name}` : 'رفع صورة للخلفية'}
                              </button>
                          </>
                      )}
                      
                      <button
                          onClick={handleApplyBackground}
                          className="w-full py-2.5 px-4 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                      >
                          تطبيق الخلفية
                      </button>
                  </div>
              )}
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
              </div>
              
            {/* Output Column */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg flex flex-col justify-center items-center h-[28rem] lg:h-auto">
              <div className="w-full h-full flex justify-center items-center border-2 border-dashed border-gray-600 rounded-lg overflow-hidden relative">
                  {isLoading ? (
                      <div className="flex flex-col items-center gap-4 text-center">
                          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-lime-500"></div>
                          <p className="text-gray-400">الذكاء الاصطناعي يضع لمسته السحرية...</p>
                      </div>
                  ) : (
                      <>
                          {!finalImageUrl && !originalPreviewUrl && (
                              <div className="text-center text-gray-500 p-4">
                                  <p>ستظهر صورتك النهائية هنا</p>
                              </div> 
                          )}
                          
                          {(finalImageUrl || originalPreviewUrl) && (
                              <img 
                                  src={finalImageUrl || originalPreviewUrl} 
                                  alt={finalImageUrl ? 'الصورة المعالجة' : (originalFile ? 'معاينة الصورة الأصلية' : '')} 
                                  className="max-w-full max-h-full object-contain"
                                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'10\' height=\'10\' fill=\'%234A5568\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%234A5568\'/%3E%3Crect x=\'10\' width=\'10\' height=\'10\' fill=\'%23718096\'/%3E%3Crect y=\'10\' width=\'10\' height=\'10\' fill=\'%23718096\'/%3E%3C/svg%3E")' }}
                              />
                          )}
                      </>
                  )}
              </div>
              {finalImageUrl && !isLoading && (
                  <button onClick={handleDownloadImage} className="w-full mt-4 py-3 px-4 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all">
                      تحميل الصورة
                  </button>
              )}
            </div>
            </div>
          
          {/* Content Sections */}
          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">لماذا تتميز أداة إزالة الخلفية لدينا؟</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-lime-400 mb-2">فورية ومجانية</h3>
                          <p className="text-gray-300">احصل على صورة احترافية خلال ثوانٍ. خدمتنا مجانية بالكامل، بدون رسوم خفية أو الحاجة للتسجيل.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-lime-400 mb-2">دقة عالية</h3>
                          <p className="text-gray-300">يتعرف الذكاء الاصطناعي على العنصر الأساسي في الصورة بدقة، ويتعامل مع أدق التفاصيل مثل الشعر والفراء بسهولة.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-lime-400 mb-2">حرية الإبداع</h3>
                          <p className="text-gray-300">لا تكتفِ بالخلفية الشفافة. أضف لمستك الإبداعية باختيار لون جديد أو دمج صورتك مع خلفية مخصصة.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-lime-400 mb-2">الخصوصية أولاً</h3>
                          <p className="text-gray-300">نحن نحترم خصوصيتك. يتم معالجة صورك ثم حذفها من خوادمنا. لا نقوم بتخزين أو استخدام صورك إطلاقًا.</p>
                      </div>
                  </div>
              </section>

            <section className="mt-20">
              <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">دليلك السريع لصورة مثالية</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">
                      وداعاً للبرامج المعقدة والتعديل اليدوي الممل. تم تصميم أداتنا المجانية لتفريغ الصور لتكون سريعة وبسيطة. ببضع نقرات فقط، يمكنك تحويل صورتك وجعل خلفيتها شفافة أو استبدالها بخلفية جديدة تمامًا. إليك كيف تحصل على نتيجة احترافية دون عناء.
                  </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                      <p className="text-lime-400 font-bold text-lg mb-2">الخطوة 1: ارفع صورتك</p>
                      <p className="text-gray-300">
                          ابدأ بالضغط على "اختر صورة" وحدد الصورة التي ترغب في تعديلها. للحصول على أفضل النتائج، استخدم صورًا ذات عنصر أساسي واضح (مثل شخص، منتج، أو حيوان) مع خلفية مميزة نسبيًا.
                      </p>
                  </div>
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                      <p className="text-lime-400 font-bold text-lg mb-2">الخطوة 2: إزالة الخلفية بنقرة واحدة</p>
                      <p className="text-gray-300">
                          بمجرد أن تكون صورتك جاهزة، اضغط ببساطة على زر "إزالة الخلفية". في لحظات، سيقوم الذكاء الاصطناعي بتحليل صورتك، وتحديد العنصر الأمامي، ومسح الخلفية بدقة، لتحصل على صورة عالية الجودة بخلفية شفافة (PNG).
                      </p>
                  </div>
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                      <p className="text-lime-400 font-bold text-lg mb-2">الخطوة 3: التخصيص والتحميل</p>
                      <p className="text-gray-300">
                          هنا يبدأ الإبداع! يمكنك الآن تحميل الصورة فورًا، أو استخدام خيارات التخصيص لإضافة لون ثابت جديد أو رفع صورة مخصصة لإنشاء مشهد فريد. بعد اختيار خلفيتك الجديدة، اضغط على زر <strong>"تطبيق الخلفية"</strong> لترى التغييرات. عندما تعجبك النتيجة، اضغط على "تحميل" لتحفظ تحفتك الفنية الجديدة!
                      </p>
                  </div>
              </div>
          </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">الأسئلة الشائعة</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-lime-400 mb-2">{faq.question}</h3>
                              <div className="text-gray-300 leading-relaxed">{faq.answer}</div>
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

export default ImageBackgroundToolPageArabic;
