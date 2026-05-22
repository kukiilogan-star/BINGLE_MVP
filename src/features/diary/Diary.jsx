import { useState } from 'react';
import BingleCharacter, { BingleVectorCharacter } from '../../shared/ui/BingleCharacter.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const getBingleStateByMood = (mood) => {
  switch (mood) {
    case 5: return 'excited';
    case 4: return 'happy';
    case 3: return 'sleeping';
    case 2: return 'tired';
    case 1: return 'crying';
    default: return 'happy';
  }
};

const POSTCARDS = [
  { id: 'forest', name: '🏞️ 힐링 숲의 숨결', color: '#e2f0d9', desc: '초록빛 숲속의 고요한 산책' },
  { id: 'milk', name: '🥛 라벤더 우유 한 잔', color: '#ebe2f7', desc: '하루의 긴장을 녹여내는 아늑함' },
  { id: 'beach', name: '🏖️ 차가운 파도 소리', color: '#dcf0f7', desc: '잡념을 씻어내는 냉정함' },
  { id: 'candle', name: '🕯️ 명상의 촛불', color: '#fff2cc', desc: '나에게 온전히 머무르는 시간' }
];

export default function Diary({ gameState, updateGameState, gainXP, showToast }) {
  const selectedTheme = gameState?.fridgeTheme || 'mint';
  const [selectedDay, setSelectedDay] = useState(20); // May 20
  const [diaryText, setDiaryText] = useState('');
  const [diaryMood, setDiaryMood] = useState(4); // default 😊
  const [selectedPostcard, setSelectedPostcard] = useState('forest');
  const [showEditor, setShowEditor] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' or 'stats'

  // Pre-populated realistic history for May 2026 to make the monthly tracker look rich and complete!
  const defaultEntries = {
    12: { text: "첫 마찰 온기 걷기 성공! 빙글이도 시원한 밤잠에 빠졌다. 기분이 아늑하다.", mood: 4, steps: 6200, temp: 15, type: 'diary', card: 'forest' },
    15: { text: "업무 압박이 너무 심했다... 번아웃 열기가 올라서 냉각 바람(심호흡)을 잔뜩 쐬어주었다. Bingle 방 온도가 무사히 내려가서 천만다행.", mood: 2, steps: 1200, temp: 48, type: 'diary', card: 'beach' },
    18: { text: "이웃 꽁꽁 가디언들이 냉기 지원을 해줬다! 이래서 같이 수호하는 재미가 있나 보다. 맑은 기운 충전 완료! 🍃", mood: 5, steps: 4800, temp: 12, type: 'diary', card: 'candle' },
    20: { text: "오늘 하루도 차분하게 나만의 감정 중심을 잡았다. 식재료 창고에 신선한 탄산수를 세 캔 모았다! 뿌듯해.", mood: 4, steps: 3500, temp: 18, type: 'diary', card: 'milk' }
  };

  const logs = gameState?.logs || [];
  const diaries = logs.reduce((acc, log) => {
    if (log.type === 'diary' && log.day) {
      acc[log.day] = log;
    }
    return acc;
  }, { ...defaultEntries });

  const handleSaveDiary = () => {
    if (!diaryText.trim()) return;

    const newDiary = {
      date: new Date().toISOString(),
      text: diaryText,
      mood: diaryMood,
      day: selectedDay,
      steps: gameState?.steps || 3500,
      temp: gameState?.mindTemperature || 18,
      card: selectedPostcard,
      type: 'diary'
    };

    const currentTemp = gameState?.mindTemperature ?? 25;
    const newTemp = Math.max(12, currentTemp - 20);

    const updatedLogs = [newDiary, ...logs];

    // Add cacao item
    const currentInv = gameState?.fridgeInventory || [];
    const idx = currentInv.findIndex(i => i.id === 'chocolate');
    let updatedInv = [...currentInv];
    if (idx !== -1) {
      updatedInv[idx] = { ...updatedInv[idx], count: updatedInv[idx].count + 1 };
    } else {
      updatedInv.push({ id: 'chocolate', name: '번아웃 카카오 힐러', desc: '스트레스 증발! 안정 12°C 달성 🍫', count: 1, icon: '🍫', color: '#ffeadc', type: 'calm', effect: 12 });
    }

    updateGameState({
      logs: updatedLogs,
      mindTemperature: newTemp,
      fridgeInventory: updatedInv
    });

    gainXP(30);
    setDiaryText('');
    setShowEditor(false);
    showToast(`📝 5월 ${selectedDay}일의 마음 일기가 등록되었습니다! 보상으로 [번아웃 카카오 🍫] 획득!`);
  };

  // Custom hand-drawn vector card renderer
  const renderCardArtwork = (cardType) => {
    switch (cardType) {
      case 'forest':
        return (
          <svg viewBox="0 0 160 110" className="w-full h-full bg-[#f1fcf0] transition-all" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f1fcf0" />
            <circle cx="80" cy="115" r="75" fill="#a4dfa2" opacity="0.4" />
            <path d="M10 110 L 45 40 L 80 110 Z" fill="#78be76" stroke="#28180b" strokeWidth="2.5" />
            <path d="M50 110 L 85 25 L 120 110 Z" fill="#589e56" stroke="#28180b" strokeWidth="2.5" />
            <path d="M90 110 L 125 50 L 160 110 Z" fill="#78be76" stroke="#28180b" strokeWidth="2.5" />
            <circle cx="30" cy="30" r="12" fill="#ffe0b2" opacity="0.85" />
            <path d="M25 35 Q 35 32, 45 35" stroke="#ffb74d" strokeWidth="2" fill="none" />
            {/* Tiny wobbly Bingle shadow sitting under the tree */}
            <path d="M75 95 C 75 90, 80 88, 85 88 C 90 88, 92 90, 92 95 C 92 102, 75 102, 75 95 Z" fill="#d0f4ff" stroke="#28180b" strokeWidth="1.5" />
            <text x="80" y="85" fontSize="10" fontWeight="900" fill="#28180b" textAnchor="middle" fontFamily="Gaegu">쉼터</text>
          </svg>
        );
      case 'milk':
        return (
          <svg viewBox="0 0 160 110" className="w-full h-full bg-[#faf5ff]" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#faf5ff" />
            <ellipse cx="80" cy="98" rx="45" ry="6" fill="#ebe2f7" />
            {/* Cute steaming milk cup */}
            <path d="M50 50 L 110 50 L 105 92 C 105 96, 55 96, 55 92 Z" fill="#ffffff" stroke="#28180b" strokeWidth="3" />
            <path d="M110 60 C 118 60, 118 75, 110 75" fill="none" stroke="#28180b" strokeWidth="3" strokeLinecap="round" />
            <path d="M55 50 C 55 45, 105 45, 105 50 Z" fill="#e9dbf7" stroke="#28180b" strokeWidth="2" />
            {/* Steaming heat waves */}
            <path d="M68 38 Q 72 30, 68 22" fill="none" stroke="#b08cd6" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M80 34 Q 84 26, 80 18" fill="none" stroke="#b08cd6" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M92 38 Q 96 30, 92 22" fill="none" stroke="#b08cd6" strokeWidth="2.5" strokeLinecap="round" />
            <text x="80" y="70" fontSize="20" textAnchor="middle">🥛</text>
          </svg>
        );
      case 'beach':
        return (
          <svg viewBox="0 0 160 110" className="w-full h-full bg-[#f0f9ff]" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f0f9ff" />
            <path d="M-10 110 L 170 110 L 170 65 Q 120 85, 80 65 T -10 65 Z" fill="#fffdec" />
            {/* Wobbly waves */}
            <path d="M-10 72 Q 40 55, 80 72 T 170 72 L 170 110 L -10 110 Z" fill="#bae6fd" stroke="#28180b" strokeWidth="2.5" />
            <path d="M-10 82 Q 40 68, 80 82 T 170 82" fill="none" stroke="#ffffff" strokeWidth="2.5" />
            {/* Beach Umbrella */}
            <g transform="translate(110, 45)">
              <line x1="20" y1="5" x2="20" y2="45" stroke="#28180b" strokeWidth="2.5" />
              <path d="M5 20 C 5 5, 35 5, 35 20 Z" fill="#ff8c69" stroke="#28180b" strokeWidth="2.5" />
              <path d="M12 20 C 12 10, 28 10, 28 20" fill="#ffffff" />
            </g>
          </svg>
        );
      case 'candle':
        return (
          <svg viewBox="0 0 160 110" className="w-full h-full bg-[#fffdf0]" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#fffdf0" />
            {/* Soft background light */}
            <circle cx="80" cy="55" r="38" fill="#fff7cc" opacity="0.65" />
            <circle cx="80" cy="55" r="22" fill="#ffec99" opacity="0.8" />
            {/* Candleholder and Candle */}
            <path d="M60 85 L 100 85" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M70 55 L 90 55 L 90 85 L 70 85 Z" fill="#ffffff" stroke="#28180b" strokeWidth="3" />
            {/* Wick */}
            <line x1="80" y1="55" x2="80" y2="48" stroke="#28180b" strokeWidth="2" />
            {/* Flame */}
            <path d="M80 32 C 77 40, 77 48, 80 48 C 83 48, 83 40, 80 32 Z" fill="#ff7043" stroke="#28180b" strokeWidth="2" />
            <path d="M80 38 C 78 42, 78 47, 80 47 C 82 47, 82 42, 80 38 Z" fill="#ffd54f" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Calendar setup for May 2026
  const daysInMonth = 31;
  const startOffset = 5; // Friday
  const calendarCells = [];
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push({ day: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d, data: diaries[d] });
  }

  const selectedDayData = diaries[selectedDay];

  // ── STATS DASHBOARD CALCULATIONS ──
  const activeDiaries = Object.values(diaries);
  const avgTemp = activeDiaries.length 
    ? Math.round(activeDiaries.reduce((sum, entry) => sum + entry.temp, 0) / activeDiaries.length) 
    : 25;
  const totalSteps = activeDiaries.reduce((sum, entry) => sum + entry.steps, 0);
  const avgSteps = activeDiaries.length ? Math.round(totalSteps / activeDiaries.length) : 0;

  // Mood counts
  const moodCounts = activeDiaries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  return (
    <div className={`fridge-bg fridge-bg-${selectedTheme} ${['black', 'wood'].includes(selectedTheme) ? 'text-white' : 'text-[#28180b]'} min-h-full flex flex-col items-center overflow-x-hidden relative font-['Gaegu'] select-none`}>
      <div className="halftone-bg" />

      <main className="w-full max-w-md pt-4 pb-28 px-4 flex flex-col gap-5 min-h-full relative z-10 animate-fade-up">
        
        {/* Header Tab Toggles */}
        <section className="flex bg-white border-4 border-black rounded-xl p-1 shadow-[4px_4px_0_0_#000] gap-1">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-2 font-black text-lg rounded-lg border-2 transition-all ${
              activeTab === 'calendar' 
                ? 'bg-[#ff8c69] border-black text-black shadow-sm' 
                : 'bg-white border-transparent text-gray-500 hover:text-black'
            }`}
          >
            🗓️ 달력 트래커
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 font-black text-lg rounded-lg border-2 transition-all ${
              activeTab === 'stats' 
                ? 'bg-[#ff8c69] border-black text-black shadow-sm' 
                : 'bg-white border-transparent text-gray-500 hover:text-black'
            }`}
          >
            📊 월별 트래킹 통계
          </button>
        </section>

        {activeTab === 'calendar' ? (
          /* ==========================================
             1. CALENDAR VIEW MODE
             ========================================== */
          <>
            {/* Calendar panel */}
            <section className="comic-panel bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_#000] rounded-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center border-b-4 border-black pb-2">
                <h2 className="text-2xl font-black text-black">🗓️ 마음 수호 달력 트래커</h2>
                <span className="bg-[#67f9e1] border-2 border-black font-black px-3 py-0.5 text-sm rounded rotate-1 shadow-[2px_2px_0_0_#000]">
                  2026년 5월
                </span>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center font-black text-sm text-gray-500 border-b border-gray-200 pb-1">
                <span className="text-red-500">일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span className="text-blue-500">토</span>
              </div>

              {/* Grid Cells */}
              <div className="grid grid-cols-7 gap-1.5">
                {calendarCells.map((cell, idx) => {
                  if (cell.day === null) {
                    return <div key={`empty-${idx}`} className="aspect-square opacity-0" />;
                  }

                  const hasData = !!cell.data;
                  const isSelected = selectedDay === cell.day;
                  
                  return (
                    <button
                      key={`day-${cell.day}`}
                      onClick={() => {
                        setSelectedDay(cell.day);
                        if (!hasData) setShowEditor(false);
                      }}
                      className={`aspect-square rounded-lg border-2 border-black font-black text-base flex flex-col items-center justify-between p-1 transition-all relative ${
                        isSelected 
                          ? 'bg-[#ff8c69] translate-y-0.5 shadow-none' 
                          : hasData 
                          ? 'bg-cyan-50 hover:bg-cyan-100 shadow-[2px_2px_0_0_#000]' 
                          : 'bg-white hover:bg-yellow-50 shadow-[2px_2px_0_0_#000]'
                      }`}
                    >
                      <span className="text-[11px] self-start leading-none z-10">{cell.day}</span>
                      {hasData && (
                        <div className="absolute inset-0 flex items-center justify-center pt-3 select-none pointer-events-none z-0">
                          <BingleVectorCharacter size={28} state={getBingleStateByMood(cell.data.mood)} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Selected day box */}
            <section className="comic-panel bg-white p-4 border-4 border-black shadow-[6px_6px_0_0_#000] rounded-2xl flex flex-col gap-4">
              <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2">
                <span className="font-black text-xl text-black">📌 5월 {selectedDay}일의 마음 풍경</span>
                {!selectedDayData && !showEditor && (
                  <button 
                    onClick={() => setShowEditor(true)}
                    className="bg-[#67f9e1] border-2 border-black font-black px-3.5 py-1 rounded text-sm shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none transition-all"
                  >
                    + 일기 쓰기
                  </button>
                )}
              </div>

              {showEditor ? (
                /* DIARY EDITOR FORM */
                <div className="flex flex-col gap-4 animate-pop-in">
                  <div className="flex justify-between items-center bg-orange-50 border-2 border-black p-2.5 rounded-xl">
                    <span className="font-black text-sm text-gray-700">체감 기분</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((m) => {
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setDiaryMood(m)}
                            className={`w-11 h-11 rounded-xl border-3 border-black flex items-center justify-center transition-all ${
                              diaryMood === m 
                                ? 'bg-[#ff8c69] scale-110 shadow-[2px_2px_0_0_#000] rotate-[-3deg]' 
                                : 'bg-white hover:bg-orange-50 shadow-[1px_1px_0_0_#000]'
                            }`}
                          >
                            <BingleVectorCharacter size={32} state={getBingleStateByMood(m)} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pick wobbly postcard artwork */}
                  <div className="flex flex-col gap-1.5">
                    <span className="font-black text-sm text-gray-700 px-1">🖼️ 마음 일화 이미지 카드 선택</span>
                    <div className="grid grid-cols-2 gap-2">
                      {POSTCARDS.map(card => (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => setSelectedPostcard(card.id)}
                          className={`border-2 border-black p-2 rounded-lg text-left transition-all ${
                            selectedPostcard === card.id 
                              ? 'bg-[#ff8c69] shadow-[2px_2px_0_0_#000]' 
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div className="font-black text-sm text-black">{card.name}</div>
                          <div className="text-[10px] font-bold text-gray-600 leading-none mt-1">{card.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <textarea
                    value={diaryText}
                    onChange={(e) => setDiaryText(e.target.value)}
                    placeholder={`5월 ${selectedDay}일, 마음창에 하얗게 서린 김서림을 털어놓아 보세요...`}
                    className="w-full h-24 p-3 border-2 border-black rounded-lg text-base font-black focus:outline-none focus:ring-4 focus:ring-sky-300 bg-yellow-50 resize-none"
                  />

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowEditor(false)}
                      className="flex-1 bg-white border-2 border-black font-black py-2 rounded shadow-[2px_2px_0_0_#000]"
                    >
                      취소
                    </button>
                    <button 
                      disabled={!diaryText.trim()}
                      onClick={handleSaveDiary}
                      className={`flex-[2] border-2 border-black font-black py-2 rounded shadow-[3px_3px_0_0_#000] active:translate-y-0.5 active:shadow-none transition-all ${
                        diaryText.trim() ? 'bg-[#67f9e1]' : 'bg-gray-100 text-gray-400 border-gray-300 shadow-none'
                      }`}
                    >
                      📝 일기 저장 (+30 XP)
                    </button>
                  </div>
                </div>
              ) : selectedDayData ? (
                /* POLAROID DETAIL VIEW */
                <div className="flex flex-col gap-4 animate-pop-in">
                  <div className="flex gap-4">
                    
                    {/* Polaroid Frame */}
                    <div className="w-1/2 bg-white border-4 border-black shadow-[4px_4px_0_0_#000] p-2.5 rounded-lg flex flex-col gap-2 relative transform -rotate-1">
                      <div className="w-full aspect-square border-2 border-black bg-slate-50 flex items-center justify-center overflow-hidden rounded">
                        {renderCardArtwork(selectedDayData.card || 'forest')}
                      </div>
                      <div className="text-center font-black text-[10px] text-gray-600 border-t border-dashed border-gray-300 pt-1">
                        성찰 사진 앨범 📸
                      </div>
                    </div>

                    {/* Stats & information */}
                    <div className="flex-1 flex flex-col gap-2.5 justify-center font-bold text-gray-700 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#ff8c69]">directions_run</span>
                        <span>활동 걸음: {selectedDayData.steps.toLocaleString()}보</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#0284c7]">ac_unit</span>
                        <span>마음 온도: {Math.round(selectedDayData.temp)}°C</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-purple-600">psychology</span>
                        <span>감정 상태: {selectedDayData.mood === 5 ? '최고의 정서 🥰' : selectedDayData.mood === 4 ? '행복과 평온 😊' : selectedDayData.mood === 3 ? '무난한 안정 💤' : selectedDayData.mood === 2 ? '울적함 😥' : '번아웃 위기 😭'}</span>
                      </div>
                    </div>

                  </div>

                  {/* Diary details speech bubble */}
                  <div className="bg-orange-50 border-4 border-black p-4 rounded-xl shadow-[4px_4px_0_0_#000] relative rotate-1">
                    <p className="text-base font-black leading-tight text-gray-800 whitespace-pre-wrap">
                      "{selectedDayData.text}"
                    </p>
                  </div>
                </div>
              ) : (
                /* NO ENTRY PLACEHOLDER */
                <div className="text-center py-8 flex flex-col items-center gap-3">
                  <span className="text-4xl">🌫️</span>
                  <p className="font-bold text-gray-500 leading-tight">
                    5월 {selectedDay}일에 기록된 마음 흔적이 없습니다.<br/>일기를 써서 냉장고를 시원하게 환기해 보세요!
                  </p>
                  <button 
                    onClick={() => setShowEditor(true)}
                    className="bg-[#ff8c69] border-4 border-black font-black text-lg px-6 py-2.5 rounded-xl shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all mt-2"
                  >
                    📝 성찰 일기 작성하기
                  </button>
                </div>
              )}
            </section>
          </>
        ) : (
          /* ==========================================
             2. MONTHLY TRACKING STATS MODE
             ========================================== */
          ((gameState?.currentWeek ?? 1) < 7 && !gameState?.bypassLocks) ? (
            <div className="comic-panel bg-white p-6 border-4 border-black shadow-[6px_6px_0_0_#000] rounded-2xl flex flex-col items-center gap-4 text-center animate-pop-in">
              <span className="text-5xl">📊</span>
              <h3 className="text-2xl font-black text-black">마음 온도 통계 닫힘</h3>
              
              <div className="bg-[#f0fdfa] border-3 border-black rounded-xl p-4 flex gap-3.5 items-start text-left">
                <div className="w-12 h-12 flex-shrink-0">
                  <BingleCharacter state="sleeping" size={48} />
                </div>
                <p className="text-base font-bold text-gray-700 leading-tight">
                  지나친 통계 수치 확인은 행동 강박을 유발하고 <strong>스트레스 인지적 부하(Cognitive Load)</strong>를 가중시킵니다.<br/><br/>
                  빙글이와의 신뢰가 충분히 쌓인 <strong>7주차 (4단계: 루틴 설계)</strong>가 시작되면 마음 기온 및 활동 변동 통계 추이가 정식 개방됩니다. 지금은 하루의 쉼에 오롯이 집중하세요!
                </p>
              </div>

              <div className="bg-[#ffe4e6] border-2 border-black p-3.5 rounded-xl w-full">
                <span className="text-xs font-black text-gray-500 uppercase block">정식 개방 주간</span>
                <span className="text-lg font-black text-red-600 mt-1 block">📅 7주차 (4단계: 루틴 지속화 설계)</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5 animate-pop-in">
            
            {/* Executive Quick Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="comic-panel bg-white p-3.5 rounded-xl text-center">
                <span className="font-black text-xs text-gray-500 block">평균 마음 온도 🌡️</span>
                <span className="text-3xl font-black text-red-500 mt-1 block">{avgTemp}°C</span>
                <span className="text-[10px] font-bold text-gray-400">냉각 조절이 필요한 상태</span>
              </div>
              <div className="comic-panel bg-white p-3.5 rounded-xl text-center">
                <span className="font-black text-xs text-gray-500 block">하루 평균 걷기 🏃</span>
                <span className="text-3xl font-black text-cyan-600 mt-1 block">{avgSteps.toLocaleString()}보</span>
                <span className="text-[10px] font-bold text-gray-400">마찰 열기를 잘 털어내는 중</span>
              </div>
            </div>

            {/* SVG Charts: Heart Temperature Trending (마음 온도 변동 추이) */}
            <section className="comic-panel bg-white p-4 rounded-2xl flex flex-col gap-2">
              <h3 className="font-black text-lg text-black border-b border-gray-200 pb-1">🌡️ 마음 온도 흐름 그래프 (Stress Trend)</h3>
              <div className="w-full h-32 relative pt-2">
                {/* SVG Line Graph */}
                <svg className="w-full h-full" viewBox="0 0 320 100" fill="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="320" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="50" x2="320" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="80" x2="320" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  
                  {/* Hand drawn curve */}
                  <path 
                    d="M 20 85 Q 80 50 140 18 Q 200 45 260 25 T 320 60" 
                    stroke="#ff8c69" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d="M 20 85 Q 80 50 140 18 Q 200 45 260 25 T 320 60 L 320 100 L 20 100 Z" 
                    fill="url(#tempGrad)" 
                    opacity="0.15" 
                  />
                  {/* Gradient */}
                  <defs>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff8c69" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>

                  {/* Highlight node bullets */}
                  <circle cx="20" cy="85" r="4.5" fill="#28180b" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="140" cy="18" r="4.5" fill="#28180b" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="260" cy="25" r="4.5" fill="#28180b" stroke="#fff" strokeWidth="1.5" />
                  
                  {/* Labels */}
                  <text x="20" y="75" fontSize="10" fontWeight="bold" fill="#777" textAnchor="middle">12일</text>
                  <text x="140" y="32" fontSize="10" fontWeight="bold" fill="#e11d48" textAnchor="middle">15일🔥</text>
                  <text x="260" y="40" fontSize="10" fontWeight="bold" fill="#777" textAnchor="middle">18일</text>
                </svg>
              </div>
              <p className="text-[11px] font-bold text-gray-500 leading-none">⚠️ 5월 15일 업무 마찰 집중으로 열풍 지수 최고치(48°C) 기록.</p>
            </section>

            {/* SVG Charts: Daily Walking Steps (걸음수 통계) */}
            <section className="comic-panel bg-white p-4 rounded-2xl flex flex-col gap-2">
              <h3 className="font-black text-lg text-black border-b border-gray-200 pb-1">🏃 일별 걸음 수 변동 (Steps walked)</h3>
              <div className="w-full h-28 relative pt-2">
                {/* SVG Bar Chart */}
                <svg className="w-full h-full" viewBox="0 0 320 80" fill="none">
                  {/* Bars */}
                  {/* Bar 1 (6200 steps) */}
                  <rect x="25" y="18" width="22" height="62" rx="4" fill="#67f9e1" stroke="#28180b" strokeWidth="2.5" />
                  <text x="36" y="12" fontSize="9" fontWeight="bold" fill="#28180b" textAnchor="middle">6.2k</text>
                  {/* Bar 2 (1200 steps) */}
                  <rect x="95" y="68" width="22" height="12" rx="4" fill="#fda4af" stroke="#28180b" strokeWidth="2.5" />
                  <text x="106" y="62" fontSize="9" fontWeight="bold" fill="#28180b" textAnchor="middle">1.2k</text>
                  {/* Bar 3 (4800 steps) */}
                  <rect x="165" y="32" width="22" height="48" rx="4" fill="#67f9e1" stroke="#28180b" strokeWidth="2.5" />
                  <text x="176" y="26" fontSize="9" fontWeight="bold" fill="#28180b" textAnchor="middle">4.8k</text>
                  {/* Bar 4 (3500 steps) */}
                  <rect x="235" y="45" width="22" height="35" rx="4" fill="#ffcb2f" stroke="#28180b" strokeWidth="2.5" />
                  <text x="246" y="39" fontSize="9" fontWeight="bold" fill="#28180b" textAnchor="middle">3.5k</text>

                  {/* Day Labels */}
                  <text x="36" y="77" fontSize="10" fontWeight="bold" fill="#555" textAnchor="middle">12일</text>
                  <text x="106" y="77" fontSize="10" fontWeight="bold" fill="#555" textAnchor="middle">15일</text>
                  <text x="176" y="77" fontSize="10" fontWeight="bold" fill="#555" textAnchor="middle">18일</text>
                  <text x="246" y="77" fontSize="10" fontWeight="bold" fill="#555" textAnchor="middle">20일</text>
                </svg>
              </div>
            </section>

            {/* Bingle's custom prescription advice */}
            <section className="comic-panel bg-[#fef9c3] p-4 rounded-2xl relative rotate-1 shadow-[4px_4px_0_0_#000]">
              <div className="absolute -top-3 left-3 bg-[#eab308] border-2 border-black text-black font-black text-xs px-2 py-0.5 rounded shadow-[1.5px_1.5px_0_0_#000]">
                빙글이의 5월 맞춤 치유 처방전 💊
              </div>
              <div className="mt-2 flex gap-3.5 items-start">
                <div className="w-12 h-12 flex-shrink-0 bg-white border-2 border-black rounded-full overflow-hidden flex items-center justify-center">
                  <BingleCharacter state="happy" size={50} />
                </div>
                <div className="flex-1 font-bold text-sm text-gray-800 leading-tight">
                  "안녕 파트너! 5월 중순 들어 실온 유입 스트레스가 약간 잦았지만, 다행히 [탄산 마음 소화수]와 [자몽 비타민]을 적절히 먹여준 덕에 고요한 12°C 꽁꽁방을 여러 번 달성했어! 앞으로도 지칠 땐 망설임 없이 냉각 호흡 수련을 함께하자!"
                </div>
              </div>
            </section>
          </div>
        )
      )}

      </main>
    </div>
  );
}
