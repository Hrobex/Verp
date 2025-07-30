import { useState } from 'react';

// Data for styles, extracted for clarity
const styleOptions = [
  { name: 'Default', value: 'default', prompt_suffix: '' },
  { name: 'Cinematic', value: 'cinematic', prompt_suffix: ', cinematic style' },
  { name: 'Photographic', value: 'photographic', prompt_suffix: ', photographic, realistic' },
  { name: 'Anime', value: 'anime', prompt_suffix: ', anime style' },
  { name: 'Digital Art', value: 'digital-art', prompt_suffix: ', digital art' },
  { name: 'Pixel Art', value: 'pixel-art', prompt_suffix: ', pixel art' },
  { name: 'Fantasy Art', value: 'fantasy-art', prompt_suffix: ', fantasy art' },
  { name: 'Neonpunk', value: 'neonpunk', prompt_suffix: ', neonpunk style' },
  { name: '3D Model', value: '3d-model', prompt_suffix: ', 3d model' },
];

// Data for sizes
const sizeOptions = [
  { label: 'Square (1024x1024)', value: '1024x1024' },
  { label: 'Widescreen (1024x576)', value: '1024x576' },
  { label: 'Portrait (576x1024)', value: '576x1024' },
];

function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('default');
  const [selectedSize, setSelectedSize] = useState('1024x1024');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = async () => {
    const userPrompt = prompt.trim();
    if (!userPrompt) {
      setError('Please enter a description for the image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrl('');

    // Default to the original prompt. If translation fails, this will be used.
    let translatedPrompt = userPrompt;

    try {
      // Use the exact translation settings you provided
      const langPair = "ar|en";
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(userPrompt)}&langpair=${langPair}&mt=1`;
      
      const translateResponse = await fetch(apiUrl);
      if (translateResponse.ok) {
        const translateData = await translateResponse.json();
        // Use translated text only if it's different from the original prompt
        if (translateData.responseData && translateData.responseData.translatedText &&
            translateData.responseData.translatedText.trim().toLowerCase() !== userPrompt.toLowerCase()) {
          translatedPrompt = translateData.responseData.translatedText;
        }
      }
    } catch (err) {
      // Silently fail on translation error and proceed with the original prompt.
      console.error("Translation API failed, using original prompt:", err);
    }

    // Now, generate the image using the (potentially translated) prompt
    const styleSuffix = styleOptions.find(s => s.value === selectedStyle)?.prompt_suffix || '';
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
      // This error handler is for the image generation service itself
      setError('Failed to load the image. The AI service may be busy. Please try again later.');
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
        const filename = `${prompt.substring(0, 20).replace(/\s/g, '_') || 'generated'}_image.png`;
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
    <div className="pt-24 bg-gray-900 text-white min-h-screen">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            AI Image Generator
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Bring your ideas to life. Describe anything you can imagine, select a style, and watch our AI create a unique image for you.
          </p>
        </div>

        {/* Main Content: Grid for controls and image display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column: Controls */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
            {/* Prompt Input */}
            <div>
              <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-2">1. Describe your image (Arabic supported)</label>
              <textarea
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A cute cat astronaut floating in space"
                className="w-full h-24 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>

            {/* Style Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">2. Choose a style</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {styleOptions.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedStyle(style.value)}
                    className={`p-2 text-center text-sm rounded-lg transition-all duration-200 ${
                      selectedStyle === style.value
                        ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-400'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <label htmlFor="size-select" className="block text-sm font-medium text-gray-300 mb-2">3. Select image size</label>
              <select
                id="size-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {sizeOptions.map(size => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>
            
            {/* Generate Button */}
            <button
              onClick={handleGenerateClick}
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
            
            {error && <p className="text-red-400 text-center mt-2">{error}</p>}
          </div>

          {/* Right Column: Image Display */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center h-96 lg:h-auto">
            <div className="w-full h-full flex justify-center items-center border-2 border-dashed border-gray-600 rounded-lg">
              {isLoading && (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                  <p className="text-gray-400">Creating your vision...</p>
                </div>
              )}
              {!isLoading && !imageUrl && (
                <div className="text-center text-gray-500">
                   <p>Your generated image will appear here</p>
                </div>
              )}
              {imageUrl && !isLoading && (
                <img src={imageUrl} alt={prompt} className="max-w-full max-h-full object-contain rounded-lg" />
              )}
            </div>
            {imageUrl && !isLoading && (
               <button
                  onClick={handleDownloadClick}
                  className="w-full mt-6 py-3 px-4 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300"
                >
                  Download Image
                </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default ImageGeneratorPage;
