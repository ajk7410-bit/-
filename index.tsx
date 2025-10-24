import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// --- From types.ts ---
interface Puzzle {
  id: number;
  question: string;
  answer: string;
  type?: 'numeric' | 'alpha';
  hintText?: string;
  hintImage?: string;
}

type GamePhase = 'WELCOME' | 'PLAY' | 'MISSION_1' | 'MISSION_2' | 'MISSION_3' | 'COMPLETED' | 'MISSION_SHADOW_FAIL' | 'MISSION_1_CONFIRM' | 'MISSION_2_CONFIRM';

// --- From constants.ts ---
const PUZZLES: Puzzle[] = [
  {
    id: 1,
    question: "Q1. 시작",
    answer: "0410",
    type: "numeric",
    hintText: "우리의 연애는\n 이 날 시작되었지"
  },
  {
    id: 2,
    question: "Q2. 그림자의 선물",
    answer: "FLOWER",
    type: "alpha",
    hintImage: "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA1MjFfMjI0%2FMDAxNjUzMTAyNDE0MTc3.sahVt8C9UVYTt2TQXynpfYzofX6zD1bUkvXB5_-IHIsg.YKS-3uE_91A24Kp3UENx0IQgKexsv7wm756a9B5L07wg.JPEG.flowercafe-sister%2F%25C0%25CE%25C3%25B5_%25B2%25C9_%25C1%25FD_%25287%2529.jpg&type=sc960_832"
  },
  {
    id: 3,
    question: "Q3. 처음의 감동",
    answer: "240515",
    type: "numeric",
    hintImage: "https://images.unsplash.com/photo-1511883833203-94c74652a92?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    question: "Q4. 마지막 열쇠",
    answer: "0928",
    type: "numeric",
    hintImage: "https://images.unsplash.com/photo-1523438097982-f0c3d9f43026?q=80&w=2070&auto=format&fit=crop"
  }
];

// --- From components/Icons.tsx ---
const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);

const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-4.5c0-2.126-1.016-4.126-2.884-5.414A5.986 5.986 0 0 0 6 5.25a6.01 6.01 0 0 0 1.5 4.5m3 5.25a6.01 6.01 0 0 1-4.5 1.5a6.01 6.01 0 0 1-4.5-1.5m9 0a6.01 6.01 0 0 0-1.5-4.5c0-2.126 1.016-4.126 2.884-5.414A5.986 5.986 0 0 1 18 5.25a6.01 6.01 0 0 0-1.5 4.5m-9 0a6.01 6.01 0 0 0 4.5 1.5m0 0a6.01 6.01 0 0 0 4.5-1.5" />
  </svg>
);

const CardKeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
  </svg>
);


// --- From components/HintModal.tsx ---
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


// --- From components/GameScreen.tsx ---
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


// --- From components/CompletionScreen.tsx ---
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

// --- From components/MissionScreen.tsx ---
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

// --- From components/WelcomeScreen.tsx ---
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


