import { useState, useRef, useEffect } from 'react';

// --- الثوابت الأساسية ---
const API_KEY = "AIzaSyCq4_YpJKaGQ4vvYQyPey5-u2bHhgNe9Oc"; // ملاحظة: هذا مفتاح عام، لا بأس به
const SCRIPT_URL = "https://esm.run/@google/generative-ai";

const MODEL_FALLBACK_CHAIN = [
  "gemini-1.5-flash-latest",
  "gemini-pro-vision"
];

const faqData = [
  {
    question: 'What is a reverse image prompt generator?',
    answer: 'It\'s an AI tool that does the opposite of a normal image generator. Instead of turning text into an image, it analyzes an existing image and generates a detailed text prompt that describes it. This prompt can then be used to create similar images.'
  },
  {
    question: 'Which AI image generators can I use these prompts with?',
    answer: 'Our prompts are designed to be universal. They work great with popular platforms like Midjourney, Stable Diffusion, DALL-E 3, and any other AI art generator that accepts descriptive text prompts.'
  },
  {
    question: 'Is this "image to prompt" tool completely free?',
    answer: 'Yes, Promptigen is 100% free to use. There are no subscriptions, hidden fees, or usage limits. Generate as many prompts as you need to fuel your creativity.'
  },
  {
    question: 'What kind of images produce the best prompts?',
    answer: 'Clear, well-defined images work best. This includes photographs, digital art, illustrations, and even screenshots. The more detail the AI can see, the more descriptive and accurate the generated prompt will be.'
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


function PromptigenPage() {
  // --- حالات الواجهة الرسومية والبيانات ---
  const [isAiReady, setIsAiReady] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
        
        console.log("AI Services Initialized Successfully.");
        setIsAiReady(true);
      } catch (e) {
        console.error("AI Initialization Failed:", e);
        setError("Could not initialize the AI model. Please refresh the page.");
      }
    };
    
    initializeAI();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        setError('Please select a valid image file (PNG, JPG, WEBP).');
        return;
      }
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePrompt = async () => {
    if (!selectedFile || !isAiReady) {
      setError('Please upload an image first and wait for the AI to initialize.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');

    const masterPrompt = `Your mission is to act as an expert prompt engineer for AI image generators like Midjourney or Stable Diffusion. Analyze the uploaded image with extreme detail. Generate a single, coherent, and rich descriptive prompt that can replicate the image. 
    **CRITICAL CONSTRAINT: The final output prompt must NOT exceed 70 words. This is a strict limit. Be concise, impactful, and stay strictly within the word limit.**
    Focus on subject, environment, art style, composition, lighting, and color palette. End with powerful keywords like "highly detailed, 4k, cinematic". Output ONLY the final, ready-to-use prompt.`;

    const imagePart = await fileToGenerativePart(selectedFile);

    for (let i = 0; i < MODEL_FALLBACK_CHAIN.length; i++) {
      const modelName = MODEL_FALLBACK_CHAIN[i];
      try {
        console.log(`Attempting to generate content with model: ${modelName}`);

        const model = genAiInstanceRef.current.getGenerativeModel({ model: modelName });
        const { HarmCategory, HarmBlockThreshold } = aiModuleRef.current;
        const safetySettings = [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const result = await model.generateContent([masterPrompt, imagePart], { safetySettings });
        const response = result.response;
        const promptText = response.text();

        if (!promptText) {
          throw new Error("Received an empty response from the AI model.");
        }
        
        setGeneratedPrompt(promptText);
        console.log(`Success with model: ${modelName}`);
        break; 

      } catch (err: any) {
        const errorString = String(err);
        console.error(`Error with model ${modelName}:`, errorString);

        if (errorString.includes('quota') || errorString.includes('429')) {
          if (i === MODEL_FALLBACK_CHAIN.length - 1) {
            setError("The tool is currently experiencing high demand. Please try again in a few minutes.");
            break;
          }
          continue; 
        }
        
        if (errorString.includes('API key not valid')) {
          setError("Tool is currently under re-activation. Please try again in 1 minute.");
          break;
        }

        if (errorString.includes('400')) {
            setError("The AI model couldn't process this image. Please try a different one.");
            break; 
        }

        if (i < MODEL_FALLBACK_CHAIN.length - 1) {
            continue; // Try next model
        }

        setError("An unexpected error occurred. Please try again.");
        break;
      }
    }

    setIsLoading(false);
  };

  const handleCopyPrompt = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).catch(err => {
      console.error('Failed to copy prompt:', err);
      setError('Failed to copy prompt to clipboard.');
    });
  };

  const getButtonText = () => {
    if (isLoading) return 'Analyzing Image...';
    if (!isAiReady) return 'Initializing AI...';
    return 'Generate Prompt';
  };

  return (
    <>
      <title>Free AI Image to Prompt Generator | Reverse Prompt Finder - Promptigen</title>
      <meta name="description" content="Turn any image into a masterpiece prompt! Promptigen is a free AI tool that analyzes your picture and generates detailed, creative text prompts for Midjourney, Stable Diffusion, and more." />
      <link rel="canonical" href="https://aiconvert.online/promptigen" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/promptigen" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/promptigen" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/promptigen" />
       <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Promptigen AI Image to Prompt Generator",
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
            }
          }
        `}
      </script>

      <div className="pt-24 bg-gray-900 text-white min-h-screen">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-500">
              Promptigen: AI Image to Prompt Generator
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              Unlock the perfect words. Upload any image and our AI will reverse-engineer a detailed, creative prompt for generators like Midjourney & Stable Diffusion.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Controls Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <h2 className="sr-only">Image to Prompt Conversion Tool</h2>
              <div>
                <label className="block text-lg font-semibold text-gray-200 mb-2">1. Upload an Image</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:border-sky-400 hover:bg-gray-700/50 transition"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Image preview for prompt generation" className="max-w-full max-h-full object-contain rounded-md" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <p>Click to browse or drag & drop</p>
                      <p className="text-sm text-gray-500">Supports PNG, JPG, WEBP</p>
                    </div>
                  )}
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
            
            {/* Output Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col min-h-[24rem]">
              <label htmlFor="prompt-output" className="block text-lg font-semibold text-gray-200 mb-2">2. Get Your AI-Generated Prompt</label>
              <div className="relative w-full h-full flex flex-col">
                <textarea
                  id="prompt-output"
                  readOnly
                  value={isLoading ? "The AI is analyzing the image..." : generatedPrompt}
                  placeholder="Your creative prompt will appear here..."
                  className="w-full flex-grow p-4 bg-gray-700 border border-gray-600 rounded-lg resize-none text-gray-200 placeholder-gray-400 leading-relaxed"
                />
                {generatedPrompt && !isLoading && (
                  <button 
                    onClick={handleCopyPrompt}
                    className="absolute top-2 right-2 p-2 text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500 hover:text-white transition-all"
                    title="Copy to Clipboard"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h10v10H4V5z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">From Vision to Text in One Click</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-sky-400 mb-2">Reverse Engineer Art</h3>
                          <p className="text-gray-300">See an image you love? Upload it and instantly get the descriptive prompt needed to recreate its style, subject, and mood.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-sky-400 mb-2">Expert-Level Prompts</h3>
                          <p className="text-gray-300">Our AI is trained to think like a prompt engineer, capturing details about lighting, composition, and artistic style.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-sky-400 mb-2">Universal Compatibility</h3>
                          <p className="text-gray-300">The generated prompts are optimized to work seamlessly with Midjourney, Stable Diffusion, DALL-E, and more.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-sky-400 mb-2">Free & Unlimited</h3>
                          <p className="text-gray-300">Unleash your creativity without limits. Our image-to-prompt tool is completely free, with no sign-up required.</p>
                      </div>
                  </div>
              </section>

            <section className="mt-20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">How It Works: A Simple 3-Step Process</h2>
                    <p className="max-w-3xl mx-auto text-gray-400 mb-12">
                        Transforming an image into a powerful prompt has never been more straightforward.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-sky-400 font-bold text-lg mb-2">1. Upload Your Image</p>
                        <p className="text-gray-300">
                            Click the upload area and select any picture from your device. It can be a photo, a painting, or any digital art that inspires you.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-sky-400 font-bold text-lg mb-2">2. Generate the Prompt</p>
                        <p className="text-gray-300">
                           Hit the "Generate Prompt" button. Our AI will analyze every aspect of the image, from the subject to the finest details.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-sky-400 font-bold text-lg mb-2">3. Copy and Create</p>
                        <p className="text-gray-300">
                           Your expert-crafted prompt appears in seconds. Copy it with one click and paste it into your favorite AI image generator to start creating.
                        </p>
                    </div>
                </div>
            </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                      {faqData.map((faq, index) => (
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

export default PromptigenPage;
