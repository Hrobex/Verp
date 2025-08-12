import { useState, useRef, ChangeEvent, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

async function processImageForEnhancement(file: File): Promise<File> {
  const MAX_ORIGINAL_SIZE_MB = 2;
  if (file.size / 1024 / 1024 > MAX_ORIGINAL_SIZE_MB) {
    throw new Error(`حجم الصورة يتجاوز ${MAX_ORIGINAL_SIZE_MB} ميجابايت. يرجى رفع ملف أصغر.`);
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };

  try {
    const processedFile = await imageCompression(file, options);
    return processedFile;
  } catch (error) {
    console.error('Image processing failed:', error);
    return file;
  }
}

const versions = ['v1.4', 'v2.1', 'v3.0'];
const scales = [2, 4];

const faqData = [
  {
    question: 'ما هي أنواع الصور التي تعمل بشكل أفضل مع الأداة؟',
    answer: 'يعمل محسن الصور بالذكاء الاصطناعي الخاص بنا بشكل جيد مع مجموعة واسعة من الصور، بما في ذلك الصور الشخصية والمناظر الطبيعية والرسومات الرقمية. للحصول على أفضل النتائج، ابدأ بصورة واضحة بشكل معقول، حتى لو كانت ذات دقة منخفضة.'
  },
  {
    question: 'ماذا يعني "رفع دقة" الصورة؟',
    answer: 'رفع الدقة هو عملية زيادة عدد البكسلات في الصورة. يقوم الذكاء الاصطناعي لدينا بإضافة بكسلات جديدة بذكاء تتناسب مع سياق الصورة، مما ينتج عنه صورة أكبر وأكثر وضوحًا وحدة دون التشويش المعتاد.'
  },
  {
    question: 'هل أداة تحسين جودة الصور هذه مجانية تمامًا؟',
    answer: 'نعم، أداتنا الأونلاين مجانية 100%. يمكنك تحسين صورك ورفع دقتها دون أي تكلفة أو اشتراكات أو رسوم خفية.'
  },
  {
    question: 'ما هو أقصى معامل تكبير متاح؟',
    answer: 'يمكنك اختيار رفع دقة صورتك بمعامل 2x أو 4x، مما يتيح لك زيادة حجم وتفاصيل صورك بشكل كبير لتكون مناسبة للطباعة أو العرض على الشاشات عالية الدقة.'
  },
];

const checkStatus = async (taskId: string) => {
  const response = await fetch(`/api/check-status?taskId=${taskId}`);
  if (!response.ok) {
    throw new Error('Failed to check job status.');
  }
  return response.json();
};

function ImageEnhancerPageArabic() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);

  const [selectedVersion, setSelectedVersion] = useState(versions[2]);
  const [selectedScale, setSelectedScale] = useState(scales[0]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [taskId, setTaskId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const pollingIntervalRef = useRef<number | null>(null);

  const genericErrorMessage = "واجه طلبك خطأ غير متوقع. يرجى الانتظار بضع ثوانٍ والمحاولة مرة أخرى.";

  const cleanupPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setTaskId(null);
  };

  useEffect(() => {
    if (taskId) {
      pollingIntervalRef.current = window.setInterval(async () => {
        try {
          const statusData = await checkStatus(taskId);
          switch (statusData.status) {
            case 'QUEUED':
              setStatusMessage(`أنت في المرتبة #${statusData.queue_position} من ${statusData.queue_total} في قائمة الانتظار.`);
              break;
            case 'PROCESSING':
              setStatusMessage('الذكاء الاصطناعي يقوم بزيادة حدة التفاصيل...');
              break;
            case 'SUCCESS':
              cleanupPolling();
              const resultResponse = await fetch(`/api/get-result?taskId=${taskId}`);
              if (!resultResponse.ok) {
                  throw new Error('Failed to fetch the final image.');
              }
              const imageBlob = await resultResponse.blob();
              const imageUrl = URL.createObjectURL(imageBlob);
              setEnhancedImageUrl(imageUrl);
              setIsLoading(false);
              setStatusMessage('');
              break;
            case 'FAILURE':
              cleanupPolling();
              setError(statusData.error || genericErrorMessage);
              setIsLoading(false);
              setStatusMessage('');
              break;
          }
        } catch (err) {
          cleanupPolling();
          setError(genericErrorMessage);
          setIsLoading(false);
          setStatusMessage('');
        }
      }, 3000);
    }
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [taskId]);
  
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFile(file);
      setEnhancedImageUrl(null);
      setError(null);
      setStatusMessage('');
      cleanupPolling();
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhanceClick = async () => {
    if (!originalFile) {
      setError('الرجاء رفع صورة أولاً.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setEnhancedImageUrl(null);
    cleanupPolling();
    setStatusMessage('جاري معالجة صورتك...');

    try {
      const processedFile = await processImageForEnhancement(originalFile);

      const formData = new FormData();
      formData.append('img', processedFile);
      formData.append('version', selectedVersion);

      const response = await fetch('/api/submit-job?tool=enhancer', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit the job.');
      }
        
      const responseData = await response.json();
      setTaskId(responseData.task_id);

    } catch (err: any) {
      if (err instanceof Error && err.message.includes('حجم الصورة يتجاوز')) {
         setError('حجم الصورة كبير جدًا. يرجى رفع صورة أصغر من 2 ميجابايت.');
      } else {
         setError(genericErrorMessage);
      }
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <>
      <title>تحسين جودة الصور ورفع دقتها بالذكاء الاصطناعي مجانًا | Enhancex AI</title>
      <meta name="description" content="قم بتحسين جودة الصور فورًا مع EnhanceX AI. أداتنا المجانية لرفع دقة الصور تزيد من حدة التفاصيل، تزيل التشويش، وترفع الدقة حتى 4x أونلاين." />
      <link rel="canonical" href="https://aiconvert.online/ar/ai-image-enhancer" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/ai-image-enhancer" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/ai-image-enhancer" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/ai-image-enhancer" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "name": "EnhanceX AI محسن الصور",
            "description": "أداة مجانية تعمل بالذكاء الاصطناعي لتحسين جودة الصور، ورفع دقتها حتى 4x، وزيادة حدة التفاصيل، وتقليل التشويش باستخدام نماذج متقدمة.",
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

      <div className="pt-24 bg-gray-900 text-white min-h-screen">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              EnhanceX AI: محسن الصور المجاني
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              حوّل صورك الباهتة ومنخفضة الدقة إلى صور حادة وعالية الجودة. قم بزيادة دقة صورك وتحسينها بقوة الذكاء الاصطناعي بنقرة واحدة.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <h2 className="sr-only">أداة تحسين جودة الصور</h2>
              
              <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">1. ارفع صورتك</h3>
                  <input type="file" accept="image/*" onChange={handleFileSelect} ref={fileInputRef} className="hidden" />
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className="w-full h-40 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-700/50 transition"
                  >
                    {originalPreviewUrl ? (
                      <img src={originalPreviewUrl} alt="معاينة" className="max-h-full max-w-full object-contain rounded-md" />
                    ) : (
                      <p className="text-gray-400 text-center">انقر لاختيار صورة</p>
                    )}
                  </div>
              </div>

              <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">2. اختر خيارات التحسين</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                          <label htmlFor="version-select" className="block text-sm font-medium text-gray-400 mb-1">نموذج الذكاء الاصطناعي</label>
                          <select id="version-select" value={selectedVersion} onChange={(e) => setSelectedVersion(e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500">
                              {versions.map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                      </div>
                      <div>
                          <label htmlFor="scale-select" className="block text-sm font-medium text-gray-400 mb-1">معامل التكبير</label>
                          <select id="scale-select" value={selectedScale} onChange={(e) => setSelectedScale(parseInt(e.target.value))} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500">
                              {scales.map(s => <option key={s} value={s}>{s}x</option>)}
                          </select>
                      </div>
                  </div>
              </div>

              <button
                onClick={handleEnhanceClick} disabled={isLoading || !originalFile}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? 'جاري تحسين الصورة...' : 'تحسين الصورة'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg flex flex-col justify-center items-center relative">
              {isLoading && (
                  <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-2xl">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
                    <p className="text-gray-300 mt-4">{statusMessage}</p>
                  </div>
              )}
              
              <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col items-center">
                      <h4 className="text-lg font-bold mb-2 text-gray-400">قبل</h4>
                      <div className="w-full h-64 sm:h-80 bg-gray-700/50 rounded-lg flex justify-center items-center border border-gray-600">
                          {originalPreviewUrl ? <img src={originalPreviewUrl} alt="الصورة الأصلية" className="max-h-full max-w-full object-contain"/> : <p className="text-gray-400 text-sm">الصورة الأصلية</p>}
                      </div>
                  </div>
                  <div className="flex flex-col items-center">
                      <h4 className="text-lg font-bold mb-2 text-cyan-400">بعد</h4>
                      <div className="w-full h-64 sm:h-80 bg-gray-700/50 rounded-lg flex justify-center items-center border border-cyan-500/50">
                         {enhancedImageUrl ? <img src={enhancedImageUrl} alt="الصورة المحسنة" className="max-h-full max-w-full object-contain"/> : <p className="text-gray-400 text-sm">النتيجة المحسّنة</p>}
                      </div>
                  </div>
              </div>

              {enhancedImageUrl && !isLoading && (
                  <a href={enhancedImageUrl} download="enhanced-image.png" className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all">
                      تحميل الصورة المحسّنة
                  </a>
              )}
            </div>
          </div>

          <div className="mt-24">
              <section className="text-center"><h2 className="text-3xl font-bold mb-4">ارفع دقة صورك وأزل التشويش بالذكاء الاصطناعي</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"><div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-cyan-400 mb-2">زيادة دقة الصور</h3><p className="text-gray-300">انقل صورك من الدقة المنخفضة إلى العالية. قم بزيادة دقة الصور بمعامل 2x أو 4x، مما يجعلها مثالية للطباعة أو الويب.</p></div><div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-cyan-400 mb-2">زيادة حدة التفاصيل</h3><p className="text-gray-300">يعمل الذكاء الاصطناعي بذكاء على تحسين التفاصيل، مما يضفي وضوحًا على الوجوه غير الواضحة، والأنسجة، والخطوط الدقيقة في أي صورة.</p></div><div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-cyan-400 mb-2">تقليل التشويش والضبابية</h3><p className="text-gray-300">قم بتنظيف عيوب ضغط الصور والتشويش الرقمي تلقائيًا لإنتاج صورة أكثر نعومة ونقاء.</p></div><div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-cyan-400 mb-2">مجاني وأونلاين</h3><p className="text-gray-300">يمكنك تحسين جودة صورتك مباشرة في متصفحك. لا حاجة لتثبيت برامج، ولا يلزم التسجيل، ومجاني تمامًا.</p></div></div></section>

            <section className="mt-20"><div className="text-center"><h2 className="text-3xl font-bold mb-4">كيف تعمل أداة تحسين جودة الصور</h2><p className="max-w-3xl mx-auto text-gray-400 mb-12">لم يكن تحسين صورك أسهل من أي وقت مضى. تعمل أداتنا على تبسيط العملية إلى ثلاث خطوات مباشرة للحصول على نتيجة احترافية في كل مرة.</p></div><div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right"><div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-cyan-400 font-bold text-lg mb-2">1. ارفع صورتك</p><p className="text-gray-300">انقر على منطقة الرفع واختر الصورة التي ترغب في تحسينها. يمكن أن تكون صورة ضبابية، أو أيقونة صغيرة، أو أي صورة تحتاج إلى رفع جودتها.</p></div><div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-cyan-400 font-bold text-lg mb-2">2. اختر خياراتك</p><p className="text-gray-300">اختر إصدار نموذج الذكاء الاصطناعي وحدد معامل التكبير المطلوب (2x أو 4x) لتحديد الدقة النهائية لصورتك.</p></div><div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-cyan-400 font-bold text-lg mb-2">3. حسّن وحمّل</p><p className="text-gray-300">اضغط على زر "تحسين الصورة" ودع الذكاء الاصطناعي يقوم بسحره. قارن النتيجة وقم بتنزيل صورتك الجديدة عالية الجودة.</p></div></div></section>

            <section className="mt-20"><div className="text-center"><h2 className="text-3xl font-bold mb-4">اختر نموذج الذكاء الاصطناعي المناسب لصورتك</h2><p className="max-w-3xl mx-auto text-gray-400 mb-12">أداتنا مدعومة بإصدارات من نموذج <strong>GFPGAN</strong> المشهور، وهو ذكاء اصطناعي مصمم خصيصًا لترميم الصور وتحسينها بشكل مذهل. يقدم كل إصدار مستوى مختلفًا من التحسين لمنحك أفضل نتيجة لاحتياجاتك الخاصة. إليك دليل سريع:</p></div><div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right"><div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-cyan-400 font-bold text-lg mb-2">نموذج v1.4 (الوضوح والوجوه)</p><p className="text-gray-300">هذا الإصدار ممتاز للتحسين العام. يركز على زيادة وضوح الصورة بشكل كبير وهو فعال بشكل خاص في استعادة تفاصيل ملامح الوجه، مما يجعله نقطة انطلاق رائعة للصور الشخصية وصور وسائل التواصل الاجتماعي.</p></div><div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-cyan-400 font-bold text-lg mb-2">نموذج v2.1 (تحسين التفاصيل)</p><p className="text-gray-300">بناءً على الإصدار السابق، يدمج هذا النموذج تقنيات أكثر تقدمًا لزيادة التفاصيل الدقيقة والأنسجة في الصورة بأكملها. اختر هذا الخيار لتحسين أكثر شمولاً يعالج العنصر الرئيسي ومحيطه.</p></div><div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-cyan-400 font-bold text-lg mb-2">نموذج v3.0 (الجودة القصوى والدقة)</p><p className="text-gray-300">هذا هو أحدث وأقوى نماذجنا. يستخدم أحدث التحسينات في تقنيات المعالجة، مما يوفر جودة صورة فائقة، وصقلًا دقيقًا للتفاصيل، وأفضل تقليل للتشويش. إنه الخيار الأمثل للأعمال الاحترافية أو الطباعة.</p></div></div><p className="text-center text-gray-400 mt-8"><strong>توصيتنا:</strong> ابدأ بنموذج <strong>v2.1</strong> لتحقيق توازن رائع بين التفاصيل والأداء. للحصول على نتائج احترافية أو استعادة الصور القديمة الثمينة، سيوفر نموذج <strong>v3.0</strong> أعلى جودة.</p></section>
            
              <section className="mt-20 max-w-4xl mx-auto"><h2 className="text-3xl font-bold text-center mb-10">الأسئلة الشائعة</h2><div className="space-y-6">{faqData.map((faq, index) => (<div key={index} className="bg-gray-800 p-6 rounded-lg"><h3 className="font-bold text-lg text-cyan-400 mb-2">{faq.question}</h3><div className="text-gray-300 leading-relaxed">{faq.answer}</div></div>))}</div></section>
          </div>
        </main>
      </div>
    </>
  );
}

export default ImageEnhancerPageArabic;
