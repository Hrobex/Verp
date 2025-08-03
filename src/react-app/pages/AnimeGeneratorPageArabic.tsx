import { useState } from 'react';

// --- ثوابت البيانات ---

// خيارات الحجم مترجمة
const sizeOptions = [
  { label: 'مربع (1024x1024)', value: '1024x1024' },
  { label: 'صورة طولية (576x1024)', value: '576x1024' },
  { label: 'شاشة عريضة (1024x576)', value: '1024x576' },
];

// خيارات الأنماط مترجمة، مع الاحتفاظ بالنص الخفي بالإنجليزية للـ API
const animeStyleOptions = [
    { 
        id: 'modern', 
        name: 'نمط حديث', 
        prompt_suffix: ', modern anime style, digital illustration, studio quality, vibrant colors, clean line art, sharp details' 
    },
    { 
        id: 'retro', 
        name: 'نمط التسعينات', 
        prompt_suffix: ', 90s anime screenshot, retro art style, cel-shaded, muted colors, subtle film grain, nostalgic aesthetic' 
    },
    { 
        id: 'chibi', 
        name: 'نمط تشيبي', 
        prompt_suffix: ', cute chibi style, super deformed, kawaii, clean line art, vibrant, sticker design' 
    },
    { 
        id: 'painterly', 
        name: 'نمط فني', 
        prompt_suffix: ', ghibli-inspired art style, beautiful detailed background, painterly, whimsical, soft colors, hand-drawn aesthetic' 
    }
];

// بيانات الأسئلة الشائعة مترجمة ومحدثة بالكامل
const faqData = [
    {
        question: 'كيف يمكنني تصميم شخصية أنمي أصلية خاصة بي؟',
        answer: 'بالتأكيد! هذه الأداة مثالية لإحياء شخصياتك المبتكرة (OCs). كل ما عليك هو تقديم وصف تفصيلي لمظهر الشخصية وملابسها، وسيقوم الذكاء الاصطناعي بإنشاء رسم توضيحي فريد لها.'
    },
    {
        question: 'ما هي أفضل طريقة لكتابة وصف لمولد الأنمي هذا؟',
        answer: 'كن محددًا ودقيقًا في الوصف. بدلاً من "فتاة أنمي"، جرب "فتاة أنمي مرحة بشعر وردي طويل وعيون زرقاء، ترتدي زيًا مدرسيًا، وتقف تحت شجرة ساكورا". كلما زادت التفاصيل، استطاع الذكاء الاصطناعي تجسيد رؤيتك بشكل أفضل.'
    },
    {
        question: 'هل يمكنني استخدام الصور التي أنشئها كصورة بروفايل (PFP)؟',
        answer: 'نعم! الحجم المربع مثالي لإنشاء صور بروفايل أنمي مخصصة لحساباتك على وسائل التواصل الاجتماعي. ويعتبر "نمط تشيبي" خيارًا شائعًا جدًا لعمل صور رمزية (أفاتار) لطيفة وفريدة.'
    },
    {
        question: 'هل هذه الأداة آمنة للاستخدام؟',
        answer: 'نعم، الأداة مصممة لإنتاج صور ورسومات فنية آمنة للعمل (SFW). تقوم بتوليد الصور بناءً على الأوصاف النصية فقط، وهي مثالية لتصميم الشخصيات ورواية القصص وفن الأنمي بشكل عام.'
    },
];

