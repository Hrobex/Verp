// الملف: ColorifyProPageArabic.tsx
import { useState, useRef, ChangeEvent } from 'react';

// --- بيانات الأسئلة الشائعة (مُحسّنة للسيو باللغة العربية) ---
const faqData = [
    {
        question: 'كيف يضيف الذكاء الاصطناعي الألوان للصور الأبيض والأسود؟',
        answer: 'تم تدريب الذكاء الاصطناعي لدينا على ملايين الصور لفهم العلاقة بين الأشكال، التفاصيل، وألوانها الطبيعية. عند رفع صورة بالأبيض والأسود، يقوم الذكاء الاصطناعي بتحليل درجات الرمادي ويتنبأ بذكاء بالألوان الأكثر واقعية لكل عنصر في المشهد، من لون البشرة إلى المناظر الطبيعية.'
    },
    {
        question: 'هل أداة تلوين الصور هذه مجانية تمامًا؟',
        answer: 'نعم، إنها مجانية 100%. يمكنك تلوين صورك دون أي تكلفة، أو رسوم خفية، أو الحاجة لإنشاء حساب. هدفنا هو جعل تكنولوجيا تلوين الصور عالية الجودة في متناول الجميع.'
    },
    {
        question: 'ما هي أنواع الصور التي تعطي أفضل النتائج؟',
        answer: 'للحصول على أفضل النتائج، استخدم صورًا واضحة وعالية الجودة. على الرغم من أن أداتنا تعمل على مجموعة واسعة من الصور، بما في ذلك الصور الباهتة وصور السيبيا، إلا أن الصور المصدرية الواضحة ذات التباين الجيد والتفاصيل الدقيقة تسمح للذكاء الاصطناعي بتقديم توقعات ألوان أكثر دقة. إنها تعمل بشكل رائع على الصور الشخصية والمناظر الطبيعية والصور التاريخية.'
    },
    {
        question: 'ماذا يحدث لصورى التي أرفعها؟',
        answer: 'نحن نأخذ خصوصيتك على محمل الجد. يتم رفع صورك بشكل آمن لغرض وحيد وهو تلوينها. تتم معالجتها تلقائيًا ولا يتم تخزينها على خوادمنا لفترة أطول من اللازم. نحن لا نشارك أو نستخدم صورك لأي غرض آخر.'
    },
];

// --- وظيفة ضغط الصور (تُنفذ في المتصفح) ---
const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                const MAX_WIDTH = 1024;
                const MAX_HEIGHT = 1024;
                let { width, height } = img;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('فشل ضغط الصورة.'));
                    }
                }, 'image/jpeg', 0.9);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

