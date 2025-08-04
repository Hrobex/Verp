import { useState, useRef, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

// --- Data Constants ---

const faqData = [
    {
        question: 'How does the AI turn my photo into a cartoon?',
        answer: 'Our AI has been trained on thousands of cartoon images. It analyzes the key features of your photo—like shapes and lines—and then redraws them in a classic, 2D cartoon style. It simplifies details to create that fun, "toon" look.'
    },
    {
        question: 'Is Cartoonify completely free to use?',
        answer: 'Yes, 100%! You can transform as many photos as you want without any cost, usage limits, or the need to sign up. Our goal is to make this fun tool accessible to everyone.'
    },
    {
        question: 'What is the difference between Cartoonify and DigiCartoony?',
        answer: (
            <>
                Think of them as two different artists. <strong>Cartoonify</strong> is like a classic comic book artist, quickly turning your photo into a fun, 2D-style cartoon with bold lines—perfect for a "toon" version of yourself. 
                <Link to="https://aiconvert.online/cartoony-art/" className="text-teal-400 underline">DigiCartoony</Link>, on the other hand, is like a 3D movie animator, transforming your photo into a detailed piece of digital art with depth and a "Pixar-style" aesthetic.
            </>
        )
    },
    {
        question: 'What happens to my uploaded photos?',
        answer: 'We prioritize your privacy. Your photos are uploaded securely to our servers for processing and are automatically deleted after a short period. We do not store, share, or use your images for any other purpose.'
    },
];

// دالة مساعدة لتحويل الصورة إلى صيغة Base64
async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

function CartoonifyPage() {
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

  const handleCartoonifyClick = async () => {
    if (!sourceFile) {
      setError('Please upload an image to cartoonify.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImageUrl(null);

    try {
        // تحويل الصورة إلى Base64 لإرسالها
        const base64Image = await fileToBase64(sourceFile);

        // استدعاء الواجهة الخلفية الآمنة
        const response = await fetch('/api/cartoonify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imageData: base64Image,
                mimeType: sourceFile.type,
                filename: sourceFile.name,
            }),
        });

        if (response.ok) {
            // الواجهة الخلفية الآن تعيد الصورة مباشرة
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setResultImageUrl(imageUrl);
        } else {
            // محاولة قراءة الخطأ كـ JSON، وإلا عرض رسالة عامة
            const errorData = await response.json().catch(() => ({ error: 'Oops! Something went wrong.' }));
            setError(errorData.error || 'Please try again later.');
        }
    } catch (err) {
      setError('An unknown error occurred. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (!resultImageUrl) return;
    const link = document.createElement('a');
    link.href = resultImageUrl;
    link.download = 'cartoonified-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
    <>
      <title>Cartoonify Yourself Free | AI Photo to Cartoon Generator</title>
      <meta name="description" content="Turn your photo into a cartoon with our free AI cartoonizer. Instantly cartoonify yourself online without any sign-up. Upload your picture and get a toon version in seconds!" />
      <link rel="canonical" href="https://aiconvert.online/cartoonify" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/cartoonify" />
      {/* <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/cartoonify" /> */}
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/cartoonify" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "name": "Cartoonify: AI Photo to Cartoon",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "description": "A free online tool that uses AI to instantly convert photos into 2D-style cartoons.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "ratingCount": "4510"
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-600">
              Cartoonify Yourself Instantly
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Transform your pictures into fun 2D cartoons with our free AI photo to cartoon generator. Upload an image and get your toon version in just one click!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* --- Controls Column --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6 items-center">
              <h2 className="text-2xl font-bold text-center">Upload Your Photo</h2>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileSelect} 
                ref={sourceFileInputRef} 
                className="hidden" 
              />
              <div 
                onClick={() => sourceFileInputRef.current?.click()} 
                className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-700/50 transition-colors bg-cover bg-center"
                style={{ backgroundImage: `url(${sourcePreview})` }}
              >
                {!sourcePreview && <p className="text-gray-400">Click to select an image</p>}
              </div>

              <button
                onClick={handleCartoonifyClick}
                disabled={isLoading || !sourceFile}
                className="w-full mt-4 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-rose-500 to-purple-600 rounded-lg hover:from-rose-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-rose-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Cartoonifying...' : 'Cartoonify!'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* --- Output Column --- */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg flex flex-col justify-center items-center relative min-h-[28rem]">
              {isLoading && (
                  <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-2xl">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-500"></div>
                    <p className="text-gray-300 mt-4">AI is working its magic...</p>
                  </div>
              )}
              
              <div className="w-full h-full flex flex-col justify-center items-center">
                {resultImageUrl ? (
                  <>
                    <img src={resultImageUrl} alt="Cartoonified Result" className="max-h-96 max-w-full object-contain rounded-lg"/>
                    <button onClick={handleDownloadClick} className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all">
                      Download Image
                    </button>
                  </>
                ) : (
                  <p className="text-gray-400 text-center">Your cartoon version will appear here</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Why Use Our AI Cartoonizer?</h2>
                  <p className="max-w-3xl mx-auto text-gray-400 mb-12">In a sea of editors, our tool stands out by being incredibly simple, fast, and completely free. No strings attached.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-rose-400 mb-2">Instant Results</h3><p className="text-gray-300">Get your cartoon picture in seconds. Our AI is optimized for speed and quality.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-rose-400 mb-2">Classic Toon Style</h3><p className="text-gray-300">We specialize in the fun, 2D cartoon look that's perfect for profile pictures and social media posts.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-rose-400 mb-2">No Sign-Up Needed</h3><p className="text-gray-300">We respect your time. Jump right into cartoonifying without the hassle of registration.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-rose-400 mb-2">Completely Free</h3><p className="text-gray-300">Enjoy unlimited cartoon conversions. No hidden fees, no subscriptions, no watermarks.</p></div>
                  </div>
              </section>

              <section className="mt-20 text-center">
                   <h2 className="text-3xl font-bold mb-4">From Photo to Cartoon in 3 Simple Steps</h2>
                   <p className="max-w-3xl mx-auto text-gray-400 mb-12">Our intuitive process makes it easy for anyone to get a high-quality cartoon version of their photo.</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-rose-400 font-bold text-lg mb-2">1. Upload Your Photo</p><p className="text-gray-300">Click the upload area and select any image from your device. It can be a portrait, a group photo, or even a pet!</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-rose-400 font-bold text-lg mb-2">2. Click 'Cartoonify!'</p><p className="text-gray-300">Hit the button and let our AI do the heavy lifting. The conversion process starts immediately.</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-rose-400 font-bold text-lg mb-2">3. Download & Share</p><p className="text-gray-300">In just a few moments, your new cartoon picture will be ready to download and share with your friends and followers.</p></div>
                   </div>
              </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-rose-400 mb-2">{faq.question}</h3>
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

export default CartoonifyPage;
