import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const faqData = [
  {
    question: 'كيف تحول الأداة صورتي إلى اسكتش فني؟',
    answer: 'تستخدم أداتنا نموذج ذكاء اصطناعي متقدم، تم تدريبه على فهم الخطوط الأساسية والظلال والأبعاد في صورتك. يقوم النموذج بإعادة رسم الصورة بأسلوب يحاكي الرسم اليدوي، مع التركيز على التفاصيل الدقيقة والتظليل لإعطاء نتيجة فنية وواقعية.'
  },
    {
    question: 'ما الفرق بين أداة "الاسكتش الفني" هذه وأداة "رسم الرصاص"؟',
    answer: (
      <>
        كلا الأداتين تقدم نتائج رائعة! هذه الأداة مصممة لإنشاء <strong>اسكتش فني</strong> غني بالتفاصيل والظلال يحاكي الرسم اليدوي، مما يعطي إحساسًا بالعمق الفني. بينما أداة <Link to="/ar/line-drawing" className="text-yellow-400 underline">تحويل الصور إلى رسم رصاص</Link> متخصصة في استخراج <strong>الخطوط الواضحة والنقية</strong> من صورتك، وهي مثالية لصفحات التلوين أو التصميمات التي تتطلب خطوطًا محددة.
      </>
    )
  },
  {
    question: 'هل هذا الموقع مجاني لتحويل الصور إلى رسم؟',
    answer: 'نعم، بكل تأكيد. هذه الأداة مجانية 100%، بدون أي حدود للاستخدام، ولا تتطلب أي تسجيل دخول. يمكنك تحويل أي عدد من الصور إلى اسكتشات فنية وقتما تشاء.'
  },
  {
    question: 'ما هو أفضل نوع من الصور للحصول على اسكتش احترافي؟',
    answer: 'الصور ذات الإضاءة الجيدة، والتفاصيل الواضحة، والتباين العالي بين الخلفية والموضوع الرئيسي، تنتج بشكل عام أفضل النتائج وأكثرها واقعية. الصور الشخصية (البورتريه) والمناظر الطبيعية تعطي نتائج مذهلة.'
  },
];

const checkStatus = async (taskId: string) => {
  const response = await fetch(`/api/check-status?taskId=${taskId}`);
  if (!response.ok) {
    throw new Error('Failed to check job status.');
  }
  return response.json();
};

