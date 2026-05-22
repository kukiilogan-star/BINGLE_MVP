import { useState, useEffect, useCallback } from 'react';
import StoryOnboarding from './features/story/StoryOnboarding.jsx';
import GameHub from './features/home/GameHub.jsx';
import PantryWarehouse from './features/home/PantryWarehouse.jsx';
import Diary from './features/diary/Diary.jsx';
import NeighborsFridge from './features/social/NeighborsFridge.jsx';
import MapWalk from './features/worlds/MapWalk.jsx';
import ForestWorld from './features/worlds/ForestWorld.jsx';
import BingleCharacter from './shared/ui/BingleCharacter.jsx';
import { database, ref, set, onValue } from './firebase';
import './index.css';
import { motion, AnimatePresence } from 'framer-motion';

const SCREENS = {
  STORY: 'story',
  HUB: 'hub',
  PANTRY: 'pantry',
  DIARY: 'diary',
  SOCIAL: 'social',
  WALK: 'walk',
  FOREST: 'forest',
};

const INITIAL_GAME_STATE = {
  level: 1,
  xp: 12,
  maxXp: 100,
  mindTemperature: 25,
  steps: 0,
  characterState: 'happy',
  hasCompletedOnboarding: false,
  isDoorOpen: false,
  currentWeek: 1, // Default to Week 1 (Stage 1)
  burnoutScore: null,
  burnoutLevel: null,
  burnoutTitle: null,
  bypassLocks: true, // Default to true so everything is unlocked initially!
  preferences: { activity: 'walk', sleepRut: 'milk' },
  mindCoins: 120, // 🪙 마음 코인 기본 지급
  fridgeInventory: [
    { id: 'water', name: '탄산 마음 소화수', desc: '불안 해소! 온도 -15°C 급속 냉방 💧', count: 10, icon: '💧', color: '#bae6fd', type: 'cool', effect: -15 },
    { id: 'orange', name: '활력 자몽 비타민', desc: '무기력 극복! 경험치 +30 보스 🍊', count: 10, icon: '🍊', color: '#fed7aa', type: 'xp', effect: 30 },
    { id: 'chocolate', name: '번아웃 카카오 힐러', desc: '스트레스 증발! 안정 12°C 달성 🍫', count: 10, icon: '🍫', color: '#ffeadc', type: 'calm', effect: 12 },
    { id: 'melon', name: '회복 멜론 젤리', desc: '평온 회복! 온도 -10°C / XP +15 🍈', count: 10, icon: '🍈', color: '#dcfce7', type: 'heal', effect: 10 },
    { id: 'milk', name: '꿀잠 라벤더 우유', desc: '마음 숙면! 온도 -20°C / 취침 유도 🥛', count: 10, icon: '🥛', color: '#f3e8ff', type: 'sleep', effect: -20 },
    { id: 'icecream', name: '급속 냉각 베리 빙과', desc: '마찰열 영하 탈출! 온도 -25°C 🍦', count: 10, icon: '🍦', color: '#fce7f3', type: 'cool', effect: -25 },
    { id: 'apple', name: '성찰 아삭 청사과', desc: '건강한 디톡스! 온도 -12°C / XP +25 🍏', count: 10, icon: '🍏', color: '#dcfce7', type: 'heal', effect: 12 },
    { id: 'coffee', name: '피로 파괴 아메리카노', desc: '활력 부스터! 경험치 +40 부스트 ☕', count: 10, icon: '☕', color: '#fef3c7', type: 'xp', effect: 40 },
    { id: 'cake', name: '위로 딸기 케이크', desc: '달콤한 포용! 안정 12°C 즉각 도달 🍰', count: 10, icon: '🍰', color: '#ffe4e6', type: 'calm', effect: 12 }
  ],
  logs: []
};

const USER_ID = "test_user_123";

