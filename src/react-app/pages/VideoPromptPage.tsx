import { useState, useRef, useEffect } from 'react';

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
    question: 'How does this tool generate a video prompt from my image?',
    answer: 'Our AI analyzes the visual elements of your photo—subjects, environment, and mood. It then acts as an expert cinematographer to write a detailed, dynamic prompt describing potential actions, camera movements, and atmospheric details to bring your static image to life.'
  },
  {
    question: 'Can I use these prompts with AI video generators like Sora, Veo, or Runway?',
    answer: 'Absolutely. These prompts are specifically engineered to work seamlessly with leading text-to-video platforms, including OpenAI\'s Sora, Google\'s Veo, Runway, Pika, Kling, and Pixverse. Just copy the generated prompt and paste it into your tool of choice.'
  },
  {
    question: 'Is this AI video prompt generator completely free?',
    answer: 'Yes, it is 100% free, offers unlimited use, and requires no sign-up. Our goal is to provide a powerful creative tool that is accessible to everyone, from hobbyists to professional creators.'
  },
  {
    question: 'What kind of photos produce the best video prompts?',
    answer: 'Images with clear subjects and interesting backgrounds tend to yield the most creative prompts. However, the AI is designed to find inspiration in any image, whether it\'s a portrait, a landscape, or even an abstract design. The more detail, the more the AI has to work with.'
  },
];

async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
}

function VideoPromptPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [loadingText, setLoadingText] = useState('The AI is directing your scene...');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      const baseText = "The AI is directing your scene";
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
      setError('Please upload an image first.');
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
            throw new Error(result.error || 'An unknown server error occurred.');
        }

        setGeneratedPrompt(result.videoPrompt);

    } catch (err: any) {
      setError(err.message);
      console.error("Frontend Error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyPrompt = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt)
        .then(() => {
            // Optional: Add a success message or UI change
        })
        .catch(() => setError('Failed to copy the prompt.'));
  };

  return (
    <>
      <title>Free AI Image to Video Prompt Generator (For Sora, Veo, Runway)</title>
      <meta name="description" content="Turn any image into a dynamic, cinematic video prompt. Get professional prompts for AI video tools like Kling, Pika & more. Free, no sign-up." />
      <link rel="canonical" href="https://aiconvert.online/ai-video-prompt-generator" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/ai-video-prompt-generator" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/ai-video-prompt-generator" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/ai-video-prompt-generator" />
       <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Image to Video Prompt Generator",
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

      <div className="pt-24 bg-gray-900 text-white min-h-screen">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-teal-500">
              AI Video Prompt Generator
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              Transform a static photo into a vivid, cinematic video prompt. Let our AI write the perfect scene description to animate your images.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Controls Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <h2 className="sr-only">Image to Video Prompt Tool</h2>
              <div>
                <p className="block text-lg font-semibold text-gray-200 mb-2">1. Upload Your Image</p>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:border-teal-400 hover:bg-gray-700/50 transition"
                >
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Image preview for video prompt generation" className="max-w-full max-h-full object-contain rounded-md" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <p>Click to browse</p>
                      <p className="text-sm">Unleash its hidden motion</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="language-select" className="block text-lg font-semibold text-gray-200 mb-2">2. Select Language</label>
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
                  {isLoading ? 'Generating Scene...' : 'Create Professional Prompt'}
                </button>
                <button
                  onClick={() => handleGeneratePrompt(true)}
                  disabled={isLoading || !selectedFile}
                  className="w-full py-3 px-4 text-lg font-bold text-white bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? 'Generating...' : 'Create with -ve Prompt (for Veo, Sora)'}
                </button>
              </div>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>
            
            {/* Output Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col min-h-[28rem]">
              <label htmlFor="prompt-output" className="block text-lg font-semibold text-gray-200 mb-2">3. Your Generated Video Prompt</label>
              <div className="relative w-full h-full flex flex-col">
                <textarea
                  id="prompt-output"
                  readOnly
                  value={isLoading ? loadingText : generatedPrompt}
                  placeholder="Your professional video prompt will appear here..."
                  className="w-full flex-grow p-4 bg-gray-700 border border-gray-600 rounded-lg resize-none text-gray-200 placeholder-gray-400 leading-relaxed"
                />
                {generatedPrompt && !isLoading && (
                   <button onClick={handleCopyPrompt} className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all">
                      Copy Prompt
                  </button>
                )}
              </div>
            </div>
          </div>
            
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold mb-4">Which Prompt Should You Choose?</h2>
            <p className="max-w-4xl mx-auto text-gray-400 mb-12">
              To give you maximum power and flexibility, we generate two types of professional prompts. Here’s a quick guide to help you choose.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Card 1 */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-left">
                <h3 className="text-xl font-bold text-teal-400">Universal Prompt</h3>
                <p className="text-gray-300 mt-3">
                  Creates a rich, detailed prompt designed for the widest compatibility across all platforms.
                </p>
                <hr className="border-gray-700 my-4" />
                <p className="font-semibold text-white">✅ Recommended For:</p>
                <ul className="list-none pl-0 mt-2 space-y-1 text-gray-300">
                  <li>Pika</li>
                  <li>PixVerse</li>
                  <li>Runway</li>
                  <li>Stable Diffusion</li>
                </ul>
              </div>
              {/* Card 2 */}
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-left">
                <h3 className="text-xl font-bold text-rose-400">Advanced Prompt (with -ve)</h3>
                <p className="text-gray-300 mt-3">
                  Includes a special "negative prompt" clause to prevent errors, optimized for the latest models.
                </p>
                <hr className="border-gray-700 my-4" />
                <p className="font-semibold text-white">✅ Optimized For:</p>
                <ul className="list-none pl-0 mt-2 space-y-1 text-gray-300">
                  <li>Google Veo</li>
                  <li>OpenAI Sora</li>
                  <li>Kling AI</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">From Still Image to Cinematic Scene</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">
                    Why just describe a photo when you can direct it? Our AI prompt writer analyzes your image and creates a ready-to-use prompt, complete with action, camera moves, and atmosphere, perfect for any text-to-video model.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-rose-400 mb-2">Instant Direction</h3>
                          <p className="text-gray-300">Overcome creative blocks. Use any image to generate a professional cinematic prompt in seconds.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-rose-400 mb-2">For All Platforms</h3>
                          <p className="text-gray-300">Prompts are optimized for leading AI video tools like Sora, Veo, Runway, and Kling, ensuring great results.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-rose-400 mb-2">Completely Free</h3>
                          <p className="text-gray-300">No fees, no limits, no sign-up required. Generate as many high-quality video prompts as you need.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-rose-400 mb-2">Multi-Lingual</h3>
                          <p className="text-gray-300">Create compelling video prompts in dozens of languages to fit your specific creative workflow.</p>
                      </div>
                  </div>
              </section>

              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
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

export default VideoPromptPage;
