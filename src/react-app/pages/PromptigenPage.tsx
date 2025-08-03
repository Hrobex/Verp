import { useState, useRef, useEffect } from 'react';

// --- الثوابت الأساسية ---
const API_KEY = "AIzaSyCq4_YpJKaGQ4vvYQyPey5-u2bHhgNe9Oc";
const SCRIPT_URL = "https://esm.run/@google/generative-ai";

const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash"
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

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [imagePart, { text: masterPrompt }] }],
          safetySettings,
        });

        const promptText = result.response.text();

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
          }
          continue; 
        }
        
        if (errorString.includes('API key not valid')) {
          setError("Tool is currently under re-activation. Please try again in 1 minute.");
          break;
        }

        if (errorString.includes('400')) {
            setError("Invalid request. The AI model configuration is incorrect. Please contact support.");
            break; 
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
      <title>Promptigen: AI Image to Prompt Generator</title>
      <meta name="description" content="Turn any image into a detailed descriptive prompt. Use our free AI tool to analyze a picture and generate the perfect text prompt for AI image generators." />
      <link rel="canonical" href="https://aiconvert.online/promptigen" />

      <div className="pt-24 bg-gray-900 text-white min-h-screen">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Promptigen: AI Image to Prompt
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Upload any image and let our AI analyze it to generate a detailed, ready-to-use prompt for your favorite image generator.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-200 mb-2">1. Upload Your Image</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:border-purple-400 hover:bg-gray-700/50 transition"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Selected preview" className="max-w-full max-h-full object-contain rounded-md" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <p>Click to browse or drag & drop</p>
                      <p className="text-sm">PNG, JPG, or WEBP</p>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleGeneratePrompt}
                disabled={!isAiReady || isLoading || !selectedFile}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:from-purple-600 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {getButtonText()}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center min-h-[24rem]">
              <div className="w-full h-full flex flex-col">
                <label className="block text-lg font-semibold text-gray-200 mb-2">Generated Prompt</label>
                <textarea
                  readOnly
                  value={isLoading ? "The AI is analyzing the image..." : generatedPrompt}
                  placeholder="Your generated prompt will appear here..."
                  className="w-full flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg resize-none"
                />
                {generatedPrompt && !isLoading && (
                  <button 
                    onClick={handleCopyPrompt}
                    className="w-full mt-4 py-2 px-4 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all"
                  >
                    Copy to Clipboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default PromptigenPage;
