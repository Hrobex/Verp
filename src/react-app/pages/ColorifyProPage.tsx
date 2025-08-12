import { useState, useRef, ChangeEvent } from 'react';

const faqData = [
    {
        question: 'How does the AI add color to black and white photos?',
        answer: 'Our AI has been trained on millions of images to understand the relationship between shapes, textures, and their natural colors. When you upload a black and white photo, it analyzes the grayscale information and intelligently predicts the most realistic colors for each object and element in the scene, from skin tones to landscapes.'
    },
    {
        question: 'Is this AI photo colorizer completely free to use?',
        answer: 'Yes, it is 100% free. You can colorize your photos without any cost, hidden fees, or the need to create an account. Our goal is to make high-quality photo colorization accessible to everyone.'
    },
    {
        question: 'What types of photos get the best results?',
        answer: 'For the best results, use clear, high-quality black and white photos. While our tool works on a wide variety of images, including sepia and faded pictures, clearer source images with good contrast and detail allow the AI to make more accurate color predictions. It works great on portraits, landscapes, and historical photos.'
    },
    {
        question: 'What happens to my uploaded images?',
        answer: 'We take your privacy seriously. Your images are uploaded securely for the sole purpose of colorization. They are processed automatically and are not stored on our servers for longer than necessary. We do not share or use your photos for any other purpose.'
    },
];

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
                
                const MAX_WIDTH = 1024;
                const MAX_HEIGHT = 1024;
                let { width, height } = img;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Image compression failed.'));
                    }
                }, 'image/jpeg'
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

function ColorifyProPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sourceFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSourceFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setSourcePreview(reader.result as string);
      reader.readAsDataURL(file);
      setResultImageUrl(null);
      setError(null);
    }
  };

  const handleColorifyClick = async () => {
    if (!sourceFile) {
      setError('Please upload a black and white photo first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImageUrl(null);

    try {
      const compressedBlob = await compressImage(sourceFile);

      const formData = new FormData();
      formData.append('file', compressedBlob, sourceFile.name);

      const response = await fetch('/api/tools?tool=colorify-pro', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to colorize the image. The server might be busy.');
      }
      
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setResultImageUrl(imageUrl);

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (!resultImageUrl) return;
    const link = document.createElement('a');
    link.href = resultImageUrl;
    link.download = 'colorified-photo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <title>AI Photo Colorizer | Free Tool to Colorize Black and White Photos</title>
      <meta name="description" content="Bring your old black and white photos to life with our free AI photo colorizer. Add realistic color to vintage or sepia images online." />
      <link rel="canonical" href="https://aiconvert.online/ai-photo-colorizer" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/ai-photo-colorizer" />
      {/* <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/ai-photo-colorizer" /> */}
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/ai-photo-colorizer" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "name": "AI Photo Colorizer",
            "operatingSystem": "WEB",
            "applicationCategory": "ImageProcessingApplication",
            "description": "A free online tool that uses artificial intelligence to automatically colorize black and white, sepia, and vintage photos.",
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500">
              Bring Your Memories to Life with AI
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Instantly add vibrant, realistic color to your old black and white photos. Our free AI tool automatically colorizes images in just one click.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* --- Controls Column --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6 items-center">
              <h2 className="text-2xl font-bold text-center">Upload a Black & White Photo</h2>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileSelect} 
                ref={sourceFileInputRef} 
                className="hidden" 
              />
              <div 
                onClick={() => sourceFileInputRef.current?.click()} 
                className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-700/50 transition-colors bg-cover bg-center"
                style={{ backgroundImage: `url(${sourcePreview})` }}
              >
                {!sourcePreview && <p className="text-gray-400">Click to select an image</p>}
              </div>

              <button
                onClick={handleColorifyClick}
                disabled={isLoading || !sourceFile}
                className="w-full mt-4 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-red-600 to-green-600 rounded-lg hover:from-red-700 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Colorizing...' : 'Colorize Photo'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* --- Output Column --- */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg flex flex-col justify-center items-center relative min-h-[28rem]">
              {isLoading && (
                  <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-2xl">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
                    <p className="text-gray-300 mt-4">AI is restoring the colors...</p>
                  </div>
              )}
              
              <div className="w-full h-full flex flex-col justify-center items-center">
                {resultImageUrl ? (
                  <>
                    <img src={resultImageUrl} alt="AI Colorized Photo Result" className="max-h-96 w-auto object-contain rounded-lg"/>
                    <button onClick={handleDownloadClick} className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all">
                      Download Colorized Photo
                    </button>
                  </>
                ) : (
                  <p className="text-gray-400 text-center">Your colorized photo will appear here</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Why Use Our Free Photo Colorizer?</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">Rediscover your history in full color. Our tool isn't just a filter; it's an AI-driven restoration process.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-green-400 mb-2">AI-Powered Realism</h3><p className="text-gray-300">Get natural and realistic colors, not just a simple tint. Our AI understands context to apply the right shades.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-green-400 mb-2">Instant & Free</h3><p className="text-gray-300">Convert black and white photos to color in seconds, with no limits and completely free of charge.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-green-400 mb-2">Preserve History</h3><p className="text-gray-300">Perfect for reviving old family albums, historical images, and reconnecting with the past in a new light.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-green-400 mb-2">Simple for Everyone</h3><p className="text-gray-300">No complex software needed. Just upload your photo, click one button, and download the result.</p></div>
                  </div>
              </section>

              <section className="mt-20 text-center">
                   <h2 className="text-3xl font-bold mb-4">From Black & White to Color in 3 Steps</h2>
                   <p className="max-w-3xl mx-auto text-gray-400 mb-12">Our intuitive process makes it easy for anyone to add color to old photos and share them with the world.</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-green-400 font-bold text-lg mb-2">1. Upload Your Photo</p><p className="text-gray-300">Click the upload area and select a black and white, sepia, or faded photo from your device.</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-green-400 font-bold text-lg mb-2">2. Click 'Colorize Photo'</p><p className="text-gray-300">Let our AI analyze your image. This process starts immediately and only takes a few moments.</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-green-400 font-bold text-lg mb-2">3. Download & Share</p><p className="text-gray-300">Your vibrant, colorized memory is ready to be downloaded and shared with family and friends.</p></div>
                   </div>
              </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-green-400 mb-2">{faq.question}</h3>
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

export default ColorifyProPage;
