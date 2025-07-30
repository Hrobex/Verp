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
          onDragLeave={(e) => e.currentTarget.classList.remove('border-purple-500')}
          className="w-full h-full border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors"
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
    e.currentTarget.classList.remove('border-purple-500');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-purple-500');
  };
  
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

      const response = await fetch('https://asartb-lld.hf.space/predict/', {
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
    <div className="pt-24 bg-gray-900 text-white min-h-screen">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            LineArtify: AI Photo to Sketch Converter
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Upload your photo and watch our AI transform it into a clean, beautiful line drawing instantly.
          </p>
        </div>

        {/* Main Tool Area */}
        <div className="bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side: Upload */}
            <ImageUploadBox
              title="Original Photo"
              imageSrc={sourcePreview}
              onFileChange={onFileInputChange}
              onDrop={onDrop}
              onDragOver={onDragOver}
            />

            {/* Right Side: Result */}
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
                  <p className="text-center text-gray-500">Your sketch will appear here</p>
                )}
                {resultImage && !isLoading && (
                  <img src={resultImage} alt="Result" className="max-w-full max-h-full object-contain rounded-md" />
                )}
              </div>
            </div>
          </div>

          {/* Controls and Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
            
            {/* Version Selector */}
            <div className="flex items-center gap-4">
                <span className="font-medium text-gray-300">Model Version:</span>
                <div className="flex gap-2">
                    <button onClick={() => setVersion('v1')} className={`px-4 py-2 rounded-md transition-colors ${version === 'v1' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>V1</button>
                    <button onClick={() => setVersion('v2')} className={`px-4 py-2 rounded-md transition-colors ${version === 'v2' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>V2</button>
                </div>
            </div>

            {/* Convert Button */}
            <button
              onClick={handleConvertClick}
              disabled={isLoading || !sourceFile}
              className="w-full sm:w-auto py-3 px-8 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? 'Converting...' : 'Convert to Sketch'}
            </button>
            
            {/* Download Button */}
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
        
        {/* Placeholder for SEO content to be added later */}
        {/* <div className="mt-24"> ... </div> */}
      </main>
    </div>
  );
}

export default LineArtifyPage;
