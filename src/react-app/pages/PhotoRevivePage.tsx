// الملف: PhotoRevivePage.tsx
import { useState, useRef } from 'react';

// --- الثوابت العامة ---
const faqData = [
  {
    question: 'How does AI photo restoration work?',
    answer: 'Our AI model has been trained on thousands of photos to recognize common types of damage like scratches, creases, fading, and noise. It intelligently reconstructs the damaged areas and enhances the overall quality to restore the photo as close to its original state as possible.'
  },
  {
    question: 'Can this tool fix heavily damaged or blurry old photos?',
    answer: 'It can make a significant improvement! For photos with scratches, fading, or moderate damage, the results are often excellent. For severely blurry or photos with missing sections, the AI will do its best to enhance clarity and repair what it can, but results may vary.'
  },
  {
    question: 'Is this photo repair tool completely free to use?',
    answer: 'Yes, 100%. PhotoRevive AI is free, with no limits on the number of photos you can restore. We believe everyone should be able to preserve their precious memories without a paywall.'
  },
  {
    question: 'What file formats can I upload?',
    answer: 'You can upload most standard image formats, including JPG, PNG, and WEBP. For best results, we recommend using the highest quality scan or digital copy of your old photo that you have.'
  },
];

function PhotoRevivePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultImageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setRestoredImage(null);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRestorePhoto = async () => {
    if (!selectedFile) {
      setError('Please upload a photo to restore.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setRestoredImage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const response = await fetch('/api/tools?tool=photo-restoration', {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'The server failed to process the image.');
        }

        const result = await response.json();
        
        // Note: The API returns 'sketch_image_base64', we'll use it for the restored image
        if (result.sketch_image_base64) {
             setRestoredImage(result.sketch_image_base64);
        } else {
            throw new Error('The AI could not process the image. Please try a different photo.');
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
    link.download = `restored_photo_from_aiconvert.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <title>Free AI Photo Restoration Online | Restore & Repair Old Photos</title>
      <meta name="description" content="Breathe new life into your memories. Our free AI photo restoration tool automatically repairs old, damaged, and faded photos. Fix scratches, enhance quality, and restore old photos online." />
      <link rel="canonical" href="https://aiconvert.online/restore-and-repair-old-photos" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/restore-and-repair-old-photos" />
      
      <div className="pt-24 bg-gray-900 text-white min-h-screen">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-cyan-500">
              PhotoRevive: AI Photo Restoration
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              Don't let your memories fade away. Upload scratched, damaged, or old family pictures and let our AI restore their original glory for free.
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* "Before" Column */}
              <div className="w-full flex flex-col items-center">
                <h3 className="text-xl font-semibold text-gray-300 mb-4">Before</h3>
                <div className="w-full h-80 bg-gray-800 rounded-lg flex items-center justify-center p-2 border-2 border-dashed border-gray-600">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Old or damaged photo before restoration" className="max-w-full max-h-full object-contain rounded-md" />
                  ) : (
                    <div className="text-center text-gray-500 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <p>Upload your old photo here</p>
                    </div>
                  )}
                </div>
              </div>
              {/* "After" Column */}
              <div className="w-full flex flex-col items-center">
                <h3 className="text-xl font-semibold text-gray-300 mb-4">After</h3>
                <div className="w-full h-80 bg-black/20 rounded-lg flex items-center justify-center p-2 border-2 border-dashed border-cyan-500/50">
                   {isLoading && (
                   <div className="text-center">
                       <p className="text-lg text-amber-300">Reviving your memory...</p>
                       <p className="text-sm text-gray-400">This may take up to a minute.</p>
                   </div>
                  )}
                  {!isLoading && restoredImage && (
                    <img ref={resultImageRef} src={restoredImage} alt="AI restored photo" className="max-w-full max-h-full object-contain rounded-md" />
                  )}
                   {!isLoading && !restoredImage && (
                   <div className="text-center text-gray-500">
                       <p>Your restored photo will appear here</p>
                   </div>
                  )}
                  {error && <p className="text-red-400 text-center p-4">{error}</p>}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col items-center justify-center gap-6">
                 <div className="flex items-center gap-4">
                     <label htmlFor="file-upload" className="w-full sm:w-auto cursor-pointer py-3 px-8 text-lg font-bold text-gray-800 bg-amber-400 rounded-lg hover:bg-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300">
                        {selectedFile ? 'Change Photo' : 'Upload Photo'}
                    </label>
                    <input id="file-upload" ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  <button
                    onClick={handleRestorePhoto}
                    disabled={isLoading || !selectedFile}
                    className="w-full sm:w-auto py-3 px-8 text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-cyan-600 rounded-lg hover:from-amber-600 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? 'Restoring...' : 'Restore Photo'}
                  </button>
                </div>
                {restoredImage && !isLoading && (
                 <button
                    onClick={handleDownload}
                    className="w-full sm:w-auto py-3 px-8 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
                  >
                    Download Restored Photo
                  </button>
              )}
            </div>
          </div>

          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Give Your Old Photos a Second Life</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">
                    Our AI-powered photo repair tool is trained to understand and fix common issues in old pictures, from physical damage to the effects of time.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-amber-400 mb-2">Remove Scratches & Tears</h3>
                          <p className="text-gray-300">Intelligently erase cracks, scratches, and creases that mar your precious family pictures.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-amber-400 mb-2">Enhance Quality</h3>
                          <p className="text-gray-300">Improve sharpness and clarity in blurry or out-of-focus old photos, revealing details you thought were lost.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-amber-400 mb-2">Fix Faded Colors</h3>
                          <p className="text-gray-300">Bring back the vibrancy to faded photographs, correcting colors to make them look as good as new.</p>
                      </div>
                      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-bold text-amber-400 mb-2">Free & Secure</h3>
                          <p className="text-gray-300">Restore unlimited photos for free. Your images are processed securely and are never stored.</p>
                      </div>
                  </div>
              </section>

              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                  <div className="space-y-4">
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

export default PhotoRevivePage;
