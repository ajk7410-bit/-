import React from 'react';

interface MissionScreenProps {
  icon: string;
  title: string;
  message: string;
  buttonText: string;
  onComplete: () => void;
}

const MissionScreen: React.FC<MissionScreenProps> = ({ icon, title, message, buttonText, onComplete }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-10 text-center shadow-2xl border border-slate-700 animate-fade-in-scale">
      <div className="text-yellow-300 text-6xl mb-4">{icon}</div>
      <h1 className="text-2xl font-bold font-serif mb-4 text-pink-300">{title}</h1>
      <p className="text-slate-300 mb-8 text-lg whitespace-pre-line">
        {message}
      </p>
      <button
        onClick={onComplete}
        className="bg-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-600 transition-all duration-300 shadow-lg shadow-pink-500/30"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default MissionScreen;
