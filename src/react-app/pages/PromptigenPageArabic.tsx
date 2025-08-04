import { useState, useRef, useEffect } from 'react';

// --- الثوابت الأساسية ---
const API_KEY = "AIzaSyCq4_YpJKaGQ4vvYQyPey5-u2bHhgNe9Oc";
const SCRIPT_URL = "https://esm.run/@google/generative-ai";

const MODEL_FALLBACK_CHAIN = [
  "gemini-1.5-flash-latest",
  "gemini-pro-vision"
];

const faqDataArabic = [
  {
    question: 'ما هو مولد الأوصاف النصية العكسي؟',
    answer: 'هو أداة ذكاء اصطناعي تقوم بعكس وظيفة مولدات الصور. فبدلاً من تحويل النص إلى صورة، تقوم هذه الأداة بتحليل صورة موجودة وتوليد وصف نصي (Prompt) تفصيلي يصفها. هذا الوصف يمكن استخدامه لاحقًا لإنشاء صور مشابهة.'
  },
  {
    question: 'هل يمكنني استخدام هذه الأوصاف مع أي مولد صور؟',
    answer: 'نعم، تم تصميم الأوصاف التي ننشئها لتكون متوافقة عالميًا. إنها تعمل بشكل ممتاز مع أشهر المنصات مثل Midjourney، وStable Diffusion، وGPT-4o image generator، وأي مولد صور آخر يقبل الأوامر النصية الوصفية.'
  },
  {
    question: 'هل أداة تحويل الصورة إلى وصف نصي (Image to Prompt) مجانية تمامًا؟',
    answer: 'نعم، أداة Promptigen مجانية 100%. لا توجد اشتراكات، رسوم خفية، أو حدود للاستخدام. يمكنك توليد العدد الذي تحتاجه من الأوصاف النصية لإطلاق العنان لإبداعك.'
  },
  {
    question: 'ما نوع الصور التي تعطي أفضل النتائج؟',
    answer: 'الصور الواضحة والمحددة جيدًا هي الأفضل. يشمل ذلك الصور الفوتوغرافية، الفن الرقمي، والرسومات. كلما زادت التفاصيل التي يمكن للذكاء الاصطناعي رؤيتها، كان الوصف النصي الناتج أكثر دقة وثراءً.'
  },
];

// --- دالة مساعدة لتحويل الصورة ---
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

