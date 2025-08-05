import { useState, useRef, ChangeEvent } from 'react';

const creativeIdeas = [
  { title: 'لمسات تاريخية', description: 'ضع وجهك على لوحة أو صورة شخصية تاريخية مشهورة.' },
  { title: 'متعة نجوم السينما', description: 'بدّل وجهك مع وجه ممثلك المفضل في مشهد سينمائي أيقوني.' },
  { title: 'مزيج الأصدقاء والعائلة', description: 'أنشئ تركيبات مرحة عن طريق دمج وجوه الأصدقاء وأفراد العائلة.' },
  { title: 'إبداعات فنية', description: 'استخدم دمج الوجوه لإنشاء مشاريع فنية رقمية فريدة وسريالية.' },
];

const ethicalGuidelines = [
  { title: 'الاستخدام المسؤول', description: 'استخدم الأداة مع احترام خصوصية الآخرين وحقوقهم الشخصية.' },
  { title: 'تجنب إساءة الاستخدام', description: 'امتنع عن استخدام الأداة بطرق مسيئة، مثل الخداع أو التنمر أو إهانة الآخرين.' },
  { title: 'احترام الخصوصية', description: 'لا تستخدم أو تشارك صور الأفراد دون موافقتهم الصريحة.' },
];

const faqData = [
    { question: 'ما هو تبديل الوجوه بالذكاء الاصطناعي وكيف يعمل؟', answer: 'تبديل الوجوه هو تقنية تستخدم الذكاء الاصطناعي لاستبدال وجه في صورة بوجه من صورة أخرى. تعمل التقنية عبر تحليل الملامح الرئيسية للوجه في الصورة المصدر ودمجها بسلاسة على الصورة الهدف.' },
    { question: 'هل يمكنني تبديل الوجوه أونلاين مجانًا؟', answer: 'نعم، Mergify هي أداة مجانية تمامًا لتبديل ودمج الوجوه أونلاين. تتيح لك تركيب الوجوه على الصور دون الحاجة للتسجيل أو بطاقة ائتمان.' },
    { question: 'هل أداة Mergify مناسبة لتبديل الوجوه في الصور الجماعية؟', answer: 'نعم، أداتنا مصممة للعمل مع الصور الجماعية. ببساطة، ارفع صورة المصدر والصورة الهدف، ثم حدد رقم الشخص (من اليسار إلى اليمين) في كل صورة لضمان تبديل الوجوه الصحيحة.' },
    { question: 'ما هي فوائد استخدام الذكاء الاصطناعي لتبديل الوجوه؟', answer: 'توفر تقنية الذكاء الاصطناعي نتائج واقعية وسلسة للغاية. فهي تحلل بذكاء الإضاءة والزوايا وتعبيرات الوجه لجعل الصورة النهائية المدمجة تبدو طبيعية ومقنعة.' },
    { question: 'هل هناك أي قيود على استخدام أداة Mergify؟', answer: 'لا تفرض Mergify أي قيود على عدد الصور التي يمكنك معالجتها. للحصول على أفضل النتائج، استخدم صورًا واضحة وذات وجه أمامي حيث لا تكون الملامح محجوبة.' },
    { question: 'ماذا عن الخصوصية عند استخدام Mergify؟', answer: 'نحن نعطي الأولوية لخصوصيتك. تتم معالجة جميع الصور التي يتم رفعها على خوادمنا ويتم حذفها تلقائيًا بعد فترة قصيرة. نحن لا نقوم بتخزين أو مشاركة صورك أبدًا.' },
    { question: 'ما هو ترخيص نموذج الذكاء الاصطناعي المستخدم في هذه الأداة؟', answer: 'يخضع النموذج لـ "رخصة الذكاء الاصطناعي المسؤول" (creativeml-openrail-m)، والتي تسمح بمجموعة واسعة من الاستخدامات طالما أنها تلتزم بقيود حالات الاستخدام المحددة لمنع التطبيقات الضارة. يمكنك قراءة الرخصة الكاملة لمزيد من التفاصيل.'},
];

