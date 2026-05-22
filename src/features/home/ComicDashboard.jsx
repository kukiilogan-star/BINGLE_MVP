import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../shared/store/useGameStore';
import { ThermometerSun, Zap, Activity, Watch, MapPin } from 'lucide-react';

const DIALOGUES = {
  happy: ["오늘도 같이 걷자! 🧊", "네가 있어서 덜 녹는 것 같아 ✨", "시원하고 기분 최고야!"],
  hot: ["너무 더워... 녹아내릴 것 같아 🥵", "마음의 온도를 낮춰줘...", "후하... 심호흡이 필요해!"],
  angry: ["왜 이렇게 스트레스 받는 일이 많은 거야! 😤", "부글부글... 머리에서 김이 나!", "화가 나서 녹을 것 같아!"],
  sleeping: ["Zzz... ❄️", "쿨쿨... 얼음나라 꿈꾸는 중...", "Zzz... 🧊"],
  crying: ["너무 지쳤어... 나 지금 울고 있니? 😭", "눈물이 흘러내려 몸이 더 빨리 녹는 기분이야...", "마음 비가 그치지 않아 ☔"],
  excited: ["완벽 충전! 에너지 대폭발! 🤩", "하늘을 날아갈 것만 같은 차가움이야!", "이 기세를 몰아 달려볼까! 🏃‍♂️"]
};

