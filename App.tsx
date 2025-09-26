
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import BackgroundSelector from './components/BackgroundSelector';
import { generateHugImage } from './services/geminiService';
import { fileToGenerativePart } from './utils/fileUtils';
import type { FileDetails } from './types';
import { SparklesIcon } from './components/Icons';

// Define background options
const backgroundOptions = [
  { id: 'white_curtain', label: 'ستار أبيض', promptValue: 'replace the background with a white curtain' },
  { id: 'studio', label: 'استوديو احترافي', promptValue: 'replace the background with a professional photo studio backdrop with soft, diffused lighting' },
  { id: 'beach', label: 'شاطئ عند الغروب', promptValue: 'replace the background with a beautiful, romantic beach at sunset' },
  { id: 'abstract', label: 'خلفية فنية', promptValue: 'replace the background with a soft, abstract, out-of-focus colorful bokeh background' },
];


function App() {
  const [image1, setImage1] = useState<FileDetails | null>(null);
  const [image2, setImage2] = useState<FileDetails | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string>('white_curtain');

  const handleImage1Change = (file: File | null) => {
    if (file) {
      setImage1({ file, preview: URL.createObjectURL(file) });
    } else {
      setImage1(null);
    }
  };

  const handleImage2Change = (file: File | null) => {
    if (file) {
      setImage2({ file, preview: URL.createObjectURL(file) });
    } else {
      setImage2(null);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!image1 || !image2) {
      setError("الرجاء رفع الصورتين للمتابعة.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imagePart1 = await fileToGenerativePart(image1.file);
      const imagePart2 = await fileToGenerativePart(image2.file);
      
      const selectedOption = backgroundOptions.find(opt => opt.id === selectedBackground);
      const backgroundPrompt = selectedOption ? selectedOption.promptValue : 'replace the background with a white curtain';

      const prompt = `Keep both faces unchanged, but make it look as if the two characters are hugging naturally. Add a light haze and flash-like lighting. Then, ${backgroundPrompt}. The final image should be photorealistic.`;

      const result = await generateHugImage(imagePart1, imagePart2, prompt);
      setGeneratedImage(result);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  }, [image1, image2, selectedBackground]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <p className="text-center text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
          حوّل صورك إلى ذكرى دافئة. ارفع صورتك وصورة من تحب، ودع الذكاء الاصطناعي يصنع لكم صورة عناق لا تُنسى.
        </p>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ImageUploader
            id="image1"
            label="صورتك الشخصية"
            onImageChange={handleImage1Change}
            preview={image1?.preview}
          />
          <ImageUploader
            id="image2"
            label="صورة من تحب"
            onImageChange={handleImage2Change}
            preview={image2?.preview}
          />
        </div>
        
        <BackgroundSelector
          options={backgroundOptions}
          selectedValue={selectedBackground}
          onChange={setSelectedBackground}
        />
        
        <div className="w-full max-w-md flex flex-col items-center mb-8">
            <button
                onClick={handleSubmit}
                disabled={!image1 || !image2 || isLoading}
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
                <SparklesIcon />
                {isLoading ? 'جاري إنشاء الصورة...' : 'اصنع صورة العناق'}
            </button>
        </div>

        {error && <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative w-full max-w-4xl" role="alert">
            <strong className="font-bold">خطأ! </strong>
            <span className="block sm:inline">{error}</span>
        </div>}
        
        <ResultDisplay generatedImage={generatedImage} isLoading={isLoading} />
        
      </main>
      <Footer />
    </div>
  );
}

export default App;