function ColorifyProPageArabic() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sourceFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSourceFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setSourcePreview(reader.result as string);
      reader.readAsDataURL(file);
      setResultImageUrl(null);
      setError(null);
    }
  };

  const handleColorifyClick = async () => {
    if (!sourceFile) {
      setError('يرجى رفع صورة بالأبيض والأسود أولاً.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImageUrl(null);

    try {
      const compressedBlob = await compressImage(sourceFile);
      const formData = new FormData();
      formData.append('file', compressedBlob, sourceFile.name);

      const response = await fetch('/api/tools?tool=colorify-pro', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'فشلت عملية تلوين الصورة. قد يكون الخادم مشغولاً.');
      }
      
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setResultImageUrl(imageUrl);

    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع. يرجى التحقق من اتصالك والمحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (!resultImageUrl) return;
    const link = document.createElement('a');
    link.href = resultImageUrl;
    link.download = 'photo-colorized.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <title>تلوين الصور بالذكاء الاصطناعي | أداة مجانية لتلوين الصور القديمة</title>
      <meta name="description" content="أعد الحياة إلى صورك القديمة بالأبيض والأسود مع أداة تلوين الصور المجانية بالذكاء الاصطناعي. أضف ألوانًا واقعية تلقائيًا للصور القديمة والتاريخية أونلاين في ثوانٍ. لا يتطلب التسجيل." />
      <link rel="canonical" href="https://aiconvert.online/ar/ai-photo-colorizer" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/ai-photo-colorizer" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/ai-photo-colorizer" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/ai-photo-colorizer" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "name": "تلوين الصور بالذكاء الاصطناعي",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "description": "أداة مجانية عبر الإنترنت تستخدم الذكاء الاصطناعي لتلوين الصور الفوتوغرافية بالأبيض والأسود، السيبيا، والقديمة تلقائيًا.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "6550"
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500">
              أعد الحياة إلى ذكرياتك بالألوان
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              أضف فورًا ألوانًا واقعية ونابضة بالحياة إلى صورك القديمة بالأبيض والأسود. أداتنا المجانية بالذكاء الاصطناعي تلون الصور تلقائيًا بنقرة واحدة فقط.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* --- عمود التحكم --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6 items-center">
              <h2 className="text-2xl font-bold text-center">ارفع صورة بالأبيض والأسود</h2>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileSelect} 
                ref={sourceFileInputRef} 
                className="hidden" 
              />
              <div 
                onClick={() => sourceFileInputRef.current?.click()} 
                className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-700/50 transition-colors bg-cover bg-center"
                style={{ backgroundImage: `url(${sourcePreview})` }}
              >
                {!sourcePreview && <p className="text-gray-400">انقر لاختيار صورة</p>}
              </div>

              <button
                onClick={handleColorifyClick}
                disabled={isLoading || !sourceFile}
                className="w-full mt-4 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-red-600 to-green-600 rounded-lg hover:from-red-700 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'جاري التلوين...' : 'لوّن الصورة'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* --- عمود النتائج --- */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg flex flex-col justify-center items-center relative min-h-[28rem]">
              {isLoading && (
                  <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-2xl">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
                    <p className="text-gray-300 mt-4">الذكاء الاصطناعي يستعيد الألوان...</p>
                  </div>
              )}
              
              <div className="w-full h-full flex flex-col justify-center items-center">
                {resultImageUrl ? (
                  <>
                    <img src={resultImageUrl} alt="نتيجة الصورة الملونة بالذكاء الاصطناعي" className="max-h-96 w-auto object-contain rounded-lg"/>
                    <button onClick={handleDownloadClick} className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all">
                      تحميل الصورة الملونة
                    </button>
                  </>
                ) : (
                  <p className="text-gray-400 text-center">صورتك الملونة ستظهر هنا</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">لماذا تستخدم أداة تلوين الصور المجانية؟</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">أعد اكتشاف تاريخك بألوان كاملة. أداتنا ليست مجرد فلتر، بل هي عملية ترميم قائمة على الذكاء الاصطناعي.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-green-400 mb-2">واقعية فائقة</h3><p className="text-gray-300">احصل على ألوان طبيعية وواقعية، وليس مجرد صبغة. الذكاء الاصطناعي لدينا يفهم السياق لتطبيق الظلال الصحيحة.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-green-400 mb-2">فوري ومجاني</h3><p className="text-gray-300">حوّل الصور من ابيض واسود الى الوان في ثوانٍ، بلا حدود ومجانًا بالكامل.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-green-400 mb-2">إحياء الذكريات</h3><p className="text-gray-300">مثالية لإعادة الحياة لألبومات صور العائلة القديمة، الصور التاريخية، والتواصل مع الماضي بصورة جديدة.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-green-400 mb-2">سهولة للجميع</h3><p className="text-gray-300">لا حاجة لبرامج معقدة. فقط ارفع صورتك، اضغط على زر واحد، وقم بتنزيل النتيجة.</p></div>
                  </div>
              </section>

              <section className="mt-20 text-center">
                   <h2 className="text-3xl font-bold mb-4">من الأبيض والأسود إلى الألوان في 3 خطوات</h2>
                   <p className="max-w-3xl mx-auto text-gray-400 mb-12">عمليتنا البسيطة تجعل من السهل على أي شخص إضافة ألوان للصور القديمة ومشاركتها مع العالم.</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-green-400 font-bold text-lg mb-2">١. ارفع صورتك</p><p className="text-gray-300">انقر على منطقة الرفع واختر صورة بالأبيض والأسود، سيبيا، أو باهتة من جهازك.</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-green-400 font-bold text-lg mb-2">٢. انقر "لوّن الصورة"</p><p className="text-gray-300">دع الذكاء الاصطناعي يحلل صورتك. تبدأ هذه العملية على الفور ولا تستغرق سوى بضع لحظات.</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-green-400 font-bold text-lg mb-2">٣. حمّل وشارك</p><p className="text-gray-300">ستكون ذكرياتك الملونة والنابضة بالحياة جاهزة للتنزيل والمشاركة مع العائلة والأصدقاء.</p></div>
                   </div>
              </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">أسئلة شائعة</h2>
                  <div className="space-y-6 text-right">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-green-400 mb-2">{faq.question}</h3>
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

export default ColorifyProPageArabic;