const ComicDashboard = () => {
  const { userLevel, mindTemperature, steps, characterState, setLevel, setMindTemperature, setSteps, setCharacterState } = useGameStore();

  const [toast, setToast] = useState(null);
  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // Logic to update character state based on Mind Temperature
  useEffect(() => {
    if (mindTemperature >= 80) {
      setCharacterState('hot');
    } else if (mindTemperature >= 60) {
      setCharacterState('angry');
    } else if (mindTemperature <= 30 && characterState !== 'sleeping') {
      setCharacterState('happy');
    }
  }, [mindTemperature, setCharacterState, characterState]);

  // Actual Mock for Apple Watch / GPS Step Tracking Sync
  const handleAppleWatchSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    showToast('애플워치 및 지도 데이터 동기화 중... ⌚️');
    
    // Simulate API request to Apple Health / Server
    setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          let addedSteps = Math.floor(Math.random() * 500) + 100; // Simulated steps from GPS
          
          if (lastLocation) {
             // Simple distance calculation mock
             const dist = Math.abs(latitude - lastLocation.lat) + Math.abs(longitude - lastLocation.lng);
             addedSteps += Math.floor(dist * 100000);
          }
          
          setLastLocation({ lat: latitude, lng: longitude });
          setSteps(steps + addedSteps);
          
          // Walking reduces mind temperature
          setMindTemperature(Math.max(0, mindTemperature - 15));
          
          setIsSyncing(false);
          showToast(`동기화 완료! ${addedSteps} 걸음 추가됨! 🧊 온도가 내려갔어요.`);
        }, (error) => {
          // Fallback if no GPS permission
          const addedSteps = Math.floor(Math.random() * 300) + 50;
          setSteps(steps + addedSteps);
          setMindTemperature(Math.max(0, mindTemperature - 10));
          setIsSyncing(false);
          showToast(`워치 동기화 완료! (GPS 제외) ${addedSteps} 걸음 추가됨!`);
        });
      }
    }, 2000);
  };

  const handleBreathe = () => {
    if (mindTemperature <= 20) {
      showToast('이미 충분히 차가워요! ❄️');
      return;
    }
    setMindTemperature(mindTemperature - 20);
    showToast('심호흡 완료! 마음의 온도가 내려갔어요 🌬️');
  };

  const handleStress = () => {
    setMindTemperature(mindTemperature + 25);
    showToast('스트레스 증가! 빙글이가 더워해요! 🔥');
  };

  const handleSleep = () => {
    setCharacterState(characterState === 'sleeping' ? 'happy' : 'sleeping');
    if (characterState !== 'sleeping') {
      setMindTemperature(Math.max(0, mindTemperature - 10));
      showToast('빙글이가 잠들었어요. 온도 감소 Zzz 🌙');
    } else {
      showToast('빙글이가 깨어났어요! ✨');
    }
  };

  const getExpression = () => {
    const dialogues = DIALOGUES[characterState] || DIALOGUES['happy'];
    return dialogues[dialogueIdx % dialogues.length];
  };

  const handleChat = () => {
    setDialogueIdx(prev => prev + 1);
  };

  const basePath = import.meta.env.BASE_URL || '/';

  const bingleImageMap = {
    happy: `${basePath}images/bingle_happy.png`,
    angry: `${basePath}images/bingle_angry.png`,
    hot: `${basePath}images/bingle_hot.png`,
    sleeping: `${basePath}images/bingle_sleeping.png`,
    crying: `${basePath}images/bingle_crying.png`,
    excited: `${basePath}images/bingle_excited.png`,
  };

  return (
    <div style={{
      width: '100%', height: '100%', display: 'grid',
      gridTemplateColumns: '300px 1fr', gridTemplateRows: 'auto 1fr',
      gap: '20px', padding: '20px', position: 'relative'
    }}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
              background: '#FFEB3B', border: '3px solid black', padding: '10px 24px',
              fontSize: '20px', fontWeight: 'bold', boxShadow: '4px 4px 0px black',
              zIndex: 9999, whiteSpace: 'nowrap'
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div style={{ gridColumn: '1 / span 2', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div className="comic-panel" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#00f2ff', borderRadius: '50%', padding: '5px' }}>
            <Zap size={20} color="black" />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Lv.{userLevel}</span>
        </div>

        <div className="comic-panel" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px', background: mindTemperature > 60 ? '#FFCDD2' : '#E0F7FA', transition: 'background 0.5s' }}>
          <ThermometerSun size={20} color={mindTemperature > 60 ? '#D32F2F' : '#0097A7'} />
          <div style={{ width: '200px', height: '16px', border: '2px solid black', borderRadius: '8px', background: 'white', overflow: 'hidden', position: 'relative' }}>
            <motion.div
              animate={{ width: \`\${mindTemperature}%\`, background: mindTemperature > 70 ? '#F44336' : mindTemperature > 40 ? '#FF9800' : '#4CAF50' }}
              transition={{ type: 'spring', stiffness: 100 }}
              style={{ height: '100%' }}
            />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>마음 온도: {mindTemperature}°C</span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
          <div className="comic-panel" style={{ padding: '5px 15px', display: 'flex', alignItems: 'center', gap: '8px', background: '#E8F5E9' }}>
            <Activity size={18} color="#2E7D32" /> 
            <span style={{ fontWeight: 'bold' }}>{steps} 걸음</span>
          </div>
          <button 
            className="comic-btn"
            style={{ padding: '5px 15px', display: 'flex', alignItems: 'center', gap: '5px', background: isSyncing ? '#E0E0E0' : '#000', color: isSyncing ? '#888' : '#FFF', fontSize: '14px' }}
            onClick={handleAppleWatchSync}
            disabled={isSyncing}
          >
            <Watch size={18} /> {isSyncing ? '동기화 중...' : '워치 연동'}
          </button>
        </div>
      </div>

      {/* Left Sidebar - Controls */}
      <div className="comic-panel" style={{ padding: '20px', background: '#FFF9C4', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="halftone" />
        <h2 style={{ fontSize: '24px', borderBottom: '3px solid black', paddingBottom: '10px' }}>컨트롤 패널</h2>
        
        <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.5 }}>
          스트레스를 받으면 빙글이의 온도가 올라갑니다! 걷기나 명상으로 온도를 낮춰주세요.
        </p>

        <button 
          className="comic-btn"
          style={{ background: '#FF5252', color: 'white', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
          onClick={handleStress}
        >
          🔥 스트레스 받기 (테스트)
        </button>

        <button 
          className="comic-btn"
          style={{ background: '#4CAF50', color: 'white', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
          onClick={handleBreathe}
        >
          🌬️ 심호흡 하기 (온도 ↓)
        </button>

        <button 
          className="comic-btn"
          style={{ background: '#3F51B5', color: 'white', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
          onClick={handleSleep}
        >
          🌙 {characterState === 'sleeping' ? '빙글이 깨우기' : '빙글이 재우기'}
        </button>
        
        <div style={{ marginTop: 'auto', padding: '15px', background: 'white', border: '2px dashed black', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={16}/> 위치 정보 기반 걸음</h3>
          <p style={{ fontSize: '12px', color: '#666' }}>워치 연동 시 실제 GPS 위치 변화를 감지하여 걸음수를 계산하고 마음의 온도를 낮춥니다.</p>
        </div>
      </div>

      {/* Main Content - Bingle Area */}
      <div
        className="comic-panel"
        style={{
          background: 'url("/comic_room.png") center/cover',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden'
        }}
        onClick={handleChat}
      >
        {/* Environment Filter based on Temp */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: mindTemperature > 80 ? 'rgba(255, 0, 0, 0.1)' : mindTemperature < 30 ? 'rgba(0, 200, 255, 0.05)' : 'transparent',
          pointerEvents: 'none', transition: 'background 1s'
        }}/>

        {/* Speech Bubble */}
        <AnimatePresence mode="wait">
          <motion.div
            key={getExpression()}
            initial={{ scale: 0, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -10 }}
            className="comic-text"
            style={{ marginBottom: '20px', maxWidth: '300px', cursor: 'pointer', zIndex: 10 }}
          >
            {getExpression()}
            <div style={{
              position: 'absolute', bottom: '-15px', left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '15px solid transparent',
              borderRight: '15px solid transparent',
              borderTop: '15px solid black'
            }} />
          </motion.div>
        </AnimatePresence>

        {/* Bingle Character */}
        <motion.img
          key={characterState}
          src={bingleImageMap[characterState] || bingleImageMap.happy}
          alt="Bingle"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: characterState === 'hot' ? [0, 5, 0] : characterState === 'sleeping' ? [0, -5, 0] : [0, -10, 0]
          }}
          transition={{ 
            duration: characterState === 'hot' ? 1 : characterState === 'sleeping' ? 4 : 3, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
          style={{ 
            width: '280px', 
            height: 'auto', 
            filter: 'drop-shadow(6px 6px 0px rgba(0,0,0,0.25))', 
            cursor: 'pointer',
            zIndex: 10
          }}
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: \`
        .comic-btn {
          padding: 12px 24px;
          font-size: 16px;
          font-weight: bold;
          border: 3px solid black;
          box-shadow: 4px 4px 0px black;
          cursor: pointer;
          transition: transform 0.1s, box-shadow 0.1s;
          font-family: 'Gaegu', cursive;
          border-radius: 8px;
        }
        .comic-btn:hover:not(:disabled) {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px black;
        }
        .comic-btn:active:not(:disabled) {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px black;
        }
        .comic-btn:disabled {
          cursor: not-allowed;
          opacity: 0.8;
        }
      \` }} />
    </div>
  );
};

export default ComicDashboard;
