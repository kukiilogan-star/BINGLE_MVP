import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BingleCharacter from '../../shared/ui/BingleCharacter.jsx';
import FoodVector from '../../shared/ui/FoodVector.jsx';
import fridgeShelvesBg from '../../../public/images/fridge_shelves_bg.png';

export default function PantryWarehouse({ gameState, updateGameState, gainXP, showToast }) {
  const currentTemp = gameState?.mindTemperature ?? 25;
  const characterState = gameState?.characterState || 'happy';
  const mindCoins = gameState?.mindCoins !== undefined ? gameState.mindCoins : 120;
  const selectedTheme = gameState?.fridgeTheme || 'mint';

  // Active Tab state: dynamically synced from global gameState.activePantryTab
  const activeTab = gameState?.activePantryTab || 'inventory';
  const setActiveTab = (tab) => {
    updateGameState({ activePantryTab: tab });
  };

  // Currently selected item in the bottom dynamic smart console
  const [selectedItemId, setSelectedItemId] = useState('water');

  // Local interactive states for Bingle feeding animation
  const [localBingleState, setLocalBingleState] = useState(null);
  const [isBingleMouthOpen, setBingleMouthOpen] = useState(false);
  const [flyingFood, setFlyingFood] = useState(null); // null or { id, itemId, startX, startY, icon, color }
  const [showEatSmoke, setShowEatSmoke] = useState(null); // null or { text, color }
  
  // High-fidelity feeding visual reactive triggers
  const [localFeedTrigger, setLocalFeedTrigger] = useState(0);
  const [localFedItemType, setLocalFedItemType] = useState('water');

  // 9 Healing items matching original dataset with price and benefits
  const SHOP_ITEMS = [
    { id: 'water', name: '탄산 마음 소화수', desc: '불안 해소! 온도 -15°C 급속 냉방 💧', price: 10, icon: '💧', color: '#bae6fd', type: 'cool', effect: -15 },
    { id: 'orange', name: '활력 자몽 비타민', desc: '무기력 극복! 경험치 +30 보스 🍊', price: 20, icon: '🍊', color: '#fed7aa', type: 'xp', effect: 30 },
    { id: 'chocolate', name: '번아웃 카카오 힐러', desc: '스트레스 증발! 안정 12°C 달성 🍫', price: 25, icon: '🍫', color: '#ffeadc', type: 'calm', effect: 12 },
    { id: 'melon', name: '회복 멜론 젤리', desc: '평온 회복! 온도 -10°C / XP +15 🍈', price: 20, icon: '🍈', color: '#dcfce7', type: 'heal', effect: 10 },
    { id: 'milk', name: '꿀잠 라벤더 우유', desc: '마음 숙면! 온도 -20°C / 취침 유도 🥛', price: 30, icon: '🥛', color: '#f3e8ff', type: 'sleep', effect: -20 },
    { id: 'icecream', name: '급속 냉각 베리 빙과', desc: '마찰열 영하 탈출! 온도 -25°C 🍦', price: 25, icon: '🍦', color: '#fce7f3', type: 'cool', effect: -25 },
    { id: 'apple', name: '성찰 아삭 청사과', desc: '건강한 디톡스! 온도 -12°C / XP +25 🍏', price: 15, icon: '🍏', color: '#dcfce7', type: 'heal', effect: 12 },
    { id: 'coffee', name: '피로 파괴 아메리카노', desc: '활력 부스터! 경험치 +40 부스트 ☕', price: 25, icon: '☕', color: '#fef3c7', type: 'xp', effect: 40 },
    { id: 'cake', name: '위로 딸기 케이크', desc: '달콤한 포용! 안정 12°C 즉각 도달 🍰', price: 35, icon: '🍰', color: '#ffe4e6', type: 'calm', effect: 12 }
  ];

  // Map backend raw inventory with local item attributes
  const rawInventory = gameState?.fridgeInventory;
  const inventory = (() => {
    if (Array.isArray(rawInventory)) {
      return SHOP_ITEMS.map(baseItem => {
        const found = rawInventory.find(i => i.id === baseItem.id);
        return found ? { ...baseItem, ...found } : { ...baseItem, count: 0 };
      });
    } else if (rawInventory && typeof rawInventory === 'object') {
      return SHOP_ITEMS.map(baseItem => ({
        ...baseItem,
        count: typeof rawInventory[baseItem.id] === 'number' ? rawInventory[baseItem.id] : 0
      }));
    }
    return SHOP_ITEMS.map(item => ({ ...item, count: 0 }));
  })();

  const selectedItem = inventory.find(i => i.id === selectedItemId) || inventory[0];

  // Helper to query shelf and column positions for exact fly particle trajectory
  const getItemIndices = (itemId) => {
    if (['water', 'melon', 'icecream', 'apple'].includes(itemId)) {
      const idx = ['water', 'melon', 'icecream', 'apple'].indexOf(itemId);
      return { shelfIndex: 1, colIndex: idx };
    }
    if (['orange', 'coffee'].includes(itemId)) {
      const idx = ['orange', 'coffee'].indexOf(itemId);
      return { shelfIndex: 2, colIndex: idx };
    }
    if (['chocolate', 'milk', 'cake'].includes(itemId)) {
      const idx = ['chocolate', 'milk', 'cake'].indexOf(itemId);
      return { shelfIndex: 3, colIndex: idx };
    }
    return { shelfIndex: 1, colIndex: 0 };
  };

  // 1. Direct interactive shelf click behavior
  const handleShelfItemClick = (item, colIndex, shelfIndex) => {
    // Select the item first
    setSelectedItemId(item.id);

    // If in Inventory mode, trigger immediate feeding on the first click!
    if (activeTab === 'inventory') {
      handleFeedBingle(item, colIndex, shelfIndex);
    }
  };

  // 2. Interactive Direct Feeding action with smooth flying motion curves
  const handleFeedBingle = (item, colIndex, shelfIndex) => {
    if (item.count <= 0) {
      showToast(`앗! [${item.name}]이 부족합니다! 마음 상점 🛒 모드에서 코인으로 구매해 주세요! 🥺`);
      return;
    }

    if (flyingFood) return; // Prevent spamming animations

    // Calculate columns startX offsets for animation
    let startX = 0;
    if (shelfIndex === 1) {
      const offsets = [-90, -30, 30, 90];
      startX = offsets[colIndex] || 0;
    } else if (shelfIndex === 2) {
      const offsets = [-50, 50];
      startX = offsets[colIndex] || 0;
    } else if (shelfIndex === 3) {
      const offsets = [-75, 0, 75];
      startX = offsets[colIndex] || 0;
    }

    const uniqueId = Date.now() + Math.random();

    // Trigger Bingle visual mouth-open feeding stance
    setBingleMouthOpen(true);
    setLocalBingleState('excited');

    setFlyingFood({
      id: uniqueId,
      itemId: item.id,
      startX: startX,
      startY: 80 + shelfIndex * 85,
      icon: item.icon,
      color: item.color
    });

    // 1. Immediately decrement in client state for swift wobbly feel
    const updatedInventory = inventory.map(i => {
      if (i.id === item.id) return { ...i, count: i.count - 1 };
      return i;
    });

    updateGameState({
      fridgeInventory: updatedInventory
    });

    // 2. Wait for animation to hit Bingle, then apply physical effects and text sparks
    setTimeout(() => {
      applyItemEffect(item);
      setFlyingFood(null);

      // Trigger high-fidelity radial burst particles and bubble reaction in BingleCharacter!
      setLocalFedItemType(item.id);
      setLocalFeedTrigger(prev => prev + 1);

      // Cute physical popup texts
      let effectText = "";
      if (item.type === 'cool') effectText = `냠냠! 😋 마음 기온 ${item.effect}°C ❄️`;
      else if (item.type === 'xp') effectText = `냠냠! 😋 활력 경험치 +${item.effect} XP ⚡`;
      else if (item.type === 'calm') effectText = `냠냠! 😋 번아웃 열기 소멸! 12°C 🍫`;
      else if (item.type === 'heal') effectText = `냠냠! 😋 정서 치유 +15 XP 🍈`;
      else if (item.type === 'sleep') effectText = `냠냠! 😋 꿀잠 아늑... 💤`;

      setShowEatSmoke({
        text: effectText,
        color: item.color
      });

      // Revert reactions after satisfying delay
      setTimeout(() => {
        setShowEatSmoke(null);
        setBingleMouthOpen(false);
        setLocalBingleState(null);
      }, 1400);

    }, 600);
  };

  // Console feeding trigger wrapper
  const handleFeedFromConsole = () => {
    if (!selectedItem) return;
    const { shelfIndex, colIndex } = getItemIndices(selectedItem.id);
    handleFeedBingle(selectedItem, colIndex, shelfIndex);
  };

  // Internal apply handler corresponding to GameHub physical formulas
  const applyItemEffect = (item) => {
    let updatedTemp = currentTemp;
    let xpGranted = 0;
    let stateUpdate = {};

    if (item.type === 'cool') {
      updatedTemp = Math.max(12, currentTemp + item.effect);
      stateUpdate = { mindTemperature: updatedTemp };
      showToast(`💧 빙글이에게 [${item.name}]을 먹였습니다! 기온이 ${Math.round(updatedTemp)}°C로 안정됩니다.`);
    } else if (item.type === 'xp') {
      xpGranted = item.effect;
      gainXP(xpGranted);
      showToast(`🍊 빙글이에게 [${item.name}]을 먹였습니다! 에너지가 충전되며 +${xpGranted} XP 획득!`);
    } else if (item.type === 'calm') {
      updatedTemp = item.effect;
      stateUpdate = { mindTemperature: updatedTemp, characterState: 'happy' };
      showToast(`🍫 [${item.name}]을 먹였습니다! 번아웃 마찰열이 물러가고 완벽한 12°C를 이룹니다!`);
    } else if (item.type === 'heal') {
      updatedTemp = Math.max(12, currentTemp - item.effect);
      xpGranted = 15;
      gainXP(xpGranted);
      stateUpdate = { mindTemperature: updatedTemp };
      showToast(`🍈 [${item.name}]을 먹였습니다! 손상된 기분이 치유되며 -10°C 및 +15 XP 획득!`);
    } else if (item.type === 'sleep') {
      updatedTemp = Math.max(12, currentTemp + item.effect);
      stateUpdate = { mindTemperature: updatedTemp, characterState: 'sleeping' };
      showToast(`🥛 [${item.name}]을 먹였습니다! 뇌파가 가라앉고 포근한 수면 회복에 빠집니다... 💤`);
    }

    updateGameState({
      ...stateUpdate,
      logs: [
        {
          date: new Date().toISOString(),
          type: 'use_item',
          text: `🍎 마음 치유 창고 섭취: [${item.name}]을(를) 빙글이에게 먹여 정서적 온도를 회복시켰습니다.`
        },
        ...(gameState?.logs || [])
      ]
    });
  };

  // 2. Active Coin Store Purchasing mechanism
  const handleBuyItem = (item) => {
    if (mindCoins < item.price) {
      showToast(`🪙 마음 코인이 부족합니다! 문 앞의 코인 발전기를 수확하거나 대화를 나눠보세요. (필요: ${item.price}코인)`);
      return;
    }

    const nextCoins = mindCoins - item.price;
    const updatedInventory = inventory.map(i => {
      if (i.id === item.id) return { ...i, count: i.count + 1 };
      return i;
    });

    updateGameState({
      mindCoins: nextCoins,
      fridgeInventory: updatedInventory,
      logs: [
        {
          date: new Date().toISOString(),
          type: 'buy_item',
          text: `🛒 마음 상점 구매: [${item.name}]을(를) ${item.price} 코인에 구매하여 보관함에 진열했습니다.`
        },
        ...(gameState?.logs || [])
      ]
    });

    // Provide immediate habituation XP feedback for making purchasing decisions
    gainXP(3);
    showToast(`🛒 [${item.name}] 구매 성공! 냉장실 보관함에 즉시 진열되었습니다. (-${item.price} 🪙)`);
  };

  // Refrigerator cabinet themes inner background gradients
  const themeInteriorGradients = {
    mint: 'from-[#e6f6f9] to-[#9ad5e6]',
    peach: 'from-[#fffbeb] to-[#fde68a]',
    ice: 'from-[#ecfeff] to-[#a5f3fc]',
    black: 'from-[#2e3748] to-[#111827]',
    wood: 'from-[#fef3c7] to-[#f59e0b]',
  };
  const interiorGradient = themeInteriorGradients[selectedTheme] || themeInteriorGradients.mint;

  const handleEmergencyRestock = () => {
    const updatedInv = inventory.map(item => ({
      ...item,
      count: 10
    }));
    updateGameState({
      fridgeInventory: updatedInv,
      logs: [
        {
          date: new Date().toISOString(),
          type: 'restock_items',
          text: '🛒 긴급 충전 완료: COLD BOOST 부스터 가동으로 냉장고 식재료를 즉각 10개씩 가득 채웠습니다.'
        },
        ...(gameState?.logs || [])
      ]
    });
    gainXP(20);
    showToast('⚡ COLD BOOST! 모든 식재료를 10개씩 선반에 가득 채웠습니다! (+20 XP)');
  };

  const isSleeping = characterState === 'sleeping';
  const themeOverlayClasses = {
    mint: 'bg-[#87beaf]/10',
    peach: 'bg-[#fed7aa]/10',
    ice: 'bg-[#bae6fd]/10',
    black: 'bg-black/50',
    wood: 'bg-[#854d0e]/20',
  };
  const themeOverlay = themeOverlayClasses[selectedTheme] || themeOverlayClasses.mint;

  return (
    <div 
      className="w-full min-h-full flex flex-col items-center overflow-x-hidden relative font-['Gaegu'] select-none transition-all duration-300 bg-cover bg-center"
      style={{
        backgroundImage: isSleeping
          ? 'linear-gradient(180deg, #0a1128 0%, #101f42 50%, #1d3570 100%)'
          : `url(${fridgeShelvesBg})`
      }}
    >
      {/* Starry Night Sky shimmering stars when sleeping */}
      {isSleeping && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-10 left-12 text-yellow-200/40 text-sm animate-pulse">★</div>
          <div className="absolute top-24 right-16 text-yellow-200/50 text-xs animate-ping" style={{ animationDuration: '4s' }}>✦</div>
          <div className="absolute top-44 left-24 text-yellow-200/30 text-lg animate-pulse" style={{ animationDuration: '3s' }}>★</div>
          <div className="absolute top-8 right-32 text-yellow-100/60 text-xs animate-pulse">✦</div>
          <div className="absolute top-36 right-8 text-yellow-200/40 text-sm animate-pulse" style={{ animationDuration: '5s' }}>★</div>
          
          <div 
            className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 rounded-full w-[260px] h-[260px]"
            style={{
              background: 'radial-gradient(circle, rgba(165,243,252,0.3) 0%, rgba(34,211,238,0.1) 45%, rgba(0,0,0,0) 70%)',
              filter: 'blur(16px)',
              mixBlendMode: 'screen',
            }}
          />
        </div>
      )}

      {/* Theme translucent color tint overlay on top of the realistic retro background (only when not sleeping) */}
      {!isSleeping && (
        <div className={`absolute inset-0 ${themeOverlay} pointer-events-none z-0 transition-colors duration-300`} />
      )}
      
      {/* 🚪 Retro Fridge Cabinet Inner Bezel Frame */}
      <div className="absolute inset-x-0 top-0 bottom-0 border-x-8 border-t-8 border-black pointer-events-none z-30 shadow-[inset_0px_10px_40px_rgba(0,0,0,0.18)]" />
      <div className="halftone-bg" />
      
      {/* Drifting chilly frost overlay */}
      <div className="fridge-frost-mist z-10" />

      {/* Main Content Area */}
      <div className="w-full max-w-md pt-4 pb-28 px-4 flex flex-col gap-4 min-h-full relative z-20 animate-fade-up">

        {/* 🎛️ Refrigerator Ceiling Console: Digital System Strip */}
        <div className="bg-gradient-to-b from-[#e5e7eb] to-[#d1d5db] border-4 border-black p-2.5 rounded-2xl flex justify-between items-center relative z-20 shadow-[4px_4px_0_0_#000]">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-500 leading-none">REFRIGERATOR SYSTEM</span>
            <span className="text-sm font-black text-black mt-1">실내 기온: {Math.round(currentTemp)}°C ❄️</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Interactive Mode Lever */}
            <div className="flex border-2 border-black rounded-lg bg-white p-0.5 shadow-[1.5px_1.5px_0_0_#000] overflow-hidden scale-95">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('inventory');
                  setSelectedItemId('water'); // Default select
                }}
                className={`px-2.5 py-1 font-black text-[11px] rounded transition-all ${
                  activeTab === 'inventory'
                    ? 'bg-[#ff8c69] text-black shadow-inner border border-black/35'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                보관함 🧺
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('shop');
                  setSelectedItemId('water'); // Default select
                }}
                className={`px-2.5 py-1 font-black text-[11px] rounded transition-all ${
                  activeTab === 'shop'
                    ? 'bg-[#67f9e1] text-black shadow-inner border border-black/35'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                마음상점 🛒
              </button>
            </div>

            {/* COLD BOOST Dial Button (Cheat Restock Dial) */}
            <button
              type="button"
              onClick={handleEmergencyRestock}
              title="급속 냉각 식재료 부스터"
              className="bg-red-500 hover:bg-red-600 active:scale-90 text-white border-2 border-black w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] shadow-[1.5px_1.5px_0_0_#000] transition-all cursor-pointer z-30 select-none"
            >
              ⚡
            </button>
          </div>
        </div>

        {/* 🛸 BINGLE COOLING DOME COMPARTMENT */}
        <section className="bg-white/15 border-4 border-black rounded-3xl p-3 flex items-center justify-between gap-3 relative z-20 shadow-[inset_0_2px_8px_rgba(255,255,255,0.4),4px_4px_0_0_rgba(0,0,0,0.15)] backdrop-blur-md overflow-hidden">
          {/* Inner metallic/glowing aura */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#67f9e1]/10 to-transparent pointer-events-none" />
          
          <div className="flex-1 z-10">
            {/* Refrigerator smart control bubble */}
            <div className="bg-[#111827] text-[#67f9e1] border-2 border-black p-3 rounded-2xl shadow-[3px_3px_0_0_#000] font-bold text-xs relative min-h-[75px] flex flex-col justify-center">
              <span className="text-[9px] text-[#67f9e1]/70 block leading-none mb-1 font-mono">BINGLE MONITOR V1.0</span>
              <p className="leading-snug">
                {isBingleMouthOpen 
                  ? "오물오물... 냠냠! 😋 주인님이 선물한 치유 음식 너무 맛있다! ✨"
                  : activeTab === 'inventory'
                    ? "선반 위의 식재료를 탭해봐! 내게 슈웅 날려보내서 마찰열을 시원하게 식혀줘! 🍉"
                    : "우와! 마음 상점 모드구나! 아래 진열대 노란 스티커 가격을 확인하고 쇼핑해봐! 🪙"
                }
              </p>
              {/* LED digital blinking dot */}
              <span className="absolute top-2 right-3 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            </div>
          </div>
          
          {/* Bingle in the Circular Glass Chamber */}
          <div className="w-22 h-22 rounded-full border-4 border-black bg-cyan-950/65 flex-shrink-0 relative overflow-hidden shadow-[inset_0_4px_8px_rgba(0,0,0,0.6),2px_2px_0_0_#000] flex items-center justify-center group z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.25)_0%,rgba(15,23,42,0.7)_90%)]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 to-white/10 pointer-events-none" />
            
            <div className="transform scale-[0.65] relative z-10 pointer-events-none">
              <BingleCharacter 
                state={localBingleState || characterState} 
                size={96} 
                feedTrigger={localFeedTrigger}
                fedItemType={localFedItemType}
              />
            </div>

            {/* Flying physical satisfaction smoke bubble popup inside/above dome */}
            <AnimatePresence>
              {showEatSmoke && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: -20, scale: 1.1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.9 }}
                  transition={{ duration: 1 }}
                  style={{ backgroundColor: showEatSmoke.color }}
                  className="absolute border-2 border-black text-black font-black text-[9px] px-2 py-0.5 rounded-full shadow-[1.5px_1.5px_0_0_#000] whitespace-nowrap z-50 text-center"
                >
                  {showEatSmoke.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Flying particle overlay */}
        <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none z-40">
          <AnimatePresence>
            {flyingFood && (
              <motion.div
                key={flyingFood.id}
                initial={{ 
                  left: `calc(50% + ${flyingFood.startX}px)`, 
                  top: `${flyingFood.startY}px`, 
                  scale: 0.6, 
                  rotate: 0, 
                  opacity: 0.9 
                }}
                animate={{ 
                  left: 'calc(50% + 120px)', // Center of Bingle's dome
                  top: '110px', // Center of Bingle's dome
                  scale: 1.1, 
                  rotate: 360, 
                  opacity: [1, 1, 0.2] 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-3 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000] z-50"
                style={{ backgroundColor: flyingFood.color }}
              >
                <FoodVector id={flyingFood.itemId} size={28} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 🧊 THREE REAL-TIME GLASS SHEVES INTERIOR */}
        <div className="flex flex-col gap-6 my-2 relative z-20 flex-1">
          
          {/* Shelf 1: 수분 & 평온 밸런스존 */}
          <div className="relative pb-6 pt-4 flex items-end justify-around min-h-[95px] rounded-b-xl border-b-4 border-black/35 backdrop-blur-sm bg-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_0_rgba(0,0,0,0.15)]">
            <span className="text-[9px] font-black text-gray-500/80 absolute top-1 left-2 px-1 bg-white/70 border border-gray-300 rounded pointer-events-none select-none">
              1층 💧 수분 & 평온 밸런스존
            </span>

            {/* Acrylic Glass Shelf Physical Rim */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gray-300 via-white to-gray-400 border-t border-b border-black/60 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-10" />
            
            {[inventory[0], inventory[3], inventory[5], inventory[6]].map((item, index) => {
              const isSelected = selectedItemId === item.id;
              const isEmpty = item.count <= 0 && activeTab === 'inventory';
              return (
                <div key={item.id} className="relative flex flex-col items-center group w-1/4">
                  <button
                    type="button"
                    onClick={() => handleShelfItemClick(item, index, 1)}
                    style={{ backgroundColor: isEmpty ? 'transparent' : item.color }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all relative z-20 ${
                      isEmpty 
                        ? 'border-2 border-dashed border-black/20 bg-black/5 opacity-20 scale-90' 
                        : `border-4 border-black shadow-[3px_3px_0_0_#000] hover:scale-105 active:scale-95 ${
                          isSelected ? 'ring-4 ring-yellow-400 ring-offset-2' : ''
                        }`
                    }`}
                  >
                    <FoodVector id={item.id} size={30} className={isEmpty ? 'grayscale filter' : ''} />
                    
                    {/* Numeric Stock Badge (Only in Inventory mode) */}
                    {activeTab === 'inventory' && item.count > 0 && (
                      <div className="absolute -top-1.5 -right-1.5 bg-red-500 border-2 border-black text-white font-black w-5 h-5 rounded-full flex items-center justify-center text-[9px] shadow-[1px_1px_0_0_#000]">
                        {item.count}
                      </div>
                    )}
                  </button>

                  {/* Vending Mart Price Ticket Tag (Only in Shop mode) */}
                  {activeTab === 'shop' && (
                    <div className="absolute -bottom-7 bg-yellow-300 border-2 border-black px-1.5 py-0.5 rounded font-black text-[9px] text-black shadow-[2px_2px_0_0_rgba(0,0,0,0.15)] scale-95 flex items-center gap-0.5 pointer-events-none select-none z-30">
                      <span>🪙</span>
                      <span>{item.price}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Shelf 2: 에너지 충전존 */}
          <div className="relative pb-6 pt-4 flex items-end justify-around min-h-[95px] rounded-b-xl border-b-4 border-black/35 backdrop-blur-sm bg-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_0_rgba(0,0,0,0.15)]">
            <span className="text-[9px] font-black text-gray-500/80 absolute top-1 left-2 px-1 bg-white/70 border border-gray-300 rounded pointer-events-none select-none">
              2층 🍊 무기력 자극 활력존
            </span>

            {/* Acrylic Glass Shelf Physical Rim */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gray-300 via-white to-gray-400 border-t border-b border-black/60 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-10" />
            
            {[inventory[1], inventory[7]].map((item, index) => {
              const isSelected = selectedItemId === item.id;
              const isEmpty = item.count <= 0 && activeTab === 'inventory';
              return (
                <div key={item.id} className="relative flex flex-col items-center group w-1/3">
                  <button
                    type="button"
                    onClick={() => handleShelfItemClick(item, index, 2)}
                    style={{ backgroundColor: isEmpty ? 'transparent' : item.color }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all relative z-20 ${
                      isEmpty 
                        ? 'border-2 border-dashed border-black/20 bg-black/5 opacity-20 scale-90' 
                        : `border-4 border-black shadow-[3px_3px_0_0_#000] hover:scale-105 active:scale-95 ${
                          isSelected ? 'ring-4 ring-yellow-400 ring-offset-2' : ''
                        }`
                    }`}
                  >
                    <FoodVector id={item.id} size={30} className={isEmpty ? 'grayscale filter' : ''} />
                    
                    {/* Numeric Stock Badge */}
                    {activeTab === 'inventory' && item.count > 0 && (
                      <div className="absolute -top-1.5 -right-1.5 bg-red-500 border-2 border-black text-white font-black w-5 h-5 rounded-full flex items-center justify-center text-[9px] shadow-[1px_1px_0_0_#000]">
                        {item.count}
                      </div>
                    )}
                  </button>

                  {/* Vending Mart Price Ticket Tag */}
                  {activeTab === 'shop' && (
                    <div className="absolute -bottom-7 bg-yellow-300 border-2 border-black px-1.5 py-0.5 rounded font-black text-[9px] text-black shadow-[2px_2px_0_0_rgba(0,0,0,0.15)] scale-95 flex items-center gap-0.5 pointer-events-none select-none z-30">
                      <span>🪙</span>
                      <span>{item.price}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Shelf 3: 번아웃 진정 & 수면 유도존 */}
          <div className="relative pb-6 pt-4 flex items-end justify-around min-h-[95px] rounded-b-xl border-b-4 border-black/35 backdrop-blur-sm bg-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_0_rgba(0,0,0,0.15)]">
            <span className="text-[9px] font-black text-gray-500/80 absolute top-1 left-2 px-1 bg-white/70 border border-gray-300 rounded pointer-events-none select-none">
              3층 💤 멜팅 번아웃 & 숙면 케어존
            </span>

            {/* Acrylic Glass Shelf Physical Rim */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gray-300 via-white to-gray-400 border-t border-b border-black/60 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-10" />
            
            {[inventory[2], inventory[4], inventory[8]].map((item, index) => {
              const isSelected = selectedItemId === item.id;
              const isEmpty = item.count <= 0 && activeTab === 'inventory';
              return (
                <div key={item.id} className="relative flex flex-col items-center group w-1/4">
                  <button
                    type="button"
                    onClick={() => handleShelfItemClick(item, index, 3)}
                    style={{ backgroundColor: isEmpty ? 'transparent' : item.color }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all relative z-20 ${
                      isEmpty 
                        ? 'border-2 border-dashed border-black/20 bg-black/5 opacity-20 scale-90' 
                        : `border-4 border-black shadow-[3px_3px_0_0_#000] hover:scale-105 active:scale-95 ${
                          isSelected ? 'ring-4 ring-yellow-400 ring-offset-2' : ''
                        }`
                    }`}
                  >
                    <FoodVector id={item.id} size={30} className={isEmpty ? 'grayscale filter' : ''} />
                    
                    {/* Numeric Stock Badge */}
                    {activeTab === 'inventory' && item.count > 0 && (
                      <div className="absolute -top-1.5 -right-1.5 bg-red-500 border-2 border-black text-white font-black w-5 h-5 rounded-full flex items-center justify-center text-[9px] shadow-[1px_1px_0_0_#000]">
                        {item.count}
                      </div>
                    )}
                  </button>

                  {/* Vending Mart Price Ticket Tag */}
                  {activeTab === 'shop' && (
                    <div className="absolute -bottom-7 bg-yellow-300 border-2 border-black px-1.5 py-0.5 rounded font-black text-[9px] text-black shadow-[2px_2px_0_0_rgba(0,0,0,0.15)] scale-95 flex items-center gap-0.5 pointer-events-none select-none z-30">
                      <span>🪙</span>
                      <span>{item.price}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* 📟 DYNAMIC BUILT-IN LCD REFRIGERATOR SMART TERMINAL CONSOLE */}
        <div className="bg-[#111827] border-4 border-black rounded-2xl p-3 flex gap-3.5 shadow-[inset_0_4px_10px_rgba(0,0,0,0.85),3px_3px_0_0_rgba(0,0,0,0.2)] relative z-20 min-h-[140px] text-[#67f9e1] shrink-0">
          {selectedItem ? (
            <>
              {/* Left visual monitor segment */}
              <div 
                style={{ backgroundColor: selectedItem.color }}
                className="w-18 h-18 rounded-2xl border-3 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000] shrink-0 self-center"
              >
                <FoodVector id={selectedItem.id} size={42} />
              </div>
              
              {/* Right text console details and console button */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-base text-white truncate max-w-[70%]">{selectedItem.name}</span>
                    <span className="text-[9px] font-black bg-[#67f9e1]/10 border border-[#67f9e1]/40 px-1.5 py-0.5 rounded shrink-0">
                      {activeTab === 'inventory' ? `보유량: ${selectedItem.count}개` : `가 격: 🪙 ${selectedItem.price}`}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-[#a5f3fc]/80 leading-snug mt-1">
                    {selectedItem.desc}
                  </p>
                </div>

                {/* Built-in Controller Buttons */}
                <div className="mt-2 text-black">
                  {activeTab === 'inventory' ? (
                    <button
                      type="button"
                      disabled={selectedItem.count <= 0}
                      onClick={handleFeedFromConsole}
                      className="w-full bg-[#ff8c69] hover:bg-[#ff754d] disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed border-2 border-black font-black py-2 rounded-xl text-xs shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1 fidget-jelly-active"
                    >
                      <span>🧺</span>
                      <span>{selectedItem.count > 0 ? '빙글이에게 즉시 먹여주기' : '이 식재료는 품절 상태입니다'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleBuyItem(selectedItem)}
                      className={`w-full py-2 font-black text-xs rounded-xl border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1 fidget-jelly-active ${
                        mindCoins >= selectedItem.price
                          ? 'bg-[#67f9e1] hover:bg-[#4be6cb] text-black'
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-900'
                      }`}
                    >
                      <span>🛒</span>
                      <span>{mindCoins >= selectedItem.price ? `식재료 1개 보충하기 (-${selectedItem.price} 🪙)` : '마음 코인이 부족합니다!'}</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <span className="text-2xl animate-pulse">📟</span>
              <span className="font-black text-xs mt-1 text-[#67f9e1]">냉장고 진열대의 식재료를 터치하세요!</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
