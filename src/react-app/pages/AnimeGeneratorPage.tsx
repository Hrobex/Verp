import { useState } from 'react';

// --- Data Constants ---

const sizeOptions = [
  { label: 'Square (1024x1024)', value: '1024x1024' },
  { label: 'Portrait (576x1024)', value: '576x1024' },
  { label: 'Widescreen (1024x576)', value: '1024x576' },
];

const animeStyleOptions = [
    { 
        id: 'modern', 
        name: 'Modern Style', 
        prompt_suffix: ', modern anime style, digital illustration, studio quality, vibrant colors, clean line art, sharp details' 
    },
    { 
        id: 'retro', 
        name: '90s Retro', 
        prompt_suffix: ', 90s anime screenshot, retro art style, cel-shaded, muted colors, subtle film grain, nostalgic aesthetic' 
    },
    { 
        id: 'chibi', 
        name: 'Chibi Style', 
        prompt_suffix: ', cute chibi style, super deformed, kawaii, clean line art, vibrant, sticker design' 
    },
    { 
        id: 'painterly', 
        name: 'Painterly', 
        prompt_suffix: ', ghibli-inspired art style, beautiful detailed background, painterly, whimsical, soft colors, hand-drawn aesthetic' 
    }
];

const faqData = [
    {
        question: 'Can I create my own original anime characters (OCs)?',
        answer: 'Absolutely! This tool is perfect for bringing your OCs to life. Just provide a detailed description of their appearance, personality, and clothing, and our AI will generate a unique character illustration for you.'
    },
    {
        question: 'What is the best way to write a prompt for this anime generator?',
        answer: 'Be specific and descriptive. Instead of "anime girl", try "a cheerful anime girl with long pink hair, blue eyes, wearing a school uniform, standing under a cherry blossom tree". The more detail you provide, the better the AI can capture your vision.'
    },
    {
        question: 'Can I use the generated images as a PFP (Profile Picture)?',
        answer: 'Yes! The square format is perfect for creating custom anime PFPs for your social media profiles. The Chibi style is especially popular for making cute and unique avatars.'
    },
    {
        question: 'Is this a "waifu" or "husbando" generator?',
        answer: 'While you can certainly use it to create characters, the tool is designed for a wide range of artistic creation. It generates SFW (Safe For Work) illustrations based on your text descriptions, perfect for character design, storytelling, and general anime art.'
    },
];

function AnimeGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState('1024x1024');
  const [selectedAnimeStyle, setSelectedAnimeStyle] = useState('modern'); // Default to 'modern'
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = async () => {
    const userPrompt = prompt.trim();
    if (!userPrompt) {
      setError('Please describe the anime character or scene you want to create.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrl('');

    let translatedPrompt = userPrompt;
    try {
      const langPair = "ar|en"; 
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(userPrompt)}&langpair=${langPair}&mt=1`;
      const translateResponse = await fetch(apiUrl);
      if (translateResponse.ok) {
        const translateData = await translateResponse.json();
        if (translateData.responseData?.translatedText) {
          translatedPrompt = translateData.responseData.translatedText;
        }
      }
    } catch (err) {
      console.error("Translation API failed, using original prompt:", err);
    }

    const styleSuffix = animeStyleOptions.find(s => s.id === selectedAnimeStyle)?.prompt_suffix || '';
    const finalPrompt = translatedPrompt + styleSuffix;
    const [width, height] = selectedSize.split('x');
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const seed = Date.now();

    const constructedUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=${width}&height=${height}&seed=${seed}&nologo=true`;

    const img = new Image();
    img.src = constructedUrl;

    img.onload = () => {
      setImageUrl(constructedUrl);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError('Failed to create the image. The AI service may be busy. Please try again.');
      setIsLoading(false);
    };
  };
  
  const handleDownloadClick = async () => {
      if (!imageUrl) return;
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const filename = `${prompt.substring(0, 25).replace(/\s/g, '_') || 'anime'}_art.png`;
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
      <title>Free AI Anime Generator | Create Anime Art From Text</title>
      <meta name="description" content="Bring your anime characters to life with our free AI anime generator. Turn text into high-quality anime art, illustrations, and characters in various styles." />
      <link rel="canonical" href="https://aiconvert.online/ai-anime-generator" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/ai-anime-generator" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/ai-anime-generator" /> 
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/ai-anime-generator" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Anime Generator",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "description": "A free text-to-anime art generator that creates original anime characters and illustrations in different styles like Modern, 90s Retro, and Chibi.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "3120"
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-600">
              AI Anime Generator
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Your personal anime character creator. Describe your vision, choose a style, and let our AI generate unique, high-quality anime art instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* --- Controls Column --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <div>
                <label htmlFor="prompt-input" className="block text-lg font-semibold text-gray-200 mb-2">1. Describe Your Character</label>
                <textarea
                  id="prompt-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., a shy mage girl with silver hair and a starry cloak"
                  className="w-full h-24 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-200 mb-2">2. Choose an Anime Style</label>
                <div className="grid grid-cols-2 gap-3">
                  {animeStyleOptions.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedAnimeStyle(style.id)}
                      className={`py-3 px-2 text-center rounded-lg transition-all duration-200 ${
                        selectedAnimeStyle === style.id 
                        ? 'bg-pink-600 text-white font-bold ring-2 ring-pink-400' 
                        : 'bg-gray-700 hover:bg-gray-600/70'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="size-select" className="block text-lg font-semibold text-gray-200 mb-2">3. Select Image Size</label>
                <select
                  id="size-select"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  {sizeOptions.map(size => (<option key={size.value} value={size.value}>{size.label}</option>))}
                </select>
              </div>

              <button
                onClick={handleGenerateClick}
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg hover:from-pink-600 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Generating...' : 'Generate Anime Art'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* --- Output Column --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center h-96 lg:h-auto min-h-[28rem]">
              <div className="w-full h-full flex justify-center items-center border-2 border-dashed border-gray-600 rounded-lg relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-lg">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
                    <p className="text-gray-300 mt-4">Bringing your character to life...</p>
                  </div>
                )}
                {!isLoading && !imageUrl && (<div className="text-center text-gray-400"><p>Your anime illustration will appear here</p></div>)}
                {imageUrl && !isLoading && (<img src={imageUrl} alt={prompt || "Generated AI anime art"} className="max-w-full max-h-full object-contain rounded-lg" />)}
              </div>
              {imageUrl && !isLoading && (<button onClick={handleDownloadClick} className="w-full mt-6 py-3 px-4 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all">Download Image</button>)}
            </div>
          </div>

          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">The Ultimate AI Tool for Anime Fans</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">Whether you're creating original characters (OCs), designing a unique PFP, or just exploring your creativity, our AI provides the perfect canvas.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-pink-400 mb-2">Diverse Anime Styles</h3><p className="text-gray-300">Go from Modern to 90s Retro, Chibi, or Painterly with a single click to match your desired aesthetic.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-pink-400 mb-2">Original Characters</h3><p className="text-gray-300">Generate completely new and unique characters from your descriptions. Perfect for writers and creators.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-pink-400 mb-2">Free & Unlimited</h3><p className="text-gray-300">Your creativity shouldn't have a paywall. Enjoy unlimited generations and downloads at no cost.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-pink-400 mb-2">High-Quality Results</h3><p className="text-gray-300">Get high-resolution, detailed manga and anime style illustrations suitable for any use.</p></div>
                  </div>
              </section>

              <section className="mt-20 text-center">
                   <h2 className="text-3xl font-bold mb-4">How to Create Anime Art in 3 Steps</h2>
                   <p className="max-w-3xl mx-auto text-gray-400 mb-12">Our process is simple. You're just moments away from creating a custom anime illustration.</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                       <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-pink-400 font-bold text-lg mb-2">Step 1: Describe It</p><p className="text-gray-300">Write a detailed description of your character, scene, or idea. Think about hair color, clothing, and mood.</p></div>
                       <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-pink-400 font-bold text-lg mb-2">Step 2: Pick a Style</p><p className="text-gray-300">Choose the anime art style that best fits your vision, from the clean lines of Modern to the nostalgia of 90s Retro.</p></div>
                       <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-pink-400 font-bold text-lg mb-2">Step 3: Generate & Share</p><p className="text-gray-300">Select your image size and hit Generate. Your unique anime art will be ready to download and share with the world.</p></div>
                   </div>
              </section>

              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-pink-400 mb-2">{faq.question}</h3>
                              <div className="text-gray-300 leading-relaxed"><p>{faq.answer}</p></div>
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

export default AnimeGeneratorPage;
