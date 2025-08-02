import { useState } from 'react';
import { Link } from 'react-router-dom';

// --- ثوابت البيانات ---

// خيارات الحجم مترجمة
const sizeOptions = [
  { label: 'مربع (1024x1024)', value: '1024x1024' },
  { label: 'شاشة عريضة (1024x576)', value: '1024x576' },
  { label: 'صورة طولية (576x1024)', value: '576x1024' },
];

// النص الخفي الذي يضاف للـ prompt لتحقيق الأسلوب الفني (يبقى بالإنجليزية للـ API)
const ARTISTIC_SUFFIX = ', masterpiece, concept art, high detail, sharp focus, cinematic lighting';

// بيانات الأسئلة الشائعة - مترجمة ومكيفة لـ Artigen V2
const faqData = [
    {
        question: 'ما الذي يميز Artigen V2 عن أدوات توليد الصور الأخرى؟',
        answer: 'Artigen V2 هو أداة فنية متخصصة ومميزة. بينما تركز الأدوات الأخرى على توفير أنماط متعددة، تم تصميم Artigen V2 بعناية فائقة لإنتاج أعمال فنية فريدة وعالية الجودة بلمسة جمالية خاصة. فكر فيه كفرشاة فنان خبير، مصممة لتحويل كلماتك إلى لوحة فنية رقمية.'
    },
    {
        question: 'متى أستخدم Artigen V2 ومتى أستخدم Artigen Pro؟',
        answer: (
            <>
                الأمر يعتمد على هدفك. استخدم <strong className="text-yellow-400">Artigen V2</strong> عندما تبحث عن تفسير فني فريد لفكرتك بجمالية مميزة. واستخدم <Link to="/ar/generate-image-pro" className="text-purple-400 hover:underline">Artigen Pro</Link> عندما تحتاج إلى تحكم أكبر في أنماط محددة مثل "فوتوغرافي" أو "سينمائي" وتريد أداة شاملة ومتعددة الاستخدامات.
            </>
        )
    },
    {
        question: 'هل هذا المولد الفني مجاني بالكامل؟',
        answer: 'نعم، Artigen V2 مجاني 100%. نؤمن بجعل الأدوات الإبداعية القوية في متناول الجميع، بدون اشتراكات، أو حدود للاستخدام، أو حاجة للتسجيل.'
    },
    {
        question: 'ما هي حقوق استخدام الصور التي أقوم بإنشائها؟',
        answer: 'الصور التي تنشئها باستخدام Artigen V2 هي ملكك ولك مطلق الحرية في استخدامها. يتم إصدارها بموجب ترخيص المشاع الإبداعي (CC0)، مما يعني أنها ملكية عامة للمشاريع الشخصية والتجارية، دون الحاجة لذكر المصدر.'
    },
];