export default function App() {
  const [screen, setScreen] = useState(() => {
    try {
      const saved = localStorage.getItem('bingle_v2_state');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed?.hasCompletedOnboarding ? SCREENS.HUB : SCREENS.STORY;
    } catch {
      return SCREENS.STORY;
    }
  });
  
  const [transitioning, setTransitioning] = useState(false);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [toast, setToast] = useState(null);
  const [showWeekSelector, setShowWeekSelector] = useState(false);
  const [lockExplanation, setLockExplanation] = useState(null); // { title: string, desc: string, unlocksAt: string }

  const [gameState, setGameState] = useState(() => {
    try {
      const saved = localStorage.getItem('bingle_v2_state');
      const parsed = saved ? JSON.parse(saved) : null;
      return {
        ...INITIAL_GAME_STATE,
        ...parsed,
        bypassLocks: true // ALWAYS initialize as unlocked (true) for reviewers/developers!
      };
    } catch {
      return { ...INITIAL_GAME_STATE, bypassLocks: true };
    }
  });

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // Sync from Firebase
  useEffect(() => {
    if (database) {
      const userRef = ref(database, 'users/' + USER_ID + '/gameState');
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setGameState(prev => ({
            ...prev,
            ...data,
            bypassLocks: prev.bypassLocks !== undefined ? prev.bypassLocks : true // Keep current session's bypassLocks state!
          }));
        }
        setIsFirebaseReady(true);
      });
      return () => unsubscribe();
    } else {
      setIsFirebaseReady(true);
    }
  }, []);

  // Sync to Firebase & LocalStorage
  useEffect(() => {
    if (isFirebaseReady) {
      localStorage.setItem('bingle_v2_state', JSON.stringify(gameState));
      if (database) {
        set(ref(database, 'users/' + USER_ID + '/gameState'), gameState).catch(console.error);
      }
    }
  }, [gameState, isFirebaseReady]);
  
  // Transition automatically when onboarding state updates
  useEffect(() => {
    if (gameState?.hasCompletedOnboarding && screen === SCREENS.STORY) {
      setScreen(SCREENS.HUB);
    }
  }, [gameState?.hasCompletedOnboarding, screen]);

  const getWeekStageDetails = (week) => {
    if (week <= 2) return { stage: 1, title: '1단계: 번아웃 신호 알아차리기' };
    if (week <= 4) return { stage: 2, title: '2단계: 일상 경계 짓기' };
    if (week <= 6) return { stage: 3, title: '3단계: 행동 활성화' };
    return { stage: 4, title: '4단계: 루틴 지속화 설계' };
  };

  const handleScreenNavigation = (targetScreen) => {
    // If bypassLocks is true, we allow viewing everything directly!
    if (gameState?.bypassLocks) {
      navigate(targetScreen);
      return;
    }

    const week = gameState?.currentWeek || 1;
    
    // Check lock rules based on current week
    if (week <= 2) {
      // Stage 1 Locks
      if (targetScreen === SCREENS.DIARY) {
        setLockExplanation({
          title: '📖 마음 일기장 잠금',
          desc: '1단계(1~2주차)는 빙글이와 정서 교감에 집중하며 번아웃 신호를 천천히 마주하는 주간입니다! 스스로 행동의 압박을 받지 않도록 일기 기록은 차주에 시작됩니다.',
          unlocksAt: '3주차 (2단계: 일상 경계 짓기)'
        });
        return;
      }
      if (targetScreen === SCREENS.SOCIAL) {
        setLockExplanation({
          title: '❄️ 얼음동굴 소셜 잠금',
          desc: '쉿! 지금은 1단계 친밀도 쌓기 기간이에요. 이웃 가디언들과 서로의 V-log를 공유하고 소통하는 얼음동굴은 5주차에 활짝 개방됩니다.',
          unlocksAt: '5주차 (3단계: 행동 활성화)'
        });
        return;
      }
      if (targetScreen === SCREENS.WALK || targetScreen === SCREENS.FOREST) {
        setLockExplanation({
          title: '🏃 산책 및 명상 잠금',
          desc: '1단계는 무리하지 않고 내 온전한 호흡을 지키는 기간입니다. 숲속 소리 명상과 GPS 산책로 포탈은 3주차에 가동을 시작합니다!',
          unlocksAt: '3주차 (2단계: 일상 경계 짓기)'
        });
        return;
      }
    } else if (week <= 4) {
      // Stage 2 Locks
      if (targetScreen === SCREENS.SOCIAL) {
        setLockExplanation({
          title: '❄️ 얼음동굴 소셜 잠금',
          desc: '이웃들과 소통하기 전, 내 마음의 냉장고 문단속 경계를 확실히 세우는 시기입니다! 소셜 얼음동굴은 다음 단계인 5주차에 정식 개방됩니다.',
          unlocksAt: '5주차 (3단계: 행동 활성화)'
        });
        return;
      }
    }

    // Otherwise unlock and navigate
    navigate(targetScreen);
  };

  const navigate = useCallback((nextScreen) => {
    if (nextScreen === screen) return;
    setTransitioning(true);
    setTimeout(() => {
      setScreen(nextScreen);
      setTransitioning(false);
    }, 250);
  }, [screen]);

  useEffect(() => {
    window.bingleNavigate = navigate;
  }, [navigate]);

  const updateGameState = useCallback((updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  const gainXP = useCallback((amount) => {
    setGameState(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newMaxXP = prev.maxXp;
      let newCoins = (prev.mindCoins !== undefined ? prev.mindCoins : 120) + Math.round(amount * 0.5);
      if (newXP >= prev.maxXp) {
        newXP = newXP - prev.maxXp;
        newLevel = prev.level + 1;
        newMaxXP = prev.maxXp + 50;
        newCoins += 50; // Level up coin bonus!
        setTimeout(() => {
          showToast(`✨ LEVEL UP! 레벨 ${newLevel} 가디언으로 승급했습니다! 🏆 (보너스 🪙 50코인 획득)`);
        }, 100);
      }
      return { ...prev, xp: newXP, level: newLevel, maxXp: newMaxXP, mindCoins: newCoins };
    });
  }, [showToast]);

  const changeWeek = (weekNum) => {
    updateGameState({ currentWeek: weekNum });
    const details = getWeekStageDetails(weekNum);
    showToast(`📅 시간 여행 완료: [${weekNum}주차 - ${details.title}]로 설정되었습니다!`);
    setShowWeekSelector(false);
    
    // Force redirect to HUB if currently on a screen that becomes locked (only if bypassLocks is not active)
    if (!gameState?.bypassLocks) {
      if (weekNum <= 2 && [SCREENS.DIARY, SCREENS.SOCIAL, SCREENS.WALK, SCREENS.FOREST].includes(screen)) {
        navigate(SCREENS.HUB);
      } else if (weekNum <= 4 && screen === SCREENS.SOCIAL) {
        navigate(SCREENS.HUB);
      }
    }
  };

  const props = { gameState, updateGameState, gainXP, navigate, screens: SCREENS, showToast, handleScreenNavigation };

  const weekDetails = getWeekStageDetails(gameState?.currentWeek || 1);

  return (
    <div className="flex items-center justify-center h-[100dvh] bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] overflow-hidden w-full sm:p-4">
      {/* Toast Alert popup */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white border-4 border-black px-6 py-3 rounded-xl shadow-[5px_5px_0_0_#000] z-[99999] animate-pop-in text-center max-w-[90%] pointer-events-none font-['Gaegu'] text-lg font-black">
          <p className="text-black">{toast}</p>
        </div>
      )}

      {/* 🔒 Adaptive Feature Lock Dialog Modal */}
      <AnimatePresence>
        {lockExplanation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[999999] backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white border-4 border-black p-5 rounded-3xl max-w-sm w-full shadow-[8px_8px_0_0_#000] relative font-['Gaegu']"
            >
              <button 
                onClick={() => setLockExplanation(null)}
                className="absolute top-3 right-3 bg-white border-3 border-black w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none"
              >
                X
              </button>

              <div className="flex gap-2.5 items-center border-b-4 border-black pb-2 mb-4">
                <span className="text-3xl">❄️</span>
                <h3 className="text-2xl font-black text-black leading-none">{lockExplanation.title}</h3>
              </div>

              <div className="bg-[#f0fdfa] border-3 border-black rounded-xl p-4 flex gap-4 items-start mb-4">
                <div className="w-12 h-12 flex-shrink-0">
                  <BingleCharacter state="angry" size={48} />
                </div>
                <p className="text-base font-bold text-gray-700 leading-tight">
                  {lockExplanation.desc}
                </p>
              </div>

              <div className="bg-[#ffe4e6] border-2 border-black p-3.5 rounded-xl text-center">
                <span className="text-xs font-black text-gray-500 uppercase block">잠금 해제 시점</span>
                <span className="text-lg font-black text-red-600 mt-1 block">📅 {lockExplanation.unlocksAt}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="relative w-full h-full sm:max-w-[420px] sm:max-h-[850px] sm:aspect-[9/16] bg-background sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),_inset_0_2px_4px_rgba(255,255,255,0.25)] sm:rounded-[2.5rem] sm:border-[12px] sm:border-[#cbd5e1] overflow-hidden flex flex-col transition-all duration-300">
        
        {/* ==========================================================
           📅 PERSISTENT 8-WEEK TIME TRAVEL CONTROL BAR (DEBUGGER)
           ========================================================== */}
        {screen !== SCREENS.STORY && (
          <header className="bg-[#28180b] border-b-4 border-black px-4 py-2 flex items-center justify-between text-white font-['Gaegu'] relative z-[999]">
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#ffcb2f] font-black leading-none">8주 점진적 치유 스토리</span>
                <span className="text-sm font-black mt-1 leading-none">
                  {gameState.currentWeek}주차 ({weekDetails.stage}단계)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const currentBypass = !!gameState.bypassLocks;
                  updateGameState({ bypassLocks: !currentBypass });
                  showToast(currentBypass ? '🔒 정식 8주차 잠금 시스템이 가동되었습니다!' : '🔓 전체 잠금이 우회되어 모든 메뉴를 열람할 수 있습니다!');
                }}
                className={`border-2 border-black font-black text-[11px] px-2 py-1 rounded-lg shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none transition-all ${
                  gameState.bypassLocks ? 'bg-[#67f9e1] text-black shadow-none' : 'bg-gray-600 text-gray-300 border-gray-700'
                }`}
              >
                {gameState.bypassLocks ? '🔓 잠금우회' : '🔒 정식체크'}
              </button>

              <button
                onClick={() => setShowWeekSelector(!showWeekSelector)}
                className="bg-[#ff8c69] border-2 border-black font-black text-xs text-black px-2.5 py-1 rounded-lg shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none"
              >
                시간여행 ⚙️
              </button>
            </div>

            {/* Dropdown overlay */}
            <AnimatePresence>
              {showWeekSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-12 left-0 right-0 bg-[#3f2d1e] border-b-4 border-black p-3.5 flex flex-col gap-3 shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
                >
                  <span className="text-xs font-black text-[#ffcb2f] uppercase tracking-wider block text-center">
                    ⏰ 8주차 치유 단계를 선택하여 인터페이스 필터링을 검증하세요!
                  </span>

                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(wNum => {
                      const det = getWeekStageDetails(wNum);
                      const isSelected = gameState.currentWeek === wNum;
                      return (
                        <button
                          key={wNum}
                          onClick={() => changeWeek(wNum)}
                          className={`border-2 border-black rounded-lg py-1.5 font-black text-xs transition-all text-center ${
                            isSelected 
                              ? 'bg-[#67f9e1] text-black shadow-none' 
                              : 'bg-white text-black hover:bg-gray-100'
                          }`}
                        >
                          {wNum}주차
                          <span className="block text-[8px] font-bold text-gray-500">St.{det.stage}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>
        )}

        {/* Content Wrapper */}
        <div style={{
          width: '100%', 
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }} className="no-scrollbar">
          
          {screen === SCREENS.STORY  && <StoryOnboarding {...props} />}
          {screen === SCREENS.HUB    && <GameHub         {...props} />}
          {screen === SCREENS.PANTRY && <PantryWarehouse {...props} />}
          {screen === SCREENS.DIARY  && <Diary           {...props} />}
          {screen === SCREENS.SOCIAL && <NeighborsFridge {...props} />}
          {screen === SCREENS.WALK   && <MapWalk         {...props} />}
          {screen === SCREENS.FOREST && <ForestWorld     {...props} />}
          
        </div>

        {/* 5-Item Bottom Navigation Bar */}
        {screen !== SCREENS.STORY && (
          <nav className="absolute bottom-0 left-0 right-0 z-50 flex justify-around items-center h-22 pb-4 bg-gradient-to-b from-[#fffcf8] via-[#fff5ee] to-[#ffe3cf] border-t-4 border-black rounded-t-[2rem] shadow-[0_-6px_0_0_#000] overflow-hidden">
            
            {/* Clean Cozy Navigation Area */}

            {/* 1. 홈 (HUB) */}
            <div 
              className={`flex flex-col items-center justify-center cursor-pointer transition-transform z-20 ${screen === SCREENS.HUB ? 'transform -translate-y-2' : 'hover:-translate-y-1'}`} 
              onClick={() => handleScreenNavigation(SCREENS.HUB)}
            >
              <div className={`w-12 h-12 rounded-full border-4 border-black flex items-center justify-center bg-white ${screen === SCREENS.HUB ? 'bg-[#ff8c69] shadow-[3px_3px_0_0_#000]' : 'shadow-[1.5px_1.5px_0_0_#000]'}`}>
                <span className="material-symbols-outlined text-2xl font-black text-black" style={screen === SCREENS.HUB ? {fontVariationSettings: "'FILL' 1"} : {}}>home</span>
              </div>
              <span className="font-black text-sm mt-1 text-black font-['Gaegu']">홈</span>
            </div>

            {/* 2. 창고 (PANTRY) */}
            <div 
              className={`flex flex-col items-center justify-center cursor-pointer transition-transform z-20 ${screen === SCREENS.PANTRY ? 'transform -translate-y-2' : 'hover:-translate-y-1'}`} 
              onClick={() => handleScreenNavigation(SCREENS.PANTRY)}
            >
              <div className={`w-12 h-12 rounded-full border-4 border-black flex items-center justify-center bg-white ${screen === SCREENS.PANTRY ? 'bg-[#ff8c69] shadow-[3px_3px_0_0_#000]' : 'shadow-[1.5px_1.5px_0_0_#000]'}`}>
                <span className="material-symbols-outlined text-2xl font-black text-black" style={screen === SCREENS.PANTRY ? {fontVariationSettings: "'FILL' 1"} : {}}>inventory_2</span>
              </div>
              <span className="font-black text-sm mt-1 text-black font-['Gaegu']">창고</span>
            </div>

            {/* 3. 트래커 (DIARY) */}
            <div 
              className={`flex flex-col items-center justify-center cursor-pointer transition-transform z-20 ${screen === SCREENS.DIARY ? 'transform -translate-y-2' : 'hover:-translate-y-1'}`} 
              onClick={() => handleScreenNavigation(SCREENS.DIARY)}
            >
              <div className={`w-12 h-12 rounded-full border-4 border-black flex items-center justify-center bg-white ${screen === SCREENS.DIARY ? 'bg-[#ff8c69] shadow-[3px_3px_0_0_#000]' : 'shadow-[1.5px_1.5px_0_0_#000]'}`}>
                <span className="material-symbols-outlined text-2xl font-black text-black" style={screen === SCREENS.DIARY ? {fontVariationSettings: "'FILL' 1"} : {}}>calendar_month</span>
              </div>
              <span className="font-black text-sm mt-1 text-black font-['Gaegu']">달력일기</span>
            </div>

            {/* 4. 이웃 (SOCIAL) */}
            <div 
              className={`flex flex-col items-center justify-center cursor-pointer transition-transform z-20 ${screen === SCREENS.SOCIAL ? 'transform -translate-y-2' : 'hover:-translate-y-1'}`} 
              onClick={() => handleScreenNavigation(SCREENS.SOCIAL)}
            >
              <div className={`w-12 h-12 rounded-full border-4 border-black flex items-center justify-center bg-white ${screen === SCREENS.SOCIAL ? 'bg-[#ff8c69] shadow-[3px_3px_0_0_#000]' : 'shadow-[1.5px_1.5px_0_0_#000]'}`}>
                <span className="material-symbols-outlined text-2xl font-black text-black" style={screen === SCREENS.SOCIAL ? {fontVariationSettings: "'FILL' 1"} : {}}>group</span>
              </div>
              <span className="font-black text-sm mt-1 text-black font-['Gaegu']">이웃</span>
            </div>

            {/* 5. 산책 (WALK) */}
            <div 
              className={`flex flex-col items-center justify-center cursor-pointer transition-transform z-20 ${screen === SCREENS.WALK ? 'transform -translate-y-2' : 'hover:-translate-y-1'}`} 
              onClick={() => handleScreenNavigation(SCREENS.WALK)}
            >
              <div className={`w-12 h-12 rounded-full border-4 border-black flex items-center justify-center bg-white ${screen === SCREENS.WALK ? 'bg-[#ff8c69] shadow-[3px_3px_0_0_#000]' : 'shadow-[1.5px_1.5px_0_0_#000]'}`}>
                <span className="material-symbols-outlined text-2xl font-black text-black" style={screen === SCREENS.WALK ? {fontVariationSettings: "'FILL' 1"} : {}}>directions_run</span>
              </div>
              <span className="font-black text-sm mt-1 text-black font-['Gaegu']">산책</span>
            </div>

          </nav>
        )}
      </div>
    </div>
  );
}
