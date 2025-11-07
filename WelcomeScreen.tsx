import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-10 text-center shadow-2xl border border-slate-700 animate-fade-in-scale">
      <div className="text-pink-300 text-6xl mb-4">💖</div>
      <h1 className="text-4xl font-bold font-serif mb-2 text-pink-300">600일 기념 이벤트</h1>
      <p className="text-slate-300 mb-8 text-lg">재밌고 행복한 추억을 만들자</p>
      <button
        onClick={onStart}
        className="bg-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-600 transition-all duration-300 shadow-lg shadow-pink-500/30"
      >
        시작하기
      </button>
    </div>
  );
};

export default WelcomeScreen;
