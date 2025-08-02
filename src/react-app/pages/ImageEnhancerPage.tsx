import { useState, useRef, ChangeEvent } from 'react';

// --- Data Constants ---
const versions = ['v1.4', 'v2.1', 'v3.0'];
const scales = [2, 4];
const apiEndpoint = 'https://makhinur-furd.hf.space/upload/';

const faqData = [
  {
    question: 'What types of images work best with EnhanceX AI?',
    answer: 'Our AI image enhancer works well on a wide variety of pictures, including portraits, landscapes, and digital graphics. For best results, start with an image that is reasonably clear, even if it\'s low-resolution.'
  },
  {
    question: 'What does "upscaling" an image mean?',
    answer: 'Upscaling is the process of increasing the resolution (the number of pixels) of an image. Our AI intelligently adds new pixels that match the context of the image, resulting in a larger, clearer, and sharper photo without the usual blurriness.'
  },
  {
    question: 'Is this photo quality enhancer completely free?',
    answer: 'Yes, our online tool is 100% free to use. You can enhance and upscale your images without any cost, subscriptions, or hidden charges.'
  },
  {
    question: 'What is the maximum upscale scale available?',
    answer: 'You can choose to upscale your image by a factor of 2x or 4x, allowing you to significantly increase the size and detail of your photos for printing or high-resolution displays.'
  },
];

