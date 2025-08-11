import { useState, useRef, useEffect } from 'react';

const languageOptions = [
    { code: 'ar', name: 'العربية' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
];

const faqData = [
  {
    question: 'كيف تقوم الأداة بإنشاء وصف فيديو من صورتي؟',
    answer: 'يقوم الذكاء الاصطناعي بتحليل العناصر المرئية في صورتك، مثل الشخصيات والبيئة المحيطة والحالة المزاجية. بعد ذلك، يعمل كخبير سينمائي لكتابة وصف (Prompt) ديناميكي ومفصل، يتضمن اقتراحات للحركة وعمل الكاميرا لإعادة إحياء صورتك الثابتة.'
  },
  {
    question: 'هل يمكنني استخدام هذه الأوصاف مع منصات مثل Sora أو Veo؟',
    answer: 'بالتأكيد. تم تصميم هذه الأوامر خصيصًا لتكون متوافقة تمامًا مع أشهر أدوات تحويل النص إلى فيديو، بما في ذلك Sora من OpenAI، و Veo من جوجل، بالإضافة إلى Runway، Pika، و Kling. ببساطة، انسخ الوصف واستخدمه مباشرة في منصتك المفضلة.'
  },
  {
    question: 'هل هذا المُولِّد مجاني بالكامل؟',
    answer: 'نعم، الأداة مجانية 100%، وتوفر استخدامًا غير محدود، ولا تتطلب أي تسجيل أو اشتراك. هدفنا هو توفير أداة إبداعية قوية ومتاحة للجميع، من الهواة إلى المحترفين.'
  },
  {
    question: 'ما هو نوع الصور الذي يعطي أفضل النتائج؟',
    answer: 'الصور التي تحتوي على شخصيات واضحة أو بيئات مثيرة للاهتمام تنتج عادةً أفضل الأوصاف الإبداعية. ومع ذلك، فإن الذكاء الاصطناعي قادر على استلهام أفكار من أي صورة تقريبًا، سواء كانت صورة شخصية، أو منظرًا طبيعيًا، أو حتى تصميمًا تجريديًا.'
  },
];

async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
}

