// الملف: LineArtifyPageArabic.tsx (النسخة الجديدة والآمنة)
import { useState, useCallback, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

const ImageUploadBox = ({ title, imageSrc, onFileChange, onDrop, onDragOver }: {
  title: string;
  imageSrc: string | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLLabelElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLLabelElement>) => void;
}) => {
  const inputId = `file-upload-${title.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="w-full flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-300 mb-4">{title}</h3>
      <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center p-4">
        <label
          htmlFor={inputId}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={(e) => e.currentTarget.classList.remove('border-blue-500')}
          className="w-full h-full border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          {imageSrc ? (
            <img src={imageSrc} alt="معاينة الصورة المرفوعة" className="max-w-full max-h-full object-contain rounded-md" />
          ) : (
            <div className="text-center text-gray-500">
              <p>اسحب وأفلت صورتك هنا</p>
              <p className="my-2">أو</p>
              <p className="bg-gray-700 px-4 py-2 rounded-md">انقر لاختيار ملف</p>
            </div>
          )}
          <input id={inputId} type="file" className="hidden" accept="image/*" onChange={onFileChange} />
        </label>
      </div>
    </div>
  );
};

const faqData = [
    {
        question: 'ما هي أداة LineArtify؟',
        answer: 'LineArtify هي أداة مجانية متقدمة تعمل بالذكاء الاصطناعي، مصممة خصيصًا لتحويل الصور إلى رسومات رصاص دقيقة ونظيفة في ثوانٍ معدودة.'
    },
    {
        question: 'ما الفرق بين LineArtify و ArtifyPro؟',
        answer: (
            <>
                كلا الأداتين تقدمان نتائج فنية مذهلة، لكنهما تخدمان أغراضًا مختلفة. 
                أداة <strong>LineArtify</strong> تتخصص في استخراج الخطوط الأساسية من صورتك لإنتاج <strong>رسم رصاص</strong> واضح ونقي، وهو مثالي لتصميمات الشعارات، صفحات التلوين، أو أي مشروع يتطلب خطوطًا محددة.
                بينما أداة <Link to="/ar/easy-drawings" className="text-cyan-400 hover:underline">ArtifyPro</Link> مصممة لإنشاء <strong>اسكتش فني</strong> متكامل يحاكي الرسم اليدوي، مع تظليل غني وتفاصيل دقيقة لإعطاء انطباع فني أعمق وأكثر واقعية.
            </>
        )
    },
    {
      question: "ما الفرق بين نمط \"بسيط\" و \"معقد\"؟",
      answer: 'النمط "البسيط" (Simple) يولد خطوطًا أساسية ونظيفة، وهو مثالي للحصول على تأثير رسم بالقلم الرصاص بسيط ومباشر. أما النمط "المعقد" (Complex) فيلتقط تفاصيل أدق من صورتك الأصلية، مما ينتج عنه رسم رصاص أكثر ثراءً وتعقيدًا.'
    },
    {
      question: 'هل هناك قيود على استخدام الأداة؟',
      answer: 'نعم، 100%. أداة LineArtify مجانية تمامًا للاستخدام وبدون أي قيود على عدد التحويلات. يمكنك تحويل أي عدد من الصور إلى رسومات رصاص حسب حاجتك، دون أي تكلفة أو تسجيل دخول.'
    },
    {
      question: 'ما هي أنواع الصور التي تعطي أفضل النتائج؟',
      answer: 'للحصول على أفضل نتيجة عند تحويل الصور إلى رسم رصاص، استخدم صورًا ذات مواضيع واضحة، إضاءة جيدة، وتباين عالٍ. الصور ذات الحواف المحددة جيدًا تميل إلى إنتاج رسومات أكثر نظافة ودقة.'
    },
];

function LineArtifyPageArabic() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [version, setVersion] = useState('v2');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSourceFile(file);
      setSourcePreview(URL.createObjectURL(file));
      setError(null);
      setResultImage(null);
    } else {
      setError('يرجى رفع ملف صورة صالح.');
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-blue-500');
  };
  
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas context not available'));
          
          const maxWidth = 1024;
          const maxHeight = 1024;
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

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          }, 'image/jpeg', 0.9);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleConvertClick = async () => {
    if (!sourceFile) {
      setError('يرجى رفع صورة أولاً.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const compressedFile = await compressImage(sourceFile);
      
      const formData = new FormData();
      formData.append('file', compressedFile, sourceFile.name);
      formData.append('version', version);

      // تم تغيير هذا السطر فقط للاتصال بالـ API الداخلي الآمن
      const response = await fetch('/api/tools?tool=lineartify', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        setResultImage(URL.createObjectURL(blob));
      } else {
        throw new Error('فشل الخادم في معالجة الصورة. يرجى المحاولة مرة أخرى.');
      }

    } catch (err) {
      console.error('Conversion Error:', err);
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع.';
      setError(`عفوًا! حدث خطأ ما. ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (!resultImage) return;
    const a = document.createElement('a');
    a.href = resultImage;
    a.download = `rasm-khaty_${sourceFile?.name.split('.')[0] || 'image'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <title>تحويل الصور إلى رسومات بالرصاص بالذكاء الاصطناعي في ثوان مجانًا</title>
      <meta name="description" content="حوّل صورك الشخصية وأنواع الصور المختلفة إلى رسومات مذهلة بالرصاص مجانًا في ثوانٍ بالذكاء الاصطناعي باستخدام أداتنا المتقدمة وبدون تسجيل دخول." />
      <link rel="canonical" href="https://aiconvert.online/ar/line-drawing" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/line-drawing" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/line-drawing" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/line-drawing" />  
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "name": "LineArtify: تحويل الصور الى رسومات رصاص",
            "description": "أداة مجانية لتحويل الصور إلى رسومات بالرصاص باستخدام الذكاء الاصطناعي بسرعة وسهولة.",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1520"
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              LineArtify: تحويل الصور إلى رسم رصاص بالذكاء الاصطناعي
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              ارفع صورتك وشاهد الذكاء الاصطناعي يحولها إلى رسم بالقلم الرصاص نقي ومذهل، فورًا ومجانًا.
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ImageUploadBox
                title="الصورة الأصلية"
                imageSrc={sourcePreview}
                onFileChange={onFileInputChange}
                onDrop={onDrop}
                onDragOver={onDragOver}
              />
              <div className="w-full flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">الرسم الناتج</h3>
                <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center p-4 border-2 border-dashed border-gray-600">
                  {isLoading && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                      <p className="text-gray-400">جاري إنشاء الرسم...</p>
                    </div>
                  )}
                  {!isLoading && !resultImage && (
                    <p className="text-center text-gray-500">سيظهر رسم الرصاص الخاص بك هنا</p>
                  )}
                  {resultImage && !isLoading && (
                    <img src={resultImage} alt="صورة تم تحويلها الى رسم بالرصاص" className="max-w-full max-h-full object-contain rounded-md" />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-300">النمط:</span>
                  <div className="flex gap-2">
                      <button onClick={() => setVersion('v1')} className={`px-4 py-2 rounded-md transition-colors ${version === 'v1' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>بسيط</button>
                      <button onClick={() => setVersion('v2')} className={`px-4 py-2 rounded-md transition-colors ${version === 'v2' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>معقد</button>
                  </div>
              </div>
              <button
                onClick={handleConvertClick}
                disabled={isLoading || !sourceFile}
                className="w-full sm:w-auto py-3 px-8 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? 'جاري التحويل...' : 'حوّل إلى رسم رصاص'}
              </button>
              {resultImage && !isLoading && (
                 <button
                    onClick={handleDownloadClick}
                    className="w-full sm:w-auto py-3 px-8 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300"
                  >
                    تحميل
                  </button>
              )}
            </div>
            {error && <p className="text-red-400 text-center mt-6">{error}</p>}
          </div>
          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">الطريقة الأذكى لإنشاء رسومات بالرصاص</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">تقدم LineArtify أداة مجانية لا مثيل لها عبر الإنترنت للفنانين والمصممين والهواة لتحويل أي صورة إلى رسم رصاص احترافي.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-cyan-400 mb-2">فوري ومجاني</h3><p className="text-gray-300">حوّل صورًا غير محدودة إلى رسومات رصاص عبر الإنترنت. بدون رسوم، بدون تسجيل، فقط قوة إبداعية خالصة.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-cyan-400 mb-2">دقة فائقة بالذكاء الاصطناعي</h3><p className="text-gray-300">يحدد الذكاء الاصطناعي المتقدم لدينا الخطوط الرئيسية في صورتك بذكاء ويستخرجها للحصول على نتيجة واضحة ونقية.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-cyan-400 mb-2">بسيط للجميع</h3><p className="text-gray-300">لا حاجة لبرامج أو مهارات. الواجهة السهلة تجعل تحويل الصور إلى رسم رصاص مهمة لا تتطلب أي مجهود.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-cyan-400 mb-2">أطلق العنان لإبداعك</h3><p className="text-gray-300">مثالي لإنشاء صفحات تلوين، أو استنسل للوشم، أو مخططات للمشاريع، أو فن رقمي فريد من نوعه.</p></div>
                  </div>
              </section>
              <section className="mt-20 text-center">
                   <h2 className="text-3xl font-bold mb-4">احصل على رسمتك بالرصاص في ثلاث خطوات</h2>
                   <p className="max-w-3xl mx-auto text-gray-400 mb-12">تم تصميم عمليتنا لتعطيك رسمًا مثاليًا بأقل جهد ممكن.</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                       <div className="bg-gray-800/50 p-6 rounded-lg">
                          <p className="text-cyan-400 font-bold text-lg mb-2">الخطوة 1: ارفع صورتك</p>
                          <p className="text-gray-300">اسحب وأفلت أو انقر لاختيار أي صورة من جهازك. الصور ذات التباين العالي تعمل بشكل أفضل!</p>
                       </div>
                        <div className="bg-gray-800/50 p-6 rounded-lg">
                          <p className="text-cyan-400 font-bold text-lg mb-2">الخطوة 2: اختر النمط</p>
                          <p className="text-gray-300">اختر النمط المفضل لديك — "بسيط" للخطوط النظيفة أو "معقد" لمزيد من التفاصيل — ثم انقر على زر "حوّل إلى رسم رصاص".</p>
                       </div>
                        <div className="bg-gray-800/50 p-6 rounded-lg">
                          <p className="text-cyan-400 font-bold text-lg mb-2">الخطوة 3: حمّل واستخدم</p>
                          <p className="text-gray-300">سيظهر رسمك الجديد في لحظات. قم بتنزيله بجودة عالية واستخدمه في أي مشروع يمكنك تخيله.</p>
                       </div>
                   </div>
              </section>
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">أسئلة شائعة حول محول الصور إلى رسم</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-cyan-400 mb-2">{faq.question}</h3>
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

export default LineArtifyPageArabic;