// --- React Component ---
function ImageEnhancerPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);

  const [selectedVersion, setSelectedVersion] = useState(versions[0]);
  const [selectedScale, setSelectedScale] = useState(scales[0]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFile(file);
      setEnhancedImageUrl(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhanceClick = async () => {
    if (!originalFile) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEnhancedImageUrl(null);

    const formData = new FormData();
    formData.append('file', originalFile);
    formData.append('version', selectedVersion);
    formData.append('scale', selectedScale.toString());

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Image enhancement failed. The server might be busy. Please try again later.');
      }
      
      const data = await response.json();
      if (data.sketch_image_base64) {
        setEnhancedImageUrl(data.sketch_image_base64);
      } else {
        throw new Error('The server did not return an enhanced image.');
      }

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>Free AI Image Enhancer & Photo Upscaler | Improve Quality Online</title>
      <meta name="description" content="Instantly improve image quality with EnhanceX AI. Our free online photo enhancer and upscaler sharpens details, removes noise, and increases resolution up to 4x." />
      <link rel="canonical" href="https://aiconvert.online/ai-image-enhancer" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/ai-image-enhancer" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/ai-image-enhancer" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/ai-image-enhancer" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "EnhanceX AI Image Enhancer",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1890"
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              EnhanceX AI: Free Image Enhancer
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Turn your blurry, low-resolution photos into sharp, high-quality images. Upscale and enhance your pictures with the power of AI in a single click.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Controls Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">1. Upload Your Image</h3>
                  <input type="file" accept="image/*" onChange={handleFileSelect} ref={fileInputRef} className="hidden" />
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className="w-full h-40 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-700/50 transition"
                  >
                    {originalPreviewUrl ? (
                      <img src={originalPreviewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
                    ) : (
                      <p className="text-gray-400 text-center">Click to select a photo</p>
                    )}
                  </div>
              </div>

              <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">2. Choose Enhancement Options</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                          <label htmlFor="version-select" className="block text-sm font-medium text-gray-400 mb-1">AI Model</label>
                          <select id="version-select" value={selectedVersion} onChange={(e) => setSelectedVersion(e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500">
                              {versions.map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                      </div>
                      <div>
                          <label htmlFor="scale-select" className="block text-sm font-medium text-gray-400 mb-1">Upscale Factor</label>
                          <select id="scale-select" value={selectedScale} onChange={(e) => setSelectedScale(parseInt(e.target.value))} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500">
                              {scales.map(s => <option key={s} value={s}>{s}x</option>)}
                          </select>
                      </div>
                  </div>
              </div>

              <button
                onClick={handleEnhanceClick} disabled={isLoading || !originalFile}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? 'Enhancing Image...' : 'Enhance Image'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* Output Column with Before/After */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg flex flex-col justify-center items-center relative">
              {isLoading && (
                  <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-2xl">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
                    <p className="text-gray-300 mt-4">AI is sharpening the details...</p>
                  </div>
              )}
              
              <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col items-center">
                      <h4 className="text-lg font-bold mb-2 text-gray-400">Before</h4>
                      <div className="w-full h-64 sm:h-80 bg-gray-700/50 rounded-lg flex justify-center items-center border border-gray-600">
                          {originalPreviewUrl ? <img src={originalPreviewUrl} alt="Original" className="max-h-full max-w-full object-contain"/> : <p className="text-gray-500 text-sm">Original image</p>}
                      </div>
                  </div>
                  <div className="flex flex-col items-center">
                      <h4 className="text-lg font-bold mb-2 text-cyan-400">After</h4>
                      <div className="w-full h-64 sm:h-80 bg-gray-700/50 rounded-lg flex justify-center items-center border border-cyan-500/50">
                         {enhancedImageUrl ? <img src={enhancedImageUrl} alt="Enhanced" className="max-h-full max-w-full object-contain"/> : <p className="text-gray-500 text-sm">Enhanced result</p>}
                      </div>
                  </div>
              </div>

              {enhancedImageUrl && !isLoading && (
                  <a href={enhancedImageUrl} download="enhanced-image.png" className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all">
                      Download Enhanced Image
                  </a>
              )}
            </div>
          </div>

          {/* Content Sections */}
          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Upscale and Denoise Your Photos with AI</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-cyan-400 mb-2">Increase Resolution</h3>
                          <p className="text-gray-300">Take your images from low-res to high-res. Upscale photos by 2x or 4x, perfect for printing or web use.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-cyan-400 mb-2">Sharpen Details</h3>
                          <p className="text-gray-300">Our AI intelligently enhances details, bringing clarity to blurry faces, textures, and fine lines in any picture.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-cyan-400 mb-2">Reduce Noise & Blur</h3>
                          <p className="text-gray-300">Automatically clean up compression artifacts and digital noise to produce a smoother, cleaner image.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-cyan-400 mb-2">Free and Online</h3>
                          <p className="text-gray-300">Improve image quality directly in your browser. No software to install, no sign-up needed, and completely free.</p>
                      </div>
                  </div>
              </section>

            <section className="mt-20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">How Our AI Image Enhancer Works</h2>
                    <p className="max-w-3xl mx-auto text-gray-400 mb-12">
                        Enhancing your photos has never been easier. Our tool simplifies the process into three straightforward steps for a professional result every time.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-cyan-400 font-bold text-lg mb-2">1. Upload Your Photo</p>
                        <p className="text-gray-300">
                            Click the upload area and select the image you wish to improve. It can be a blurry photo, a small icon, or any picture that needs a quality boost.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-cyan-400 font-bold text-lg mb-2">2. Select Your Options</p>
                        <p className="text-gray-300">
                            Choose the AI model version and select the desired upscale factor (2x or 4x) to determine the final resolution of your image.
                        </p>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-lg">
                        <p className="text-cyan-400 font-bold text-lg mb-2">3. Enhance and Download</p>
                        <p className="text-gray-300">
                           Hit the "Enhance Image" button and let the AI work its magic. Compare the result and download your new, high-quality image.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mt-20">
    <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choosing the Right AI Model for Your Photo</h2>
        <p className="max-w-3xl mx-auto text-gray-400 mb-12">
            Our tool is powered by versions of the acclaimed <strong>GFPGAN</strong> model, an AI specifically designed for stunning photo restoration and enhancement. Each version offers a different level of refinement to give you the best result for your specific needs. Here’s a quick guide:
        </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="bg-gray-800/50 p-6 rounded-lg">
            <p className="text-cyan-400 font-bold text-lg mb-2">Model v1.4 (Clarity & Faces)</p>
            <p className="text-gray-300">
                This version is excellent for general-purpose enhancement. It focuses on significantly improving overall image clarity and is particularly effective at restoring details in facial features, making it a great starting point for portraits and social media photos.
            </p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg">
            <p className="text-cyan-400 font-bold text-lg mb-2">Model v2.1 (Detailed Enhancement)</p>
            <p className="text-gray-300">
                Building upon the previous version, this model incorporates more advanced techniques to augment fine details and textures across the entire image. Choose this option for a more comprehensive enhancement that improves both the subject and its surroundings.
            </p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg">
            <p className="text-cyan-400 font-bold text-lg mb-2">Model v3.0 (Maximum Quality & Precision)</p>
            <p className="text-gray-300">
                This is our latest and most powerful model. It uses the most advanced improvements in enhancement techniques, delivering superior image quality, precise detail refinement, and the best overall noise reduction. This is the ultimate choice for professional work, printing, or when you need the absolute highest fidelity.
            </p>
        </div>
    </div>
    <p className="text-center text-gray-400 mt-8">
        <strong>Our Recommendation:</strong> Start with <strong>v2.1</strong> for a fantastic balance of detail and performance. For professional results or restoring precious old photos, <strong>v3.0</strong> will provide the highest quality.
    </p>
</section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-cyan-400 mb-2">{faq.question}</h3>
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

export default ImageEnhancerPage;
