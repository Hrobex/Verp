import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const faqData = [
  {
    question: 'How does this AI convert my photo to a sketch?',
    answer: 'Our tool uses an advanced AI model trained to identify the essential lines, edges, and contours of your photo. It then redraws the image, omitting color and complex textures to produce a clean, artistic sketch effect.'
  },
  {
    question: 'Is this photo to sketch converter free to use?',
    answer: 'Yes, absolutely. This tool is 100% free, with no limits on usage and no requirement to sign up or create an account. You can turn as many photos into sketches as you like.'
  },
  {
    question: 'What is the best type of photo for creating a sketch?',
    answer: 'Photos with good lighting, clear subjects, and high contrast generally produce the best results. However, our AI can work its magic on almost any image, from portraits and pets to landscapes and architecture.'
  },
  {
    question: "What's the difference between this 'Sketch' tool and the 'Line Drawing' tool?",
    answer: (
      <>
        Both tools create amazing artistic effects, but for different purposes. This tool is designed to generate a rich, detailed <strong>artistic sketch</strong> with shading and texture, mimicking a hand-drawn piece. 
        In contrast, our <Link to="/line-drawing" className="text-yellow-400 underline">Photo to Line Drawing tool</Link> specializes in extracting clean, precise <strong>outlines</strong> from your image, perfect for coloring pages, stencils, or technical designs.
      </>
    )
  },
  {
    question: 'Can I use the generated sketch for commercial purposes?',
    answer: 'Yes, the images you create are yours to use as you wish. They are perfect for artists looking for a base outline, graphic designers, or anyone needing a unique, stylized image for their project.'
  },
];

function EasyDrawingsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultImageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setGeneratedImage(null);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateSketch = async () => {
    if (!selectedFile) {
      setError('Please upload an image to get started.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await fetch('/api/tools?tool=image-to-sketch', {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'The server responded with an error.');
        }

        const result = await response.json();

        if (result.sketch_image_base64) {
             setGeneratedImage(result.sketch_image_base64);
        } else {
            throw new Error('The AI failed to process the image. Please try a different one.');
        }

    } catch (err: any) {
      setError(err.message);
      console.error("Frontend Error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!resultImageRef.current?.src) return;
    const link = document.createElement('a');
    link.href = resultImageRef.current.src;
    link.download = `sketch_from_aiconvert.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <title>Free Photo to Sketch Converter Online | AI Image to Sketch</title>
      <meta name="description" content="Instantly turn any photo into a beautiful sketch with 'ArtifyPro'. Our free AI tool converts your images to stunning drawings online." />
      <link rel="canonical" href="https://aiconvert.online/image-to-sketch" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/image-to-sketch" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/image-to-sketch" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/image-to-sketch" />
      <script type="application/ld+json">
{`
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ArtifyPro: AI Photo to Sketch Converter",
    "applicationCategory": "ImageProcessingApplication",
    "operatingSystem": "WEB",
    "description": "A free online AI tool that converts photos into detailed artistic sketches with shading and texture.",
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-lime-500">
              ArtifyPro: Free AI Photo to Sketch Converter
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              Transform your pictures into pencil artistic sketches with a single click. Upload a photo and let our AI do the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Input Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6 items-center">
              <h2 className="text-2xl font-bold text-gray-200">1. Upload Your Photo</h2>
              <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-80 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:border-yellow-400 hover:bg-gray-700/50 transition"
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                {imagePreview ? (
                  <img src={imagePreview} alt="Uploaded photo to be converted to sketch" className="max-w-full max-h-full object-contain rounded-md" />
                ) : (
                  <div className="text-center text-gray-400">
                    <p>Click or Drag & Drop an Image Here</p>
                    <p className="text-sm">PNG, JPG, WEBP supported</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleGenerateSketch}
                disabled={isLoading || !selectedFile}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-yellow-500 to-lime-600 rounded-lg hover:from-yellow-600 hover:to-lime-700 focus:outline-none focus:ring-4 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? 'Creating Sketch...' : 'Turn into Sketch'}
              </button>
            </div>
            
            {/* Output Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6 items-center">
              <h2 className="text-2xl font-bold text-gray-200">2. Get Your Sketch</h2>
              <div className="w-full h-80 border-2 border-gray-700 bg-gray-900/50 rounded-lg flex justify-center items-center">
                {isLoading && (
                   <div className="text-center">
                       <p className="text-lg text-gray-300">AI is drawing...</p>
                       <p className="text-sm text-gray-400">This can take a moment.</p>
                   </div>
                )}
                {!isLoading && generatedImage && (
                  <img ref={resultImageRef} src={generatedImage} alt="AI generated sketch from photo" className="max-w-full max-h-full object-contain rounded-md" />
                )}
                {!isLoading && !generatedImage && (
                   <div className="text-center text-gray-500">
                       <p>Your artistic sketch will appear here</p>
                   </div>
                )}
                 {error && <p className="text-red-400 text-center p-4">{error}</p>}
              </div>
              <button
                onClick={handleDownload}
                disabled={isLoading || !generatedImage}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-lime-700 rounded-lg hover:bg-lime-800 focus:outline-none focus:ring-4 focus:ring-lime-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Download Sketch
              </button>
            </div>
          </div>

          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Create Stunning drawings Instantly</h2>
                   <p className="max-w-3xl mx-auto text-gray-400 mb-12">
                    Whether you're an artist seeking a foundation for your next piece, a designer looking for a stylized graphic, or just having fun, our AI sketch generator provides a clean, high-quality outline from any image in seconds.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-yellow-400 mb-2">For Artists</h3>
                          <p className="text-gray-300">Generate perfect art from a photo to use as a template for tracing, painting, or digital art.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-yellow-400 mb-2">High Quality</h3>
                          <p className="text-gray-300">The AI focuses on creating clean, defined lines, providing a professional-looking sketch every time.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-yellow-400 mb-2">100% Free</h3>
                          <p className="text-gray-300">No subscriptions, no hidden costs. Convert as many photos to sketches as you need, completely for free.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-yellow-400 mb-2">Simple & Fast</h3>
                          <p className="text-gray-300">No complex software needed. Just upload your image, click a button, and download your sketch.</p>
                      </div>
                  </div>
              </section>

              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-lime-400 mb-2">{faq.question}</h3>
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

export default EasyDrawingsPage;