function PromptigenPageArabic() {
  // --- حالات الواجهة الرسومية والبيانات ---
  const [isAiReady, setIsAiReady] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [loadingText, setLoadingText] = useState('يقوم الذكاء الاصطناعي بتحليل الصورة...');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const genAiInstanceRef = useRef<any>(null);
  const aiModuleRef = useRef<any>(null);

  // --- التأثير الجانبي لتهيئة الذكاء الاصطناعي ---
  useEffect(() => {
    const initializeAI = async () => {
      try {
        const module = await import(SCRIPT_URL);
        aiModuleRef.current = module;
        genAiInstanceRef.current = new module.GoogleGenerativeAI(API_KEY);
        setIsAiReady(true);
      } catch (e) {
        console.error("AI Initialization Failed:", e);
        setError("لا يمكن تهيئة نموذج الذكاء الاصطناعي. يرجى تحديث الصفحة.");
      }
    };
    initializeAI();
  }, []);

  // --- التأثير الجانبي لنص التحميل الديناميكي ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      const baseText = "يقوم الذكاء الاصطناعي بتحليل الصورة";
      let dotCount = 1;
      interval = setInterval(() => {
        setLoadingText(`${baseText}${'.'.repeat(dotCount)}`);
        dotCount = (dotCount % 3) + 1;
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        setError('يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP).');
        return;
      }
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePrompt = async () => {
    if (!selectedFile || !isAiReady) {
      setError('يرجى رفع صورة أولاً وانتظار تهيئة الذكاء الاصطناعي.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');

    let masterPrompt = `Your mission is to act as an expert prompt engineer for AI image generators like Midjourney or Stable Diffusion. Analyze the uploaded image with extreme detail. Generate a single, coherent, and rich descriptive prompt that can replicate the image. 
    **CRITICAL CONSTRAINT: The final output prompt must NOT exceed 70 words. This is a strict limit. Be concise, impactful, and stay strictly within the word limit.**
    Focus on subject, environment, art style, composition, lighting, and color palette. End with powerful keywords like "highly detailed, 4k, cinematic". Output ONLY the final, ready-to-use prompt.`;

    if (language === 'ar') {
      masterPrompt += ` **CRITICAL FINAL INSTRUCTION: Your entire response MUST be in fluent, modern Arabic.**`;
    }

    const imagePart = await fileToGenerativePart(selectedFile);

    for (let i = 0; i < MODEL_FALLBACK_CHAIN.length; i++) {
        const modelName = MODEL_FALLBACK_CHAIN[i];
        try {
            const model = genAiInstanceRef.current.getGenerativeModel({ model: modelName });
            const { HarmCategory, HarmBlockThreshold } = aiModuleRef.current;
            const safetySettings = [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ];

            const result = await model.generateContent([masterPrompt, imagePart], { safetySettings });
            const promptText = result.response.text();

            if (!promptText) throw new Error("استجابة فارغة من النموذج.");
            
            setGeneratedPrompt(promptText);
            break; 

        } catch (err) {
            console.error(`Error with model ${modelName}:`, String(err));
            if (i === MODEL_FALLBACK_CHAIN.length - 1) {
                setError("حدث خطأ غير متوقع أو أن الأداة تواجه ضغطًا عاليًا. يرجى المحاولة مرة أخرى.");
            }
        }
    }
    setIsLoading(false);
  };
  
  const handleCopyPrompt = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).catch(() => setError('فشل نسخ النص إلى الحافظة.'));
  };

  const getButtonText = () => {
    if (isLoading) return 'جاري تحليل الصورة...';
    if (!isAiReady) return 'جاري تهيئة الأداة...';
    return 'توليد الوصف النصي';
  };

  return (
    <>
      <title>مولد الأوصاف النصية (Prompt) من الصور - أداة مجانية بالذكاء الاصطناعي</title>
      <meta name="description" content="حوّل أي صورة إلى وصف نصي (Prompt) احترافي ومفصل. أداة Promptigen المجانية تحلل صورتك وتنشئ أمر نصي مثالي لمولدات الصور مثل ميدجورني وStable Diffusion." />
      <link rel="canonical" href="https://aiconvert.online/prompt-generator" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/prompt-generator" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/prompt-generator" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/prompt-generator" />
       <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Promptigen - مولد الأوصاف النصية من الصور",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "954"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "availableOnDevice": "Desktop, Mobile",
            "inLanguage": "ar"
          }
        `}
      </script>

      <div className="pt-24 bg-gray-900 text-white min-h-screen">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-500">
              Promptigen: تحويل الصورة إلى وصف نصي احترافي
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              اكتشف الكلمات المثالية. ارفع أي صورة ودع الذكاء الاصطناعي يحللها ليولد لك وصفًا نصيًا (Prompt) دقيقًا ومبتكرًا لاستخدامه في مولدات الصور.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* عمود التحكم */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <h2 className="sr-only">أداة تحويل الصورة إلى أمر نصي</h2>
              <div>
                <p className="block text-lg font-semibold text-gray-200 mb-2">١. ارفع الصورة</p>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:border-sky-400 hover:bg-gray-700/50 transition"
                >
                  <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="hidden" />
                  {imagePreview ? (
                    <img src={imagePreview} alt="معاينة الصورة المرفوعة" className="max-w-full max-h-full object-contain rounded-md" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <p>انقر هنا أو اسحب الصورة وأفلتها</p>
                      <p className="text-sm text-gray-500">يدعم PNG, JPG, WEBP</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <p className="block text-lg font-semibold text-gray-200 mb-2">٢. اختر لغة الوصف</p>
                <div className="flex gap-4 rounded-lg bg-gray-700 p-2">
                    <button onClick={() => setLanguage('ar')} className={`flex-1 p-2 rounded-md font-semibold transition ${language === 'ar' ? 'bg-sky-500 text-white' : 'bg-transparent text-gray-300 hover:bg-gray-600'}`}>
                        العربية
                    </button>
                    <button onClick={() => setLanguage('en')} className={`flex-1 p-2 rounded-md font-semibold transition ${language === 'en' ? 'bg-sky-500 text-white' : 'bg-transparent text-gray-300 hover:bg-gray-600'}`}>
                        English
                    </button>
                </div>
              </div>

              <button
                onClick={handleGeneratePrompt}
                disabled={!isAiReady || isLoading || !selectedFile}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-sky-500 to-violet-600 rounded-lg hover:from-sky-600 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-sky-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {getButtonText()}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>
            
            {/* عمود النتائج */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col min-h-[24rem]">
              <label htmlFor="prompt-output" className="block text-lg font-semibold text-gray-200 mb-2">٣. احصل على وصفك النصي</label>
              <div className="relative w-full h-full flex flex-col">
                <textarea
                  id="prompt-output"
                  readOnly
                  value={isLoading ? loadingText : generatedPrompt}
                  placeholder="سيظهر وصفك النصي المولد هنا..."
                  className="w-full flex-grow p-4 bg-gray-700 border border-gray-600 rounded-lg resize-none text-gray-200 placeholder-gray-400 leading-relaxed"
                />
                {generatedPrompt && !isLoading && (
                   <button onClick={handleCopyPrompt} className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all">
                      نسخ إلى الحافظة
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* أقسام المحتوى */}
          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">من صورة إلى نص بنقرة واحدة</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-sky-400 mb-2">هندسة عكسية للفن</h3>
                          <p className="text-gray-300">هل أعجبتك صورة؟ ارفعها واحصل فورًا على الوصف النصي اللازم لإعادة إنشاء أسلوبها وموضوعها وجوها العام.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-sky-400 mb-2">أوصاف احترافية</h3>
                          <p className="text-gray-300">تم تدريب الذكاء الاصطناعي لدينا ليفكر كمهندس أوامر (Prompt Engineer)، حيث يلتقط أدق التفاصيل حول الإضاءة والتكوين والأسلوب الفني.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-sky-400 mb-2">يدعم لغتين</h3>
                          <p className="text-gray-300">احصل على الوصف النصي باللغة العربية الفصحى أو الإنجليزية، مما يمنحك مرونة أكبر لاستخدامه في مشاريعك الإبداعية المختلفة.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-sky-400 mb-2">مجاني وغير محدود</h3>
                          <p className="text-gray-300">أطلق العنان لإبداعك بلا قيود. أداة تحويل الصورة إلى وصف نصي مجانية بالكامل ولا تتطلب أي تسجيل.</p>
                      </div>
                  </div>
              </section>

            <section className="mt-20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">كيفية الحصول على وصف نصي من أي صورة في 3 خطوات</h2>
                    <p className="max-w-3xl mx-auto text-gray-400 mb-12">
                        أصبح تحويل أي صورة إلى أمر نصي قوي أسهل من أي وقت مضى.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-sky-400 font-bold text-lg mb-2">١. ارفع صورتك</p>
                        <p className="text-gray-300">
                            انقر على منطقة الرفع واختر أي صورة من جهازك. يمكن أن تكون صورة فوتوغرافية، لوحة، أو أي فن رقمي يلهمك.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-sky-400 font-bold text-lg mb-2">٢. ولّد الوصف</p>
                        <p className="text-gray-300">
                           اضغط على زر "توليد الوصف". سيقوم الذكاء الاصطناعي لدينا بتحليل كل جانب من جوانب الصورة، من الموضوع الرئيسي إلى أدق التفاصيل.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-sky-400 font-bold text-lg mb-2">٣. انسخ وأنشئ</p>
                        <p className="text-gray-300">
                           سيظهر وصفك الاحترافي في ثوانٍ. انسخه بنقرة واحدة وألصقه في مولد الصور المفضل لديك لبدء الإبداع.
                        </p>
                    </div>
                </div>
            </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">الأسئلة الشائعة</h2>
                  <div className="space-y-4">
                      {faqDataArabic.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-sky-400 mb-2">{faq.question}</h3>
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

export default PromptigenPageArabic;
