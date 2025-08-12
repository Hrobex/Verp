import { useState, useRef } from 'react';

const faqData = [
  {
    question: 'كيف تعمل تقنية ترميم الصور بالذكاء الاصطناعي؟',
    answer: 'تم تدريب نموذج الذكاء الاصطناعي الخاص بنا على آلاف الصور لفهم أنواع التلف الشائعة مثل الخدوش، التجاعيد، بهتان الألوان، والتشويش. يقوم النموذج بإعادة بناء المناطق المتضررة بذكاء وتحسين الجودة العامة لإعادة الصورة إلى أقرب شكل ممكن من حالتها الأصلية.'
  },
  {
    question: 'هل يمكن للأداة إصلاح الصور شديدة التلف أو المشوشة؟',
    answer: 'يمكنها إحداث فرق كبير! بالنسبة للصور التي بها خدوش أو بهتان أو تلف متوسط، غالبًا ما تكون النتائج ممتازة. أما بالنسبة للصور المشوشة بشدة أو التي بها أجزاء مفقودة، سيبذل الذكاء الاصطناعي قصارى جهده لتحسين الوضوح وإصلاح ما يمكن إصلاحه، لكن قد تختلف النتائج.'
  },
  {
    question: 'هل أداة إصلاح الصور هذه مجانية تمامًا؟',
    answer: 'نعم، 100%. أداة PhotoRevive AI مجانية بالكامل، وبدون أي حدود على عدد الصور التي يمكنك ترميمها. نحن نؤمن بأن كل شخص يجب أن يكون قادرًا على الحفاظ على ذكرياته الثمينة دون أي تكلفة.'
  },
  {
    question: 'ما هي صيغ الملفات التي يمكنني رفعها؟',
    answer: 'يمكنك رفع معظم صيغ الصور الشائعة، بما في ذلك JPG، PNG، و WEBP. للحصول على أفضل النتائج، نوصي باستخدام أعلى جودة ممكنة للنسخة الممسوحة ضوئيًا أو الرقمية من صورتك القديمة.'
  },
];

