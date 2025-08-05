import { useState, useRef, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

// --- دالة مساعدة ---
// تقوم بضغط الصورة وتحويلها إلى ملف JPEG
async function compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('سياق الكانفاس غير متوفر.'));

                const maxWidth = 1000;
                const maxHeight = 1000;
                let { width, height } = img;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round(height * (maxWidth / width));
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round(width * (maxHeight / height));
                        height = maxHeight;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                        } else {
                            reject(new Error('فشل تحويل الكانفاس إلى Blob.'));
                        }
                    },
                    'image/jpeg',
                    0.7 // جودة 70%
                );
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}

function DigiCartoonyPageArabic() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [detectFace, setDetectFace] = useState(true);
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

  const handleGenerateClick = async () => {
    if (!sourceFile) {
      setError('يرجى رفع صورة للبدء.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImageUrl(null);

    try {
      const compressedFile = await compressImage(sourceFile);
      
      const formData = new FormData();
      formData.append('file', compressedFile);
      formData.append('if_face', detectFace ? 'Yes' : 'No');

      // تم تغيير الرابط فقط إلى الواجهة الخلفية الآمنة
      const response = await fetch('/api/tools?tool=digicartoony', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const imageBlob = await response.blob();
        setResultImageUrl(URL.createObjectURL(imageBlob));
      } else {
        const errorText = await response.text();
        setError(errorText || 'حدث خطأ أثناء المعالجة. يرجى المحاولة مرة أخرى.');
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع. يرجى التحقق من اتصالك.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (!resultImageUrl) return;
    const link = document.createElement('a');
    link.href = resultImageUrl;
    link.download = 'digital-art.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

// --- ثوابت البيانات ---
const faqData = [
    {
        question: 'كيف تختلف هذه الأداة عن فلاتر الكرتون البسيطة؟',
        answer: 'DigiCartoony لا يقوم فقط بتطبيق فلتر. بل يستخدم ذكاءً اصطناعيًا متقدمًا لإعادة تصور صورتك كقطعة فنية رقمية جديدة، مضيفًا عمقًا فنيًا، إضاءة معقدة، وجودة فريدة.'
    },
    {
        question: 'ماذا يفعل خيار "تحديد الوجه فقط"؟',
        answer: 'هذه الميزة القوية تمنحك تحكمًا فنيًا. عند تفعيلها، يركز الذكاء الاصطناعي كل طاقته على تحويل الوجه في صورتك فقط إلى بورتريه رقمي مفصل. عند تعطيلها، يقوم بتحويل الصورة بأكملها، وهو أمر رائع للمناظر الطبيعية أو الصور كاملة الجسم.'
    },
    {
        question: 'ما الفرق بين DigiCartoony و Cartoonify؟',
        answer: (
            <>
                إنهما فنانان مختلفان لهدفين مختلفين. <strong>DigiCartoony</strong> هو رسام رقمي، ينشئ قطعة فنية مفصلة وعالية الجودة بعمق فريد، وهو مخصص لإنشاء تحفة فنية.
                بينما أداة <Link to="/ar/cartoonify/" className="text-rose-400 underline">Cartoonify</Link> هي فنان اسكتشات سريع، يمنحك مظهر "كرتوني" ممتعًا وثنائي الأبعاد على الفور، وهو مثالي لمنشورات وسائل التواصل الاجتماعي.
            </>
        )
    },
     {
        question: 'هل صوري التي أرفعها آمنة؟',
        answer: 'نعم، خصوصيتك هي أولويتنا القصوى. يتم رفع الصور بشكل آمن لمعالجتها بواسطة الذكاء الاصطناعي، ويتم حذفها تلقائيًا من خوادمنا بعد فترة وجيزة. نحن لا نخزن أو نشارك صورك أبدًا.'
    },
];


  return (
    <>
      <title>تحويل الصور إلى رسم رقمي بالذكاء الاصطناعي | لوحة فنية</title>
      <meta name="description" content="حوّل صورتك إلى لوحة فنية رقمية مذهلة باستخدام أداتنا المجانية بالذكاء الاصطناعي. أنشئ فنًا رقميًا عالي الجودة من صورك أونلاين، بدون تسجيل." />
      <link rel="canonical" href="https://aiconvert.online/ar/cartoony-art" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/cartoony-art" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/cartoony-art" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/cartoony-art" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "name": "DigiCartoony: تحويل الصور إلى رسم رقمي",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "description": "أداة ذكاء اصطناعي تحول الصور إلى لوحات رقمية عالية الجودة بأسلوب فني، مع خيار للتركيز على الوجه.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1720"
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">
              DigiCartoony: حوّل صورتك إلى فن رقمي
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              ارتقِ بصورك إلى مستوى اللوحات الفنية الرقمية عالية الجودة. حوّل صورتك إلى قطعة فنية فريدة مجانًا.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* --- عمود التحكم --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <div className="text-center">
                  <h2 className="text-2xl font-bold">١. ارفع صورتك</h2>
              </div>
              <div 
                onClick={() => sourceFileInputRef.current?.click()} 
                className="w-full h-40 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-700/50 transition-colors bg-cover bg-center"
                style={{ backgroundImage: `url(${sourcePreview})` }}
              >
                {!sourcePreview && <p className="text-gray-400">انقر لاختيار صورة</p>}
              </div>
              <input type="file" accept="image/*" onChange={handleFileSelect} ref={sourceFileInputRef} className="hidden" />
              
              <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                <input 
                  type="checkbox" 
                  id="face-detect" 
                  checked={detectFace}
                  onChange={(e) => setDetectFace(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-500 bg-gray-800 text-teal-500 focus:ring-teal-400"
                />
                <label htmlFor="face-detect" className="text-gray-200">٢. تحديد الوجه</label>
              </div>

              <button
                onClick={handleGenerateClick}
                disabled={isLoading || !sourceFile}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg hover:from-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'جاري إنشاء لوحتك...' : 'حوّل إلى فن رقمي'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* --- عمود النتائج --- */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg flex flex-col justify-center items-center relative min-h-[28rem]">
              {isLoading && (
                  <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-2xl">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
                    <p className="text-gray-300 mt-4">نرسم تحفتك الفنية...</p>
                  </div>
              )}
              <div className="w-full h-full flex flex-col justify-center items-center">
                {resultImageUrl ? (
                  <>
                    <img src={resultImageUrl} alt="لوحة رقمية" className="max-h-96 max-w-full object-contain rounded-lg"/>
                    <button onClick={handleDownloadClick} className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all">
                      تحميل العمل الفني
                    </button>
                  </>
                ) : (
                  <p className="text-gray-400 text-center">عملك الفني الرقمي سيظهر هنا</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">تجاوز الفلاتر. أنشئ فنًا رقميًا.</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">DigiCartoony ليس مجرد تأثير آخر للصور. إنه أداة فنية تعمل بالذكاء الاصطناعي تعيد تصور صورك كلوحات رقمية عالية الجودة.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-teal-400 mb-2">أسلوب فني فريد</h3><p className="text-gray-300">يحول صورتك إلى عمل فني رقمي مفصل بجمالية فريدة تشبه الرسم بالفرشاة.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-teal-400 mb-2">رسم رقمي غني</h3><p className="text-gray-300">حوّل الصور إلى لوحات رقمية مفصلة بتظليل معقد وذوق فني رفيع.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-teal-400 mb-2">تحكم فني دقيق</h3><p className="text-gray-300">استخدم خيار "تحديد الوجه" لتركيز قوة الذكاء الاصطناعي على إنشاء بورتريه مثالي.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-teal-400 mb-2">مجاني وبدون تسجيل</h3><p className="text-gray-300">احصل على أدوات تحويل صور احترافية أونلاين مجانًا، دون الحاجة للتسجيل.</p></div>
                  </div>
              </section>

              <section className="mt-20 text-center">
                   <h2 className="text-3xl font-bold mb-4">كيف تحول صورتك إلى لوحة فنية</h2>
                   <p className="max-w-3xl mx-auto text-gray-400 mb-12">عمليتنا تمنحك التحكم لإنشاء التحول الفني المثالي.</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-teal-400 font-bold text-lg mb-2">١. ارفع صورتك</p><p className="text-gray-300">اختر صورة عالية الجودة من جهازك. الصور الشخصية الواضحة تعمل بشكل أفضل لإنشاء البورتريه.</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-teal-400 font-bold text-lg mb-2">٢. اضبط لمستك الفنية</p><p className="text-gray-300">اختياريًا، قم بتفعيل "التركيز على الوجه فقط" لتركيز قوة الذكاء الاصطناعي على إنشاء بورتريه مثالي.</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-teal-400 font-bold text-lg mb-2">٣. أنشئ وحمّل</p><p className="text-gray-300">اضغط على زر الإنشاء. سيقوم الذكاء الاصطناعي بإنشاء عملك الفني الجديد، ليكون جاهزًا للتحميل.</p></div>
                   </div>
              </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">أسئلة شائعة</h2>
                  <div className="space-y-6 text-right">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-teal-400 mb-2">{faq.question}</h3>
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

export default DigiCartoonyPageArabic;