// --- React Component ---
function FaceMergePageArabic() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [destinationFile, setDestinationFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [destinationPreview, setDestinationPreview] = useState<string | null>(null);
  
  const [sourcePersonNumber, setSourcePersonNumber] = useState('1');
  const [destinationPersonNumber, setDestinationPersonNumber] = useState('1');

  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sourceFileInputRef = useRef<HTMLInputElement>(null);
  const destinationFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>, type: 'source' | 'destination') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'source') {
          setSourceFile(file);
          setSourcePreview(result);
        } else {
          setDestinationFile(file);
          setDestinationPreview(result);
        }
      };
      reader.readAsDataURL(file);
      setResultImageUrl(null);
      setError(null);
    }
  };

  const handleMergeClick = async () => {
    if (!sourceFile || !destinationFile) {
      setError('الرجاء رفع صورة المصدر والصورة الهدف معًا.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImageUrl(null);

    const formData = new FormData();
    formData.append('source_file', sourceFile);
    formData.append('destination_file', destinationFile);
    formData.append('source_face_index', sourcePersonNumber);
    formData.append('destination_face_index', destinationPersonNumber);
    
    try {
      // تم تغيير هذا السطر فقط للاتصال بالـ API الداخلي الآمن
      const response = await fetch('/api/face-merge', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'فشل تبديل الوجوه. الرجاء التحقق من صورك والمحاولة مرة أخرى.');
      }
      
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setResultImageUrl(imageUrl);

    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير معروف.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>دمج الصور | دمج صورتين مع بعض أون لاين باستخدام الذكاء الاصطناعي مجانًا</title>
      <meta name="description" content="استمتع معنا مجانًا مع أحدث تقنيات الذكاء الاصطناعي في عملية تبديل ودمج الوجوه في جميع الصور بما فيها صور الذكاء الاصطناعي free ai face swap" />
      <link rel="canonical" href="https://aiconvert.online/ar/ai-face-merge" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/ai-face-merge" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/ai-face-merge" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/ai-face-merge" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Mergify أداة دمج وتبديل الوجوه",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "ratingCount": "2410"
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-600">
              Mergify: دمج الوجوه وتبديل الصور بالذكاء الاصطناعي مجانًا
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              أنشئ صورًا مضحكة ومذهلة عبر تبديل الوجوه باستخدام أداتنا المجانية. ارفع صورتين ودع الذكاء الاصطناعي يدمجهما لك بسلاسة.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Controls Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <h2 className="sr-only">أداة تبديل الوجوه</h2>

              <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">1. ارفع صورة المصدر (الوجه)</h3>
                  <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, 'source')} ref={sourceFileInputRef} className="hidden" />
                  <div onClick={() => sourceFileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-700/50 transition">
                    {sourcePreview ? <img src={sourcePreview} alt="معاينة المصدر" className="max-h-full max-w-full object-contain" /> : <p className="text-gray-400">انقر لاختيار صورة المصدر</p>}
                  </div>
                  <div className="mt-2">
                    <label htmlFor="source-person" className="text-sm text-gray-400">رقم الشخص (من اليسار، يبدأ بـ 1):</label>
                    <input id="source-person" type="number" min="1" value={sourcePersonNumber} onChange={(e) => setSourcePersonNumber(e.target.value)} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg"/>
                  </div>
              </div>

              <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">2. ارفع الصورة الهدف</h3>
                  <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, 'destination')} ref={destinationFileInputRef} className="hidden" />
                  <div onClick={() => destinationFileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-700/50 transition">
                    {destinationPreview ? <img src={destinationPreview} alt="معاينة الهدف" className="max-h-full max-w-full object-contain" /> : <p className="text-gray-400">انقر لاختيار الصورة الهدف</p>}
                  </div>
                   <div className="mt-2">
                    <label htmlFor="dest-person" className="text-sm text-gray-400">رقم الشخص (من اليسار، يبدأ بـ 1):</label>
                    <input id="dest-person" type="number" min="1" value={destinationPersonNumber} onChange={(e) => setDestinationPersonNumber(e.target.value)} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg"/>
                  </div>
              </div>

              <button
                onClick={handleMergeClick} disabled={isLoading || !sourceFile || !destinationFile}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-lg hover:from-purple-700 hover:to-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'جاري تبديل الوجوه...' : 'تبديل الوجوه'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* Output Column */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg flex flex-col justify-center items-center relative min-h-[28rem]">
              {isLoading && (
                  <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-2xl">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-fuchsia-500"></div>
                    <p className="text-gray-300 mt-4">الذكاء الاصطناعي يقوم بعملية الدمج...</p>
                  </div>
              )}
              
              <div className="w-full h-full flex flex-col justify-center items-center">
                {resultImageUrl ? (
                  <>
                    <img src={resultImageUrl} alt="النتيجة المدمجة" className="max-h-96 max-w-full object-contain rounded-lg"/>
                    <a href={resultImageUrl} download="merged-image.png" className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all">
                      تحميل الصورة
                    </a>
                  </>
                ) : (
                  <p className="text-gray-400 text-center">صورتك المُبدلة ستظهر هنا</p>
                )}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">لماذا تختار Mergify لتبديل الوجوه؟</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-fuchsia-400 mb-2">نتائج واقعية</h3><p className="text-gray-300">يقوم الذكاء الاصطناعي المتقدم لدينا بإنشاء عمليات دمج سلسة وطبيعية للوجوه تمتزج بشكل مثالي.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-fuchsia-400 mb-2">سريع ومجاني</h3><p className="text-gray-300">أنشئ عددًا غير محدود من عمليات تبديل الوجوه بسرعة وبدون أي تكلفة. لا اشتراكات أو رسوم خفية.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-fuchsia-400 mb-2">الخصوصية أولاً</h3><p className="text-gray-300">تتم معالجة صورك بأمان وحذفها تلقائيًا. نحن لا نقوم بتخزين بياناتك أبدًا.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-fuchsia-400 mb-2">سهل الاستخدام</h3><p className="text-gray-300">واجهة بسيطة تجعل تركيب الوجوه على الصور متاحًا للجميع، دون الحاجة إلى مهارات تقنية.</p></div>
                  </div>
              </section>

              <section className="mt-20">
                  <div className="text-center"><h2 className="text-3xl font-bold mb-4">كيفية تبديل الوجوه في 3 خطوات بسيطة</h2><p className="max-w-3xl mx-auto text-gray-400 mb-12">اتبع هذا الدليل لإنشاء دمج مثالي لوجهك في أقل من دقيقة.</p></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-fuchsia-400 font-bold text-lg mb-2">1. ارفع صورة المصدر والهدف</p><p className="text-gray-300">اختر "صورة المصدر" التي تحتوي على الوجه الذي تريد استخدامه. ثم، ارفع "الصورة الهدف" التي سيتم وضع الوجه عليها.</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-fuchsia-400 font-bold text-lg mb-2">2. حدد رقم الشخص</p><p className="text-gray-300">في حقل الإدخال أسفل كل صورة، أدخل رقم الشخص الذي تريد تبديله، مع العد من اليسار إلى اليمين (مثال: 1، 2، 3...).</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-fuchsia-400 font-bold text-lg mb-2">3. ادمج وحمّل</p><p className="text-gray-300">انقر على زر "تبديل الوجوه". سيقوم الذكاء الاصطناعي بمعالجة الصورتين، وستظهر نتيجتك النهائية جاهزة للتنزيل.</p></div>
                  </div>
              </section>

              <section className="mt-20">
                  <div className="text-center"><h2 className="text-3xl font-bold mb-4">أطلق العنان لإبداعك</h2><p className="max-w-3xl mx-auto text-gray-400 mb-12">هل تحتاج إلى بعض الإلهام؟ إليك بعض الأفكار الممتعة لتجربتها مع مولد الوجوه الخاص بنا.</p></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {creativeIdeas.map((idea, index) => (
                          <div key={index} className="bg-gray-800/50 p-6 rounded-lg"><h3 className="text-lg font-semibold text-fuchsia-400 mb-2">{idea.title}</h3><p className="text-gray-300">{idea.description}</p></div>
                      ))}
                  </div>
              </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">الأسئلة الشائعة</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-fuchsia-400 mb-2">{faq.question}</h3>
                              <div className="text-gray-300 leading-relaxed">{faq.answer}</div>
                          </div>
                      ))}
                  </div>
              </section>

              <section className="mt-20 max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">التزامنا بالاستخدام المسؤول للذكاء الاصطناعي</h2>
                <p className="max-w-3xl mx-auto text-gray-400 mb-8">هذه الأداة مخصصة للأغراض الإبداعية والترفيهية. نحن ملتزمون بالاستخدام الأخلاقي ومنع إساءة الاستخدام.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
                  {ethicalGuidelines.map((guideline, index) => (
                    <div key={index} className="bg-gray-800/50 p-6 rounded-lg">
                      <h3 className="font-semibold text-fuchsia-400 mb-2">{guideline.title}</h3>
                      <p className="text-gray-300 text-sm">{guideline.description}</p>
                    </div>
                  ))}
                </div>
                 <p className="text-xs text-gray-400 mt-8">نحن نلتزم بجميع سياسات المنصات، بما في ذلك الحفاظ على خصوصية المستخدم وعدم المساس بالبيانات الشخصية. لا ندعم أي استخدام يتعارض مع هذه المبادئ.</p>
              </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default FaceMergePageArabic;
