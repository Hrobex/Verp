import { useState, useRef, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

// --- Helper Function ---
// Converts a File to a compressed JPEG File
async function compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas context is not available.'));

                const maxWidth = 1000;
                const maxHeight = 1000;
                let { width, height } = img;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round(height * (maxWidth / width));
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round(width * (maxHeight / height));
                        height = maxHeight;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                        } else {
                            reject(new Error('Canvas to Blob conversion failed.'));
                        }
                    },
                    'image/jpeg',
                    0.7 // 70% quality
                );
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}


// --- Data Constants ---
const faqData = [
    {
        question: 'How is this different from a simple cartoon filter?',
        answer: 'DigiCartoony doesn\'t just apply a filter. It uses advanced AI to reinterpret your photo as a new piece of digital art, adding painterly depth, complex lighting, and a unique artistic quality.'
    },
    {
        question: 'What does the "Detect Face Only" option do?',
        answer: 'This powerful feature gives you artistic control. When enabled, the AI focuses all its power on transforming only the face in your photo into a detailed digital portrait. When disabled, it transforms the entire image, which is great for landscapes or full-body shots.'
    },
    {
        question: 'What is the difference between DigiCartoony and Cartoonify?',
        answer: (
            <>
                They are two different artists for two different goals. <strong>DigiCartoony</strong> is a digital painter, creating a high-quality, detailed piece of art with a unique painterly depth. It's for creating a masterpiece.
                <Link to="https://aiconvert.online/cartoonify/" className="text-rose-400 underline"> Cartoonify</Link> is a quick sketch artist, giving you a fun, 2D "toon" look instantly, perfect for social media posts.
            </>
        )
    },
     {
        question: 'Are my uploaded photos safe?',
        answer: 'Yes, your privacy is our priority. Photos are uploaded securely for AI processing and are automatically deleted from our servers after a short time. We never store or use your images.'
    },
];

function DigiCartoonyPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [detectFace, setDetectFace] = useState(false);
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

  const handleGenerateClick = async () => {
    if (!sourceFile) {
      setError('Please upload a photo to get started.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImageUrl(null);

    try {
      const compressedFile = await compressImage(sourceFile);
      
      const formData = new FormData();
      formData.append('file', compressedFile);
      formData.append('if_face', detectFace ? 'Yes' : 'No');
      // The 'Style' parameter is removed as there are no options to choose from.

      const response = await fetch('https://makhinur-angusad.hf.space/inference/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const imageBlob = await response.blob();
        setResultImageUrl(URL.createObjectURL(imageBlob));
      } else {
        const errorText = await response.text();
        setError(errorText || 'An error occurred during processing. Please try again.');
      }
    } catch (err) {
      setError('An unknown error occurred. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (!resultImageUrl) return;
    const link = document.createElement('a');
    link.href = resultImageUrl;
    link.download = 'digicartoony-art.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <title>AI Digital Painting from Photo | Free Photo to Art Converter</title>
      <meta name="description" content="Turn your photo into a stunning piece of digital painting with our free AI tool. Create high-quality digital art online from your pictures, no sign-up required." />
      <link rel="canonical" href="https://aiconvert.online/cartoony-art" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/cartoony-art" />
      {/* <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/cartoony-art" /> */}
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/cartoony-art" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "name": "DigiCartoony: Photo to Digital Painting",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "description": "An AI tool that transforms photos into high-quality digital paintings with an artistic style, with an option to focus on the face.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1950"
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">
              DigiCartoony: AI Photo to Digital Art
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Elevate your photos into high-quality digital paintings. Turn your picture into a unique piece of art for free.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* --- Controls Column --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <div className="text-center">
                  <h2 className="text-2xl font-bold">1. Upload Your Photo</h2>
              </div>
              <div 
                onClick={() => sourceFileInputRef.current?.click()} 
                className="w-full h-40 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-700/50 transition-colors bg-cover bg-center"
                style={{ backgroundImage: `url(${sourcePreview})` }}
              >
                {!sourcePreview && <p className="text-gray-400">Click to select an image</p>}
              </div>
              <input type="file" accept="image/*" onChange={handleFileSelect} ref={sourceFileInputRef} className="hidden" />
              
              <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                <input 
                  type="checkbox" 
                  id="face-detect" 
                  checked={detectFace}
                  onChange={(e) => setDetectFace(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-500 bg-gray-800 text-teal-500 focus:ring-teal-400"
                />
                <label htmlFor="face-detect" className="text-gray-200">2. Face Detect</label>
              </div>

              <button
                onClick={handleGenerateClick}
                disabled={isLoading || !sourceFile}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg hover:from-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Your Art...' : 'Generate Digital Art'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* --- Output Column --- */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg flex flex-col justify-center items-center relative min-h-[28rem]">
              {isLoading && (
                  <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-2xl">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
                    <p className="text-gray-300 mt-4">Rendering your masterpiece...</p>
                  </div>
              )}
              <div className="w-full h-full flex flex-col justify-center items-center">
                {resultImageUrl ? (
                  <>
                    <img src={resultImageUrl} alt="Digital Painting Result" className="max-h-96 max-w-full object-contain rounded-lg"/>
                    <button onClick={handleDownloadClick} className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all">
                      Download Your Art
                    </button>
                  </>
                ) : (
                  <p className="text-gray-400 text-center">Your digital artwork will appear here</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Go Beyond Filters. Create Digital Art.</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">DigiCartoony isn't just another photo effect. It's an AI-powered artistic tool that reimagines your photos as high-quality digital paintings.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-teal-400 mb-2">Unique Artistic Style</h3><p className="text-gray-300">Transforms your photo into a detailed digital artwork with a unique, painterly aesthetic.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-teal-400 mb-2">Rich Digital Painting</h3><p className="text-gray-300">Convert photos into detailed digital paintings with complex shading and artistic flair.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-teal-400 mb-2">Artistic Control</h3><p className="text-gray-300">Use the "Detect Face" option to focus the AI's power on creating a perfect character portrait.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-teal-400 mb-2">Free, No Sign-Up</h3><p className="text-gray-300">Access professional-grade photo transformation tools online for free, without any registration.</p></div>
                  </div>
              </section>

              <section className="mt-20 text-center">
                   <h2 className="text-3xl font-bold mb-4">How to Turn Your Photo into Digital Art</h2>
                   <p className="max-w-3xl mx-auto text-gray-400 mb-12">Our process gives you the control to create the perfect artistic transformation.</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-teal-400 font-bold text-lg mb-2">1. Upload Your Image</p><p className="text-gray-300">Select a high-quality photo from your device. Clear, well-lit portraits work best for character creation.</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-teal-400 font-bold text-lg mb-2">2. Fine-Tune Your Art</p><p className="text-gray-300">Optionally, enable 'Detect Face Only' to focus the AI's power on creating a perfect character portrait from your photo.</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-teal-400 font-bold text-lg mb-2">3. Generate & Download</p><p className="text-gray-300">Hit the generate button. Our AI will render your new piece of art, ready for you to download and keep.</p></div>
                   </div>
              </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-teal-400 mb-2">{faq.question}</h3>
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

export default DigiCartoonyPage;
