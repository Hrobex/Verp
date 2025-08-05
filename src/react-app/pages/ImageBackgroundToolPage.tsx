// الملف: ImageBackgroundToolPage.tsx (النسخة الجديدة والآمنة)
import { useState, useRef, useEffect, ChangeEvent } from 'react';

const faqData = [
  {
    question: 'Is this AI background remover completely free?',
    answer: 'Yes, 100%. Our tool is free to use with no limits on the number of images you can process or download. No hidden fees or sign-up required.'
  },
  {
    question: 'What kind of images work best?',
    answer: 'For the best results, use images with a clear subject and a distinct background. High-resolution images generally yield cleaner cutouts.'
  },
  {
    question: 'How does the AI work?',
    answer: 'Our tool uses an advanced computer vision model trained to identify the main subject (like a person, product, or animal) and precisely separate it from the background.'
  },
  {
    question: 'Can I use the final images for commercial projects?',
    answer: 'Yes. Once you process an image and download it, you are free to use it for any personal or commercial purpose without needing to provide attribution.'
  },
];

function ImageBackgroundToolPage() {
  // State for file handling and API interaction
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string>('');
  const [processedImageUrl, setProcessedImageUrl] = useState<string>(''); // URL from API
  const [finalImageUrl, setFinalImageUrl] = useState<string>(''); // URL from canvas after bg apply
  
  // State for UI control
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for background customization
  const [backgroundOption, setBackgroundOption] = useState<'transparent' | 'color' | 'custom'>('transparent');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [customBgFile, setCustomBgFile] = useState<File | null>(null);

  // Refs for file inputs
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  // Effect to clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
      if (processedImageUrl) URL.revokeObjectURL(processedImageUrl);
      if (finalImageUrl) URL.revokeObjectURL(finalImageUrl);
    };
  }, [originalPreviewUrl, processedImageUrl, finalImageUrl]);

  const handleMainFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFile(file);
      setProcessedImageUrl('');
      setFinalImageUrl('');
      setError(null);
      if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
      setOriginalPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleCustomBgFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomBgFile(file);
    }
  };

  const handleProcessImage = async () => {
    if (!originalFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProcessedImageUrl('');
    setFinalImageUrl('');
    
    const formData = new FormData();
    formData.append('file', originalFile);

    try {
      // تم تغيير هذا السطر فقط للاتصال بالـ API الداخلي الآمن
      const response = await fetch('/api/tools?tool=background-remover', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process image. The service might be busy. Please try again.');
      }

      const blob = await response.blob();
      const processedUrl = URL.createObjectURL(blob);
      setProcessedImageUrl(processedUrl);
      setFinalImageUrl(processedUrl); // Set final image to processed initially

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // هذا المنطق يعمل في المتصفح ويبقى كما هو
  const handleApplyBackground = () => {
    if (!processedImageUrl) {
      setError('Please process an image first to get the cutout.');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (backgroundOption === 'color') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (backgroundOption === 'custom' && customBgFile) {
        const bgImg = new Image();
        bgImg.onload = () => {
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          setFinalImageUrl(canvas.toDataURL('image/png'));
        };
        bgImg.src = URL.createObjectURL(customBgFile);
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      setFinalImageUrl(canvas.toDataURL('image/png'));
    };
    img.src = processedImageUrl;
  };

  const handleDownloadImage = () => {
    if (!finalImageUrl) return;
    const link = document.createElement('a');
    link.href = finalImageUrl;
    link.download = 'processed_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <>
      {/* SEO Section - Following React 19 Best Practices */}
      <title>Free Online AI Background Remover - Remove & Change Backgrounds</title>
      <meta name="description" content="Instantly remove the background from any image with our free AI tool. Create transparent backgrounds or change them to a solid color or custom image." />
      <link rel="canonical" href="https://aiconvert.online/remove-background" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/remove-background" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/remove-background" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/remove-background" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Background Remover",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "ratingCount": "1549"
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-500">
              AI Background Remover & Converter
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Effortlessly remove & change image backgrounds in one click. Upload your photo to get a transparent background, or replace it with a new one.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Controls Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              
              {/* Step 1: Upload */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-200">
                  <span className="text-lime-400 font-bold">Step 1:</span> Upload Your Image
                </h3>
                <input type="file" accept="image/*" onChange={handleMainFileSelect} ref={mainFileInputRef} className="hidden" />
                <button 
                  onClick={() => mainFileInputRef.current?.click()}
                  className="w-full py-3 px-4 font-bold text-gray-900 bg-gray-300 rounded-lg hover:bg-white transition-all"
                >
                  {originalFile ? 'Change Image' : 'Select Image'}
                </button>
                {originalFile && <p className="text-sm text-gray-400 text-center truncate">Selected: {originalFile.name}</p>}
              </div>

              {/* Step 2: Process */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-200">
                    <span className="text-lime-400 font-bold">Step 2:</span> Remove Background
                </h3>
                <button
                  onClick={handleProcessImage}
                  disabled={!originalFile || isLoading}
                  className="w-full py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-lime-600 rounded-lg hover:from-green-600 hover:to-lime-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? 'Processing...' : 'Remove Background'}
                </button>
              </div>

              {/* Step 3: Customize (Appears after processing) */}
{processedImageUrl && (
    <div className="space-y-4 border-t border-gray-700 pt-4">
        <h3 className="text-lg font-semibold text-gray-200">
            <span className="text-lime-400 font-bold">Step 3:</span> Customize New Background
        </h3>
        <select
            value={backgroundOption}
            onChange={(e) => setBackgroundOption(e.target.value as any)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500"
        >
            <option value="transparent">Transparent Background</option>
            <option value="color">Solid Color</option>
            <option value="custom">Custom Image</option>
        </select>

        {backgroundOption === 'color' && (
            <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-full h-12 p-1 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
            />
        )}
        {backgroundOption === 'custom' && (
            <>
                <input type="file" accept="image/*" onChange={handleCustomBgFileSelect} ref={bgFileInputRef} className="hidden" />
                <button onClick={() => bgFileInputRef.current?.click()} className="w-full py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded-lg">
                    {customBgFile ? `Selected: ${customBgFile.name}` : 'Upload Background Image'}
                </button>
            </>
        )}
        
        <button
            onClick={handleApplyBackground}
            className="w-full py-2.5 px-4 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
        >
            Apply Background
        </button>
    </div>
)}
{error && <p className="text-red-400 text-center mt-2">{error}</p>}
</div>
              
            {/* Output Column */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg flex flex-col justify-center items-center h-[28rem] lg:h-auto">
    <div className="w-full h-full flex justify-center items-center border-2 border-dashed border-gray-600 rounded-lg overflow-hidden relative">
        {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-lime-500"></div>
                <p className="text-gray-400">AI is working its magic...</p>
            </div>
        ) : (
            <>
                {!finalImageUrl && !originalPreviewUrl && (
                    <div className="text-center text-gray-500 p-4">
                        <p>Your final image will appear here</p>
                    </div> 
                )}
                
                {(finalImageUrl || originalPreviewUrl) && (
                    <img 
                        src={finalImageUrl || originalPreviewUrl} 
                        alt={finalImageUrl ? 'Processed image' : (originalFile ? 'Original image preview' : '')} 
                        className="max-w-full max-h-full object-contain"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'10\' height=\'10\' fill=\'%234A5568\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%234A5568\'/%3E%3Crect x=\'10\' width=\'10\' height=\'10\' fill=\'%23718096\'/%3E%3Crect y=\'10\' width=\'10\' height=\'10\' fill=\'%23718096\'/%3E%3C/svg%3E")' }}
                    />
                )}
            </>
        )}
    </div>
    {finalImageUrl && !isLoading && (
        <button onClick={handleDownloadImage} className="w-full mt-4 py-3 px-4 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all">
            Download Image
        </button>
    )}
</div>
            </div>
          
          {/* Content Sections */}
          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Why Our AI Background Remover Stands Out?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-lime-400 mb-2">Instant & Free</h3>
                          <p className="text-gray-300">Get a professional-grade cutout in seconds. No fees, no sign-up, no hassle.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-lime-400 mb-2">High Precision</h3>
                          <p className="text-gray-300">Our AI accurately detects the subject, handling tricky areas like hair and fur with ease.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-lime-400 mb-2">Creative Freedom</h3>
                          <p className="text-gray-300">Go beyond transparent. Add solid colors or custom image backgrounds to fit your project.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-lime-400 mb-2">Privacy First</h3>
                          <p className="text-gray-300">Your images are processed and then deleted. We do not store or use your uploads.</p>
                      </div>
                  </div>
              </section>

            {/* How to Use Section */}
<section className="mt-20">
    <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Your Quick Guide to a Perfect Image Cutout</h2>
        <p className="max-w-3xl mx-auto text-gray-400 mb-12">
            Forget complex software and tedious manual editing. Our free background eraser is designed for speed and simplicity. In just a few clicks, you can transform your photo, making the background transparent or swapping it for something entirely new. Here's how to achieve a professional-grade result effortlessly.
        </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="bg-gray-800/50 p-6 rounded-lg">
            <p className="text-lime-400 font-bold text-lg mb-2">Step 1: Upload Your Photo</p>
            <p className="text-gray-300">
                Start by clicking 'Select Image' and choosing the photo you want to edit. For the cleanest results, images with a clear subject (like a person, a product, or a pet) against a relatively distinct background work best.
            </p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg">
            <p className="text-lime-400 font-bold text-lg mb-2">Step 2: One-Click Background Removal</p>
            <p className="text-gray-300">
                Once your image is ready, simply hit the 'Remove Background' button. In an instant, our AI will analyze your photo, identify the foreground, and precisely erase the background, leaving you with a high-quality transparent image (PNG).
            </p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg">
            <p className="text-lime-400 font-bold text-lg mb-2">Step 3: Customize & Download</p>
            <p className="text-gray-300">
                This is where you get creative! Add a fresh solid color or upload a custom image. After selecting your new background, click the <strong>"Apply Background"</strong> button to see the changes. Once you're happy, just click "Download"!
            </p>
        </div>
    </div>
</section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-lime-400 mb-2">{faq.question}</h3>
                              {/* Using div for flexibility as per our established rule */}
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

export default ImageBackgroundToolPage;
