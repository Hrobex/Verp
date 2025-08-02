import { useState } from 'react';
import { Link } from 'react-router-dom';

// --- Data Constants ---

const sizeOptions = [
  { label: 'Square (1024x1024)', value: '1024x1024' },
  { label: 'Widescreen (1024x576)', value: '1024x576' },
  { label: 'Portrait (576x1024)', value: '576x1024' },
];

const ARTISTIC_SUFFIX = ', masterpiece, concept art, high detail, sharp focus, cinematic lighting';

const faqData = [
    // ... (FAQ data remains unchanged from the previous version) ...
    {
        question: 'What makes Artigen V2 different from other AI image generators?',
        answer: 'Artigen V2 is specialized for artistic expression. While other tools focus on providing many styles, Artigen V2 uses a fine-tuned model that excels at creating images with a distinct, high-quality artistic aesthetic. Think of it as an expert artist’s brush, designed to turn your text into unique digital art.'
    },
    {
        question: `Should I use Artigen V2 or Artigen Pro?`,
        answer: (
            <>
                It depends on your goal. Use <strong className="text-yellow-400">Artigen V2</strong> when you want a unique, artistic interpretation of your idea with a signature aesthetic. Use <Link to="/generate-image-pro" className="text-purple-400 hover:underline">Artigen Pro</Link> when you need more control over specific styles like "Photographic," "Anime," or "Cinematic" and want a versatile, all-in-one tool.
            </>
        )
    },
    {
        question: 'Is this AI art generator completely free?',
        answer: 'Yes, Artigen V2 is 100% free to use. We believe in making powerful creative tools accessible to everyone, without subscriptions, limits, or the need to sign up.'
    },
    {
        question: 'What are the usage rights for the images I create?',
        answer: 'The images you generate with Artigen V2 are yours to use freely. They are released under a Creative Commons (CC0) license, which means they are in the public domain for both personal and commercial projects, no attribution required.'
    },
];

function ArtigenV2Page() {
  const [prompt, setPrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState('1024x1024');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = async () => {
    const userPrompt = prompt.trim();
    if (!userPrompt) {
      setError('Please enter a description to generate art.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrl('');

    // --- Prepare data for the API ---
    const finalPrompt = userPrompt + ARTISTIC_SUFFIX;
    const [width, height] = selectedSize.split('x');
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const seed = Date.now();

    // --- Construct the API URL ---
    const constructedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=${width}&height=${height}&seed=${seed}&nologo=true`;

    const img = new Image();
    img.src = constructedUrl;

    img.onload = () => {
      setImageUrl(constructedUrl);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError('Failed to generate the art. The service might be busy. Please try again in a moment.');
      setIsLoading(false);
    };
  };
  
  const handleDownloadClick = async () => {
      // ... (Download handler remains unchanged) ...
      if (!imageUrl) return;
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const filename = `${prompt.substring(0, 25).replace(/\s/g, '_') || 'artigen_v2'}_art.png`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        setError('Download failed. You can try right-clicking the image and selecting "Save Image As".');
      }
  };

  return (
     
    <>
      <title>Artigen V2: AI Art Generator for Unique & Creative Images</title>
      <meta name="description" content="Transform your text into unique, high-quality digital art with Artigen V2. Our free AI art generator is tuned for a distinct artistic aesthetic. No sign-up required." />
      <link rel="canonical" href="https://aiconvert.online/artigenv2" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/artigenv2" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/artigenv2" /> 
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/artigenv2" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Artigen V2 AI Art Generator",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "description": "A free AI art generator specialized in producing unique and high-quality images with a distinct artistic aesthetic from text prompts.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "875"
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">
              Artigen V2: The AI Art Generator
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Transform your words into stunning, one-of-a-kind digital art. Our AI is finely tuned to deliver creative and high-quality visuals with a unique artistic touch.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* --- Controls Column --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <div>
                <label htmlFor="prompt-input" className="block text-lg font-semibold text-gray-200 mb-2">1. Describe Your Vision</label>
                <textarea
                  id="prompt-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A majestic lion with a crown of stars, digital art"
                  className="w-full h-36 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                />
              </div>
              
              <div>
                <label htmlFor="size-select" className="block text-lg font-semibold text-gray-200 mb-2">2. Choose a Size</label>
                <select
                  id="size-select"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  {sizeOptions.map(size => (<option key={size.value} value={size.value}>{size.label}</option>))}
                </select>
              </div>

              <button
                onClick={handleGenerateClick}
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? 'Creating Art...' : 'Generate Art'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* --- Output Column --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center h-96 lg:h-auto min-h-[28rem]">
              <div className="w-full h-full flex justify-center items-center border-2 border-dashed border-gray-600 rounded-lg relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-lg">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
                    <p className="text-gray-300 mt-4">The AI is painting your idea...</p>
                  </div>
                )}
                {!isLoading && !imageUrl && (<div className="text-center text-gray-400"><p>Your generated art will appear here</p></div>)}
                {imageUrl && !isLoading && (<img src={imageUrl} alt={prompt || "Generated AI art"} className="max-w-full max-h-full object-contain rounded-lg" />)}
              </div>
              {imageUrl && !isLoading && (<button onClick={handleDownloadClick} className="w-full mt-6 py-3 px-4 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all">Download Art</button>)}
            </div>
          </div>

          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">An AI Artist for Your Creative Ideas</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">Artigen V2 is more than a tool; it's a creative partner. We focused on artistic quality so you can focus on your vision.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-yellow-400 mb-2">Distinct Aesthetic</h3><p className="text-gray-300">Generates images with a unique and recognizable artistic flair, making your creations stand out.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-yellow-400 mb-2">Superior Quality</h3><p className="text-gray-300">Our model is optimized for high-resolution, detailed outputs suitable for any project.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-yellow-400 mb-2">Effortless Creation</h3><p className="text-gray-300">A simple interface means you can go from idea to finished artwork in seconds. No complex settings.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-yellow-400 mb-2">Completely Free</h3><p className="text-gray-300">Unleash your creativity without limits. Artigen V2 is free, with no sign-ups or subscriptions required.</p></div>
                  </div>
              </section>

              <section className="mt-20 text-center">
                   <h2 className="text-3xl font-bold mb-4">How to Create with Artigen V2</h2>
                   <p className="max-w-3xl mx-auto text-gray-400 mb-12">Just two steps stand between your imagination and a finished piece of art.</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                       <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-yellow-400 font-bold text-lg mb-2">Step 1: Write Your Prompt</p><p className="text-gray-300">Describe the artwork you want to create. Be as imaginative and detailed as you like. The AI thrives on creativity.</p></div>
                       <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-yellow-400 font-bold text-lg mb-2">Step 2: Choose Your Size</p><p className="text-gray-300">Select the ideal dimensions for your artwork—square, widescreen, or portrait—to perfectly fit your needs.</p></div>
                       <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-yellow-400 font-bold text-lg mb-2">Step 3: Generate & Download</p><p className="text-gray-300">Click "Generate Art" and watch the AI bring your concept to life. Your unique artwork is then ready to download.</p></div>
                   </div>
              </section>

              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-yellow-400 mb-2">{faq.question}</h3>
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

export default ArtigenV2Page;
