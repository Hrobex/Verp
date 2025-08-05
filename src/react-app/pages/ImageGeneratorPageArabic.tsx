import { useState } from 'react';
import { Link } from 'react-router-dom';

// قائمة الأنماط أصبحت أبسط، بدون الـ prompt_suffix السري
const styleOptions = [
  { name: 'افتراضي', value: 'default' },
  { name: 'سينمائي', value: 'cinematic' },
  { name: 'فوتوغرافي', value: 'photographic' },
  { name: 'أنمي', value: 'anime' },
  { name: 'فن رقمي', value: 'digital-art' },
  { name: 'فن البكسل', value: 'pixel-art' },
  { name: 'فن خيالي', value: 'fantasy-art' },
  { name: 'نيون بانك', value: 'neonpunk' },
  { name: 'مجسم 3D', value: '3d-model' },
];

const sizeOptions = [
  { label: 'مربع (1024x1024)', value: '1024x1024' },
  { label: 'شاشة عريضة (1024x576)', value: '1024x576' },
  { label: 'صورة طولية (576x1024)', value: '576x1024' },
];

const faqData = [
    {
      question: 'هل أداة Artigen Pro مجانية حقًا؟',
      answer: `نعم، بالتأكيد. Artigen Pro مجاني 100%. لا توجد رسوم خفية، أو خطط اشتراك، أو حدود للاستخدام. هدفنا هو جعل إنشاء صور عالية الجودة بالذكاء الاصطناعي متاحًا للجميع.`
    },
    {
      question: 'هل الصور التي أقوم بإنشائها فريدة تمامًا؟',
      answer: `نعم. في كل مرة تضغط فيها على "توليد الصورة"، حتى مع نفس الوصف تمامًا، يقوم نموذج الذكاء الاصطناعي لدينا بإنشاء صورة جديدة وفريدة بالكامل. ستحصل على نتيجة جديدة مع كل عملية توليد.`
    },
    {
      question: 'ما هو نموذج الذكاء الاصطناعي الذي تعمل به هذه الأداة؟',
      answer: `يعمل Artigen Pro بنموذج FLUX المتقدم، والذي يشتهر بقدرته على فهم الأوصاف النصية المعقدة وترجمتها إلى صور عالية التفاصيل والترابط.`
    },
    {
      question: 'هل يمكنني استخدام الصور التي تم إنشاؤها في مشاريعي؟',
      answer: `الصور التي تم إنشاؤها بواسطة هذه الأداة تصدر بموجب ترخيص Creative Commons (CC0)، مما يعني أنها في الملكية العامة. لك مطلق الحرية في استخدامها للمشاريع الشخصية والتجارية دون الحاجة إلى ذكر المصدر.`
    },
    {
        question: `ما الفرق بين Artigen Pro و Artigen V2؟`,
        answer: (
            <>
                يقدم كلا النموذجين نتائج إبداعية مذهلة، لكن لكل منهما نقطة قوة. يبرع <strong>Artigen Pro</strong> في توليد كافة الأنماط بدقة عالية، من الصور الواقعية إلى التصميمات الفنية المعقدة. 
                بينما يتميز <Link to="https://aiconvert.online/ar/artigenv2/" className="text-purple-400 hover:underline">Artigen V2</Link> بشكل خاص في إنتاج صور ذات طابع فني فريد وجمالي، مما يجعله الخيار الأمثل للمستخدمين الذين يبحثون عن لمسة فنية مميزة.
            </>
        )
    }
];