function PhotoRevivePageAr() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultImageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setRestoredImage(null);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRestorePhoto = async () => {
    if (!selectedFile) {
      setError('يرجى رفع صورة لترميمها.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setRestoredImage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await fetch('/api/tools?tool=photo-restoration', {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'فشل الخادم في معالجة الصورة.');
        }

        const result = await response.json();
        
        if (result.sketch_image_base64) {
             setRestoredImage(result.sketch_image_base64);
        } else {
            throw new Error('لم يتمكن الذكاء الاصطناعي من معالجة الصورة. يرجى تجربة صورة مختلفة.');
        }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!resultImageRef.current?.src) return;
    const link = document.createElement('a');
    link.href = resultImageRef.current.src;
    link.download = `restored_photo_from_aiconvert.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <title>ترميم الصور بالذكاء الاصطناعي | استعادة ومعالجة الصور القديمة مجانًا</title>
      <meta name="description" content="استمتع بترميم، معالجة، وإصلاح الصور القديمة والتالفة بالذكاء الاصطناعي أونلاين مجانًا مع PhotoRevive AI. أزل الخدوش وحسّن الجودة الآن!" />
      <link rel="canonical" href="https://aiconvert.online/ar/restore-and-repair-old-photos" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/restore-and-repair-old-photos" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/restore-and-repair-old-photos" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/restore-and-repair-old-photos" />
      <script type="application/ld+json">
{`
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PhotoRevive: ترميم الصور بالذكاء الاصطناعي",
    "description": "أداة مجانية تعمل بالذكاء الاصطناعي لترميم الصور القديمة والتالفة. تقوم تلقائيًا بإزالة الخدوش، إصلاح التمزقات، تحسين الجودة، وإصلاح الألوان الباهتة.",
    "operatingSystem": "WEB",
    "applicationCategory": "ImageProcessingApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }
`}
</script>
      
      <div className="pt-24 bg-gray-900 text-white min-h-screen font-sans">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8" dir="rtl">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-cyan-500">
              PhotoRevive: ترميم الصور بالذكاء الاصطناعي مجانًا
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              لا تدع الزمن يسرق ذكرياتك. ارفع صور عائلتك القديمة، المخدوشة أو التالفة، ودع الذكاء الاصطناعي يعيد لها مجدها الأصلي مجانًا.
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="w-full flex flex-col items-center">
                <h3 className="text-xl font-semibold text-gray-300 mb-4">قبل</h3>
                <div className="w-full h-80 bg-gray-800 rounded-lg flex items-center justify-center p-2 border-2 border-dashed border-gray-600">
                  {imagePreview ? (
                    <img src={imagePreview} alt="صورة قديمة أو تالفة قبل الترميم" className="max-w-full max-h-full object-contain rounded-md" />
                  ) : (
                    <div className="text-center text-gray-500 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <p>ارفع صورتك القديمة هنا</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full flex flex-col items-center">
                <h3 className="text-xl font-semibold text-gray-300 mb-4">بعد</h3>
                <div className="w-full h-80 bg-black/20 rounded-lg flex items-center justify-center p-2 border-2 border-dashed border-cyan-500/50 relative">
                  
                  {isLoading && (
                    <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-lg">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
                      <p className="text-gray-300 mt-4">نعيد إحياء ذكرياتك...</p>
                    </div>
                  )}
               
                  {!isLoading && restoredImage && (
                    <img ref={resultImageRef} src={restoredImage} alt="صورة قديمة بعد ترميمها بالذكاء الاصطناعي" className="max-w-full max-h-full object-contain rounded-md" />
                  )}
                   {!isLoading && !restoredImage && (
                   <div className="text-center text-gray-500">
                       <p>ستظهر هنا صورتك المرممة</p>
                   </div>
                  )}
                  {error && <p className="text-red-400 text-center p-4">{error}</p>}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col items-center justify-center gap-6">
                 <div className="flex items-center gap-4">
                     <label htmlFor="file-upload" className="w-full sm:w-auto cursor-pointer py-3 px-8 text-lg font-bold text-gray-800 bg-amber-400 rounded-lg hover:bg-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300">
                        {selectedFile ? 'تغيير الصورة' : 'رفع صورة'}
                    </label>
                    <input id="file-upload" ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  <button
                    onClick={handleRestorePhoto}
                    disabled={isLoading || !selectedFile}
                    className="w-full sm:w-auto py-3 px-8 text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-cyan-600 rounded-lg hover:from-amber-600 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? 'جاري الترميم...' : 'ترميم الصورة'}
                  </button>
                </div>
                {restoredImage && !isLoading && (
                 <button
                    onClick={handleDownload}
                    className="w-full sm:w-auto py-3 px-8 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
                  >
                    تحميل الصورة المرممة
                  </button>
              )}
            </div>
          </div>
          
          <section className="mt-20">
              <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">كيفية ترميم صورتك في 3 خطوات بسيطة</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">تم تصميم عمليتنا لتكون سهلة للغاية. احصل على صورتك المرممة بشكل جميل في أقل من دقيقة.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                      <p className="text-amber-400 font-bold text-lg mb-2">1. ارفع صورتك</p>
                      <p className="text-gray-300">انقر على زر "رفع صورة" واختر صورة قديمة، مخدوشة أو باهتة من جهازك.</p>
                  </div>
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                      <p className="text-amber-400 font-bold text-lg mb-2">2. اضغط على "ترميم"</p>
                      <p className="text-gray-300">اضغط على زر "ترميم الصورة" ودع الذكاء الاصطناعي يحلل ويصلح التلف، من الخدوش إلى الألوان الباهتة.</p>
                  </div>
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                      <p className="text-amber-400 font-bold text-lg mb-2">3. حمّل وشارك</p>
                      <p className="text-gray-300">ستظهر ذكرىك التي تم إحياؤها. قم بتنزيل الصورة المرممة عالية الجودة وشاركها مع أحبائك.</p>
                  </div>
              </div>
          </section>

          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">امنح صورك القديمة فرصة جديدة للحياة</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">
                    أداة إصلاح الصور الخاصة بنا مدربة على فهم وإصلاح المشاكل الشائعة في الصور القديمة، من التلف المادي إلى تأثيرات الزمن.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-amber-400 mb-2">إزالة الخدوش والتمزقات</h3>
                          <p className="text-gray-300">قم بمحو الشقوق والخدوش والتجاعيد التي تشوه صور عائلتك الثمينة بذكاء وفعالية.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-amber-400 mb-2">تحسين الجودة</h3>
                          <p className="text-gray-300">حسّن الحدة والوضوح في الصور القديمة المشوشة أو الباهتة، لتكشف عن تفاصيل ظننت أنها فُقدت.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-amber-400 mb-2">إصلاح الألوان الباهتة</h3>
                          <p className="text-gray-300">أعد الحيوية للصور الفوتوغرافية الباهتة، وقم بتصحيح الألوان لتبدو جديدة ومشرقة كما كانت.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-amber-400 mb-2">مجانًا وآمن</h3>
                          <p className="text-gray-300">قم بترميم عدد غير محدود من الصور مجانًا. تتم معالجة صورك بأمان ولا يتم تخزينها أبدًا.</p>
                      </div>
                  </div>
              </section>

              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">أسئلة شائعة</h2>
                  <div className="space-y-4">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-cyan-400 mb-2">{faq.question}</h3>
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

export default PhotoRevivePageAr;
