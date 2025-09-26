import React from 'react';
import Spinner from './Spinner';
import { DownloadIcon } from './Icons';

interface ResultDisplayProps {
  generatedImage: string | null;
  isLoading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImage, isLoading }) => {
  if (!isLoading && !generatedImage) {
    return null; // Don't render anything if there's no activity
  }

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    const mimeType = generatedImage.split(';')[0].split(':')[1];
    const extension = mimeType ? mimeType.split('/')[1] : 'png';
    link.download = `hug-image.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="w-full max-w-4xl mt-8">
      <h2 className="text-2xl font-bold text-center mb-4 text-indigo-300">النتيجة</h2>
      <div className="bg-gray-800/50 rounded-lg p-4 min-h-[300px] flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center text-gray-300">
            <Spinner />
            <p className="mt-4 text-lg">يتم الآن صنع السحر... قد يستغرق هذا بضع لحظات.</p>
          </div>
        ) : (
          generatedImage && (
            <div className="flex flex-col items-center gap-4">
              <img 
                src={generatedImage} 
                alt="الصورة المُنشأة" 
                className="max-w-full max-h-[70vh] rounded-lg shadow-2xl" 
              />
              <button
                onClick={handleDownload}
                className="mt-4 flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <DownloadIcon />
                حفظ الصورة
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;