function EasyDrawingsPageAr() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
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
              setStatusMessage('الذكاء الاصطناعي يرسم...');
              break;
            case 'SUCCESS':
              cleanupPolling();
              const resultResponse = await fetch(`/api/get-result?taskId=${taskId}`);
              if (!resultResponse.ok) {
                  throw new Error('Failed to fetch the final image.');
              }
              const imageBlob = await resultResponse.blob();
              const imageUrl = URL.createObjectURL(imageBlob);
              setGeneratedImage(imageUrl);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setGeneratedImage(null);
      setStatusMessage('');
      cleanupPolling();
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateSketch = async () => {
    if (!selectedFile) {
      setError('يرجى رفع صورة للبدء.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    cleanupPolling();
    setStatusMessage('تم استلام طلبك...');

    try {
      const formData = new FormData();
      formData.append('img', selectedFile);

      const response = await fetch('/api/submit-job?tool=sketch', {
          method: 'POST',
          body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit the job.');
      }

      const responseData = await response.json();
      setTaskId(responseData.task_id);

    } catch (err) {
      setError(genericErrorMessage);
      setIsLoading(false);
      setStatusMessage('');
    }
  };
  
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `sketch_from_aiconvert.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <title>تحويل الصور إلى اسكتش ورسم فني بالذكاء الاصطناعي أونلاين مجانًا | ArtifyPro</title>
      <meta name="description" content="حوّل صورك إلى اسكتش فني احترافي بضغطة زر. أنشئ لوحات ورسومات فنية وتصميمات يدوية من الصور باستخدام الذكاء الاصطناعي مجانًا وبدون تسجيل دخول." />
      <link rel="canonical" href="https://aiconvert.online/ar/image-to-sketch" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/image-to-sketch" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/image-to-sketch" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/image-to-sketch" />
      <script type="application/ld+json">
{`
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ArtifyPro: تحويل الصور إلى اسكتش فني",
    "applicationCategory": "ImageProcessingApplication",
    "operatingSystem": "WEB",
    "description": "أداة ذكاء اصطناعي مجانية أونلاين تقوم بتحويل الصور إلى اسكتشات فنية مفصلة مع تظليل وملمس يحاكي الرسم اليدوي.",
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-500">
              ArtifyPro | تحويل الصور إلى اسكتش فني بالذكاء الاصطناعي مجانًا 
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              أضف لمسة فنية فريدة لصورك. ارفع أي صورة ودع الذكاء الاصطناعي يحولها إلى رسم فني يحاكي الرسم اليدوي.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6 items-center">
              <h2 className="text-2xl font-bold text-gray-200">1. ارفع صورتك الأصلية</h2>
              <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-80 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:border-yellow-400 hover:bg-gray-700/50 transition"
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                {imagePreview ? (
                  <img src={imagePreview} alt="الصورة الأصلية قبل تحويلها لاسكتش" className="max-w-full max-h-full object-contain rounded-md" />
                ) : (
                  <div className="text-center text-gray-400">
                    <p>انقر أو اسحب وأفلت الصورة هنا</p>
                    <p className="text-sm">جميع صيغ الصور مدعومة</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleGenerateSketch}
                disabled={isLoading || !selectedFile}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-yellow-500 to-lime-600 rounded-lg hover:from-yellow-600 hover:to-lime-700 focus:outline-none focus:ring-4 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? 'جاري إنشاء الرسم...' : 'حوّل إلى اسكتش'}
              </button>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6 items-center">
              <h2 className="text-2xl font-bold text-gray-200">2. استلم الاسكتش الفني</h2>
              <div className="w-full h-80 border-2 border-gray-700 bg-gray-900/50 rounded-lg flex justify-center items-center relative">
                {isLoading && (
                   <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-lg">
                       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400"></div>
                       <p className="text-lg text-gray-300 mt-4">{statusMessage}</p>
                   </div>
                )}
                {!isLoading && generatedImage && (
                  <img src={generatedImage} alt="اسكتش فني تم إنشاؤه بالذكاء الاصطناعي" className="max-w-full max-h-full object-contain rounded-md" />
                )}
                {!isLoading && !generatedImage && !error && (
                   <div className="text-center text-gray-500">
                       <p>سيظهر هنا الاسكتش الفني الخاص بك</p>
                   </div>
                )}
                 {error && <p className="text-red-400 text-center p-4">{error}</p>}
              </div>
              <button
                onClick={handleDownload}
                disabled={isLoading || !generatedImage}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-lime-700 rounded-lg hover:bg-lime-800 focus:outline-none focus:ring-4 focus:ring-lime-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                تحميل الاسكتش
              </button>
            </div>
          </div>

          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">أنشئ رسومات فنية مذهلة فورًا</h2>
                   <p className="max-w-3xl mx-auto text-gray-400 mb-12">
                    سواء كنت فنانًا تبحث عن إلهام، أو مصممًا تحتاج إلى صورة بأسلوب فريد، أو مجرد هاوٍ يستمتع بالفن، فإن مولد الاسكتشات الخاص بنا يوفر لك أداة قوية وسهلة لإنتاج رسومات فنية عالية الجودة في ثوانٍ.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-yellow-400 mb-2">للفنانين والهواة</h3>
                          <p className="text-gray-300">احصل على اسكتش احترافي من أي صورة ليكون أساسًا لرسوماتك، لوحاتك، أو مشاريعك الرقمية.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-yellow-400 mb-2">جودة فنية عالية</h3>
                          <p className="text-gray-300">يركز الذكاء الاصطناعي على إنشاء اسكتشات غنية بالتظليل والتفاصيل، مما يعطي نتيجة فنية مقنعة.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-yellow-400 mb-2">مجاني 100%</h3>
                          <p className="text-gray-300">لا اشتراكات ولا تكاليف خفية. حوّل صورًا لا محدودة إلى اسكتشات فنية، مجانًا بالكامل.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-yellow-400 mb-2">بساطة وسرعة</h3>
                          <p className="text-gray-300">لا حاجة لبرامج معقدة. ارفع صورتك، اضغط على زر واحد، وقم بتنزيل الاسكتش الفني الخاص بك.</p>
                      </div>
                  </div>
              </section>

              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">أسئلة متكررة</h2>
                  <div className="space-y-4">
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

export default EasyDrawingsPageAr;
