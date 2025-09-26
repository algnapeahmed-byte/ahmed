
import React, { useRef, useState } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageChange: (file: File | null) => void;
  preview: string | null | undefined;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageChange, preview }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onImageChange(file || null);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    onImageChange(file || null);
    if(inputRef.current) {
        inputRef.current.files = event.dataTransfer.files;
    }
  };


  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-indigo-300">{label}</h2>
      <label
        htmlFor={id}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-400 bg-gray-700/50' : 'border-gray-600 hover:border-indigo-500 bg-gray-800/50'}`}
      >
        <input
          type="file"
          id={id}
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {preview ? (
          <img src={preview} alt="معاينة" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon />
            <p className="mt-2">انقر أو اسحب الصورة إلى هنا</p>
          </div>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;
