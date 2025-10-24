import React from 'react';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  hintText?: string;
}

const HintModal: React.FC<HintModalProps> = ({ isOpen, onClose, imageUrl, hintText }) => {
  if (!isOpen) return null;

  const renderContent = () => {
    if (hintText) {
      return (
        <div className="p-8 text-center flex items-center justify-center h-full">
          <p className="text-2xl text-slate-200 font-serif whitespace-pre-line">{hintText}</p>
        </div>
      );
    }
    if (imageUrl) {
      return (
        <img 
          src={imageUrl} 
          alt="Hint" 
          className="w-full h-full object-contain" 
        />
      );
    }
    return (
      <div className="p-8 text-center flex items-center justify-center h-full">
        <p className="text-slate-400">No hint available for this puzzle.</p>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 p-2 rounded-xl shadow-2xl relative max-w-lg w-full m-4 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-slate-900/50 rounded-lg aspect-video w-full flex items-center justify-center overflow-hidden">
          {renderContent()}
        </div>
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-pink-500 rounded-full text-white font-bold flex items-center justify-center hover:bg-pink-600 transition-transform hover:scale-110"
          aria-label="Close hint"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default HintModal;