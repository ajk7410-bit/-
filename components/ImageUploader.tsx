
import React, { useState, useRef } from 'react';
import { UploadIcon, ImageIcon } from './Icons.tsx';

interface ImageUploaderProps {
  index: number;
  onImageUpload: (index: number, imageDataUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ index, onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        onImageUpload(index, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <div
        onClick={handleAreaClick}
        className="w-full aspect-square bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 hover:bg-slate-700 transition-all duration-300"
      >
        {imagePreview ? (
          <img src={imagePreview} alt={`Hint preview ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="text-center text-slate-400">
            <ImageIcon className="w-10 h-10 mx-auto mb-2" />
            <span className="text-sm font-semibold">Hint {index + 1}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;