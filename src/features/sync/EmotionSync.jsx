import { useState } from 'react';
import './EmotionSync.css';
import BingleCharacter from '../../shared/ui/BingleCharacter.jsx';

const EMOTIONS = [
  { id: 1, label: '🧊 꽁꽁 언 얼음방 (안심/고요)', icon: 'ac_unit', bg: 'bg-blue-50', activeBg: 'bg-blue-100', temp: 12 },
  { id: 2, label: '🌬️ 시원한 찬바람 (약간 서늘함)', icon: 'partly_cloudy_day', bg: 'bg-teal-50', activeBg: 'bg-[#FFE4D1]', temp: 22 },
  { id: 3, label: '☀️ 딱 좋음 (따뜻 촉촉)', icon: 'light_mode', bg: 'bg-yellow-50', activeBg: 'bg-secondary-container', temp: 35 },
  { id: 4, label: '🔥 후끈후끈 (열기 차오름)', icon: 'local_fire_department', bg: 'bg-[#FFF1E9]', activeBg: 'bg-primary-container/40', temp: 55 },
  { id: 5, label: '🌋 펄펄 끓음 (화산 폭발 직전)', icon: 'volcano', bg: 'bg-red-50', activeBg: 'bg-error-container', temp: 85 }
];

export default function EmotionSync({ gameState, updateGameState, gainXP, navigate, screens }) {
  const selectedTheme = gameState?.fridgeTheme || 'mint';
  const [selected, setSelected] = useState(gameState?.emotionScore || 3);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleNext = () => {
    const selectedEmo = EMOTIONS.find(e => e.id === selected);
    const newTemp = selectedEmo ? selectedEmo.temp : 35;
    
    // Sync to game state
    updateGameState({ 
      emotionScore: selected,
      mindTemperature: newTemp
    });

    // Write database log
    const newLog = {
      date: new Date().toISOString(),
      type: 'emotion_sync',
      text: `🌡️ 냉장고 코어 기온 싱크 완료: 파트너의 감정 온도가 ${newTemp}°C로 맞춰졌습니다. 빙글이의 활동 패턴이 갱신되었습니다. (XP +15)`,
      temp: newTemp
    };
    const currentLogs = gameState?.logs || [];
    updateGameState({ logs: [newLog, ...currentLogs] });

    if (gainXP) gainXP(15);
    
    showToast('🌡️ 냉장고 기온 동기화 완료! 빙글이에게 즉시 반영되었습니다.');
    setTimeout(() => {
      if (navigate) navigate(screens?.HUB);
    }, 1000);
  };

  const getBingleState = (id) => {
    if (id <= 2) return 'sleeping'; // Freezing/chilly -> sleeping
    if (id === 3) return 'happy'; // Cozy -> happy
    return 'angry'; // Hot/boiling -> angry/melting puddles
  };

  return (
    <div className={`fridge-bg fridge-bg-${selectedTheme} ${['black', 'wood'].includes(selectedTheme) ? 'text-white' : 'text-[#28180b]'} min-h-full flex flex-col items-center overflow-x-hidden relative font-['Gaegu'] select-none`}>
      
      {/* Halftone Background overlay */}
      <div className="halftone-bg" />

      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white border-4 border-black px-6 py-2.5 rounded-xl shadow-[6px_6px_0_0_#000] z-[9999] animate-pop-in text-center max-w-[90%] pointer-events-none">
          <p className="text-base font-black text-black">{toast}</p>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 w-full z-50 flex items-center justify-between px-4 h-16 bg-white border-b-4 border-black shadow-[0_4px_0_0_#000]">
        <div className="flex items-center gap-3" onClick={() => navigate && navigate(screens?.HUB)}>
          <span className="material-symbols-outlined text-[#ff8c69] font-black text-2xl cursor-pointer">arrow_back</span>
          <h1 className="text-2xl font-black text-black tracking-wide">냉장고 핵심 기온 싱크 🌡️</h1>
        </div>
      </header>

      <main className="w-full max-w-md pt-6 pb-32 px-4 flex flex-col gap-6 min-h-full relative z-10">
        
        {/* Dialogue bubble with reactive claymation avatar */}
        <section className="relative flex items-end justify-between gap-4 mb-2">
          <div className="flex-1">
            <div className="speech-bubble bg-white border-4 border-black p-4 rounded-xl shadow-[4px_4px_0_0_#000] relative transform -rotate-1">
              <p className="text-lg font-black text-black leading-tight">
                {selected <= 2 && "와앗...! 냉장실이 아주 시원하고 고요해졌어. 차분하게 안심이 돼... 🥶"}
                {selected === 3 && "웅! 지금 기온이 아주 딱 포근해! 몸도 찌릿찌릿 활동하기 제일 좋은 상태야! ☀️"}
                {selected >= 4 && "헉, 내 방에 뜨거운 마찰 열기나 번아웃 아지랑이가 가득 들어찼어! 조절이 필요해... 🌋"}
              </p>
            </div>
          </div>
          <div className="w-24 h-24 flex-shrink-0 relative">
            <BingleCharacter state={getBingleState(selected)} size={96} className="filter drop-shadow-[4px_4px_0px_rgba(0,0,0,0.25)]" />
          </div>
        </section>

        {/* Comic Panel List Selector */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xl font-black text-black px-1">👇 현재 내 마음의 체감 열기와 동기화하기</h3>
          
          <div className="flex flex-col gap-3">
            {EMOTIONS.map(emo => {
              const isActive = selected === emo.id;
              return (
                <button 
                  key={emo.id}
                  onClick={() => handleSelect(emo.id)}
                  className={`w-full flex items-center gap-4 ${emo.bg} border-4 border-black p-3.5 rounded-xl shadow-[4px_4px_0_0_#000] squishy-btn group relative overflow-hidden transition-all ${
                    isActive ? 'bg-[#ffb59f] translate-y-1 shadow-[1px_1px_0_0_#000]' : 'hover:bg-yellow-50 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full border-4 border-black flex items-center justify-center bg-white ${isActive ? 'bg-[#ff8c69] shadow-inner' : ''} relative z-10`}>
                    <span className="material-symbols-outlined text-2xl font-black text-black" style={{fontVariationSettings: "'FILL' 1"}}>{emo.icon}</span>
                  </div>
                  
                  <span className="text-lg font-black text-black relative z-10">
                    {emo.label}
                  </span>

                  {isActive && (
                    <div className="ml-auto material-symbols-outlined text-black font-black text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Sync Button */}
        <div className="border-t-4 border-dashed border-black/40 my-3 w-full"></div>
        
        <div className="text-center space-y-4">
          <p className="text-base font-bold text-gray-800">기온 싱크를 맞춰주면 내 방 기온이 즉각 동기화돼! 🗺️</p>
          <button 
            onClick={handleNext} 
            className="w-full py-4 px-6 bg-[#ff8c69] hover:bg-[#ffa07a] rounded-2xl border-4 border-black shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 font-black text-xl text-black"
          >
            <span>동기화 게이트웨이 개방! ⚡→🌡️</span>
            <span className="material-symbols-outlined text-black font-black">arrow_forward</span>
          </button>
        </div>
      </main>

      {/* Floating Sticker Decoration */}
      <div className="fixed top-24 right-4 pointer-events-none opacity-20">
        <span className="material-symbols-outlined text-4xl text-black font-black">filter_vintage</span>
      </div>
      <div className="fixed bottom-24 left-4 pointer-events-none opacity-20">
        <span className="material-symbols-outlined text-4xl text-black font-black">star</span>
      </div>
    </div>
  );
}
