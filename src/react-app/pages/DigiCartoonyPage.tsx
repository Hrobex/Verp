// الملف: FaceMergePage.tsx (النسخة الجديدة والآمنة)
import { useState, useRef, ChangeEvent } from 'react';

// --- Data Constants ---
// تم حذف `apiEndpoint` السري من هنا.
const creativeIdeas = [
  { title: 'Historical Mashups', description: 'Place your face onto a famous historical portrait or photograph.' },
  { title: 'Movie Star Fun', description: 'Swap faces with your favorite actor in an iconic movie scene.' },
  { title: 'Friend & Family Mix', description: 'Create hilarious combinations by merging faces of friends and family.' },
  { title: 'Artistic Creations', description: 'Use face merge to create unique and surreal digital art projects.' },
];

const ethicalGuidelines = [
  { title: 'Use Responsibly', description: 'Employ the tool with respect for the privacy and personal rights of others.' },
  { title: 'Avoid Misuse', description: 'Refrain from using the tool in abusive ways, such as for deception, bullying, or insulting others.' },
  { title: 'Respect Privacy', description: 'Do not use or share images of individuals without their proper consent.' },
];

const faqData = [
    { question: 'What is AI face swapping and how does it work?', answer: 'AI face swapping is a technology that uses artificial intelligence to replace a face in one image with a face from another. It works by analyzing the key facial features in the source image and seamlessly blending them onto the target image.' },
    { question: 'Can I swap faces online for free?', answer: 'Yes, Mergify is a completely free online AI face swap tool. It allows you to merge and swap faces in images without any sign-up or credit card required.' },
    { question: 'Is Mergify suitable for swapping faces in group photos?', answer: 'Yes, our tool is designed to work with group photos. Simply upload your source and destination images and specify the number of the person (from left to right) in each photo to ensure the correct faces are swapped.' },
    { question: 'What are the benefits of using AI for face swapping?', answer: 'AI technology provides highly realistic and seamless results. It intelligently analyzes lighting, angles, and expressions to make the final merged image look natural and convincing.' },
    { question: 'Are there any limitations to using Mergify?', answer: 'Mergify does not impose any limits on the number of images you can process. For the best results, use clear, front-facing photos where faces are not obscured.' },
    { question: 'What are the privacy implications of using Mergify?', answer: 'We prioritize your privacy. All uploaded images are processed on our servers and are automatically deleted after a short period. We do not store or share your images.' },
    { question: 'What is the license for the AI model used in this tool?', answer: 'The model is governed by the Responsible AI License (creativeml-openrail-m), which allows for a wide range of uses as long as they adhere to the specific use-case restrictions outlined in the license to prevent harmful applications. You can read the full license for details.'},
];

// --- React Component ---
function FaceMergePage() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [destinationFile, setDestinationFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [destinationPreview, setDestinationPreview] = useState<string | null>(null);
  
  const [sourcePersonNumber, setSourcePersonNumber] = useState('1');
  const [destinationPersonNumber, setDestinationPersonNumber] = useState('1');

  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sourceFileInputRef = useRef<HTMLInputElement>(null);
  const destinationFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>, type: 'source' | 'destination') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'source') {
          setSourceFile(file);
          setSourcePreview(result);
        } else {
          setDestinationFile(file);
          setDestinationPreview(result);
        }
      };
      reader.readAsDataURL(file);
      setResultImageUrl(null);
      setError(null);
    }
  };

  const handleMergeClick = async () => {
    if (!sourceFile || !destinationFile) {
      setError('Please upload both a source and a destination image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImageUrl(null);

    const formData = new FormData();
    formData.append('source_file', sourceFile);
    formData.append('destination_file', destinationFile);
    formData.append('source_face_index', sourcePersonNumber);
    formData.append('destination_face_index', destinationPersonNumber);
    
    try {
      // تم تغيير هذا السطر فقط للاتصال بالـ API الداخلي الآمن
      const response = await fetch('/api/face-merge', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Face swapping failed. Please check your images and try again.');
      }
      
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setResultImageUrl(imageUrl);

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
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
