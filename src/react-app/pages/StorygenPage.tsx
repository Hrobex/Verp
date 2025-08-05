// الملف: StorygenPage.tsx (النسخة المصححة)
import { useState, useRef, useEffect } from 'react'; // تم حذف ChangeEvent من هنا

// --- الثوابت العامة (آمنة) ---
const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'zh', name: '中文 (Chinese)' },
    { code: 'ja', name: '日本語 (Japanese)' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
];

const faqData = [
  {
    question: 'How does the AI generate a story from a picture?',
    answer: 'Our AI, Storygen, analyzes key elements in your uploaded photo—like characters, setting, and mood. It then uses this visual information as a prompt to weave a unique and creative narrative, complete with a beginning, middle, and end.'
  },
  {
    question: 'Is this AI Story Generator free to use?',
    answer: 'Yes, absolutely. You can turn any image into a story completely for free, without any limits or the need to sign up. It\'s a tool built for pure creativity.'
  },
  {
    question: 'Can I choose the language of the generated story?',
    answer: 'Of course! We support a wide range of languages. Simply select your desired language from the dropdown menu before generating the story, and the AI will write its narrative in that language.'
  },
  {
    question: 'What kind of photos work best for story generation?',
    answer: 'Images with clear subjects, characters, or interesting environments tend to produce the most detailed stories. However, our AI is creative and can find inspiration in almost any picture, from portraits and landscapes to abstract art.'
  },
];

// --- دالة مساعدة لتحويل الصورة إلى Base64 ---
async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
}

function StorygenPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedStory, setGeneratedStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [loadingText, setLoadingText] = useState('The AI is weaving your story...');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      const baseText = "The AI is weaving your story";
      let dotCount = 1;
      setLoadingText(`${baseText}${'.'.repeat(dotCount)}`);
      interval = setInterval(() => {
        dotCount = (dotCount % 3) + 1;
        setLoadingText(`${baseText}${'.'.repeat(dotCount)}`);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // تم تغيير نوع المعامل هنا
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setGeneratedStory('');
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateStory = async () => {
    if (!selectedFile) {
      setError('Please upload an image.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedStory('');

    try {
        const imageData = await fileToBase64(selectedFile);

        const response = await fetch('/api/stvid?tool=story', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imageData: imageData,
                mimeType: selectedFile.type,
                language: selectedLanguage,
            }),
        });
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'An unknown error occurred.');
        }

        setGeneratedStory(result.story);

    } catch (err: any) {
      setError(err.message);
      console.error("Frontend Error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyStory = () => {
    if (!generatedStory) return;
    navigator.clipboard.writeText(generatedStory).catch(() => setError('Failed to copy the story.'));
  };

// --- تأكد من أن هذه الدالة مطابقة ---
const getButtonText = () => {
    if (isLoading) return 'Writing Your Story...';
    // السطر الذي كان يسبب المشكلة تم حذفه
    return 'Generate Story from Image';
};
  
  return (
    <>
      <title>Free AI Story Generator from Image | Turn Picture to Story - Storygen</title>
      <meta name="description" content="Turn any image into a captivating story! Our free AI Story Generator analyzes your photo and writes a unique, creative narrative for you in seconds." />
      <link rel="canonical" href="https://aiconvert.online/ai-story-generator" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/ai-story-generator" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/ai-story-generator" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/ai-story-generator" />
       <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Storygen: AI Story Generator from Image",
            "operatingSystem": "WEB",
            "applicationCategory": "ProductivityApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "2158"
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">
              Storygen: AI Story Generator from Image
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              Every picture has a story. Upload any photo and let our AI writer craft a unique narrative based on your visual prompt.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Controls Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <h2 className="sr-only">Image to Story Tool</h2>
              <div>
                <p className="block text-lg font-semibold text-gray-200 mb-2">1. Upload a Picture</p>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:border-indigo-400 hover:bg-gray-700/50 transition"
                >
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview for story generation" className="max-w-full max-h-full object-contain rounded-md" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <p>Click to browse or drag & drop an image</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="language-select" className="block text-lg font-semibold text-gray-200 mb-2">2. Choose Language</label>
                 <select
                    id="language-select"
                    value={selectedLanguage.code}
                    onChange={(e) => setSelectedLanguage(languageOptions.find(lang => lang.code === e.target.value) || languageOptions[0])}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white"
                >
                    {languageOptions.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>
              </div>

              <button
                onClick={handleGenerateStory}
                disabled={isLoading || !selectedFile}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-lg hover:from-indigo-600 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {getButtonText()}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>
            
            {/* Output Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col min-h-[28rem]">
              <label htmlFor="story-output" className="block text-lg font-semibold text-gray-200 mb-2">3. Read Your AI-Generated Story</label>
              <div className="relative w-full h-full flex flex-col">
                <textarea
                  id="story-output"
                  readOnly
                  value={isLoading ? loadingText : generatedStory}
                  placeholder="Your unique story will appear here..."
                  className="w-full flex-grow p-4 bg-gray-700 border border-gray-600 rounded-lg resize-none text-gray-200 placeholder-gray-400 leading-relaxed"
                />
                {generatedStory && !isLoading && (
                   <button onClick={handleCopyStory} className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all">
                      Copy Story
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Turn Any Visual into a Vivid Narrative</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-indigo-400 mb-2">Instant Inspiration</h3>
                          <p className="text-gray-300">Stuck with writer's block? Use any photo as a visual prompt and let our AI story maker kickstart your creativity.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-indigo-400 mb-2">Deep Narrative AI</h3>
                          <p className="text-gray-300">Our AI doesn't just describe the image; it crafts a full story with characters, plot, and a satisfying conclusion.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-indigo-400 mb-2">Multi-Lingual Writer</h3>
                          <p className="text-gray-300">Generate stories in multiple languages, from English and Spanish to Japanese and Hindi, perfect for global audiences.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-indigo-400 mb-2">Free for Everyone</h3>
                          <p className="text-gray-300">This powerful photo story maker is completely free and unlimited. Turn endless pictures into stories today.</p>
                      </div>
                  </div>
              </section>

            <section className="mt-20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">How to Create a Story from a Picture</h2>
                    <p className="max-w-3xl mx-auto text-gray-400 mb-12">
                        Our visual story generator makes the process incredibly simple. Just follow these three steps.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-indigo-400 font-bold text-lg mb-2">1. Upload Your Photo</p>
                        <p className="text-gray-300">
                           Select any image from your device. It could be a portrait, a landscape, or even an abstract piece of art.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-indigo-400 font-bold text-lg mb-2">2. Select a Language</p>
                        <p className="text-gray-300">
                           Choose your preferred language for the story from the dropdown menu. The default is English.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-indigo-400 font-bold text-lg mb-2">3. Generate & Read</p>
                        <p className="text-gray-300">
                           Click the generate button and watch as the AI writes a complete story based on your picture, ready to be read and shared.
                        </p>
                    </div>
                </div>
            </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-indigo-400 mb-2">{faq.question}</h3>
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

export default StorygenPage;
