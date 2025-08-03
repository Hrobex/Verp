import { useState, useRef } from 'react';

function PromptigenPage() {
  // --- State Management ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Event Handlers ---

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePrompt = async () => {
    if (!selectedFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');
    let imageUrl = '';

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const uploadResponse = await fetch('https://image.pollinations.ai/upload', {
        method: 'POST',
        body: formData,
      });
      if (!uploadResponse.ok) {
        throw new Error(`Image upload failed with status: ${uploadResponse.status}`);
      }
      const uploadResult = await uploadResponse.json();
      imageUrl = uploadResult.url || uploadResult.ipfs_url;
      if (!imageUrl) {
          throw new Error('Could not retrieve a public URL for the uploaded image.');
      }
    } catch (err) {
      console.error("Image Upload Error:", err);
      setError('Failed to prepare the image for analysis. Please try again.');
      setIsLoading(false);
      return;
    }
    
    try {
      const payload = {
        model: "claude-hybridspace",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image and generate a detailed, descriptive prompt suitable for an AI image generator like Midjourney or Stable Diffusion. Focus on describing the main subjects, the environment, the art style (e.g., photograph, digital painting), lighting, colors, and overall mood."
              },
              {
                type: "image_url",
                image_url: { url: imageUrl }
              }
            ]
          }
        ]
      };
      const promptResponse = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!promptResponse.ok) {
         throw new Error(`The AI model failed with status: ${promptResponse.status}`);
      }
      const promptResult = await promptResponse.json();
      const promptText = promptResult.choices[0].message.content;
      setGeneratedPrompt(promptText);
    } catch (err: any) {
       console.error("Prompt Generation Error:", err);
       setError(err.message || 'An unknown error occurred during prompt generation.');
    } finally {
       setIsLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt)
      .then(() => {
        // You can add a "Copied!" confirmation message here if you like
      })
      .catch(err => { // FIXED: The 'err' variable is now used
        console.error('Failed to copy prompt:', err); 
        setError('Failed to copy prompt to clipboard.');
      });
  };

  // --- JSX ---
  return (
    <>
      <title>Promptigen: AI Image to Prompt Generator</title>
      <meta name="description" content="Turn any image into a detailed descriptive prompt. Use our free AI tool to analyze a picture and generate the perfect text prompt for AI image generators." />
      <link rel="canonical" href="https://aiconvert.online/promptigen" />
      {/* Add other meta/link tags as needed */}

      <div className="pt-24 bg-gray-900 text-white min-h-screen">
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Promptigen: AI Image to Prompt
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Upload any image and let our AI analyze it to generate a detailed, ready-to-use prompt for your favorite image generator.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* --- Controls Column --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-200 mb-2">1. Upload Your Image</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center cursor-pointer hover:border-purple-400 hover:bg-gray-700/50 transition"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Selected preview" className="max-w-full max-h-full object-contain rounded-md" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <p>Click to browse or drag & drop</p>
                      <p className="text-sm">PNG, JPG, or WEBP</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleGeneratePrompt}
                disabled={isLoading || !selectedFile}
                className="w-full mt-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg hover:from-purple-600 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isLoading ? 'Analyzing Image...' : 'Generate Prompt'}
              </button>
              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </div>

            {/* --- Output Column --- */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center min-h-[24rem]">
              <div className="w-full h-full flex flex-col">
                <label className="block text-lg font-semibold text-gray-200 mb-2">Generated Prompt</label>
                <textarea
                  readOnly
                  value={isLoading ? "The AI is thinking..." : generatedPrompt}
                  placeholder="Your generated prompt will appear here..."
                  className="w-full flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg resize-none"
                />
                {generatedPrompt && !isLoading && (
                  <button 
                    onClick={handleCopyPrompt}
                    className="w-full mt-4 py-2 px-4 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all"
                  >
                    Copy to Clipboard
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Your additional content will go here */}
          
        </main>
      </div>
    </>
  );
}

export default PromptigenPage;
