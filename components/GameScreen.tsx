
import React, { useState, useRef, useEffect } from 'react';
import type { Puzzle } from '../types.ts';
import HintModal from './HintModal.tsx';
import { LockIcon, LightbulbIcon } from './Icons.tsx';

interface GameScreenProps {
  puzzle: Puzzle;
  onSuccess: () => void;
  currentStage: number;
  totalStages: number;
  onCustomFail?: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ puzzle, onSuccess, currentStage, totalStages, onCustomFail }) => {
  const codeLength = puzzle.answer.length;
  const inputType = puzzle.type || 'numeric';
  
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(''));
  const [error, setError] = useState<boolean>(false);
  const [isHintVisible, setIsHintVisible] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, codeLength);
    setCode(Array(codeLength).fill(''));
    inputRefs.current[0]?.focus();
  }, [puzzle, codeLength]);

  const handleChange = (index: number, value: string) => {
    const validationRegex = inputType === 'numeric' ? /^\d*$/ : /^[a-zA-Z]*$/;
    if (!validationRegex.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = code.join('');

    if (puzzle.id === 2 && enteredCode.toLowerCase() === 'shadow' && onCustomFail) {
      onCustomFail();
      return;
    }

    const isCorrect = inputType === 'numeric'
      ? enteredCode === puzzle.answer
      : enteredCode.toLowerCase() === puzzle.answer.toLowerCase();

    if (isCorrect) {
      onSuccess();
    } else {
      setError(true);
      setCode(Array(codeLength).fill(''));
      inputRefs.current[0]?.focus();
      setTimeout(() => setError(false), 800);
    }
  };

  const gap = codeLength > 4 ? 'gap-2' : 'gap-3';
  const inputSizeClasses = codeLength > 4 ? 'w-14 h-16 text-3xl' : 'w-16 h-20 text-4xl';

  const baseInputClasses = `bg-slate-700/50 border-2 rounded-lg text-center font-bold text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200`;
  const errorClasses = `animate-shake border-red-500`;

  return (
    <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700 animate-fade-in">
      <div className="absolute top-4 left-4 bg-pink-500/20 text-pink-300 text-sm font-bold px-3 py-1 rounded-full">
        {currentStage} / {totalStages}
      </div>
      <div className="text-center mb-8 pt-8">
        <h2 className="text-2xl font-serif font-bold mb-4 text-slate-200">{puzzle.question}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={`flex justify-center items-center mb-8 ${gap}`}>
          <LockIcon className="w-8 h-8 text-slate-500 mr-1" />
          {Array.from({ length: codeLength }).map((_, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el; }}
              type={inputType === 'numeric' ? 'tel' : 'text'}
              inputMode={inputType === 'numeric' ? 'numeric' : 'text'}
              autoCapitalize={inputType === 'alpha' ? 'characters' : 'off'}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              maxLength={1}
              value={code[index] || ''}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className={`${baseInputClasses} ${inputSizeClasses} ${inputType === 'alpha' ? 'uppercase' : ''} ${error ? errorClasses : 'border-slate-600'}`}
              required
            />
          ))}
        </div>
        <button type="submit" className="w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 transition-all duration-300 shadow-lg shadow-pink-500/30">
          Unlock
        </button>
      </form>

      <button 
        onClick={() => setIsHintVisible(true)}
        className="absolute bottom-5 right-5 w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 hover:bg-yellow-300 transition-transform duration-300 hover:scale-110 shadow-lg shadow-yellow-500/30"
        aria-label="Show Hint"
        >
        <LightbulbIcon className="w-7 h-7" />
      </button>

      <HintModal 
        isOpen={isHintVisible} 
        onClose={() => setIsHintVisible(false)} 
        imageUrl={puzzle.hintImage}
        hintText={puzzle.hintText}
      />
    </div>
  );
};

export default GameScreen;