function ImageGeneratorPageArabic() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('default');
  const [selectedSize, setSelectedSize] = useState('1024x1024');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = async () => {
    const userPrompt = prompt.trim();
    if (!userPrompt) {
      setError('يرجى إدخال وصف للصورة.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrl('');
    
    try {
        const response = await fetch('/api/image-generators?tool=image-pro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userPrompt: userPrompt,
                style: selectedStyle,
                size: selectedSize,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'فشل توليد الصورة.');
        }

        const generatedUrl = data.imageUrl;
        
        const img = new Image();
        img.src = generatedUrl;

        img.onload = () => {
            setImageUrl(generatedUrl);
            setIsLoading(false);
        };

        img.onerror = () => {
            setError('فشل تحميل الصورة. قد تكون خدمة الذكاء الاصطناعي مشغولة. يرجى المحاولة مرة أخرى لاحقًا.');
            setIsLoading(false);
        };
    } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
    }
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
        const filename = `${prompt.substring(0, 20).replace(/\s/g, '_') || 'generated'}_image.png`;
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
      <title>Artigen Pro: مولد الصور المجاني بالذكاء الاصطناعي من النص</title>
      <meta name="description" content="أنشئ صورًا مذهلة وفريدة من الأوصاف النصية مع Artigen Pro. مولد الصور المجاني بالذكاء الاصطناعي يحول أفكارك إلى حقيقة فورًا. لا يتطلب تسجيل." />
      <link rel="canonical" href="https://aiconvert.online/ar/generate-image-pro" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/generate-image-pro" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/generate-image-pro" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/generate-image-pro" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "name": "Artigen Pro: مولد الصور بالذكاء الاصطناعي",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1840"
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Artigen Pro: مولد الصور بالذكاء الاصطناعي
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              حوّل أفكارك إلى حقيقة. صِف أي شيء تتخيله، اختر نمطًا، وشاهد أداة تحويل النص إلى صورة المجانية تنشئ لك تحفة فنية فريدة.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <div>
                <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-2">١. صِف صورتك</label>
                <textarea
                  id="prompt-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="مثال: قط رائد فضاء لطيف يطفو في الفضاء"
                  className="w-full h-24 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">٢. اختر نمطًا</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {styleOptions.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setSelectedStyle(style.value)}
                      className={`p-2 text-center text-sm rounded-lg transition-all duration-200 ${
                        selectedStyle === style.value ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-400' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="size-select" className="block text-sm font-medium text-gray-300 mb-2">٣. حدد حجم الصورة</label>
                <select
                  id="size-select"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {sizeOptions.map(size => (<option key={size.value} value={size.value}>{size.label}</option>))}
                </select>
              </div>
              <button
                onClick={handleGenerateClick}
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? 'جاري التوليد...' : 'توليد الصورة'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center h-96 lg:h-auto">
              <div className="w-full h-full flex justify-center items-center border-2 border-dashed border-gray-600 rounded-lg">
                {isLoading && (<div className="flex flex-col items-center gap-4"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div><p className="text-gray-400">نصمم رؤيتك...</p></div>)}
                {!isLoading && !imageUrl && (<div className="text-center text-gray-500"><p>النتيجة ستظهر هنا</p></div>)}
                {imageUrl && !isLoading && (<img src={imageUrl} alt={prompt} className="max-w-full max-h-full object-contain rounded-lg" />)}
              </div>
              {imageUrl && !isLoading && (<button onClick={handleDownloadClick} className="w-full mt-6 py-3 px-4 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300">تحميل الصورة</button>)}
            </div>
          </div>
          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">لماذا Artigen Pro هو خيارك الأول للتصميم بالذكاء الاصطناعي؟</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">في عالم مليء بالأدوات المعقدة، يقدم Artigen Pro تجربة مباشرة وقوية. نؤمن بأن الإبداع يجب أن يكون سهلاً ومتاحًا للجميع.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-purple-400 mb-2">مجاني بالكامل</h3>
                          <p className="text-gray-300">بلا اشتراكات، بلا بطاقات ائتمان، بلا تكاليف خفية. استمتع بتوليد صور غير محدودة بالذكاء الاصطناعي على حسابنا.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-purple-400 mb-2">بدون تسجيل</h3>
                          <p className="text-gray-300">نحترم خصوصيتك ووقتك. ابدأ مباشرة في إنشاء الصور دون عناء التسجيل.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-purple-400 mb-2">إنشاء بلا حدود</h3>
                          <p className="text-gray-300">لا توجد قيود على عدد الصور التي يمكنك إنتاجها أو تحميلها. خيالك هو الحد الوحيد.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-purple-400 mb-2">يفهم كل اللغات</h3>
                          <p className="text-gray-300">صِف رؤيتك بالعربية، الإنجليزية، أو أي لغة أخرى، وسيقوم الذكاء الاصطناعي بفهمك وتقديم النتيجة.</p>
                      </div>
                  </div>
              </section>
              <section className="mt-20 text-center">
                   <h2 className="text-3xl font-bold mb-4">من الوصف إلى صورة في 3 خطوات بسيطة</h2>
                   <p className="max-w-3xl mx-auto text-gray-400 mb-12">عمليتنا البديهية تجعل إنشاء الصور بالذكاء الاصطناعي أمرًا سهلاً للجميع، من المبتدئين إلى المحترفين.</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                       <div className="bg-gray-800/50 p-6 rounded-lg">
                          <p className="text-purple-400 font-bold text-lg mb-2">الخطوة 1: صِف رؤيتك</p>
                          <p className="text-gray-300">اكتب ما تريد رؤيته. كن محددًا للحصول على أفضل النتائج! بدلاً من "كلب"، جرب "جرو جولدن ريتريفر سعيد يلعب في حقل من زهور عباد الشمس عند غروب الشمس."</p>
                       </div>
                        <div className="bg-gray-800/50 p-6 rounded-lg">
                          <p className="text-purple-400 font-bold text-lg mb-2">الخطوة 2: اختر النمط والحجم</p>
                          <p className="text-gray-300">اختر نمطًا فنيًا يناسب فكرتك—من السينمائي إلى الأنمي. ثم حدد الأبعاد المثالية لتصميمك.</p>
                       </div>
                        <div className="bg-gray-800/50 p-6 rounded-lg">
                          <p className="text-purple-400 font-bold text-lg mb-2">الخطوة 3: ولّد وحمّل</p>
                          <p className="text-gray-300">اضغط على زر "توليد الصورة" لتشاهد سحر الذكاء الاصطناعي. في لحظات، ستكون صورتك الفريدة جاهزة للتحميل والمشاركة.</p>
                       </div>
                   </div>
              </section>
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">أسئلة شائعة</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-purple-400 mb-2">{faq.question}</h3>
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

export default ImageGeneratorPageArabic;
