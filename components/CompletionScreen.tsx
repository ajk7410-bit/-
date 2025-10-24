
import React from 'react';
import { CardKeyIcon } from './Icons';

interface CompletionScreenProps {
  onPlayAgain: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ onPlayAgain }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-10 text-center shadow-2xl border border-slate-700 animate-fade-in-scale">
      <div className="text-yellow-300 mb-6 flex justify-center">
        <CardKeyIcon className="w-20 h-20" />
      </div>
      <h1 className="text-lg font-sans mb-8 text-gray-100 leading-relaxed whitespace-pre-line">
        {"고생 많았어.\n그 카드키는 3059 호야.\n즐거운 시간 보내도록 해."}
      </h1>
      <button
        onClick={onPlayAgain}
        className="bg-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-600 transition-all duration-300 shadow-lg shadow-pink-500/30"
      >
        다시하기
      </button>
    </div>
  );
};

export default CompletionScreen;