// --- From App.tsx ---
const App: React.FC = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('WELCOME');
  const [currentStage, setCurrentStage] = useState(0);

  const handleStartGame = useCallback(() => {
    setGamePhase('PLAY');
  }, []);

  const handleCodeSuccess = useCallback(() => {
    switch (currentStage) {
      case 0:
        setGamePhase('MISSION_1');
        break;
      case 1:
        setGamePhase('MISSION_2');
        break;
      case 2:
        setGamePhase('MISSION_3');
        break;
      case PUZZLES.length - 1:
        setGamePhase('COMPLETED');
        break;
      default:
        // Fallback for any other stages
        if (currentStage < PUZZLES.length - 1) {
          setCurrentStage(prev => prev + 1);
        } else {
          setGamePhase('COMPLETED');
        }
    }
  }, [currentStage]);

  const handleMission1Complete = useCallback(() => {
    setGamePhase('MISSION_1_CONFIRM');
  }, []);

  const handleMission1Confirm = useCallback(() => {
    setCurrentStage(1);
    setGamePhase('PLAY');
  }, []);

  const handleMission2Complete = useCallback(() => {
    setGamePhase('MISSION_2_CONFIRM');
  }, []);

  const handleMission2Confirm = useCallback(() => {
    setCurrentStage(2);
    setGamePhase('PLAY');
  }, []);

  const handleMission3Complete = useCallback(() => {
    setCurrentStage(3);
    setGamePhase('PLAY');
  }, []);

  const handleShadowFail = useCallback(() => {
    setGamePhase('MISSION_SHADOW_FAIL');
  }, []);

  const handleReturnToPlay = useCallback(() => {
    setGamePhase('PLAY');
  }, []);


  const handlePlayAgain = useCallback(() => {
    setCurrentStage(0);
    setGamePhase('WELCOME');
  }, []);

  const renderContent = () => {
    switch (gamePhase) {
      case 'WELCOME':
        return <WelcomeScreen onStart={handleStartGame} />;
      case 'PLAY':
        const puzzle = PUZZLES[currentStage];
        if (!puzzle) {
            return <div className="text-center p-8">Error: Missing puzzle data. Please restart the game.</div>;
        }
        return (
          <GameScreen 
            puzzle={puzzle} 
            onSuccess={handleCodeSuccess} 
            onCustomFail={currentStage === 1 ? handleShadowFail : undefined}
            currentStage={currentStage + 1}
            totalStages={PUZZLES.length}
          />
        );
      case 'MISSION_1':
        return <MissionScreen
            icon="💌"
            title="정답이야!"
            message={"잘 기억하고 있구나!\n 그 답례로 광이가 커피를 사줄거야.\n 지금 ㅇㅇ카페로 가봐!"}
            buttonText="고마워! "
            onComplete={handleMission1Complete}
        />;
      case 'MISSION_1_CONFIRM':
        return <MissionScreen
            icon="☕"
            title="커피 타임"
            message={"커피 받고나서 아래 버튼 눌러줘"}
            buttonText="잘 받았어!"
            onComplete={handleMission1Confirm}
        />;
      case 'MISSION_2':
        return <MissionScreen
            icon="🎁"
            title="정답이야!"
            message={"그림자로 만들어진 어둠은\n 너에게 선물을 줄거야.\n\n 아래 주소지로 가봐 \n\n 서울 용산구 서빙고로 17\n 판매시설동 1001, JUREE"}
            buttonText="지금 당장 갈게!"
            onComplete={handleMission2Complete}
        />;
      case 'MISSION_2_CONFIRM':
        return <MissionScreen
            icon="💖"
            title="선물 확인"
            message={"선물 받고 난 후에 아래 버튼 눌러줘"}
            buttonText="고마워!"
            onComplete={handleMission2Confirm}
        />;
      case 'MISSION_3':
        return <MissionScreen
            icon="🔐"
            title="정답이야!"
            message={"어려웠을텐데 잘 풀어냈네.\n 이제 마지막 문제만 남았어.\n\n용산역 ㅇㅇ번 사물함을 열어봐.\n 비밀번호는 동일해."}
            buttonText="마지막 여정"
            onComplete={handleMission3Complete}
        />;
      case 'MISSION_SHADOW_FAIL':
        return <MissionScreen
            icon="🤔"
            title="그런 답은 너무 뻔하잖아"
            message={"그림자는 어둠을 위한 초석이지,\n 열쇠가 아냐"}
            buttonText="다시 기회를 줘"
            onComplete={handleReturnToPlay}
        />;
      case 'COMPLETED':
        return <CompletionScreen onPlayAgain={handlePlayAgain} />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 flex items-center justify-center p-4 transition-all duration-500">
      <div className="w-full max-w-md mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};


// --- Original index.tsx Mounting logic ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
