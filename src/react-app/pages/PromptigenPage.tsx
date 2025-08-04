import { useState, useRef, useEffect, ChangeEvent } from 'react';

const faqData = [
  { question: 'What is a reverse image prompt generator?', answer: 'It\'s an AI tool that does the opposite of a normal image generator. Instead of turning text into an image, it analyzes an existing image and generates a detailed text prompt that describes it. This prompt can then be used to create similar images.' },
  { question: 'Which AI image generators can I use these prompts with?', answer: 'Our prompts are designed to be universal. They work great with popular platforms like Midjourney, Stable Diffusion, Flux, and GPT-4o image generator, and any other AI art generator that accepts descriptive text prompts.' },
  { question: 'Is this "image to prompt" tool completely free?', answer: 'Yes, Promptigen is 100% free to use. There are no subscriptions, hidden fees, or usage limits. Generate as many prompts as you need to fuel your creativity.' },
  { question: 'What kind of images produce the best prompts?', answer: 'Clear, well-defined images work best. This includes photographs, digital art, illustrations, and even screenshots. The more detail the AI can see, the more descriptive and accurate the generated prompt will be.' },
];

function PromptigenPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState('The AI is analyzing the image...');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      const baseText = "The AI is analyzing the image";
      let dotCount = 1;
      setLoadingText(`${baseText}${'.'.repeat(dotCount)}`);
      interval = setInterval(() => { dotCount = (dotCount % 3) + 1; setLoadingText(`${baseText}${'.'.repeat(dotCount)}`); }, 500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { setError('Please select a valid image file (PNG, JPG, WEBP).'); return; }
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePrompt = async () => {
    if (!selectedFile) { setError('Please upload an image first.'); return; }
    
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
        const base64String = (reader.result as string).split(',')[1];
        try {
            const response = await fetch('/api/generatePrompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64: base64String, mimeType: selectedFile.type }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'An unknown error occurred.');
            setGeneratedPrompt(data.prompt);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    reader.onerror = () => { setIsLoading(false); setError('Failed to read the file.'); };
  };

  const handleCopyPrompt = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).catch(() => setError('Failed to copy prompt to clipboard.'));
  };

  const getButtonText = () => isLoading ? 'Analyzing Image...' : 'Generate Prompt';

  return (
    <>
      <title>Free AI Image to Prompt Generator | Reverse Prompt Finder - Promptigen</title>
      <meta name="description" content="Turn any image into a masterpiece prompt! Promptigen is a free AI tool that analyzes your picture and generates detailed, creative text prompts for Midjourney, Stable Diffusion, and more." />
      <link rel="canonical" href="https://aiconvert.online/prompt-generator" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/prompt-generator" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/prompt-generator" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/prompt-generator" />
      <script type="application/ld+json">{`{ "@context": "https://schema.org", "@type": "SoftwareApplication", "name": "Promptigen AI Image to Prompt Generator", "operatingSystem": "WEB", "applicationCategory": "MultimediaApplication", "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "ratingCount": "954" }, "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } }`}</script>

      <div className="pt-24 bg-gray-900 text-white min-h-screen">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-500">Promptigen: AI Image to Prompt Generator</h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">Unlock the perfect words. Upload any image and our AI will reverse-engineer a detailed, creative prompt for generators like Midjourney & Stable Diffusion.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-200 mb-2">1. Upload Your Image</label>
                <div onClick={() => fileInputRef.current?.click()} className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:border-purple-400 hover:bg-gray-700/50 transition">
                  <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="hidden" />
                  {imagePreview ? <img src={imagePreview} alt="Selected preview" className="max-w-full max-h-full object-contain rounded-md" /> : <div className="text-center text-gray-400"><p>Click to browse or drag & drop</p><p className="text-sm">PNG, JPG, or WEBP</p></div>}
                </div>
              </div>
              <button onClick={handleGeneratePrompt} disabled={isLoading || !selectedFile} className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:from-purple-600 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">{getButtonText()}</button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center min-h-[24rem]">
              <div className="w-full h-full flex flex-col">
                <label className="block text-lg font-semibold text-gray-200 mb-2">Generated Prompt</label>
                <textarea readOnly value={isLoading ? loadingText : generatedPrompt} placeholder="Your generated prompt will appear here..." className="w-full flex-grow p-4 bg-gray-700 border border-gray-600 rounded-lg resize-none text-gray-200 placeholder-gray-400" />
                {generatedPrompt && !isLoading && <button onClick={handleCopyPrompt} className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all">Copy to Clipboard</button>}
              </div>
            </div>
          </div>
          <div className="mt-24">
            <section className="text-center">
              <h2 className="text-3xl font-bold mb-4">From Vision to Text in One Click</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-sky-400 mb-2">Reverse Engineer Art</h3><p className="text-gray-300">See an image you love? Upload it and instantly get the descriptive prompt needed to recreate its style, subject, and mood.</p></div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-sky-400 mb-2">Expert-Level Prompts</h3><p className="text-gray-300">Our AI is trained to think like a prompt engineer, capturing details about lighting, composition, and artistic style.</p></div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-sky-400 mb-2">Universal Compatibility</h3><p className="text-gray-300">The generated prompts are optimized to work seamlessly with Midjourney, Stable Diffusion, and more.</p></div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-sky-400 mb-2">Free & Unlimited</h3><p className="text-gray-300">Unleash your creativity without limits. Our image-to-prompt tool is completely free, with no sign-up required.</p></div>
              </div>
            </section>
            <section className="mt-20">
              <div className="text-center"><h2 className="text-3xl font-bold mb-4">How It Works: A Simple 3-Step Process</h2><p className="max-w-3xl mx-auto text-gray-400 mb-12">Transforming an image into a powerful prompt has never been more straightforward.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-sky-400 font-bold text-lg mb-2">1. Upload Your Image</p><p className="text-gray-300">Click the upload area and select any picture from your device. It can be a photo, a painting, or any digital art that inspires you.</p></div>
                <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-sky-400 font-bold text-lg mb-2">2. Generate the Prompt</p><p className="text-gray-300">Hit the "Generate Prompt" button. Our AI will analyze every aspect of the image, from the subject to the finest details.</p></div>
                <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-sky-400 font-bold text-lg mb-2">3. Copy and Create</p><p className="text-gray-300">Your expert-crafted prompt appears in seconds. Copy it with one click and paste it into your favorite AI image generator to start creating.</p></div>
              </div>
            </section>
            <section className="mt-20 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
              <div className="space-y-4">{faqData.map((faq, index) => <div key={index} className="bg-gray-800 p-6 rounded-lg"><h3 className="font-bold text-lg text-sky-400 mb-2">{faq.question}</h3><p className="text-gray-300 leading-relaxed">{faq.answer}</p></div>)}</div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default PromptigenPage;
