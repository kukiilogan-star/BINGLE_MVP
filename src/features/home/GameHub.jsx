import { useState, useEffect, useRef } from 'react';
import './GameHub.css';
import BingleCharacter, { BingleVectorCharacter } from '../../shared/ui/BingleCharacter.jsx';
import FoodVector from '../../shared/ui/FoodVector.jsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameHub({ gameState, updateGameState, gainXP, navigate, screens, showToast }) {
  const userLevel = gameState?.level || 1;
  const userXp = gameState?.xp || 0;
  const maxXp = gameState?.maxXp || 100;
  const mindTemperature = typeof gameState?.mindTemperature === 'number' ? gameState.mindTemperature : 25;
  const steps = gameState?.steps || 0;
  const characterState = gameState?.characterState || 'happy';
  
  // Refrigerator double doors open/closed state
  const [isDoorOpen, setIsDoorOpen] = useState(gameState?.isDoorOpen ?? false);
  const [showVectorLab, setShowVectorLab] = useState(false);
  const [selectedLabSpecimen, setSelectedLabSpecimen] = useState('happy');

  // Manual Mood Sync & Direct Feeding states
  const [manualMood, setManualMood] = useState(null);
  const [flyingFoods, setFlyingFoods] = useState([]);
  const [feedTrigger, setFeedTrigger] = useState(0);
  const [lastFedType, setLastFedType] = useState('water');
  
  // 🍖 Interactive Drag-and-Drop Feeding States
  const [isBingleHungry, setIsBingleHungry] = useState(false);

  // Drag physics tracking
  const handleDrag = (event, info) => {
    // If the food is dragged upward beyond -60px, Bingle notices and gets ready to gulp!
    if (info.offset.y < -60) {
      setIsBingleHungry(true);
    } else {
      setIsBingleHungry(false);
    }
  };

  const handleDragEnd = (event, info, itemId) => {
    setIsBingleHungry(false);
    
    // Gulp check: If dropped high enough (y < -60px), swallow successfully!
    if (info.offset.y < -60) {
      handleUseItemDirect(itemId);
    }
  };

  // 🪙 Magnet Cooldown State
  const [coinCooldown, setCoinCooldown] = useState(0);

  // 💬 AI Mind Talk States
  const [showAiChat, setShowAiChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isBingleTyping, setIsBingleTyping] = useState(false);

  // Cooldown countdown
  useEffect(() => {
    if (coinCooldown > 0) {
      const timer = setInterval(() => {
        setCoinCooldown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [coinCooldown]);

  // Set Bingle initial message on chat open
  useEffect(() => {
    if (showAiChat) {
      const greetings = {
        happy: "오늘 기분이 참 상쾌해요! 😊 주인님도 오늘 기분 좋은 일이 있으셨나요? 저와 힐링 에너지를 나눠봐요! 💬",
        sleeping: "쿠울... 앗, 주인님 오셨군요! 💤 깊은 수면 중이었지만 주인님과 소통할 준비는 완료되었어요! 오늘 하루 어떤 고민이 있으셨나요?",
        angry: "후우... 마음에 스트레스 열이 끓어올라요! 😤 주인님도 요즘 과도한 일에 쫓기고 계신가요? 제게 이야기를 털어놓고 식혀봐요.",
        hot: "아앗 뜨거워요! 🥵 몸이 말랑말랑 녹아내릴 것 같아 조언이 필요해요... 무엇이 마음의 문단속을 방해하는지 이야기해주세요!",
        crying: "흐아앙... 오늘은 마음 한구석이 조금 쓸쓸해요. 😭 그래도 주인님과 대화를 나누다 보면 슬픈 비도 그칠 거예요...",
        excited: "와아! 젤리처럼 둠칫둠칫 신나는 날이에요! 🤩 주인님도 오늘 행복한 자극을 받고 싶다면 저랑 재미있게 떠들어봐요! 🎉",
        tired: "하아암... 에너지가 바닥나서 말랑해졌어요... 🥱 그래도 주인님이 저를 찾아와주셔서 기뻐요! 편하게 마인드 케어 토크를 해봐요.",
        shocked: "앗 깜짝이야! 😲 심장이 쿵 시원해지는 소리가 들렸어요! 우리 오늘 정서 주파수를 제대로 조율해볼까요?",
        frozen: "와아! 꽁꽁 얼어붙어서 아주 아늑해요! 🥶 주인님의 과부하 마음도 꽁꽁 얼려서 가라앉힐 수 있는 치유 상담소에 오신 걸 환영해요!"
      };
      const initialText = greetings[characterState] || greetings.happy;
      setChatMessages([
        { id: 'init', sender: 'bingle', text: initialText, time: new Date() }
      ]);
    }
  }, [showAiChat]);

  const handleHarvestCoins = () => {
    if (coinCooldown > 0) {
      showToast(`⏳ 발전기가 아직 과열 상태입니다! ${coinCooldown}초 후에 다시 수확해주세요.`);
      return;
    }
    const currentCoins = gameState?.mindCoins !== undefined ? gameState.mindCoins : 120;
    updateGameState({
      mindCoins: currentCoins + 15
    });
    setCoinCooldown(30);
    gainXP(8);
    showToast("🪙 찌릿찌릿! 마음 코인 발전기 수확 완료! +15 코인 & +8 XP 획득!");
  };

  const handleSendChatMessage = (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    // 1. Add User Message
    const userMsg = { id: Date.now() + Math.random(), sender: 'user', text: text, time: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsBingleTyping(true);

    // 2. Analyze response keywords and generate reply
    setTimeout(() => {
      let bingleReply = "";
      const lower = text.toLowerCase();

      if (lower.includes("피곤") || lower.includes("지쳐") || lower.includes("힘들어") || lower.includes("귀찮") || lower.includes("졸려") || lower.includes("번아웃") || lower.includes("방전")) {
        bingleReply = "아구구.. 주인님도 에너지가 많이 방전되었군요! 🥱 무리해서 채찍질하지 말고 냉장실 문을 닫아두고 푹 쉬는 게 최고의 처방이에요! 제가 지켜줄게요.";
      } else if (lower.includes("스트레스") || lower.includes("화나") || lower.includes("짜증") || lower.includes("싫어") || lower.includes("속상")) {
        bingleReply = "그럴 땐 번아웃 카카오 🍫나 시원한 소화수 💧를 마시면서 마찰열을 서서히 식혀보아요. 제 온도 조절 장치도 주인님의 평온함을 위해 대기 중이랍니다! 😤";
      } else if (lower.includes("슬퍼") || lower.includes("우울") || lower.includes("눈물") || lower.includes("힘듦") || lower.includes("외롭")) {
        bingleReply = "토닥토닥.. 점토가 말랑말랑해서 가끔 찌그러지듯이, 우리 마음도 눈물로 찌그러질 때가 있어요. 😭 슬픈 마음은 흘려보내고, 달콤한 딸기 케이크 🍰로 위로해 줄게요. 힘내요!";
      } else if (lower.includes("칭찬") || lower.includes("좋아") || lower.includes("사랑") || lower.includes("귀여")) {
        bingleReply = "와아! 헤헤.. 그런 칭찬을 들으니 제 온도가 12°C로 순식간에 녹아내리며 신나져요! 🤩 주인님은 언제나 제 최고의 마음 수호자예요! 사랑해요 💖";
      } else if (lower.includes("산책") || lower.includes("운동") || lower.includes("걷기") || lower.includes("숲")) {
        bingleReply = "산책은 다리 근육의 온기를 모으고 머리를 맑게 식혀주는 마법의 물리에요! 🏃 500보 이상 걸어서 보상 식재료도 얻고 맑은 바람을 쐬러 나가볼까요?";
      } else if (lower.includes("일") || lower.includes("공부") || lower.includes("회사") || lower.includes("업무") || lower.includes("시험")) {
        bingleReply = "집중해서 노력하는 것도 좋지만, 집중 포모도로 타이머 ⏱️가 끝나면 반드시 일과 휴식의 문을 닫는 습관을 들여보아요! 문단속이 번아웃 극복의 핵심이랍니다! 🚪";
      } else if (lower.includes("상점") || lower.includes("동전") || lower.includes("코인") || lower.includes("돈") || lower.includes("사기") || lower.includes("식재료")) {
        bingleReply = "상점 🛒에 가시면 9가지의 귀엽고 다양한 힐링 식재료들을 코인으로 살 수 있어요! 매일 출석체크 퀘스트나 저와의 대화로 코인을 부지런히 모아보세요! 🪙";
      } else {
        bingleReply = "주인님의 고유한 주파수 진동을 완벽히 흡수 완료! 📡 무슨 이야기를 하든 전 주인님의 편이에요. 저와 따뜻한 마음의 온도를 이어가며 오늘도 차분하게 치유해봐요! 🫧";
      }

      const bingleMsg = { id: Date.now() + Math.random(), sender: 'bingle', text: bingleReply, time: new Date() };
      setChatMessages(prev => [...prev, bingleMsg]);
      setIsBingleTyping(false);

      // Award Coins and XP!
      const currentCoins = gameState?.mindCoins !== undefined ? gameState.mindCoins : 120;
      updateGameState({
        mindCoins: currentCoins + 10
      });
      gainXP(5);
      showToast("💬 대화 소통 완료! +10 코인 & +5 XP가 충전되었습니다! 🪙");
    }, 1200);
  };

  // Work Focus Session states
  const [focusTimeLeft, setFocusTimeLeft] = useState(0);
  const [focusDuration, setFocusDuration] = useState(60); // default 60s
  const [isFocusActive, setIsFocusActive] = useState(false);
  const focusIntervalRef = useRef(null);

  // 🌤️ Weather API States
  const [outdoorTemp, setOutdoorTemp] = useState(22); // Default fallback temperature
  const [weatherDesc, setWeatherDesc] = useState('맑음 🌤️');
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // 🌤️ Fetch Real Outdoor Weather Data
  useEffect(() => {
    setWeatherLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeatherData(lat, lon);
        },
        () => {
          // Geolocation blocked or failed: Fallback to Seoul coordinates
          fetchWeatherData(37.566, 126.978);
        }
      );
    } else {
      fetchWeatherData(37.566, 126.978);
    }
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const data = await res.json();
      if (data?.current_weather) {
        const temp = data.current_weather.temperature;
        const code = data.current_weather.weathercode;
        setOutdoorTemp(temp);

        // Convert WMO weather codes to descriptive emojis
        let desc = '맑음 🌤️';
        if (code >= 1 && code <= 3) desc = '구름 조금 ⛅';
        else if (code >= 45 && code <= 48) desc = '안개 🌫️';
        else if (code >= 51 && code <= 67) desc = '비 🌧️';
        else if (code >= 71 && code <= 77) desc = '눈 ❄️';
        else if (code >= 80 && code <= 82) desc = '소나기 🌦️';
        else if (code >= 95) desc = '천둥번개 ⛈️';
        
        setWeatherDesc(`${desc}`);
        console.log(`Weather synchronized successfully: ${temp}°C, code ${code}`);
      }
    } catch (e) {
      console.error('Failed to sync weather from Open-Meteo:', e);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Auto-sync Bingle mood based on temperature and focus state
  useEffect(() => {
    // If the user has manually synchronized Bingle to a specific emotion, suspend auto-sync!
    if (manualMood) return;

    if (characterState === 'sleeping' || characterState === 'shocked') return; 
    
    // Tired state during active focus session (more than halfway done)
    if (isFocusActive && focusTimeLeft > 0 && focusTimeLeft <= focusDuration / 2) {
      if (characterState !== 'tired') {
        updateGameState({ characterState: 'tired' });
      }
      return;
    }

    if (mindTemperature >= 75) {
      if (characterState !== 'hot') updateGameState({ characterState: 'hot' });
    } else if (mindTemperature >= 45) {
      if (characterState !== 'angry') updateGameState({ characterState: 'angry' });
    } else if (mindTemperature <= 15) {
      if (characterState !== 'frozen') updateGameState({ characterState: 'frozen' });
    } else {
      if (characterState !== 'happy') updateGameState({ characterState: 'happy' });
    }
  }, [mindTemperature, characterState, isFocusActive, focusTimeLeft, focusDuration, manualMood]);

  // Focus timer & heat rise simulation (coupled with real weather)
  useEffect(() => {
    if (isFocusActive && isDoorOpen) {
      focusIntervalRef.current = setInterval(() => {
        setFocusTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(focusIntervalRef.current);
            setIsFocusActive(false);
            handleFocusSuccess();
            return 0;
          }
          
          // Thermal heat physics: Base rate + outdoor temperature heat factor
          const baseRise = 2.0;
          const outdoorFactor = outdoorTemp > 25 ? (outdoorTemp - 25) * 0.12 : 0;
          const totalRise = baseRise + outdoorFactor;

          const nextTemp = Math.min(100, mindTemperature + totalRise);
          updateGameState({ mindTemperature: nextTemp });

          return prev - 1;
        });
      }, 1000);
    } else {
      if (focusIntervalRef.current) clearInterval(focusIntervalRef.current);
    }

    return () => {
      if (focusIntervalRef.current) clearInterval(focusIntervalRef.current);
    };
  }, [isFocusActive, isDoorOpen, mindTemperature, outdoorTemp]);

  const handleFocusSuccess = () => {
    gainXP(50);
    
    // Add cool water & lavender milk reward to pantry
    const currentInv = gameState?.fridgeInventory || [];
    const updatedInv = currentInv.map(item => {
      if (item.id === 'water') return { ...item, count: item.count + 2 };
      if (item.id === 'milk') return { ...item, count: item.count + 1 };
      return item;
    });

    updateGameState({ 
      mindTemperature: 12, // perfect cozy cold
      fridgeInventory: updatedInv,
      characterState: 'sleeping', // Bingle enters rest
      logs: [
        {
          date: new Date().toISOString(),
          type: 'focus_success',
          text: `🎯 집중 업무 수련 달성: ${focusDuration}초 집중 수리에 성공하여 가동 필터 작동! 12°C로 급속 동결 완료. (XP +50, 탄산수 2개 & 라벤더 우유 1개 획득)`
        },
        ...(gameState?.logs || [])
      ]
    });

    showToast('🎉 집중 업무 완료! 냉장실 기온이 아늑하게 내려앉고, 치유 보관대에 [탄산 소화수 💧] 2캔과 [라벤더 우유 🥛] 1병이 충전되었습니다!');
  };

  // Direct consumption from shelf with high-fidelity flying food animation
  const handleUseItemDirect = (itemId) => {
    const inventory = gameState?.fridgeInventory || [];
    const item = inventory.find(i => i.id === itemId);
    if (!item || item.count <= 0) return;

    // 1. Tactile UI Polish: Immediately decrement item count so it vanishes from shelf instantly
    const updatedInventory = inventory.map(i => {
      if (i.id === itemId) return { ...i, count: i.count - 1 };
      return i;
    });

    updateGameState({
      fridgeInventory: updatedInventory
    });

    // 2. Generate a flying food item
    const uniqueId = Date.now() + Math.random();
    // Random starting x coordinate from shelf center
    const startX = (Math.random() - 0.5) * 160; 
    const newFlying = {
      id: uniqueId,
      itemId: itemId,
      icon: item.icon,
      startX: startX
    };
    setFlyingFoods(prev => [...prev, newFlying]);

    // 3. Clear manual mood sync so Bingle reacts naturally to food temperature changes!
    setManualMood(null);
  };

  // Apply actual physics effects when food hits Bingle's mouth!
  const applyItemEffect = (itemId) => {
    const inventory = gameState?.fridgeInventory || [];
    // Note: Inventory count is already decremented in handleUseItemDirect
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    let updatedTemp = mindTemperature;
    let xpGranted = 0;
    let stateUpdate = {};

    if (item.type === 'cool') {
      updatedTemp = Math.max(12, mindTemperature + item.effect);
      stateUpdate = { mindTemperature: updatedTemp };
      showToast(`💧 [${item.name}]을 먹여 마음이 시원해졌습니다! 기온: ${Math.round(updatedTemp)}°C`);
    } else if (item.type === 'xp') {
      xpGranted = item.effect;
      gainXP(xpGranted);
      showToast(`🍊 [${item.name}]을 먹여 활력이 솟아납니다! +${xpGranted} XP`);
    } else if (item.type === 'calm') {
      updatedTemp = item.effect; // Instantly go to perfect 12C
      stateUpdate = { mindTemperature: updatedTemp, characterState: 'happy' };
      showToast(`🍫 [${item.name}]을 먹여 번아웃 열기가 식고 안정 12°C에 도달했습니다!`);
    } else if (item.type === 'heal') {
      updatedTemp = Math.max(12, mindTemperature - item.effect);
      xpGranted = 15;
      gainXP(xpGranted);
      stateUpdate = { mindTemperature: updatedTemp };
      showToast(` Melon! 🍈 [${item.name}]을 먹여 마음을 회복했습니다! 기온 -10°C / +15 XP`);
    } else if (item.type === 'sleep') {
      updatedTemp = Math.max(12, mindTemperature + item.effect);
      stateUpdate = { mindTemperature: updatedTemp, characterState: 'sleeping' };
      showToast(`🥛 [${item.name}]을 먹여 깊은 회복 수면에 빠져듭니다... 💤`);
    }

    updateGameState({
      ...stateUpdate,
      logs: [
        {
          date: new Date().toISOString(),
          type: 'use_item',
          text: `🍎 선반 다이렉트 섭취: [${item.name}]을 냉장고 내부에서 꺼내 복용하여 안정감을 회복했습니다.`
        },
        ...(gameState?.logs || [])
      ]
    });

    // Trigger Bingle eating splash reaction!
    setLastFedType(itemId);
    setFeedTrigger(prev => prev + 1);
  };

  // Toggle Door (Work-Life Separation Boundary)
  const handleToggleDoor = () => {
    // Clear manual mood when door is toggled so Bingle automatically shifts to correct sleeping/alert states!
    setManualMood(null);

    const nextState = !isDoorOpen;
    setIsDoorOpen(nextState);
    updateGameState({ isDoorOpen: nextState });

    if (nextState) {
      showToast('🚪 냉장고 문이 활짝 열렸습니다! 실외 온기 및 집중 업무열이 유입됩니다.');
      setFocusTimeLeft(focusDuration);
      setIsFocusActive(true);
    } else {
      showToast('🚪 냉장고 문을 닫았습니다! 실온 유입을 완벽 차단하고 일상의 안락한 밤이 시작됩니다. 💤');
      setIsFocusActive(false);
      updateGameState({ 
        mindTemperature: 12,
        characterState: 'sleeping',
        logs: [
          {
            date: new Date().toISOString(),
            type: 'close_door',
            text: '🚪 퇴근 문단속: 냉장고 문을 닫아 실온 유입을 차단하고 빙글이를 휴식 상태로 전환했습니다.'
          },
          ...(gameState?.logs || [])
        ]
      });
    }
  };

  const handleBingleClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 350) {
      const nextCount = clickCount + 1;
      setClickCount(nextCount);
      if (nextCount >= 2) {
        // Shocked trigger! Save original state to restore
        const originalState = characterState;
        if (originalState !== 'shocked') {
          updateGameState({ characterState: 'shocked' });
          showToast('⚡ 빙글이가 찌릿! 깜짝 놀라 방어 모드에 돌입했습니다!');
          
          setTimeout(() => {
            updateGameState({ characterState: originalState });
            setClickCount(0);
          }, 2000);
        }
      }
    } else {
      setClickCount(1);
    }
    setLastClickTime(now);
  };

  const handleCoolingVent = () => {
    // Clear manual mood so Bingle reacts naturally to the ice blast
    setManualMood(null);

    const cooled = Math.max(12, mindTemperature - 18);
    updateGameState({ mindTemperature: cooled });
    gainXP(10);
    showToast('🌬️ 후우~ 냉장고 급속 송풍 모터 가동! 내부 기온이 -18°C 내려갑니다!');
  };

  const handleRestock = () => {
    updateGameState({ activePantryTab: 'shop' });
    navigate(screens.PANTRY);
  };

  const handleSelectEmotion = (stateName) => {
    // Set manual mood to override temperature auto-sync!
    setManualMood(stateName);

    updateGameState({ 
      characterState: stateName,
      logs: [
        {
          date: new Date().toISOString(),
          type: 'mood_sync',
          text: `🎭 감정 주파수 조율: 빙글이의 정서가 [${stateName}] 상태로 조율되었습니다.`
        },
        ...(gameState?.logs || [])
      ]
    });
    gainXP(5);
    showToast(`🎭 빙글이와 정서 싱크 완료! [${stateName}] 기분을 공유합니다.`);
  };

  // Check how many of today's checklist tasks are complete
  const isWalkDone = steps >= 500;
  const isDiaryDone = (gameState?.logs || []).some(log => log.type === 'diary' && new Date(log.date).toDateString() === new Date().toDateString());
  const isBreathDone = (gameState?.logs || []).some(log => log.type === 'breath' || log.type === 'use_item');

  const selectedTheme = gameState?.fridgeTheme || 'mint';
  const hasFoodOnShelves = gameState?.fridgeInventory && gameState.fridgeInventory.some(item => item.count > 0);

  return (
    <div className={`fridge-bg fridge-bg-${selectedTheme} ${['black', 'wood'].includes(selectedTheme) ? 'text-white' : 'text-[#28180b]'} min-h-full flex flex-col items-center overflow-x-hidden relative font-['Gaegu'] select-none`}>
      <div className="halftone-bg" />

      {/* Main Container Dashboard */}
      <main className="w-full max-w-md pt-4 pb-28 px-4 flex flex-col gap-6 min-h-full relative z-10">
        
        {/* Level & XP Progress Card */}
        <section className="comic-panel bg-white p-3.5 border-4 border-black shadow-[4px_4px_0_0_#000] relative">
          <div className="absolute -top-3.5 -left-3 bg-[#ff8c69] border-4 border-black px-3.5 py-1 font-black text-black transform -rotate-1 z-10 shadow-[3px_3px_0_0_#000] text-sm">
            LEVEL {userLevel} 마음 가디언
          </div>
          
          <div className="absolute -top-3.5 -right-3 bg-yellow-400 border-4 border-black px-3 py-1 font-black text-black transform rotate-1 z-10 shadow-[3px_3px_0_0_#000] text-sm flex items-center gap-1">
            <span>🪙</span>
            <span>{gameState?.mindCoins !== undefined ? gameState.mindCoins : 120} 코인</span>
          </div>
          
          <div className="mt-2.5 flex justify-between items-center text-xs font-black text-gray-500">
            <span>마찰 온기 에너지 (XP)</span>
            <span>{userXp} / {maxXp} XP</span>
          </div>
          <div className="w-full bg-gray-100 border-3 border-black h-5 rounded-full overflow-hidden mt-1 shadow-inner relative flex items-center">
            <motion.div 
              className="h-full bg-[#67f9e1]" 
              animate={{ width: `${(userXp / maxXp) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-black">
              {Math.round((userXp / maxXp) * 100)}% 동력 공급 중
            </div>
          </div>
        </section>

        {/* 📋 Burnout Psychological Status Card */}
        <section className="comic-panel bg-[#fef3c7] p-3.5 border-4 border-black shadow-[4px_4px_0_0_#000] flex flex-col gap-2 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xl">📊</span>
              <span className="font-black text-sm text-[#28180b]">내 마음의 번아웃 진단서</span>
            </div>
            <button
              onClick={() => {
                updateGameState({ hasCompletedOnboarding: false });
                navigate(screens.STORY);
              }}
              className="bg-[#ff8c69] hover:bg-[#ff7b52] text-black border-2 border-black font-black text-xs px-2 py-0.5 rounded shadow-[1.5px_1.5px_0_0_#000] active:translate-y-0.5 active:shadow-none transition-all"
            >
              다시 검사하기 🔄
            </button>
          </div>

          <div className="bg-white border-2 border-black rounded-lg p-2 flex justify-between items-center mt-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-bold leading-none">진단 결과</span>
              <span className="text-sm font-black text-black mt-1 leading-none">
                {gameState.burnoutTitle || '진단 미완료'} (온도 {gameState.burnoutScore ?? 0}점)
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs bg-[#e0f2fe] border-2 border-black font-black px-1.5 py-0.5 rounded shadow-[1px_1px_0_0_#000]">
                {gameState.burnoutLevel ? `${gameState.burnoutLevel}단계 수호자` : '미진단'}
              </span>
            </div>
          </div>

          <p className="text-[11px] font-bold text-gray-600 leading-tight">
            {gameState.burnoutLevel === 1 && "아주 건강하거나 스트레스가 경미한 수준입니다. 빙글이와 편안하게 감정 온도를 이어가세요!"}
            {gameState.burnoutLevel === 2 && "업무 마찰열이 서서히 유입되어 기온이 높아지고 있습니다. 일과 삶의 경계를 다잡으세요!"}
            {gameState.burnoutLevel === 3 && "피로가 만성화되어 마음에 열이 끓고 있습니다. 빙글이 급속 냉방과 소소한 산책이 꼭 필요해요!"}
            {gameState.burnoutLevel === 4 && "인지 능력이 멍해지고 감정 기복이 생기는 위험 신호입니다! 냉장실을 닫고 충분한 치유 간식을 먹이세요."}
            {gameState.burnoutLevel === 5 && "에너지가 고갈되어 즉각적인 치유 조치가 시급합니다! 8주 점진적 치유 루틴에 집중하세요."}
            {!gameState.burnoutLevel && "초반 스토리보드와 마음 진단을 다시 시작하여 내 감정 상태에 맞는 주차별 맞춤 케어를 처방받으세요!"}
          </p>
        </section>

        {/* ==========================================================
           CORE INTERACTIVE 3D REFRIGERATOR COCKPIT
           ========================================================== */}
        <section className="relative">
          <div className={`fridge-cabinet-exterior theme-${selectedTheme} border-4 border-black shadow-[8px_8px_0_0_#28180b] rounded-[2.5rem] relative overflow-hidden transition-all duration-500 ${
            isDoorOpen ? 'doors-open' : ''
          }`} style={{ height: '510px' }}>
            
            {/* ── INTERIOR CABIN (Visible when door is open) ── */}
            <div 
              className={`fridge-cabinet-interior theme-${selectedTheme} ${
                characterState === 'sleeping' ? 'fridge-sleeping-mode' : ''
              }`}
              style={{
                backgroundImage: characterState === 'sleeping' 
                  ? 'linear-gradient(180deg, #0a1128 0%, #101f42 50%, #1d3570 100%)' 
                  : `url('${import.meta.env.BASE_URL || '/'}images/fridge_shelves_bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="fridge-led-strip" />
              <div className="fridge-frost-mist" />

              {/* Glowing moonlight aura and starry constellation elements when sleeping */}
              {characterState === 'sleeping' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                  {/* Starry Night Sky shimmering stars */}
                  <div className="absolute top-10 left-12 text-yellow-200/40 text-sm animate-pulse">★</div>
                  <div className="absolute top-24 right-16 text-yellow-200/50 text-xs animate-ping" style={{ animationDuration: '4s' }}>✦</div>
                  <div className="absolute top-44 left-24 text-yellow-200/30 text-lg animate-pulse" style={{ animationDuration: '3s' }}>★</div>
                  <div className="absolute top-8 right-32 text-yellow-100/60 text-xs animate-pulse">✦</div>
                  <div className="absolute top-36 right-8 text-yellow-200/40 text-sm animate-pulse" style={{ animationDuration: '5s' }}>★</div>
                  
                  {/* Giant, super glowing full moon aura directly centered behind Bingle for ultimate visibility */}
                  <div 
                    className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full w-[260px] h-[260px] pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(165,243,252,0.3) 0%, rgba(34,211,238,0.1) 45%, rgba(0,0,0,0) 70%)',
                      filter: 'blur(16px)',
                      mixBlendMode: 'screen',
                    }}
                  />
                  
                  {/* Glowing crescent moon in corner */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5, y: -20 }}
                    animate={{ opacity: 0.85, scale: 1, y: 0 }}
                    className="absolute top-6 right-8 w-9 h-9 rounded-full shadow-[inset_-9px 9px 0 0 #fef08a] filter drop-shadow(0 0 10px rgba(254, 240, 138, 0.6))"
                  />
                  
                  {/* Cozy floating cloud */}
                  <motion.div
                    animate={{ x: [-10, 10, -10] }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                    className="absolute top-12 left-4 text-white/10 text-3xl font-bold"
                  >
                    ☁️
                  </motion.div>
                </div>
              )}

              {/* Upper shelf: Focus Tablet screen */}
              <div className="px-4 pt-1.5 z-20">
                <div className="fridge-smart-display text-white p-2.5 border-2 border-black rounded-xl">
                  <div className="flex justify-between items-center text-[10px] font-black tracking-wider text-cyan-400">
                    <span>Smart Focus Center</span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                      실외기온: {outdoorTemp.toFixed(1)}°C {weatherDesc}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-400 leading-none">집중 타이머</span>
                      <span className="text-lg font-mono font-black text-red-400 leading-none mt-1">
                        {Math.floor(focusTimeLeft / 60)}:{(focusTimeLeft % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    
                    {isFocusActive ? (
                      <span className="text-[10px] bg-red-950/80 border border-red-500 text-red-300 font-bold px-2 py-0.5 rounded leading-tight text-center">
                        업무열기 유입 🌡️ (+{(2.0 + (outdoorTemp > 25 ? (outdoorTemp - 25) * 0.12 : 0)).toFixed(2)}°C/s)
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setFocusTimeLeft(focusDuration);
                          setIsFocusActive(true);
                        }}
                        className="bg-cyan-500 hover:bg-cyan-400 border border-black font-black text-[10px] text-black px-2.5 py-0.5 rounded shadow-[1.5px_1.5px_0_0_#000] active:translate-y-0.5 active:shadow-none"
                      >
                        집중 시작 ⚡
                      </button>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-800 h-1.5 border border-gray-700 rounded-full overflow-hidden mt-1.5">
                    <div className="h-full bg-cyan-400" style={{ width: `${(focusTimeLeft / focusDuration) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Main Shelf: Animated Bingle Resides here */}
              <div className="flex-1 flex flex-col items-center justify-center relative z-10 pb-2">
                
                {/* Temperature warning badge */}
                <div className="absolute top-1 bg-white/95 border-2 border-black font-black text-[10px] px-2 py-0.5 rounded shadow-[1.5px_1.5px_0_0_#000] z-20">
                  냉각 온도: {Math.round(mindTemperature)}°C {mindTemperature >= 75 ? '🌋 멜팅 위험!' : mindTemperature >= 45 ? '🔥 피로누적' : '❄️ 평온'}
                </div>

                {/* Big Breathing Bingle Character */}
                <BingleCharacter 
                  state={characterState} 
                  size={155} 
                  onClick={handleBingleClick} 
                  feedTrigger={feedTrigger}
                  fedItemType={lastFedType}
                  isHungry={isBingleHungry}
                />

                {/* Flying foods layer */}
                <AnimatePresence>
                  {flyingFoods.map(food => (
                    <motion.div
                      key={food.id}
                      initial={{ 
                        x: `calc(-50% + ${food.startX}px)`, 
                        y: 120, // Start around the shelf area relative to this container
                        scale: 0.7,
                        opacity: 0,
                        rotate: 0 
                      }}
                      animate={{ 
                        x: '-50%', // Centered horizontally relative to Bingle
                        y: -30, // Fly up to Bingle's mouth!
                        scale: [0.7, 1.4, 1.0], // Pop up then hit Bingle
                        opacity: 1,
                        rotate: 360,
                      }}
                      exit={{
                        scale: 0,
                        opacity: 0
                      }}
                      transition={{ 
                        duration: 0.85, 
                        ease: [0.25, 0.8, 0.25, 1.1] // Beautiful wobbly spring ease
                      }}
                      onAnimationComplete={() => {
                        applyItemEffect(food.itemId);
                        setFlyingFoods(prev => prev.filter(f => f.id !== food.id));
                      }}
                      style={{
                        left: '50%',
                        backgroundColor: 
                          food.itemId === 'water' ? '#e0f2fe' :
                          food.itemId === 'orange' ? '#ffedd5' :
                          food.itemId === 'chocolate' ? '#fef3c7' :
                          food.itemId === 'melon' ? '#ecfeff' :
                          food.itemId === 'milk' ? '#faf5ff' :
                          food.itemId === 'icecream' ? '#fce7f3' :
                          food.itemId === 'apple' ? '#dcfce7' :
                          food.itemId === 'coffee' ? '#fef3c7' : '#ffe4e6'
                      }}
                      className="absolute z-50 pointer-events-none w-10 h-10 rounded-xl border-3 border-black flex items-center justify-center shadow-[3px_3px_0_0_#000]"
                    >
                      <FoodVector id={food.itemId} size={28} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Speech dialog bubble */}
                <div className="speech-bubble bg-white border-2 border-black font-black px-4.5 py-1 rounded-xl text-xs mt-2.5 shadow-[2.5px_2.5px_0_0_#000] relative max-w-[85%] text-center">
                  {characterState === 'sleeping' && "쿨쿨.. 단잠을 자며 아늑하게 충전하고 있어요.. 💤"}
                  {characterState === 'happy' && "문을 열면 외부의 뜨거운 업무 열기가 유입됩니다! 🌬️"}
                  {characterState === 'angry' && "후끈후끈! 몸에 스트레스 열이 오르고 있어요! 🥵"}
                  {characterState === 'hot' && "아앗!! 점토가 끈적하게 녹아내려요!! 문을 닫아주세요! 🌋"}
                  {characterState === 'crying' && "흐아앙... 너무 슬프고 힘들어서 마음이 녹아내려요... 😭"}
                  {characterState === 'excited' && "와아!! 에너지가 넘쳐요! 젤리처럼 신나게 뜀박질하는 중! 🤩"}
                  {characterState === 'tired' && "모든 배터리가 소진되었어요.. 아무것도 할 힘이 없어요.. 🥱"}
                  {characterState === 'shocked' && "앗 깜짝이야!! 갑자기 심장이 시원하게 쿵 내려앉았어! 😲"}
                  {characterState === 'frozen' && "와아.. 온 세상이 단단하고 꽁꽁 얼어붙어서 완벽하게 아늑해! 🥶"}
                </div>
              </div>

              {/* ── 3-TIER LAYERED GLASS REFRIGERATOR SHELVES (ORGANIZED IN 3 DECKS) ── */}
              <div className="glass-shelf-layered flex flex-col gap-1 px-3 py-1 relative z-20 border-t-2 border-black/10 bg-white/5 backdrop-blur-[2px] mt-1 no-scrollbar overflow-y-auto max-h-[175px]">
                {[
                  {
                    name: "🧁 3층 디저트 진열대",
                    items: ['chocolate', 'icecream', 'cake']
                  },
                  {
                    name: "🍏 2층 신선 과일 진열대",
                    items: ['orange', 'melon', 'apple']
                  },
                  {
                    name: "🥤 1층 마음 음료 진열대",
                    items: ['water', 'milk', 'coffee']
                  }
                ].map((shelf, shelfIdx) => (
                  <div key={shelfIdx} className="relative flex flex-col pt-0.5 pb-1 shrink-0">
                    {/* Shelf Section Title */}
                    <div className="flex justify-between items-center px-1 mb-0.5 text-[8.5px] font-black text-black/55 uppercase tracking-wider leading-none">
                      <span>{shelf.name}</span>
                    </div>
                    
                    {/* Shelf Plate Stands */}
                    <div className="flex gap-4 justify-around items-end h-10 px-2 relative z-10">
                      {shelf.items.map(itemId => {
                        const item = gameState.fridgeInventory.find(i => i.id === itemId);
                        const count = item ? item.count : 0;
                        const hasItem = count > 0;
                        
                        return (
                          <div key={itemId} className="relative flex flex-col items-center justify-end w-10 h-10">
                            {/* Stand Plate dish shadow */}
                            <div 
                              className="absolute bottom-0 w-9 h-2 rounded-full border border-black/20 shadow-inner pointer-events-none"
                              style={{ 
                                backgroundColor: hasItem ? item.color : 'rgba(0,0,0,0.06)',
                                opacity: hasItem ? 0.7 : 0.3
                              }}
                            />
                            
                            {hasItem ? (
                              /* Tactile wobbly 2.5D Drag-and-Drop Food Container */
                              <motion.div
                                drag
                                dragSnapToOrigin={true}
                                dragElastic={0.45}
                                dragTransition={{ bounceStiffness: 400, bounceDamping: 14 }}
                                onDrag={(e, info) => handleDrag(e, info)}
                                onDragEnd={(e, info) => handleDragEnd(e, info, itemId)}
                                onClick={() => handleUseItemDirect(itemId)}
                                whileHover={{ scale: 1.25, y: -4, zIndex: 100 }}
                                whileTap={{ scale: 0.9, cursor: 'grabbing' }}
                                style={{ 
                                  touchAction: 'none',
                                  backgroundColor: item.color
                                }}
                                className="w-8.5 h-8.5 rounded-lg border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0_0_#000] relative cursor-pointer z-10 active:z-50 shrink-0"
                                title={`${item.name} (클릭하거나 끌어서 빙글이에게 먹이세요!)`}
                              >
                                <FoodVector id={itemId} size={22} />
                                
                                {/* Wobbly count badge */}
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black text-[8px] border border-black rounded-full px-1 leading-none py-0.25 shadow-[0.5px_0.5px_0_0_#000] pointer-events-none">
                                  {count}
                                </span>
                              </motion.div>
                            ) : (
                              /* Empty plate dotted slot encouraging restock shopping */
                              <div 
                                onClick={() => {
                                  showToast(`🛒 [${item?.name || itemId}] 진열대가 비었습니다! 아래 [장보기 🛒]로 풍성하게 채워주세요!`);
                                }}
                                className="w-8.5 h-8.5 rounded-lg border border-dashed border-black/25 flex items-center justify-center opacity-30 cursor-pointer hover:opacity-50 transition-all mb-0.5 bg-black/5"
                                title="식재료 품절 (장보기로 채우기)"
                              >
                                <span className="text-[11px] font-black opacity-60 leading-none">{item?.icon || '❓'}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* 3D Transparent Acrylic Shelf Deck Bar */}
                    <div className="w-full h-1 bg-gradient-to-r from-white/20 via-white/60 to-white/20 border-y border-black/10 mt-0.5 rounded-full shadow-sm" />
                  </div>
                ))}
              </div>

              {/* Drawer & controls footer */}
              <div className="bg-[#28180b]/10 h-11 flex items-center justify-around px-2 z-20 border-t border-black/10">
                <button
                  onClick={handleCoolingVent}
                  className="bg-cyan-300 hover:bg-cyan-200 border-2 border-black font-black text-[10px] px-1.5 py-1 rounded shadow-[1.5px_1.5px_0_0_#000] active:translate-y-0.5 active:shadow-none flex items-center gap-0.5 text-black"
                >
                  <span className="material-symbols-outlined text-xs font-black">ac_unit</span>
                  <span>급속 송풍 🌬️</span>
                </button>

                <button
                  onClick={() => setShowAiChat(true)}
                  className="bg-yellow-400 hover:bg-yellow-300 border-2 border-black font-black text-[10px] px-1.5 py-1 rounded shadow-[1.5px_1.5px_0_0_#000] active:translate-y-0.5 active:shadow-none flex items-center gap-0.5 text-black"
                >
                  <span className="material-symbols-outlined text-xs font-black">forum</span>
                  <span>AI 마인드톡 💬</span>
                </button>

                <button
                  onClick={handleRestock}
                  className="bg-[#67f9e1] hover:bg-[#4be6cb] border-2 border-black font-black text-[10px] px-1.5 py-1 rounded shadow-[1.5px_1.5px_0_0_#000] active:translate-y-0.5 active:shadow-none flex items-center gap-0.5 text-black"
                >
                  <span className="material-symbols-outlined text-xs font-black">shopping_cart</span>
                  <span>장보기 🛒</span>
                </button>

                <button
                  onClick={() => {
                    updateGameState({ activePantryTab: 'inventory' });
                    navigate(screens.PANTRY);
                  }}
                  className="bg-[#ffcb2f] hover:bg-[#ffd55a] border-2 border-black font-black text-[10px] px-1.5 py-1 rounded shadow-[1.5px_1.5px_0_0_#000] active:translate-y-0.5 active:shadow-none flex items-center gap-0.5 text-black"
                >
                  <span className="material-symbols-outlined text-xs font-black">kitchen</span>
                  <span>치유 창고 🍎</span>
                </button>
              </div>
            </div>

            {/* ── EXTRACTABLE 3D DOUBLE DOORS (Closed State) ── */}
            <div className="fridge-double-doors">
              
              {/* LEFT DOOR */}
              <div className={`fridge-door-left theme-${selectedTheme} flex flex-col justify-between p-4`}>
                
                {/* 📝 Checklist Magnet Sticker */}
                <div className="fridge-magnet bg-[#fffef0] border-2 border-black p-2.5 shadow-[3px_3px_0_0_#000] rotate-[-2deg] flex flex-col gap-1 w-full max-w-[130px] z-30">
                  <div className="text-[10px] font-black border-b border-black pb-0.5 mb-1 text-center">📌 오늘의 수호 임무</div>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-gray-700">
                    <span className="material-symbols-outlined text-[11px] font-black text-green-600">{isWalkDone ? 'check_box' : 'check_box_outline_blank'}</span>
                    <span>산책 500보</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-gray-700">
                    <span className="material-symbols-outlined text-[11px] font-black text-green-600">{isDiaryDone ? 'check_box' : 'check_box_outline_blank'}</span>
                    <span>환기 일기</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-gray-700">
                    <span className="material-symbols-outlined text-[11px] font-black text-green-600">{isBreathDone ? 'check_box' : 'check_box_outline_blank'}</span>
                    <span>치료 보충</span>
                  </div>
                </div>

                {/* 🎨 Fridge Design Customizer Magnet */}
                <div className="fridge-magnet bg-[#fae8ff] border-2 border-black p-2 rounded-xl text-center shadow-[3px_3px_0_0_#000] rotate-[2deg] w-28 active:scale-95 transition-all z-30">
                  <span className="text-lg">🎨</span>
                  <div className="text-[9px] font-black text-black mt-0.5 leading-none">디자인 테마 선택</div>
                  <div className="flex gap-1 justify-center mt-1.5">
                    {[
                      { id: 'mint', color: '#87beaf' },
                      { id: 'peach', color: '#fed7aa' },
                      { id: 'ice', color: '#bae6fd' },
                      { id: 'black', color: '#374151' },
                      { id: 'wood', color: '#854d0e' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGameState({ fridgeTheme: t.id });
                          showToast(`🎨 냉장고 디자인 테마를 [${t.id.toUpperCase()}]로 변경했습니다!`);
                        }}
                        style={{ backgroundColor: t.color }}
                        className={`w-3.5 h-3.5 rounded-full border border-black focus:outline-none ${
                          selectedTheme === t.id ? 'ring-2 ring-yellow-400 scale-110' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* 🧪 & 📖 Left Door Magnet Widgets */}
                <div className="flex flex-col gap-2 z-30 self-start">
                  {/* 🧪 Bingle Vector Lab magnet */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowVectorLab(true);
                    }}
                    className="fridge-magnet bg-[#e0f2fe] hover:bg-[#bae6fd] border-2 border-black p-1.5 rounded-xl text-center shadow-[3px_3px_0_0_#000] rotate-[3deg] w-28 active:scale-95 transition-all"
                  >
                    <span className="text-lg">🧪</span>
                    <div className="text-[9px] font-black text-black mt-0.5 leading-none">벡터 연구실 도감</div>
                  </button>

                  {/* 📖 Onboarding Story Replay Magnet */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateGameState({ hasCompletedOnboarding: false });
                      navigate(screens.STORY);
                    }}
                    className="fridge-magnet bg-[#fffbeb] hover:bg-[#fef3c7] border-2 border-black p-1.5 rounded-xl text-center shadow-[3px_3px_0_0_#000] rotate-[-3deg] w-28 active:scale-95 transition-all"
                  >
                    <span className="text-lg">📖</span>
                    <div className="text-[9px] font-black text-black mt-0.5 leading-none">심리검사 & 스토리</div>
                  </button>
                </div>

                {/* Giant Left Handle */}
                <div 
                  onClick={handleToggleDoor}
                  className="fridge-handle-left"
                />
              </div>

              {/* RIGHT DOOR */}
              <div className={`fridge-door-right theme-${selectedTheme} flex flex-col justify-between items-end p-4`}>
                
                {/* 🌡️ Digital Temperature Screen */}
                <div className={`border-3 border-black p-2 rounded-xl text-center shadow-[3px_3px_0_0_#000] rotate-[1deg] w-28 z-30 ${
                  mindTemperature >= 75 ? 'bg-red-500 text-white animate-pulse' : 'bg-[#111827] text-[#00ff66]'
                }`}>
                  <div className="text-[8px] font-black opacity-80 uppercase tracking-widest leading-none">Core Temp</div>
                  <div className="text-lg font-mono font-black mt-1 leading-none">{Math.round(mindTemperature)}°C</div>
                  <div className="text-[8px] font-bold mt-1 opacity-70 leading-none">
                    {mindTemperature >= 75 ? '🌋 OVERHEAT' : mindTemperature >= 45 ? '🔥 WARNING' : '❄️ SYSTEM SAFE'}
                  </div>
                </div>

                {/* Real-time Outdoor Temp Gauge Magnet */}
                <div className="fridge-magnet bg-[#f0fdf4] border-2 border-black p-2 rounded-xl text-center shadow-[3px_3px_0_0_#000] rotate-[-2deg] w-28 z-30">
                  <span className="text-sm block">🌤️ 실외 센서</span>
                  <span className="text-xs font-black text-green-700 block mt-0.5">{outdoorTemp.toFixed(1)}°C</span>
                  <span className="text-[8px] font-bold text-gray-500 block leading-none mt-1">{weatherDesc}</span>
                </div>

                {/* Insta-View circular glass bubble: We can see Bingle breathing inside! */}
                <div 
                  onClick={handleToggleDoor}
                  className="w-32 h-32 rounded-full border-4 border-black bg-cyan-900/60 overflow-hidden relative shadow-[inset_0_4px_12px_rgba(0,0,0,0.6),3px_3px_0_0_#000] z-20 flex items-center justify-center cursor-pointer group"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.35)_0%,rgba(15,23,42,0.8)_80%)]" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-transparent to-white/10 pointer-events-none" />
                  
                  {/* Bingle is visibly floating inside the glass pane! */}
                  <div className="transform scale-[0.65] relative z-10 pointer-events-none">
                    <BingleCharacter state={characterState} size={150} />
                  </div>
                  
                  <div className="absolute bottom-2.5 bg-black/60 px-2 py-0.5 rounded border border-gray-700 text-[8px] font-black text-white pointer-events-none select-none">
                    INSTAVIEW WINDOW 🔎
                  </div>
                </div>

                {/* Smart memo sticker */}
                <div className="fridge-magnet bg-[#ffe4e6] border-2 border-black px-2.5 py-1.5 rounded-lg shadow-[2px_2px_0_0_#000] text-[10px] font-black text-red-600 rotate-[-4deg] max-w-[120px] text-center z-30">
                  🚪 더블 탭이나 핸들을 당겨 문을 여세요!
                </div>

                {/* 🪙 마음 코인 발전기 자석 */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHarvestCoins();
                  }}
                  className={`fridge-magnet bg-[#fef08a] hover:bg-[#fde047] border-2 border-black p-2 rounded-xl text-center shadow-[3px_3px_0_0_#000] rotate-[-2deg] w-28 active:scale-95 transition-all z-30 cursor-pointer ${
                    coinCooldown > 0 ? 'opacity-70 grayscale cursor-not-allowed' : 'animate-bounce-slow'
                  }`}
                >
                  <span className="text-xl block">🪙 코인 발전기</span>
                  <span className="text-[10px] font-black text-black mt-0.5 block leading-none">
                    {coinCooldown > 0 ? `냉각 중 (${coinCooldown}s)` : '탭하여 수확! 🌟'}
                  </span>
                  {coinCooldown <= 0 && (
                    <span className="text-[8px] bg-red-500 text-white px-1 rounded animate-pulse absolute -top-1.5 -right-1.5 font-bold">UP!</span>
                  )}
                </div>

                {/* Giant Right Handle */}
                <div 
                  onClick={handleToggleDoor}
                  className="fridge-handle-right"
                />
              </div>

            </div>

          </div>
        </section>

        {/* Ambient controls & Quick Gateway */}
        <section className={`comic-panel bg-white p-4 border-4 border-black shadow-[4px_4px_0_0_#000] flex flex-col gap-3 transition-all ${
          manualMood ? 'neon-sync-panel' : ''
        }`}>
          <div className="flex justify-between items-center border-b border-gray-200 pb-1">
            <h4 className="text-lg font-black text-black">🚪 문단속 경계 가이드</h4>
            <button
              onClick={handleToggleDoor}
              className={`px-4 py-1.5 rounded-xl border-3 border-black font-black text-xs shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none transition-all ${
                isDoorOpen ? 'bg-red-400 text-white animate-pulse' : 'bg-[#67f9e1] text-black'
              }`}
            >
              {isDoorOpen ? '🚪 냉장고 닫기 (휴식)' : '🚪 냉장고 열기 (업무)'}
            </button>
          </div>
          
          <p className="text-sm font-bold text-gray-500 leading-tight">
            {isDoorOpen 
              ? `⚠️ 냉장고 문이 활짝 열렸습니다! 현재 실외 기온(${outdoorTemp.toFixed(1)}°C)에 노출되어 뽀모도로 업무 집중 중에 열풍 스트레스가 더 빨리 축적됩니다! [선반 위 간식]이나 [송풍 가동]으로 빙글이를 지키세요!`
              : "💤 퇴근 문단속이 완벽히 완료되었습니다! 냉장고 내부가 급속 동결되어 12°C의 평온함과 함께 빙글이가 아늑한 밤잠에 빠집니다."}
          </p>

          {/* Ambient sync dial always visible */}
          <div className={`border-3 border-black p-3 rounded-lg flex flex-col gap-2 mt-1 transition-all ${
            manualMood ? 'bg-teal-50 border-teal-500' : 'bg-yellow-50 border-black'
          }`}>
            <div className="flex justify-between items-center text-xs font-black text-gray-500 border-b border-gray-300 pb-1 flex-wrap gap-1">
              <span className="flex items-center gap-1">
                <span>🎭 내 마음 온도 주파수 조율</span>
                {manualMood && (
                  <span className="bg-teal-100 text-teal-800 border border-teal-400 px-1.5 py-0.5 rounded-full text-[9px] animate-pulse">
                    수동 정서 싱크 중 🟢
                  </span>
                )}
              </span>
              {manualMood ? (
                <button
                  onClick={() => setManualMood(null)}
                  className="bg-[#67f9e1] hover:bg-[#4be6cb] text-black border border-black font-black text-[9px] px-2 py-0.5 rounded shadow-[1px_1px_0_0_#000] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-0.5 animate-bounce-slow"
                >
                  자동 연동 복귀 🔄
                </button>
              ) : (
                <span>정서 싱크 동기화</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {['happy', 'sleeping', 'angry', 'hot', 'crying', 'excited', 'tired', 'shocked', 'frozen'].map((st) => {
                const label = 
                  st === 'happy' ? '😊 기쁨' : 
                  st === 'sleeping' ? '💤 숙면' : 
                  st === 'angry' ? '😤 화남' : 
                  st === 'hot' ? '🥵 과열' : 
                  st === 'crying' ? '😭 슬픔' : 
                  st === 'excited' ? '🤩 신남' :
                  st === 'tired' ? '🥱 지침' :
                  st === 'shocked' ? '😲 당황' : '🥶 동결';
                const isActive = characterState === st;
                return (
                  <button
                    key={st}
                    onClick={() => handleSelectEmotion(st)}
                    className={`py-1.5 rounded-lg border-2 border-black font-black text-xs transition-all shadow-[2.5px_2.5px_0_0_#000] active:translate-y-0.5 active:shadow-none ${
                      isActive
                        ? 'bg-[#ff8c69] text-white scale-[1.03] border-red-500' 
                        : 'bg-white text-black hover:bg-yellow-50/50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==========================================================
           WEEK 3+ WIDGET 1: DAILY PATTERN SYNC WIDGET
           ========================================================== */}
        <section className="comic-panel bg-white p-4 border-4 border-black shadow-[4px_4px_0_0_#000] flex flex-col gap-3">
          <div className="flex justify-between items-center border-b-2 border-black pb-1.5">
            <h4 className="text-lg font-black text-black">🌤️ 일일 생활 패턴 싱크</h4>
            <span className="bg-[#67f9e1] border-2 border-black font-black px-2 py-0.5 text-xs rounded rotate-1 shadow-[1.5px_1.5px_0_0_#000]">
              {((gameState?.currentWeek ?? 1) >= 3 || gameState?.bypassLocks) ? '동기화 중 🟢' : '3주차 개방 🔒'}
            </span>
          </div>

          {((gameState?.currentWeek ?? 1) >= 3 || gameState?.bypassLocks) ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-gray-500 mb-1 leading-tight">
                주변 수면 및 디바이스 패턴 센서가 빙글이 냉각실과 실시간 연동됩니다. 규칙적인 흐름이 감지되면 내부 온도 -5°C 조절 보너스!
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
                <div className="bg-[#f0f9ff] border-2 border-black p-2 rounded-lg">
                  <span className="text-sm block">🌤️ 아침 기상</span>
                  <span className="text-[#0284c7] block mt-1">07:30</span>
                  <span className="text-[9px] text-green-600">싱크완료 🟢</span>
                </div>
                <div className="bg-[#fffbeb] border-2 border-black p-2 rounded-lg">
                  <span className="text-sm block">🚶 점심 산책</span>
                  <span className="text-[#d97706] block mt-1">12:40</span>
                  <span className="text-[9px] text-green-600">싱크완료 🟢</span>
                </div>
                <div className="bg-[#f3e8ff] border-2 border-black p-2 rounded-lg">
                  <span className="text-sm block">🛌 밤 소등</span>
                  <span className="text-[#7c3aed] block mt-1">23:00</span>
                  <span className="text-[9px] text-gray-400">대기 중 ⏳</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 items-center bg-gray-50 border-2 border-dashed border-gray-300 p-3.5 rounded-xl">
              <span className="text-3xl">🔒</span>
              <p className="text-xs font-bold text-gray-400 leading-tight">
                2단계(3주차)가 개방되면 <b>기상/산책/소등 일일 패턴 연동 위젯</b>이 활성화됩니다. 규칙적인 힐링 리듬을 통해 냉장고 온도 방어막을 구축하세요!
              </p>
            </div>
          )}
        </section>

        {/* ==========================================================
           WEEK 3+ WIDGET 2: CONTINUOUS ATTENDANCE micro-quests
           ========================================================== */}
        <section className="comic-panel bg-white p-4 border-4 border-black shadow-[4px_4px_0_0_#000] flex flex-col gap-3">
          <div className="flex justify-between items-center border-b-2 border-black pb-1.5">
            <h4 className="text-lg font-black text-black">🗓️ 5분 초저난도 출석체크</h4>
            <span className="bg-[#ff8c69] border-2 border-black font-black px-2 py-0.5 text-xs rounded -rotate-1 shadow-[1.5px_1.5px_0_0_#000]">
              {((gameState?.currentWeek ?? 1) >= 3 || gameState?.bypassLocks) ? '부담제로 퀘스트 🎯' : '3주차 개방 🔒'}
            </span>
          </div>

          {((gameState?.currentWeek ?? 1) >= 3 || gameState?.bypassLocks) ? (
            <div className="flex flex-col gap-2.5">
              <p className="text-xs font-bold text-gray-500 leading-tight mb-1">
                번아웃 극복을 돕는 초소형 5분 행동 활성화 루틴입니다. 무리하지 말고 가볍게 클릭하여 완료하세요!
              </p>
              
              <div className="flex flex-col gap-2">
                {[
                  { id: 'quest_water', text: '기상 직후 시원한 물 한 잔 마시기 🥛', xp: 10 },
                  { id: 'quest_look', text: '모니터 밖 먼 창문 10초간 지긋이 응시하기 🖥️', xp: 10 },
                  { id: 'quest_shoulders', text: '숨 들이마시며 어깨 세 번 으쓱 털기 🧘', xp: 10 }
                ].map(quest => {
                  const isDone = (gameState?.completedQuests || []).includes(quest.id);
                  return (
                    <button
                      key={quest.id}
                      onClick={() => {
                        if (isDone) return;
                        const prevQuests = gameState?.completedQuests || [];
                        updateGameState({ completedQuests: [...prevQuests, quest.id] });
                        gainXP(quest.xp);
                        showToast(`🎯 초저난도 미션 완료! [${quest.text.slice(0, 10)}...] (+${quest.xp} XP)`);
                      }}
                      className={`flex justify-between items-center border-2 border-black p-2.5 rounded-lg text-left text-xs font-black transition-all ${
                        isDone 
                          ? 'bg-gray-100 text-gray-400 border-gray-300 shadow-none cursor-default' 
                          : 'bg-white hover:bg-yellow-50 shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm font-black text-green-600">
                          {isDone ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                        <span className={isDone ? 'line-through text-gray-400' : 'text-[#28180b]'}>
                          {quest.text}
                        </span>
                      </span>
                      {!isDone && <span className="bg-[#67f9e1] border border-black px-1.5 py-0.5 rounded text-[9px] text-black">+{quest.xp}XP</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex gap-3 items-center bg-gray-50 border-2 border-dashed border-gray-300 p-3.5 rounded-xl">
              <span className="text-3xl">🔒</span>
              <p className="text-xs font-bold text-gray-400 leading-tight">
                2단계(3주차)가 개방되면 번아웃 무기력증을 유연하게 녹여줄 <b>초저난도 5분 힐링 출석체크</b> 리스트가 매일 활성화됩니다.
              </p>
            </div>
          )}
        </section>

      </main>

      {/* ==========================================================
         🧪 BINGLE VECTOR LAB SPECIMEN MUSEUM MODAL (SEPARATED)
         ========================================================== */}
      <AnimatePresence>
        {showVectorLab && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[99999] backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white border-4 border-black p-5 rounded-3xl max-w-sm w-full shadow-[8px_8px_0_0_#000] relative font-['Gaegu']"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowVectorLab(false)}
                className="absolute top-3.5 right-3.5 bg-white border-3 border-black w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none"
              >
                X
              </button>

              <div className="flex gap-2.5 items-center border-b-4 border-black pb-2 mb-4">
                <span className="text-3xl">🧪</span>
                <div className="flex flex-col">
                  <h3 className="text-2xl font-black text-black leading-none">빙글이 벡터 연구실</h3>
                  <span className="text-xs font-bold text-gray-500 mt-1">Stitch 벡터 점토 물리 가속 렌더링</span>
                </div>
              </div>

              {/* Main Display Specimen Specimen */}
              <div className="bg-[#f0fdfa] border-4 border-dashed border-[#87beaf] rounded-2xl p-4 flex flex-col items-center justify-center min-h-[180px] relative overflow-hidden mb-4">
                <div className="halftone-bg" />
                <BingleVectorCharacter state={selectedLabSpecimen} size={140} className="relative z-10" />
                <span className="absolute bottom-2.5 bg-[#14b8a6] text-white border-2 border-black font-black text-xs px-2.5 py-0.5 rounded shadow-[1.5px_1.5px_0_0_#000] z-20">
                  {selectedLabSpecimen === 'happy' && '기쁨 연구체'}
                  {selectedLabSpecimen === 'sleeping' && '숙면 연구체'}
                  {selectedLabSpecimen === 'angry' && '분노 연구체'}
                  {selectedLabSpecimen === 'hot' && '멜팅 연구체'}
                </span>
              </div>

              {/* Option Specimen Selector Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-3.5">
                {['happy', 'sleeping', 'angry', 'hot'].map((emo) => (
                  <button
                    key={emo}
                    onClick={() => {
                      setSelectedLabSpecimen(emo);
                      showToast(`🧪 벡터 가속기 작동: Bingle_${emo} 점토 피지컬 적용 완료!`);
                    }}
                    className={`border-2 border-black rounded-lg py-2 text-center text-sm font-black transition-all shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none ${
                      selectedLabSpecimen === emo 
                        ? 'bg-[#14b8a6] text-white' 
                        : 'bg-white text-black hover:bg-gray-50'
                    }`}
                  >
                    {emo === 'happy' && '기쁨'}
                    {emo === 'sleeping' && '숙면'}
                    {emo === 'angry' && '분노'}
                    {emo === 'hot' && '멜팅'}
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 border-3 border-black p-3 rounded-xl">
                <p className="text-xs font-bold text-gray-600 leading-tight">
                  💡 <b>벡터 연구실 설명:</b><br/>
                  이 연구실은 BINGLE의 오리지널 SVG 벡터 모델을 독자 구동하는 독립 시뮬레이터입니다! 탭하여 점토 젤리처럼 출렁이며 반응하는 실시간 벡터 물리를 관찰해보세요!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================================
         💬 BINGLE AI MIND TALK DIALOGUE MODAL (NEW)
         ========================================================== */}
      <AnimatePresence>
        {showAiChat && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[99999] backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-[#fffbeb] border-4 border-black p-5 rounded-3xl max-w-sm w-full shadow-[8px_8px_0_0_#000] relative font-['Gaegu'] flex flex-col max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowAiChat(false)}
                className="absolute top-3.5 right-3.5 bg-white border-3 border-black w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none"
              >
                X
              </button>

              <div className="flex gap-2.5 items-center border-b-4 border-black pb-2.5 mb-3 shrink-0">
                <span className="text-3xl">💬</span>
                <div className="flex flex-col">
                  <h3 className="text-2xl font-black text-black leading-none">빙글이 AI 마인드톡</h3>
                  <span className="text-xs font-bold text-gray-500 mt-1">지친 마음에 건네는 공감 피팅 대화</span>
                </div>
              </div>

              {/* Mini Interactive Character View */}
              <div className="bg-[#fef3c7] border-3 border-black rounded-2xl p-2.5 flex items-center justify-center min-h-[95px] relative overflow-hidden mb-3 shrink-0">
                <div className="halftone-bg" />
                <div className="flex items-center gap-4 w-full px-2 relative z-10">
                  <div className="shrink-0 scale-90 relative">
                    <BingleCharacter state={characterState} size={70} />
                    {isBingleTyping && (
                      <span className="absolute -top-1 -right-1 bg-white border border-black px-1 rounded-full text-[9px] font-black animate-bounce text-cyan-600">
                        생각중...
                      </span>
                    )}
                  </div>
                  <div className="flex-1 bg-white border-2 border-black p-2 rounded-xl text-xs font-black leading-tight max-w-[70%]">
                    {characterState === 'sleeping' && "새록새록... 쿨쿨... 주인님이 오셔서 너무 아늑해요 💤"}
                    {characterState === 'happy' && "기분이 파랗고 상쾌해! 내 기운을 나누어 줄게 😊"}
                    {characterState === 'excited' && "신나! 점토 몸을 통통 튕기며 주인님의 말을 듣고 있어! 🤩"}
                    {characterState === 'angry' && "후우.. 머리가 끓고 있어.. 그래도 주인님 말엔 대답할래 😤"}
                    {characterState === 'hot' && "아뜨뜨! 멜팅 위험! 어서 나랑 얘기하고 온도를 낮추자 🥵"}
                    {characterState === 'crying' && "훌쩍훌쩍.. 속상한 일을 편하게 털어놔 주겠어? 😭"}
                    {characterState === 'tired' && "배터리 방전 중.. 🥱 그래도 주인님과 통하면 힐링이 돼."}
                    {characterState === 'frozen' && "꽁꽁 얼어서 차분해! 🥶 주인님의 스트레스 열도 다 얼려줄게."}
                    {characterState === 'shocked' && "헉! 찌릿찌릿! 방어 모드를 풀고 편하게 들어줄게 😲"}
                  </div>
                </div>
              </div>

              {/* Chat Messages Display Area */}
              <div className="flex-1 overflow-y-auto bg-white border-3 border-black rounded-2xl p-3 flex flex-col gap-2 min-h-[160px] max-h-[220px] mb-3 no-scrollbar">
                {chatMessages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    <span className="text-[9px] font-bold text-gray-400 mb-0.5">
                      {msg.sender === 'user' ? '나의 고민' : '빙글이'}
                    </span>
                    <div 
                      style={{ 
                        backgroundColor: msg.sender === 'user' ? '#fef08a' : '#e0f2fe',
                        borderRadius: msg.sender === 'user' ? '14px 2px 14px 14px' : '2px 14px 14px 14px'
                      }}
                      className="border-2 border-black p-2.5 text-xs font-black text-black leading-tight shadow-[1.5px_1.5px_0_0_#000]"
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {isBingleTyping && (
                  <div className="self-start flex flex-col items-start max-w-[80%]">
                    <span className="text-[9px] font-bold text-gray-400 mb-0.5">빙글이</span>
                    <div className="bg-[#e0f2fe] border-2 border-black px-3.5 py-2 rounded-2xl shadow-[1.5px_1.5px_0_0_#000] flex gap-1 items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-700 animate-bounce" style={{ animationDelay: '0s' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-700 animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-700 animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Healing Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar shrink-0">
                {[
                  { label: "오늘 너무 피곤해 🥱", query: "오늘 정말 피곤하고 지쳤어. 아무것도 하기 싫어." },
                  { label: "스트레스 폭발이야 🌋", query: "업무랑 일 때문에 스트레스를 너무 많이 받아서 폭발할 것 같아." },
                  { label: "우울하고 지루해 😭", query: "마음이 슬프고 우울해서 위로가 필요해." },
                  { label: "칭찬 한마디 해줘! ✨", query: "나 오늘 하루도 수고했다고 시원한 칭찬 마구 해줘!" },
                  { label: "상점 사용법은? 🛒", query: "식재료를 채우고 사고 싶어. 상점은 어떻게 써?" }
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendChatMessage(chip.query)}
                    className="shrink-0 bg-white hover:bg-yellow-50 text-black border border-black font-black text-[10px] px-2.5 py-1 rounded-full shadow-[1.5px_1.5px_0_0_#000] active:translate-y-0.5 active:shadow-none"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Chat Keyboard Form input box */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
                className="flex gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="빙글이에게 마음을 털어놓으세요..."
                  className="flex-1 bg-white border-3 border-black rounded-xl px-3 py-1.5 text-xs font-black focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
                />
                <button
                  type="submit"
                  className="bg-[#67f9e1] hover:bg-[#4be6cb] border-3 border-black text-black font-black text-xs px-3.5 py-1.5 rounded-xl shadow-[2.5px_2.5px_0_0_#000] active:translate-y-0.5 active:shadow-none transition-all"
                >
                  보내기
                </button>
              </form>

              {/* Bottom Info Note */}
              <div className="bg-cyan-50 border-2 border-black p-2 rounded-xl mt-3 shrink-0">
                <p className="text-[10px] font-bold text-cyan-800 leading-tight text-center">
                  💡 <b>마인드 케어 피드백:</b> 대화를 나눌 때마다 정서 치유 보상으로 <b>🪙 10 코인</b>과 <b>+5 XP</b>를 지급해 드립니다!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
