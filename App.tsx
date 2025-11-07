
import React, { useState, useCallback } from 'react';
import { PUZZLES } from './constants.ts';
import type { GamePhase } from './types.ts';
import GameScreen from './components/GameScreen.tsx';
import CompletionScreen from './components/CompletionScreen.tsx';
import MissionScreen from './components/MissionScreen.tsx';
import WelcomeScreen from './components/WelcomeScreen.tsx';

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
            message={"잘 기억하고 있구나!\n 이제 본격적으로 시작해보자. \n 지금 광이랑 같이 근처 카페로 가서 자리잡아봐"}
            buttonText="지금 바로 갈게! "
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

export default App;