function ArtigenV2PageArabic() {
  const [prompt, setPrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState('1024x1024');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = async () => {
    const userPrompt = prompt.trim();
    if (!userPrompt) {
      setError('يرجى إدخال وصف لإنشاء لوحتك الفنية.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrl('');

    // --- ترجمة النص إلى الإنجليزية قبل إرساله للـ API ---
    let translatedPrompt = userPrompt;
    try {
      const langPair = "ar|en";
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(userPrompt)}&langpair=${langPair}&mt=1`;
      
      const translateResponse = await fetch(apiUrl);
      if (translateResponse.ok) {
        const translateData = await translateResponse.json();
        if (translateData.responseData && translateData.responseData.translatedText &&
            translateData.responseData.translatedText.trim().toLowerCase() !== userPrompt.toLowerCase()) {
          translatedPrompt = translateData.responseData.translatedText;
        }
      }
    } catch (err) {
      console.error("Translation API failed, using original prompt:", err);
    }
    
    // --- تجهيز البيانات للـ API ---
    const finalPrompt = translatedPrompt + ARTISTIC_SUFFIX;
    const [width, height] = selectedSize.split('x');
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const seed = Date.now();

    // --- بناء رابط الـ API ---
    const constructedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=${width}&height=${height}&seed=${seed}&nologo=true`;

    const img = new Image();
    img.src = constructedUrl;

    img.onload = () => {
      setImageUrl(constructedUrl);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError('فشل توليد الصورة الفنية. قد تكون الخدمة مشغولة. يرجى المحاولة مرة أخرى بعد لحظات.');
      setIsLoading(false);
    };
  };
  
  const handleDownloadClick = async () => {
      if (!imageUrl) return;
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const filename = `${prompt.substring(0, 25).replace(/\s/g, '_') || 'artigen_v2'}_art.png`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        setError('فشل التحميل. يمكنك محاولة النقر بزر الماوس الأيمن على الصورة واختيار "حفظ الصورة باسم".');
      }
  };

  return (
    <>
      <title>Artigen V2: مولد الفن المجاني بالذكاء الاصطناعي | حوّل النص إلى صور فنية</title>
      <meta name="description" content="حوّل نصك إلى فن فريد وعالي الجودة مع Artigen V2. مولد الفنون المجاني بالذكاء الاصطناعي الخاص بنا مصمم لإنتاج صور ذات جمالية فنية مميزة. لا يتطلب تسجيل." />
      <link rel="canonical" href="https://aiconvert.online/ar/artigenv2" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/artigenv2" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/artigenv2" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/artigenv2" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Artigen V2: مولد فنون بالذكاء الاصطناعي",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "description": "مولد فنون مجاني بالذكاء الاصطناعي متخصص في إنتاج صور فريدة وعالية الجودة ذات جمالية فنية مميزة من الأوصاف النصية.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "910"
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">
              Artigen V2: صانع الفن بالذكاء الاصطناعي
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              حوّل كلماتك إلى لوحات فنية مذهلة وفريدة من نوعها. تم تصميم ذكائنا الاصطناعي لتقديم صور إبداعية وعالية الجودة بلمسة فنية مميزة.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* --- عمود التحكم --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <div>
                <label htmlFor="prompt-input" className="block text-lg font-semibold text-gray-200 mb-2">١. صِف رؤيتك الفنية</label>
                <textarea
                  id="prompt-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="مثال: أسد مهيب يرتدي تاجًا من النجوم، لوحة رقمية"
                  className="w-full h-36 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                />
              </div>
              
              <div>
                <label htmlFor="size-select" className="block text-lg font-semibold text-gray-200 mb-2">٢. اختر أبعاد اللوحة</label>
                <select
                  id="size-select"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  {sizeOptions.map(size => (<option key={size.value} value={size.value}>{size.label}</option>))}
                </select>
              </div>

              <button
                onClick={handleGenerateClick}
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? 'جاري إبداع لوحتك...' : 'حوّل إلى فن'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* --- عمود النتائج --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center h-96 lg:h-auto min-h-[28rem]">
              <div className="w-full h-full flex justify-center items-center border-2 border-dashed border-gray-600 rounded-lg relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-lg">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
                    <p className="text-gray-300 mt-4">الذكاء الاصطناعي يرسم فكرتك...</p>
                  </div>
                )}
                {!isLoading && !imageUrl && (<div className="text-center text-gray-400"><p>لوحتك الفنية ستظهر هنا</p></div>)}
                {imageUrl && !isLoading && (<img src={imageUrl} alt={prompt || "صورة فنية تم إنشاؤها"} className="max-w-full max-h-full object-contain rounded-lg" />)}
              </div>
              {imageUrl && !isLoading && (<button onClick={handleDownloadClick} className="w-full mt-6 py-3 px-4 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all">تحميل الصورة</button>)}
            </div>
          </div>

          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">فنان ذكاء اصطناعي لأفكارك الإبداعية</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">Artigen V2 هو أكثر من مجرد أداة؛ إنه شريكك في الإبداع. لقد ركزنا على الجودة الفنية لتتمكن أنت من التركيز على رؤيتك.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-yellow-400 mb-2">جمالية مميزة</h3><p className="text-gray-300">يولد صورًا ذات طابع فني فريد ومعروف، مما يجعل إبداعاتك تبرز وتلفت الأنظار.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-yellow-400 mb-2">جودة فائقة</h3><p className="text-gray-300">تم تحسين نموذجنا لإنتاج صور عالية الدقة والتفاصيل، مناسبة لأي مشروع فني.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-yellow-400 mb-2">تصميم بلا عناء</h3><p className="text-gray-300">واجهة بسيطة تتيح لك الانتقال من فكرة إلى عمل فني مكتمل في ثوانٍ. لا توجد إعدادات معقدة.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-yellow-400 mb-2">مجاني بالكامل</h3><p className="text-gray-300">أطلق العنان لإبداعك بلا حدود. Artigen V2 مجاني، بدون الحاجة للتسجيل أو دفع اشتراكات.</p></div>
                  </div>
              </section>

              <section className="mt-20 text-center">
                   <h2 className="text-3xl font-bold mb-4">كيف تنشئ لوحة فنية مع Artigen V2</h2>
                   <p className="max-w-3xl mx-auto text-gray-400 mb-12">خطوتان فقط تفصلان بين خيالك وعمل فني مكتمل.</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                       <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-yellow-400 font-bold text-lg mb-2">الخطوة ١: اكتب وصاً فنياً</p><p className="text-gray-300">صِف العمل الفني الذي تريد إنشاءه. كن مبدعًا ومفصلاً قدر الإمكان. الذكاء الاصطناعي يزدهر على الأوصاف الغنية.</p></div>
                       <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-yellow-400 font-bold text-lg mb-2">الخطوة ٢: اختر الأبعاد</p><p className="text-gray-300">حدد الأبعاد المثالية لقطعتك الفنية—مربعة، عريضة، أو طولية—لتناسب احتياجاتك بشكل مثالي.</p></div>
                       <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-yellow-400 font-bold text-lg mb-2">الخطوة ٣: أنشئ وحمّل</p><p className="text-gray-300">اضغط على "حوّل إلى فن" وشاهد الذكاء الاصطناعي يجسد مفهومك. عملك الفني الفريد سيكون جاهزًا للتحميل.</p></div>
                   </div>
              </section>

              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">أسئلة شائعة</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-yellow-400 mb-2">{faq.question}</h3>
                              <div className="text-gray-300 leading-relaxed">{typeof faq.answer === 'string' ? <p>{faq.answer}</p> : faq.answer}</div>
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

export default ArtigenV2PageArabic;