function VideoPromptPageAr() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [loadingText, setLoadingText] = useState('الذكاء الاصطناعي يخرج مشهدك...');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      const baseText = "الذكاء الاصطناعي يخرج مشهدك";
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
      setError(null);
      setGeneratedPrompt('');
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePrompt = async (withNegative: boolean) => {
    if (!selectedFile) {
      setError('يرجى رفع صورة أولاً.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');

    try {
        const imageData = await fileToBase64(selectedFile);

        const response = await fetch('/api/stvid?tool=video-prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imageData: imageData,
                mimeType: selectedFile.type,
                language: selectedLanguage,
                withNegativePrompt: withNegative,
            }),
        });
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'حدث خطأ غير معروف في الخادم.');
        }

        setGeneratedPrompt(result.videoPrompt);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyPrompt = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt)
        .catch(() => setError('فشل نسخ النص.'));
  };

  return (
    <>
      <title>مولد وصف (Prompt) فيديو بالذكاء الاصطناعي مجانًا (Veo 3، Sora،..)</title>
      <meta name="description" content="حوّل أي صورة إلى وصف فيديو سينمائي احترافي. احصل على أوامر دقيقة مجانًا دون تسجيل لأشهر أدوات توليد الفيديو مثل Kling AI، Pixverse، والمزيد " />
      <link rel="canonical" href="https://aiconvert.online/ar/ai-video-prompt-generator" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/ai-video-prompt-generator" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/ai-video-prompt-generator" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/ai-video-prompt-generator" />
      <script type="application/ld+json">
{`
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "مولد وصف الفيديو بالذكاء الاصطناعي من الصور",
    "operatingSystem": "WEB",
    "applicationCategory": "ProductivityApplication",
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-teal-500">
              مولد وصف الفيديو بالذكاء الاصطناعي من الصور مجانًا 
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              حوّل صورك الثابتة إلى مشاهد سينمائية متحركة. أداتنا الذكية تكتب لك وصفًا (Prompt) احترافيًا جاهزًا للاستخدام في برامج تحويل النص إلى فيديو.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* عمود التحكم */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <div>
                <p className="block text-lg font-semibold text-gray-200 mb-2">1. ارفع صورتك</p>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:border-teal-400 hover:bg-gray-700/50 transition"
                >
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  {imagePreview ? (
                    <img src={imagePreview} alt="معاينة الصورة لإنشاء وصف الفيديو" className="max-w-full max-h-full object-contain rounded-md" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <p>انقر هنا لرفع الصورة</p>
                      <p className="text-sm">لتحرير حركتها الكامنة</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="language-select" className="block text-lg font-semibold text-gray-200 mb-2">2. اختر اللغة</label>
                 <select
                    id="language-select"
                    value={selectedLanguage.code}
                    onChange={(e) => setSelectedLanguage(languageOptions.find(lang => lang.code === e.target.value) || languageOptions[0])}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 text-white"
                >
                    {languageOptions.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <button
                  onClick={() => handleGeneratePrompt(false)}
                  disabled={isLoading || !selectedFile}
                  className="w-full py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-rose-500 to-teal-600 rounded-lg hover:from-rose-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-rose-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isLoading ? 'جاري الإنشاء...' : 'إنشاء وصف احترافي'}
                </button>
                <button
                  onClick={() => handleGeneratePrompt(true)}
                  disabled={isLoading || !selectedFile}
                  className="w-full py-3 px-4 text-lg font-bold text-white bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? 'جاري الإنشاء...' : 'إنشاء مع موجه سلبي (لـ Veo, Sora)'}
                </button>
              </div>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>
            
            {/* عمود المخرجات */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col min-h-[28rem]">
              <label htmlFor="prompt-output" className="block text-lg font-semibold text-gray-200 mb-2">3. وصف الفيديو المُنشأ</label>
              <div className="relative w-full h-full flex flex-col">
                <textarea
                  id="prompt-output"
                  readOnly
                  value={isLoading ? loadingText : generatedPrompt}
                  placeholder="سيظهر هنا وصف الفيديو الاحترافي الخاص بك..."
                  className="w-full flex-grow p-4 bg-gray-700 border border-gray-600 rounded-lg resize-none text-gray-200 placeholder-gray-400 leading-relaxed text-right"
                />
                {generatedPrompt && !isLoading && (
                   <button onClick={handleCopyPrompt} className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all">
                      نسخ الوصف
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold mb-4">أي وصف يجب أن تختار؟</h2>
            <p className="max-w-4xl mx-auto text-gray-400 mb-12">
              لنمنحك أقصى قدر من القوة والمرونة، يمكن لأداتنا إنشاء نوعين من الأوصاف الاحترافية. إليك دليل سريع لمساعدتك في الاختيار.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-right">
              {/* Card 1 */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-teal-400">الوصف العالمي</h3>
                <p className="text-gray-300 mt-3">
                  ينشئ وصفًا غنيًا ومفصلاً ومصممًا ليكون متوافقًا مع جميع المنصات.
                </p>
                <hr className="border-gray-700 my-4" />
                <p className="font-semibold text-white">✅ يُنصح به لـ:</p>
                <ul className="list-none pr-0 mt-2 space-y-1 text-gray-300">
                  <li>Pika</li>
                  <li>PixVerse</li>
                  <li>Runway</li>
                  <li>Stable Diffusion</li>
                </ul>
              </div>
              {/* Card 2 */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-rose-400">الوصف المتقدم (مع موجه سلبي)</h3>
                <p className="text-gray-300 mt-3">
                  يتضمن عبارة "موجه سلبي" خاصة لمنع الأخطاء الشائعة، وهو مُحسَّن لأحدث النماذج.
                </p>
                <hr className="border-gray-700 my-4" />
                <p className="font-semibold text-white">✅ مُحسَّن لـ:</p>
                <ul className="list-none pr-0 mt-2 space-y-1 text-gray-300">
                  <li>Google Veo</li>
                  <li>OpenAI Sora</li>
                  <li>Kling AI</li>
                </ul>
              </div>
            </div>
          </div>


          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">من صورة ثابتة إلى مشهد سينمائي</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">
                    لماذا تكتفي بوصف الصورة بينما يمكنك إخراجها؟ أداتنا تكتب لك أوامر احترافية جاهزة للاستخدام، كاملة مع الحركة المقترحة، زاوية الكاميرا، والأجواء العامة، وهي مثالية لأي منصة تحويل نص إلى فيديو.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-rose-400 mb-2">إخراج فوري</h3>
                          <p className="text-gray-300">تجاوز عقبات الإبداع. استخدم أي صورة لإنشاء أمر سينمائي احترافي في ثوانٍ معدودة.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-rose-400 mb-2">لكل المنصات</h3>
                          <p className="text-gray-300">الأوصاف الناتجة محسّنة لتعمل مع أشهر الأدوات مثل Sora, Veo, و Runway، مما يضمن أفضل النتائج.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-rose-400 mb-2">مجانية تمامًا</h3>
                          <p className="text-gray-300">لا رسوم، لا حدود للاستخدام، ولا حاجة للتسجيل. أنشئ العدد الذي تريده من أوامر الفيديو عالية الجودة.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-rose-400 mb-2">متعددة اللغات</h3>
                          <p className="text-gray-300">أنشئ أوامر فيديو جذابة بالعديد من اللغات المختلفة لتناسب سير عملك الإبداعي المحدد.</p>
                      </div>
                  </div>
              </section>

              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">أسئلة شائعة</h2>
                  <div className="space-y-4">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-teal-400 mb-2">{faq.question}</h3>
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

export default VideoPromptPageAr;
