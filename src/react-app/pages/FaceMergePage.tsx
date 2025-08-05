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
      const response = await fetch('/api/tools?tool=face-merge',
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
      <title>Free AI Face Swap & Merge Online | Mergify AI Tool</title>
      <meta name="description" content="Swap and merge faces online for free with Mergify. Our AI face swapper lets you combine faces and put a face on another picture instantly. No sign-up required." />
      <link rel="canonical" href="https://aiconvert.online/ai-face-merge" />
      <link rel="alternate" hrefLang="en" href="https://aiconvert.online/ai-face-merge" />
      <link rel="alternate" hrefLang="ar" href="https://aiconvert.online/ar/ai-face-merge" />
      <link rel="alternate" hrefLang="x-default" href="https://aiconvert.online/ai-face-merge" />
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Mergify AI Face Swap",
            "operatingSystem": "WEB",
            "applicationCategory": "MultimediaApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "ratingCount": "2410"
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-600">
              Mergify: AI Face Merge & Swap Online
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Create hilarious and amazing photos by swapping faces with our free AI tool. Upload two images and let our AI seamlessly merge them for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Controls Column */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <h2 className="sr-only">Face Swap Tool</h2>

              <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">1. Upload Source Image (The Face)</h3>
                  <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, 'source')} ref={sourceFileInputRef} className="hidden" />
                  <div onClick={() => sourceFileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-700/50 transition">
                    {sourcePreview ? <img src={sourcePreview} alt="Source Preview" className="max-h-full max-w-full object-contain" /> : <p className="text-gray-400">Click to select source image</p>}
                  </div>
                  <div className="mt-2">
                    <label htmlFor="source-person" className="text-sm text-gray-400">Person's number (from left, starts at 1):</label>
                    <input id="source-person" type="number" min="1" value={sourcePersonNumber} onChange={(e) => setSourcePersonNumber(e.target.value)} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg"/>
                  </div>
              </div>

              <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">2. Upload Destination Image</h3>
                  <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, 'destination')} ref={destinationFileInputRef} className="hidden" />
                  <div onClick={() => destinationFileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-700/50 transition">
                    {destinationPreview ? <img src={destinationPreview} alt="Destination Preview" className="max-h-full max-w-full object-contain" /> : <p className="text-gray-400">Click to select destination image</p>}
                  </div>
                   <div className="mt-2">
                    <label htmlFor="dest-person" className="text-sm text-gray-400">Person's number (from left, starts at 1):</label>
                    <input id="dest-person" type="number" min="1" value={destinationPersonNumber} onChange={(e) => setDestinationPersonNumber(e.target.value)} className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded-lg"/>
                  </div>
              </div>

              <button
                onClick={handleMergeClick} disabled={isLoading || !sourceFile || !destinationFile}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-lg hover:from-purple-700 hover:to-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Swapping Faces...' : 'Swap Faces'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* Output Column */}
            <div className="bg-gray-800 p-4 rounded-2xl shadow-lg flex flex-col justify-center items-center relative min-h-[28rem]">
              {isLoading && (
                  <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-2xl">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-fuchsia-500"></div>
                    <p className="text-gray-300 mt-4">AI is performing the swap...</p>
                  </div>
              )}
              
              <div className="w-full h-full flex flex-col justify-center items-center">
                {resultImageUrl ? (
                  <>
                    <img src={resultImageUrl} alt="Merged Result" className="max-h-96 max-w-full object-contain rounded-lg"/>
                    <a href={resultImageUrl} download="merged-image.png" className="w-full mt-4 py-3 px-4 text-center text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all">
                      Download Image
                    </a>
                  </>
                ) : (
                  <p className="text-gray-400 text-center">Your swapped image will appear here</p>
                )}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="mt-24">
              <section className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Why Choose Mergify for Face Swapping?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-fuchsia-400 mb-2">Realistic Results</h3><p className="text-gray-300">Our deep swap AI creates seamless and natural-looking face merges that blend perfectly.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-fuchsia-400 mb-2">Fast and Free</h3><p className="text-gray-300">Generate unlimited face swaps quickly and without any cost. No subscriptions or hidden fees.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-fuchsia-400 mb-2">Privacy Focused</h3><p className="text-gray-300">Your images are processed securely and deleted automatically. We never store your data.</p></div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md"><h3 className="text-xl font-bold text-fuchsia-400 mb-2">Easy to Use</h3><p className="text-gray-300">A simple interface makes face swapping accessible to everyone, no technical skills required.</p></div>
                  </div>
              </section>

              <section className="mt-20">
                  <div className="text-center"><h2 className="text-3xl font-bold mb-4">How to Swap Faces in 3 Simple Steps</h2><p className="max-w-3xl mx-auto text-gray-400 mb-12">Follow this guide to create your perfect face merge in under a minute.</p></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-fuchsia-400 font-bold text-lg mb-2">1. Upload Source & Target</p><p className="text-gray-300">Select the 'Source Image' that contains the face you want to use. Then, upload the 'Destination Image' where the face will be placed.</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-fuchsia-400 font-bold text-lg mb-2">2. Specify the Person</p><p className="text-gray-300">In the input field below each image, enter the number of the person you want to swap, counting from left to right (e.g., 1, 2, 3...).</p></div>
                    <div className="bg-gray-800/50 p-6 rounded-lg"><p className="text-fuchsia-400 font-bold text-lg mb-2">3. Merge & Download</p><p className="text-gray-300">Click the "Merge Faces" button. The AI will process the images, and your final result will appear, ready to be downloaded.</p></div>
                  </div>
              </section>

              <section className="mt-20">
                  <div className="text-center"><h2 className="text-3xl font-bold mb-4">Unleash Your Creativity</h2><p className="max-w-3xl mx-auto text-gray-400 mb-12">Need some inspiration? Here are a few fun ideas to try with our AI face generator.</p></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {creativeIdeas.map((idea, index) => (
                          <div key={index} className="bg-gray-800/50 p-6 rounded-lg"><h3 className="text-lg font-semibold text-fuchsia-400 mb-2">{idea.title}</h3><p className="text-gray-300">{idea.description}</p></div>
                      ))}
                  </div>
              </section>
            
              <section className="mt-20 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                      {faqData.map((faq, index) => (
                          <div key={index} className="bg-gray-800 p-6 rounded-lg">
                              <h3 className="font-bold text-lg text-fuchsia-400 mb-2">{faq.question}</h3>
                              <div className="text-gray-300 leading-relaxed">{faq.answer}</div>
                          </div>
                      ))}
                  </div>
              </section>

              <section className="mt-20 max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Our Commitment to Responsible AI</h2>
                <p className="max-w-3xl mx-auto text-gray-400 mb-8">This tool is intended for creative and entertainment purposes. We are committed to ethical use and the prevention of misuse.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {ethicalGuidelines.map((guideline, index) => (
                    <div key={index} className="bg-gray-800/50 p-6 rounded-lg">
                      <h3 className="font-semibold text-fuchsia-400 mb-2">{guideline.title}</h3>
                      <p className="text-gray-300 text-sm">{guideline.description}</p>
                    </div>
                  ))}
                </div>
                 <p className="text-xs text-gray-400 mt-8">We adhere to all platform policies, including preserving user privacy and not compromising personal data. We do not endorse any usage that conflicts with these principles.</p>
              </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default FaceMergePage;
