// الملف: LineArtifyPage.tsx (النسخة الجديدة والآمنة)
import { useState, useCallback, ChangeEvent } from 'react';

// This is a helper component for the drag-and-drop area.
const ImageUploadBox = ({ title, imageSrc, onFileChange, onDrop, onDragOver }: {
  title: string;
  imageSrc: string | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLLabelElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLLabelElement>) => void;
}) => {
  const inputId = `file-upload-${title.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="w-full flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-300 mb-4">{title}</h3>
      <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center p-4">
        <label
          htmlFor={inputId}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={(e) => e.currentTarget.classList.remove('border-blue-500')}
          className="w-full h-full border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          {imageSrc ? (
            <img src={imageSrc} alt="Preview" className="max-w-full max-h-full object-contain rounded-md" />
          ) : (
            <div className="text-center text-gray-500">
              <p>Drag & Drop your image here</p>
              <p className="my-2">or</p>
              <p className="bg-gray-700 px-4 py-2 rounded-md">Click to select a file</p>
            </div>
          )}
          <input id={inputId} type="file" className="hidden" accept="image/*" onChange={onFileChange} />
        </label>
      </div>
    </div>
  );
};

// FAQ Data for LineArtify
const faqData = [
    {
      question: 'How is LineArtify different from ArtifyPro?',
      answer: 'LineArtify focuses on creating clean, distinct lines, similar to an outline or contour drawing. A sketch tool (ArtifyPro), on the other hand, often reproduces shading, texture, and a more hand-drawn pencil effect. LineArtify is perfect for creating outlines, coloring pages, or minimalist art.'
    },
    {
      question: "What's the difference between the 'Simple' and 'Complex' styles?",
      answer: "The 'Simple' style generates clean, minimalist outlines, perfect for a basic line art effect. The 'Complex' style captures more detail from your original photo, resulting in a more intricate and richer line drawing."
    },
    {
      question: 'Is this line drawing generator really free?',
      answer: 'Yes, 100%. LineArtify is completely free to use with no limits on the number of conversions. You can turn as many pictures into line drawings as you need, without any cost or sign-up.'
    },
    {
      question: 'What types of images produce the best results?',
      answer: 'For the best line art conversion, use images with clear subjects, good lighting, and high contrast. Photos with well-defined edges tend to produce cleaner and more accurate line drawings.'
    },
    {
      question: 'Can I use the generated line art for commercial projects?',
      answer: 'Yes. The line drawings you create can be used for both personal and commercial projects. However, you are responsible for ensuring you have the rights to the original photo you are converting.'
    },
];

function LineArtifyPage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [version, setVersion] = useState('v2');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSourceFile(file);
      setSourcePreview(URL.createObjectURL(file));
      setError(null);
      setResultImage(null);
    } else {
      setError('Please upload a valid image file.');
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-blue-500');
  };
  
  // دالة ضغط الصورة تبقى هنا لتحسين الأداء قبل الرفع
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
          if (!ctx) return reject(new Error('Canvas context not available'));
          
          const maxWidth = 1024;
          const maxHeight = 1024;
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

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          }, 'image/jpeg', 0.9);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // تم تعديل هذه الدالة لتصبح آمنة
  const handleConvertClick = async () => {
    if (!sourceFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const compressedFile = await compressImage(sourceFile);
      
      const formData = new FormData();
      formData.append('file', compressedFile, sourceFile.name);
      formData.append('version', version);

      // تم تغيير هذا السطر فقط للاتصال بالـ API الداخلي الآمن
      const response = await fetch('/api/lineartify', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        setResultImage(URL.createObjectURL(blob));
      } else {
        throw new Error('Server failed to process the image. Please try again.');
      }

    } catch (err) {
      console.error('Conversion Error:', err);
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(`Oops! Something went wrong. ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (!resultImage) return;
    const a = document.createElement('a');
    a.href = resultImage;
    a.download = `lineart_${sourceFile?.name.split('.')[0] || 'image'}.png`;
    document.body.appendChild(a);
a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      {/* --- START: SEO CONTENT ADDED HERE --- */}
      <title>LineArtify: Free AI Photo to Line Art Converter Online</title>
      <meta name="description" content="Instantly convert your photos into clean, beautiful line drawings with LineArtify. Our free online AI tool makes it easy to create line art for any project. No sign-up required." />
      <link rel="canonical" href="https://aiconvert.online/line-drawing" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/line-drawing" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/line-drawing" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/line-drawing" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "LineArtify: AI Photo to Line Art Converter",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "ratingCount": "980"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        `}
      </script>
      {/* --- END: SEO CONTENT ADDED HERE --- */}

      <div className="pt-24 bg-gray-900 text-white min-h-screen">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              LineArtify: AI Photo to Line Art Converter
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Upload your photo and watch our AI transform it into a clean, beautiful line drawing instantly and for free.
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ImageUploadBox
                title="Original Photo"
                imageSrc={sourcePreview}
                onFileChange={onFileInputChange}
                onDrop={onDrop}
                onDragOver={onDragOver}
              />
              <div className="w-full flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Line Art Result</h3>
                <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center p-4 border-2 border-dashed border-gray-600">
                  {isLoading && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                      <p className="text-gray-400">Converting to line art...</p>
                    </div>
                  )}
                  {!isLoading && !resultImage && (
                    <p className="text-center text-gray-500">Your line drawing will appear here</p>
                  )}
                  {resultImage && !isLoading && (
                    <img src={resultImage} alt="Result" className="max-w-full max-h-full object-contain rounded-md" />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-300">Style:</span>
                  <div className="flex gap-2">
                      <button onClick={() => setVersion('v1')} className={`px-4 py-2 rounded-md transition-colors ${version === 'v1' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Simple</button>
                      <button onClick={() => setVersion('v2')} className={`px-4 py-2 rounded-md transition-colors ${version === 'v2' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Complex</button>
                  </div>
              </div>
              <button
                onClick={handleConvertClick}
                disabled={isLoading || !sourceFile}
                className="w-full sm:w-auto py-3 px-8 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? 'Converting...' : 'Create Line Art'}
              </button>
              {resultImage && !isLoading && (
                 <button
                    onClick={handleDownloadClick}
                    className="w-full sm:w-auto py-3 px-8 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300"
                  >
                    Download
                  </button>
              )}
            </div>
            {error && <p className="text-red-400 text-center mt-6">{error}</p>}
          </div>
          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">The Smartest Way to Create Line Drawings</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">LineArtify offers an unmatched free online tool for artists, designers, and enthusiasts to convert any picture into clean line art.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-cyan-400 mb-2">Instant & Free</h3><p className="text-gray-300">Convert unlimited images to line drawings online. No fees, no sign-up, just pure creative power.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-cyan-400 mb-2">AI-Powered Precision</h3><p className="text-gray-300">Our advanced AI intelligently identifies and extracts the key lines from your photo for a crisp, clean result.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-cyan-400 mb-2">Simple for Everyone</h3><p className="text-gray-300">No software or skills needed. The intuitive interface makes photo to line art conversion effortless.</p></div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-cyan-400 mb-2">Unleash Creativity</h3><p className="text-gray-300">Perfect for creating coloring pages, tattoo stencils, project outlines, or unique digital art.</p></div>
                  </div>
              </section>
              <section className="mt-20 text-center">
                   <h2 className="text-3xl font-bold mb-4">Generate Line Art from a Photo in Seconds</h2>
                   <p className="max-w-3xl mx-auto text-gray-400 mb-12">Our process is streamlined to give you a perfect line drawing with minimal effort.</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                       <div className="bg-gray-800/50 p-6 rounded-lg">
                          <p className="text-cyan-400 font-bold text-lg mb-2">Step 1: Upload Your Photo</p>
                          <p className="text-gray-300">Drag and drop or click to select any image from your device. High-contrast pictures work best!</p>
                       </div>
                        <div className="bg-gray-800/50 p-6 rounded-lg">
                          <p className="text-cyan-400 font-bold text-lg mb-2">Step 2: Choose a Style</p>
                          <p className="text-gray-300">Select your preferred style—'Simple' for clean outlines or 'Complex' for more detail—and click the 'Create Line Art' button.</p>
                       </div>
                        <div className="bg-gray-800/50 p-6 rounded-lg">
                          <p className="text-cyan-400 font-bold text-lg mb-2">Step 3: Download & Use</p>
                          <p className="text-gray-300">Your new line drawing will appear in moments. Download it in high quality and use it in any project you can imagine.</p>
                       </div>
                   </div>
              </section>
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">Common Questions about our Line Art Converter</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-cyan-400 mb-2">{faq.question}</h3>
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

export default LineArtifyPage;
