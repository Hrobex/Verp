import { useState, useEffect, ChangeEvent } from 'react';

type Genders = { Male?: string[]; Female?: string[]; };
type LanguageData = { code: string; name: string; genders: Genders; };
type GenderKey = 'Male' | 'Female';

// --- React Component ---
function TextToSpeechPageArabic() {
  const [text, setText] = useState('');
  const [selectedLanguageCode, setSelectedLanguageCode] = useState('ar-BH'); // Default to Bahrain
  const [selectedGender, setSelectedGender] = useState<GenderKey>('Female');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  const [voicesData, setVoicesData] = useState<LanguageData[]>([]);
  const [languageNamesArabic, setLanguageNamesArabic] = useState<{ [key: string]: string }>({}); // تم تغيير الاسم هنا
  const [genders, setGenders] = useState<GenderKey[]>([]);
  const [voices, setVoices] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchVoicesData = async () => {
      try {
        const response = await fetch('/api/tts-voices');
        if (!response.ok) throw new Error('Could not load voice data.');
        const data = await response.json();
        
        setVoicesData(data.voices);
        setLanguageNamesArabic(data.translations);

        const initialLang = data.voices.find((lang: LanguageData) => lang.code === 'ar-BH');
        if (initialLang?.genders.Female?.[0]) {
            setSelectedVoice(initialLang.genders.Female[0]);
        }
      } catch (err) {
        setError('فشل تحميل الأصوات المتاحة. يرجى تحديث الصفحة.');
      }
    };
    fetchVoicesData();
  }, []);

  useEffect(() => {
    if (voicesData.length === 0) return;
    const currentLanguage = voicesData.find(lang => lang.code === selectedLanguageCode);
    const availableGenders = currentLanguage ? Object.keys(currentLanguage.genders) as GenderKey[] : [];
    setGenders(availableGenders);
    if (availableGenders.length > 0 && !availableGenders.includes(selectedGender)) {
      setSelectedGender(availableGenders[0]);
    }
  }, [selectedLanguageCode, voicesData]);

  useEffect(() => {
    if (voicesData.length === 0) return;
    const currentLanguage = voicesData.find(lang => lang.code === selectedLanguageCode);
    if (currentLanguage && selectedGender && currentLanguage.genders[selectedGender]) {
      const availableVoices = currentLanguage.genders[selectedGender] || [];
      setVoices(availableVoices);
      setSelectedVoice(availableVoices[0] || '');
    } else {
      setVoices([]);
      setSelectedVoice('');
    }
  }, [selectedLanguageCode, selectedGender, voicesData]);

  // --- Handlers ---
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= 1500) {
      setText(newText);
    }
  };
  
  const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedGender(e.target.value as GenderKey);
  };

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      setError('الرجاء إدخال نص لتحويله إلى كلام.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAudioURL(null);

    const formData = new FormData();
    formData.append('text', text);
    formData.append('language', selectedLanguageCode);
    formData.append('gender', selectedGender);
    formData.append('voice', selectedVoice);
    formData.append('rate', rate.toString());
    formData.append('pitch', pitch.toString());

    try {
      const response = await fetch('/api/tts-generate', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('فشل توليد الصوت. قد تكون الخدمة مشغولة. الرجاء المحاولة مرة أخرى.');
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير معروف.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const totalVoices = voicesData.reduce((acc, lang) => acc + (lang.genders.Male?.length || 0) + (lang.genders.Female?.length || 0), 0);
  const totalLanguages = voicesData.length;
  
  const faqData = [
    { question: 'هل أداة تحويل النص إلى صوت مجانية حقًا؟', answer: `نعم، تمامًا. مولد الصوت بالذكاء الاصطناعي الخاص بنا مجاني 100% لجميع المستخدمين. لا توجد حدود لعدد الأحرف، أو أصوات مميزة مدفوعة، أو رسوم اشتراك.`},
    { question: 'كم عدد اللغات والأصوات المتاحة؟', answer: `نحن نقدم مكتبة ضخمة تضم أكثر من ${totalVoices > 0 ? totalVoices : '700+'} صوتًا طبيعيًا في أكثر من ${totalLanguages > 0 ? totalLanguages : '100+'} لغة ولهجة، مما يجعلها واحدة من أشمل أدوات تحويل الكتابة إلى صوت أونلاين.`},
    { question: 'هل يمكنني استخدام الصوت الذي تم إنشاؤه على يوتيوب أو في مشاريع تجارية؟', answer: 'بالتأكيد. الصوت الذي تقوم بإنشائه هو ملكك ولك كامل الحرية في استخدامه لأي غرض، بما في ذلك المشاريع التجارية ومحتوى وسائل التواصل الاجتماعي ومقاطع الفيديو على يوتيوب، دون أي حقوق أو حاجة لذكر المصدر.'},
    { question: 'كيف يمكنني تحميل الملف الصوتي؟', answer: 'بعد إنشاء الصوت، سيظهر مشغل صوتي. يمكنك الاستماع إليه ثم الضغط على زر "تحميل الصوت" لحفظه على جهازك كملف MP3.'},
  ];
  
  return (
    <>
      <title>تحويل النص إلى صوت بالذكاء الاصطناعي مجاناً | مولد الأصوات</title>
      <meta name="description" content={`حوّل أي نص مكتوب إلى صوت مسموع بأصوات بشرية طبيعية باستخدام مولد الأصوات المجاني. يدعم أكثر من ${totalLanguages} لغة ولهجة وأكثر من ${totalVoices} صوت مختلف. جربه الآن أونلاين.`} />
      <link rel="canonical" href="https://aiconvert.online/ar/text-to-speech" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/text-to-speech" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/text-to-speech" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/text-to-speech" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "مولد الأصوات المجاني بالذكاء الاصطناعي",
            "description": "أداة مجانية لتحويل النص إلى صوت بالذكاء الاصطناعي. تدعم أكثر من 100 لغة و 700 صوت طبيعي، مع إمكانية التحكم في سرعة الكلام ودرجة حدة الصوت.",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              مولد الأصوات بالذكاء الاصطناعي مجانًا
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              امنح نصوصك الحياة. حوّل أي كتابة إلى صوت طبيعي ومسموع باستخدام أداتنا المجانية التي تدعم مئات الأصوات واللغات واللهجات.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Controls Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-5">
              
              <div>
                <label htmlFor="text-input" className="block text-sm font-medium text-gray-300 mb-2">1. أدخل النص هنا</label>
                <div className="relative">
                  <textarea
                    id="text-input" value={text} onChange={handleTextChange} placeholder="اكتب أو الصق النص الذي تريد تحويله..."
                    className="w-full h-40 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  />
                  <p className="absolute bottom-2 left-3 text-xs text-gray-400">متبقي {1500 - text.length} حرف</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">2. اختر الصوت المفضل</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select id="language" value={selectedLanguageCode} onChange={(e) => setSelectedLanguageCode(e.target.value)} className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500">
                        {voicesData.map(lang => <option key={lang.code} value={lang.code}>{languageNamesArabic[lang.code] || lang.name}</option>)}
                    </select>
                    <select id="gender" value={selectedGender} onChange={handleGenderChange} className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500" disabled={genders.length === 0}>
                        {genders.map(gender => <option key={gender} value={gender}>{gender === 'Male' ? 'ذكر' : 'أنثى'}</option>)}
                    </select>
                    <select id="voice" value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500" disabled={voices.length === 0}>
                       {voices.map(voice => <option key={voice} value={voice}>{voice.split('-').slice(2).join('-').replace('Neural', '')}</option>)}
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">3. اضبط إعدادات الصوت</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label htmlFor="rate-slider" className="w-16">السرعة</label>
                    <input id="rate-slider" type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                    <span className="w-8 text-center">{rate.toFixed(1)}x</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label htmlFor="pitch-slider" className="w-16">الحدة</label>
                    <input id="pitch-slider" type="range" min="0.5" max="1.5" step="0.1" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                    <span className="w-8 text-center">{pitch.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerateAudio} disabled={isLoading || !selectedVoice}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-red-600 to-orange-500 rounded-lg hover:from-red-700 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? 'جاري توليد الصوت...' : 'توليد الصوت'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* Output Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center h-96 lg:h-auto">
              {isLoading && (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
                  <p className="text-gray-400">يتم تحويل النص إلى صوت طبيعي...</p>
                </div>
              )}
              {!isLoading && !audioURL && (
                <div className="text-center text-gray-500 p-4">
                  <p className="text-lg">سيظهر ملفك الصوتي هنا</p>
                  <p className="text-sm mt-2">جاهز للتحميل كملف MP3</p>
                </div>
              )}
              {audioURL && (
                <div className="w-full flex flex-col items-center gap-6">
                  <audio controls src={audioURL} className="w-full">متصفحك لا يدعم عنصر الصوت.</audio>
                  <a href={audioURL} download="generated-audio.mp3" className="w-full py-3 px-4 text-center text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all">
                    تحميل الصوت (MP3)
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-24">
              <section className="text-center">
    <h2 className="text-3xl font-bold mb-4">لماذا تختار مولد الأصوات الخاص بنا؟</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-2">مجاني بالكامل</h3>
            <p className="text-gray-300">استمتع بتحويل غير محدود للنصوص إلى أصوات بدون أي تكلفة. لا اشتراكات ولا رسوم خفية.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-2">315+ صوت طبيعي</h3>
            <p className="text-gray-300">استفد من مكتبة ضخمة من الأصوات عالية الجودة التي تحاكي أصوات البشر لأي مشروع.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-2">{totalLanguages}+ لغة ولهجة</h3>
            <p className="text-gray-300">من الإنجليزية والإسبانية إلى العربية والصينية، أنشئ محتوى صوتيًا لجمهور عالمي.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-2">تحكم كامل بالصوت</h3>
            <p className="text-gray-300">اضبط سرعة الكلام ودرجة حدة الصوت بسهولة لتنتج نبرة الصوت المثالية التي تناسب محتواك.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-2">بدون تسجيل</h3>
            <p className="text-gray-300">قم بتوليد وتحميل ملفاتك الصوتية فورًا. نحن نقدر وقتك وخصوصيتك.</p>
        </div>
    </div>
</section>

            <section className="mt-20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">كيفية تحويل النص إلى صوت في 3 خطوات بسيطة</h2>
                    <p className="max-w-3xl mx-auto text-gray-400 mb-12">
                        أداتنا البسيطة تجعل عملية إنشاء ملفات صوتية عالية الجودة من النصوص سهلة للجميع، من صناع المحتوى إلى الطلاب.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-red-400 font-bold text-lg mb-2">1. أدخل النص</p>
                        <p className="text-gray-300">
                            اكتب أو الصق النص الذي تريد تحويله في صندوق النص. يمكنك كتابة أي شيء من جملة قصيرة إلى فقرة أطول.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-red-400 font-bold text-lg mb-2">2. اختر صوتك</p>
                        <p className="text-gray-300">
                            اختر اللغة، والجنس، والصوت المحدد الذي تفضله. يمكنك أيضًا تعديل سرعة الكلام وحدته للحصول على النبرة المثالية.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-red-400 font-bold text-lg mb-2">3. ولّد وحمّل</p>
                        <p className="text-gray-300">
                           اضغط على زر "توليد الصوت". في لحظات، سيكون ملفك الصوتي جاهزًا للاستماع والتحميل كملف MP3 عالي الجودة.
                        </p>
                    </div>
                </div>
            </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">الأسئلة الشائعة</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-red-400 mb-2">{faq.question}</h3>
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

export default TextToSpeechPageArabic;
