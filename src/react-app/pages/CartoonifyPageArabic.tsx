import { useState, useRef, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

const faqData = [
    {
        question: 'كيف تقوم الأداة بتحويل صورتي إلى كرتون؟',
        answer: 'تم تدريب الذكاء الاصطناعي لدينا على آلاف الصور الكرتونية. يقوم بتحليل الملامح الرئيسية في صورتك - مثل الأشكال والخطوط - ثم يعيد رسمها بأسلوب كرتوني كلاسيكي ثنائي الأبعاد (2D). إنه يبسط التفاصيل لخلق ذلك المظهر الكرتوني الممتع.'
    },
    {
        question: 'هل أداة Cartoonify مجانية تمامًا؟',
        answer: 'نعم، 100%! يمكنك تحويل أي عدد من الصور التي تريدها دون أي تكلفة، أو حدود للاستخدام، أو الحاجة إلى تسجيل الدخول. هدفنا هو جعل هذه الأداة الممتعة في متناول الجميع.'
    },
    {
        question: 'ما الفرق بين Cartoonify و DigiCartoony؟',
        answer: (
            <>
                اعتبرهما فنانين مختلفين لهدفين مختلفين. أداة <strong>Cartoonify</strong> تشبه فنان الرسوم الهزلية السريع، حيث تحول صورتك فورًا إلى كرتون ممتع بأسلوب ثنائي الأبعاد وخطوط جريئة - مثالية لعمل "نسخة كرتونية" من نفسك.
                بينما أداة <Link to="/ar/cartoony-art" className="text-teal-400 underline">DigiCartoony</Link> تشبه رسام أفلام التحريك، حيث تحول صورتك إلى عمل فني رقمي مفصل بعمق وجمالية تشبه أفلام الأنيميشن ثلاثية الأبعاد.
            </>
        )
    },
    {
        question: 'ماذا يحدث لصورى التي أرفعها؟',
        answer: 'خصوصيتك هي أولويتنا. يتم رفع صورك بشكل آمن إلى خوادمنا لمعالجتها، ويتم حذفها تلقائيًا بعد فترة قصيرة. نحن لا نقوم بتخزين صورك أو مشاركتها أو استخدامها لأي غرض آخر.'
    },
];

function CartoonifyPageArabic() {
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

  const handleCartoonifyClick = async () => {
    if (!sourceFile) {
      setError('يرجى رفع صورة لكرتنتها.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImageUrl(null);

    try {
      const formData = new FormData();
      formData.append('file', sourceFile);
        
      const response = await fetch('/api/tools?tool=cartoonify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'فشلت عملية تحويل الصورة. الرجاء المحاولة مرة أخرى.');
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
    link.download = 'cartoon-image.png'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
    <>
      <title>تحويل الصور إلى كرتون مجانًا بالذكاء الاصطناعي</title>
      <meta name="description" content="حوّل صورتك إلى كرتون باستخدام أداة الذكاء الاصطناعي المجانية. قم بكرتنة صورك الشخصية أونلاين فورًا وبدون تسجيل. ارفع صورتك واحصل على نسختك الكرتونية في ثوانٍ!" />
      <link rel="canonical" href="https://aiconvert.online/ar/cartoonify" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/cartoonify" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/cartoonify" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/cartoonify" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "name": "Cartoonify: تحويل الصور إلى كرتون بالذكاء الاصطناعي",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "description": "أداة مجانية أونلاين تستخدم الذكاء الاصطناعي لتحويل الصور فورًا إلى كرتون بأسلوب ثنائي الأبعاد.",
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-600">
              حوّل صورتك إلى كرتون فورًا
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              حوّل صورك إلى كرتون ممتع بأسلوب 2D مع صانع الكرتون المجاني بالذكاء الاصطناعي. ارفع صورة واحصل على نسختك الكرتونية بنقرة واحدة فقط!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* --- عمود التحكم --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6 items-center">
              <h2 className="text-2xl font-bold text-center">ارفع صورتك</h2>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileSelect} 
                ref={sourceFileInputRef} 
                className="hidden" 
              />
              <div 
                onClick={() => sourceFileInputRef.current?.click()} 
                className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-700/50 transition-colors bg-cover bg-center"
                style={{ backgroundImage: `url(${sourcePreview})` }}
              >
                {!sourcePreview && <p className="text-gray-400">انقر لاختيار صورة</p>}
              </div>

              <button
                onClick={handleCartoonifyClick}
                disabled={isLoading || !sourceFile}
                className="w-full mt-4 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-rose-500 to-purple-600 rounded-lg hover:from-rose-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-rose-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'جاري الكرتنة...' : 'حوّل إلى كرتون!'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>
              
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg flex flex-col justify-center items-center relative min-h-[28rem]">
              {isLoading && (
                  <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-2xl">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-500"></div>
                    <p className="text-gray-300 mt-4">الذكاء الاصطناعي يعمل بسحره...</p>
                  </div>
              )}
              
              <div className="w-full h-full flex flex-col justify-center items-center">
                {resultImageUrl ? (
                  <>
                    <img src={resultImageUrl} alt="صورة كرتونية" className="max-h-96 max-w-full object-contain rounded-lg"/>
                    <button onClick={handleDownloadClick} className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all">
                      تحميل الصورة
                    </button>
                  </>
                ) : (
                  <p className="text-gray-400 text-center">صورتك الكرتونية ستظهر هنا</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">لماذا تستخدم أداة كرتنة الصور الخاصة بنا؟</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">في بحر من برامج التعديل، تتميز أداتنا بكونها سهلة للغاية، سريعة، ومجانية تمامًا. بدون أي قيود.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-rose-400 mb-2">نتائج فورية</h3><p className="text-gray-300">احصل على صورتك الكرتونية في ثوانٍ. تم تحسين الذكاء الاصطناعي لدينا للسرعة والجودة.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-rose-400 mb-2">فلتر كرتوني كلاسيكي</h3><p className="text-gray-300">نحن متخصصون في المظهر الكرتوني الممتع ثنائي الأبعاد، المثالي لصور البروفايل ومنشورات وسائل التواصل الاجتماعي.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-rose-400 mb-2">بدون تسجيل</h3><p className="text-gray-300">نحترم وقتك. ابدأ مباشرة في تحويل صورك دون عناء إنشاء حساب.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-rose-400 mb-2">مجاني تمامًا</h3><p className="text-gray-300">استمتع بتحويلات غير محدودة. لا رسوم خفية، لا اشتراكات، ولا علامات مائية.</p></div>
                  </div>
              </section>

              <section className="mt-20 text-center">
                   <h2 className="text-3xl font-bold mb-4">من صورة إلى كرتون في 3 خطوات بسيطة</h2>
                   <p className="max-w-3xl mx-auto text-gray-400 mb-12">عمليتنا البديهية تجعل من السهل على أي شخص الحصول على نسخة كرتونية عالية الجودة من صورته.</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-rose-400 font-bold text-lg mb-2">١. ارفع صورتك</p><p className="text-gray-300">انقر على منطقة الرفع واختر أي صورة من جهازك. يمكن أن تكون صورة شخصية، صورة جماعية، أو حتى لحيوان أليف!</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-rose-400 font-bold text-lg mb-2">٢. انقر "حوّل إلى كرتون!"</p><p className="text-gray-300">اضغط على الزر ودع الذكاء الاصطناعي يقوم بالعمل الشاق. تبدأ عملية التحويل على الفور.</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-rose-400 font-bold text-lg mb-2">٣. حمّل وشارك</p><p className="text-gray-300">في غضون لحظات قليلة، ستكون صورتك الكرتونية الجديدة جاهزة للتحميل والمشاركة مع أصدقائك ومتابعيك.</p></div>
                   </div>
              </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">أسئلة شائعة</h2>
                  <div className="space-y-6 text-right">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-rose-400 mb-2">{faq.question}</h3>
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

export default CartoonifyPageArabic;