function AnimeGeneratorPageArabic() {
  const [prompt, setPrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState('1024x1024');
  const [selectedAnimeStyle, setSelectedAnimeStyle] = useState('modern');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = async () => {
    const userPrompt = prompt.trim();
    if (!userPrompt) {
      setError('يرجى وصف شخصية أو مشهد الأنمي الذي تريد إنشاءه.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrl('');

    let translatedPrompt = userPrompt;
    try {
      const langPair = "ar|en"; 
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(userPrompt)}&langpair=${langPair}&mt=1`;
      const translateResponse = await fetch(apiUrl);
      if (translateResponse.ok) {
        const translateData = await translateResponse.json();
        if (translateData.responseData?.translatedText) {
          translatedPrompt = translateData.responseData.translatedText;
        }
      }
    } catch (err) {
      console.error("Translation API failed, using original prompt:", err);
    }

    const styleSuffix = animeStyleOptions.find(s => s.id === selectedAnimeStyle)?.prompt_suffix || '';
    const finalPrompt = translatedPrompt + styleSuffix;
    const [width, height] = selectedSize.split('x');
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const seed = Date.now();

    const constructedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=${width}&height=${height}&seed=${seed}&nologo=true`;

    const img = new Image();
    img.src = constructedUrl;

    img.onload = () => {
      setImageUrl(constructedUrl);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError('فشل إنشاء الصورة. قد تكون خدمة الذكاء الاصطناعي مشغولة. يرجى المحاولة مرة أخرى.');
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
        const filename = `${prompt.substring(0, 25).replace(/\s/g, '_') || 'anime'}_art.png`;
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
      <title>مولد أنمي مجاني بالذكاء الاصطناعي | أنشئ صور أنمي من النص</title>
      <meta name="description" content="حوّل أفكارك إلى حقيقة مع مولد الأنمي المجاني بالذكاء الاصطناعي. صمم شخصيات ورسومات أنمي فريدة بأنماط متنوعة وعالية الجودة." />
      <link rel="canonical" href="https://aiconvert.online/ar/anime-ai" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/anime-ai" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/anime-ai" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/anime-ai" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "name": "مولد أنمي بالذكاء الاصطناعي",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "description": "صانع صور أنمي مجاني يحول النص إلى شخصيات ورسومات أنمي أصلية بأنماط مختلفة مثل الحديث، التسعينات، وتشيبي.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "2580"
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-600">
              مولد صور الأنمي بالذكاء الاصطناعي
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              صانع شخصيات الأنمي الخاص بك. صِف رؤيتك، اختر نمطك، ودع الذكاء الاصطناعي يولد لك صور أنمي فريدة وعالية الجودة على الفور.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* --- عمود التحكم --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <div>
                <label htmlFor="prompt-input" className="block text-lg font-semibold text-gray-200 mb-2">١. صِف شخصيتك</label>
                <textarea
                  id="prompt-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="مثال: فتاة محاربة قوية بشعر أحمر ناري وعيون خضراء"
                  className="w-full h-24 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-200 mb-2">٢. اختر نمط الأنمي</label>
                <div className="grid grid-cols-2 gap-3">
                  {animeStyleOptions.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedAnimeStyle(style.id)}
                      className={`py-3 px-2 text-center rounded-lg transition-all duration-200 ${
                        selectedAnimeStyle === style.id 
                        ? 'bg-pink-600 text-white font-bold ring-2 ring-pink-400' 
                        : 'bg-gray-700 hover:bg-gray-600/70'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="size-select" className="block text-lg font-semibold text-gray-200 mb-2">٣. حدد حجم الصورة</label>
                <select
                  id="size-select"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  {sizeOptions.map(size => (<option key={size.value} value={size.value}>{size.label}</option>))}
                </select>
              </div>

              <button
                onClick={handleGenerateClick}
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg hover:from-pink-600 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'جاري الإنشاء...' : 'أنشئ صورة الأنمي'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* --- عمود النتائج --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center h-96 lg:h-auto min-h-[28rem]">
              <div className="w-full h-full flex justify-center items-center border-2 border-dashed border-gray-600 rounded-lg relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-lg">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
                    <p className="text-gray-300 mt-4">نُحيي شخصيتك...</p>
                  </div>
                )}
                {!isLoading && !imageUrl && (<div className="text-center text-gray-400"><p>صورتك ستظهر هنا</p></div>)}
                {imageUrl && !isLoading && (<img src={imageUrl} alt={prompt || "صورة أنمي تم إنشاؤها"} className="max-w-full max-h-full object-contain rounded-lg" />)}
              </div>
              {imageUrl && !isLoading && (<button onClick={handleDownloadClick} className="w-full mt-6 py-3 px-4 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all">تحميل الصورة</button>)}
            </div>
          </div>

          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">الأداة المثالية لكل محبي الأنمي</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">سواء كنت تصمم شخصياتك الأصلية (OCs)، أو تبحث عن صورة بروفايل فريدة، أو تستكشف إبداعك، فإن أداتنا توفر لك كل ما تحتاجه.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-pink-400 mb-2">أنماط أنمي متنوعة</h3><p className="text-gray-300">انتقل من النمط الحديث إلى نمط التسعينات، تشيبي، أو النمط الفني بنقرة واحدة لتناسب رؤيتك.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-pink-400 mb-2">مجاني وبلا حدود</h3><p className="text-gray-300">إبداعك لا يجب أن يكون له ثمن. استمتع بتوليد وتحميل عدد غير محدود من الصور مجانًا.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-pink-400 mb-2">بدون تسجيل</h3><p className="text-gray-300">نحترم وقتك. ابدأ في التصميم فورًا دون الحاجة إلى إنشاء حساب أو تسجيل الدخول.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-pink-400 mb-2">نتائج عالية الجودة</h3><p className="text-gray-300">احصل على رسومات بأسلوب المانجا والأنمي عالية الدقة والتفاصيل ومناسبة لأي استخدام.</p></div>
                  </div>
              </section>

              <section className="mt-20 text-center">
                   <h2 className="text-3xl font-bold mb-4">كيف تصمم شخصية أنمي في 3 خطوات</h2>
                   <p className="max-w-3xl mx-auto text-gray-400 mb-12">عمليتنا بسيطة جدًا. أنت على بعد لحظات فقط من إنشاء تصميم أنمي مخصص بالكامل.</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                       <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-pink-400 font-bold text-lg mb-2">الخطوة ١: صِف الفكرة</p><p className="text-gray-300">اكتب وصفًا تفصيليًا لشخصيتك أو مشهدك. فكر في لون الشعر، الملابس، والحالة المزاجية.</p></div>
                       <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-pink-400 font-bold text-lg mb-2">الخطوة ٢: اختر النمط</p><p className="text-gray-300">اختر أسلوب رسم الأنمي الذي يناسب رؤيتك، من الخطوط النظيفة للنمط الحديث إلى حنين الماضي في نمط التسعينات.</p></div>
                       <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-pink-400 font-bold text-lg mb-2">الخطوة ٣: أنشئ وشارك</p><p className="text-gray-300">حدد حجم صورتك واضغط على "أنشئ". صورتك الفريدة ستكون جاهزة للتحميل والمشاركة مع العالم.</p></div>
                   </div>
              </section>

              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">أسئلة شائعة</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-pink-400 mb-2 text-right">{faq.question}</h3>
                              <div className="text-gray-300 leading-relaxed text-right"><p>{faq.answer}</p></div>
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

export default AnimeGeneratorPageArabic;
