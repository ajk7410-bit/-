
import React, { useState, useCallback } from 'react';
import ImageUploader from './ImageUploader.tsx';

interface SetupScreenProps {
  onImagesReady: (images: string[]) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onImagesReady }) => {
  const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);

  const handleImageUpload = useCallback((index: number, imageDataUrl: string) => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages[index] = imageDataUrl;
      return newImages;
    });
  }, []);

  const allImagesUploaded = images.every(img => img !== null);

  const handleStart = () => {
    if (allImagesUploaded) {
      onImagesReady(images as string[]);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-2 font-serif text-pink-300">Anniversary Code Breaker</h1>
      <p className="text-center text-slate-400 mb-8">Upload a special photo for each stage's hint.</p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {images.map((img, index) => (
          <ImageUploader key={index} index={index} onImageUpload={handleImageUpload} />
        ))}
      </div>

      <button
        onClick={handleStart}
        disabled={!allImagesUploaded}
        className="w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-pink-500/30 disabled:shadow-none"
      >
        Start Game
      </button>
    </div>
  );
};

export default SetupScreen;