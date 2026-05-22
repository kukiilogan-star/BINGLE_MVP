import { useState, useCallback, useRef } from 'react';
import './ForestWorld.css';
import BingleCharacter from '../../shared/ui/BingleCharacter.jsx';

export default function ForestWorld({ gameState, updateGameState, gainXP, navigate, screens }) {
  const selectedTheme = gameState?.fridgeTheme || 'mint';
  const taskProgress = gameState?.leafCount || 0;
  const characterState = gameState?.characterState || 'happy';
  const [isPlayingASMR, setIsPlayingASMR] = useState(false);
  const audioRef = useRef(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const toggleASMR = () => {
    if (audioRef.current) {
      if (isPlayingASMR) {
        audioRef.current.pause();
        showToast('🔈 숲속 바람 자연 소리를 잠시 꺼둡니다.');
      } else {
        audioRef.current.play();
        showToast('🎵 숲속 바람 자연 소리를 재생하여 귀를 편안하게 해줍니다.');
        // Log to database
        const newLog = {
          date: new Date().toISOString(),
          type: 'asmr',
          text: '🎧 ASMR 공명 모드: 마법의 숲 소리 주파수와 뇌파를 공명시켜 차분히 감정을 이완시켰습니다. (XP +10)'
        };
        const currentLogs = gameState?.logs || [];
        updateGameState({ logs: [newLog, ...currentLogs] });
        if (gainXP) gainXP(10);
      }
      setIsPlayingASMR(!isPlayingASMR);
    }
  };

  const handleBreathe = useCallback(() => {
    if (taskProgress < 5) {
      const nextProgress = taskProgress + 1;
      updateGameState({ leafCount: nextProgress });
      if (gainXP) gainXP(15);
      
      showToast('🍃 숲속 깊은 숨으로 나뭇잎 바람 온기를 획득했습니다! (XP +15)');

      if (nextProgress === 5) {
        // Write database log for achievement
        const newLog = {
          date: new Date().toISOString(),
          type: 'leaf_gather',
          text: '🍃 마법의 숲 완전 정복: 다섯 장의 나뭇잎 온기를 모두 모아 빙글이 냉장고 필터를 깨끗하게 정화했습니다! (XP +30)'
        };
        const currentLogs = gameState?.logs || [];
        updateGameState({ 
          logs: [newLog, ...currentLogs],
          leafCount: 0 // Reset for tomorrow
        });
        if (gainXP) gainXP(30);
      }
    }
  }, [taskProgress, updateGameState, gainXP, gameState]);


  return (
    <div className={`fridge-bg fridge-bg-${selectedTheme} ${['black', 'wood'].includes(selectedTheme) ? 'text-white' : 'text-[#28180b]'} min-h-full flex flex-col items-center overflow-x-hidden relative font-['Gaegu'] select-none`}>
      
      {/* Halftone BG overlay */}
      <div className="halftone-bg" />

      {/* Dynamic Toast System */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white border-4 border-black px-6 py-2.5 rounded-xl shadow-[6px_6px_0_0_#000] z-[9999] animate-pop-in text-center max-w-[90%] pointer-events-none">
          <p className="text-base font-black text-black">{toast}</p>
        </div>
      )}

      {/* Top Header Panel */}
      <header className="sticky top-0 w-full z-50 flex items-center justify-between px-4 h-16 bg-white border-b-4 border-black shadow-[0_4px_0_0_#000]">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate && navigate(screens?.HUB)}>
          <span className="material-symbols-outlined text-[#ff8c69] font-black text-2xl">arrow_back</span>
          <span className="text-2xl font-black text-black tracking-wide">마법의 숲 모험 지구 🌳</span>
        </div>
        <div className="bg-yellow-100 border-2 border-black px-2 py-0.5 rounded font-black text-sm rotate-2 shadow-[2px_2px_0_0_#000]">
          수호 3일차
        </div>
      </header>

      {/* Main Gameplay Canvas */}
      <main className="w-full max-w-md pt-6 pb-32 px-4 flex flex-col gap-6 min-h-full relative z-10">
        
        {/* HUD - Heart Temperature Bar */}
        <section className="w-full flex flex-col items-center gap-2">
          <div className="comic-panel w-full bg-white p-3.5 border-4 border-black shadow-[4px_4px_0_0_#000]">
            <div className="flex justify-between items-center mb-1.5 px-1 font-black text-base text-gray-700">
              <span>🍃 숲의 맑은 바람 지표</span>
              <span className="text-[#ff8c69]">바람 정화율: {Math.round((taskProgress/5)*100)}%</span>
            </div>
            <div className="h-6 w-full bg-gray-200 border-4 border-black rounded-full overflow-hidden shadow-inner flex items-center">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500" 
                style={{ width: `${(taskProgress/5)*100}%` }}
              />
            </div>
          </div>
        </section>

        {/* Center Interactive Breathing Area */}
        <section className="comic-panel bg-[#e6fffa] border-4 border-black shadow-[6px_6px_0_0_#000] p-6 flex flex-col items-center justify-center min-h-[280px] relative">
          <div 
            onClick={handleBreathe}
            className="w-48 h-48 rounded-full border-4 border-black flex items-center justify-center cursor-pointer bg-white hover:bg-emerald-50 active:scale-95 shadow-[4px_4px_0_0_#000] transition-all relative z-10"
          >
            {/* Pulsing Core */}
            <div className={`w-40 h-40 rounded-full bg-gradient-to-tr from-[#67f9e1] to-[#87beaf] flex flex-col items-center justify-center p-3 text-center border-4 border-dashed border-black ${taskProgress < 5 ? 'animate-pulse' : ''}`}>
              <span className="font-black text-xl text-black leading-tight">
                {taskProgress >= 5 ? "정화 완료! 🎉" : "이곳을 탭하며\n깊은 호흡 🍃"}
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="font-black text-lg bg-yellow-300 border-4 border-black px-4 py-1 rounded-full shadow-[3px_3px_0_0_#000] inline-block mb-3 rotate-1">
              맑은 바람 잎사귀 모으기: {taskProgress} / 5 🍃
            </span>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map(step => (
                <span 
                  key={step} 
                  className={`material-symbols-outlined text-3xl font-black ${taskProgress >= step ? 'text-emerald-600' : 'text-gray-300'}`}
                  style={{fontVariationSettings: "'FILL' 1"}}
                >
                  eco
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Action Widgets */}
        <section className="comic-panel bg-white p-4 border-4 border-black shadow-[4px_4px_0_0_#000] flex flex-col gap-3">
          <h3 className="text-xl font-black border-b-4 border-black pb-1.5">🗺️ 숲속 모험 도구</h3>
          <div className="flex gap-3">
            <button 
              onClick={handleBreathe} 
              className="flex-1 bg-[#67f9e1] hover:bg-[#4ce5cd] border-4 border-black rounded-xl py-3.5 flex flex-col items-center justify-center gap-1 font-black text-lg shadow-[3px_3px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
            >
              <span className="text-2xl">🍃</span>
              <span>호흡하기 (+15 XP)</span>
            </button>
            <button 
              onClick={toggleASMR} 
              className={`flex-1 border-4 border-black rounded-xl py-3.5 flex flex-col items-center justify-center gap-1 font-black text-lg shadow-[3px_3px_0_0_#000] active:translate-y-1 active:shadow-none transition-all ${
                isPlayingASMR ? 'bg-[#ff8c69] hover:bg-[#ffa07a]' : 'bg-white hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl">🎧</span>
              <span>{isPlayingASMR ? '소리 끄기' : '숲의 소리 듣기'}</span>
            </button>
          </div>
        </section>

        {/* Bingle Interactive Speech bubble dialogue */}
        <section className="bg-white border-4 border-black rounded-xl p-4 shadow-[4px_4px_0_0_#000] flex gap-3 items-center relative overflow-hidden transform -rotate-1">
          <div className="flex-shrink-0 w-16 h-16 bg-[#87beaf] rounded-full border-4 border-black overflow-hidden flex items-center justify-center">
            <BingleCharacter state={characterState} size={48} className="mt-1" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-black text-black leading-tight">
              {taskProgress >= 5 
                ? "고마워 파트너! 숲속 나뭇잎 바람 덕분에 냉장실 환기가 다 됐어! 아주 신선해! 🍃" 
                : "숨을 크게 들이마시고 내쉬는 마찰 온기가 숲 속 바람으로 환원되어 우릴 맑게 지켜줘!"}
            </p>
          </div>
        </section>

      </main>

      <audio ref={audioRef} src="https://actions.google.com/sounds/v1/ambiences/forest_birds.ogg" loop />
    </div>
  );
}
