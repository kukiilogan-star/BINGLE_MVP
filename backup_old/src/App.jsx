import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import StoryCut       from './features/story/StoryCut';
import EvolutionModal from './features/story/EvolutionModal';
import IceSection from './features/home/IceSection';
import UnityWorldSection from './features/home/UnityWorldSection';
import BottomNav  from './shared/ui/BottomNav';
import QuestCard  from './features/home/QuestCard';
import { useGameStore, LEVEL_THRESHOLDS } from './shared/store/useGameStore';
import ComicHomeView from './features/home/ComicHomeView';

import AffinityPage   from './features/shop/AffinityPage';
import DataLogPage    from './features/archive/DataLogPage';
import SocialPage     from './features/social/SocialPage';
import LetterPage     from './features/social/LetterPage';
import RefrigeratorPage from './features/refrigerator/RefrigeratorPage';
import IceCubeScene    from './features/shop/IceCubeScene';

// ─── Nudge message (time-based) ──────────────────────────────────
function getNudge(charName, burnoutLevel, quests, programWeek, programStage) {
  const h = new Date().getHours();
  const pending = quests.filter(q => q.progress < q.target && !q.auto);
  
  if (burnoutLevel >= 5) return `${charName}야... 오늘 좀 쉬자 ❄️`;
  
  // Weekly program nudge
  if (programWeek === 1) return `먼저 나의 감정을 알아보는 시간!\n${programStage} 단계를 시작해보자 🐾`;
  
  if (h >= 6  && h < 12) return `좋은 아침이에요!\n오늘도 ${charName}와 함께 해요 ☀️`;
  if (h >= 12 && h < 14) return `점심 시간이에요~\n물 한 잔 꼭 마셔요! 💧`;
  if (h >= 14 && h < 18) return pending.length
    ? `${pending[0].name} 아직 남았어요.\n같이 해볼까요? ❄️`
    : '오후도 잘 하고 있어요! ✨';
  if (h >= 18 && h < 22) return `오늘도 수고했어요\n고마워요 ♡`;
  return `늦었네요...\n이제 슬슬 자야 할 시간이에요 🌙`;
}

// ─── Header ──────────────────────────────────────────────────────
const HomeHeader = () => {
  const { fish, paw, userLevel, charName, addCurrency } = useGameStore();
  const levelInfo = LEVEL_THRESHOLDS.find(t => t.level === userLevel) || LEVEL_THRESHOLDS[0];
  const navigate  = useNavigate();
  const { is3D, setViewMode } = useGameStore();

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 18px 0', flexShrink: 0, position: 'relative', zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => navigate('/affinity')}
          style={{
            background: 'rgba(255,255,255,0.8)', border: '2px solid #87CEEB',
            borderRadius: '50%', width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', cursor: 'pointer',
          }}
        >🧊</button>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#3E3127', lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
            BINGLE
          </div>
          <div style={{ fontSize: '10px', color: '#8B7A6C', fontWeight: 700 }}>
            {charName} · Lv.{userLevel} {levelInfo.emoji}
          </div>
        </div>
      </div>

      {/* Refrigerator Feature Access */}
      <button
        onClick={() => navigate('/refrigerator')}
        style={{
          background: 'rgba(235, 248, 255, 0.9)', border: '2px solid #87CEEB',
          borderRadius: '18px', padding: '5px 12px',
          display: 'flex', alignItems: 'center', gap: '6px',
          fontWeight: 800, fontSize: '13px', color: '#2c3e50',
          cursor: 'pointer', boxShadow: '0 2px 6px rgba(135,206,235,0.2)',
          marginLeft: 'auto', marginRight: '8px'
        }}
      >
        🧊 얼음방
      </button>

      <button
        onClick={() => setViewMode(is3D ? '2d' : '3d')}
        style={{
          background: is3D ? 'rgba(62, 49, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          border: '2px solid #3E3127',
          borderRadius: '18px', padding: '5px 12px',
          display: 'flex', alignItems: 'center', gap: '6px',
          fontWeight: 800, fontSize: '13px', color: is3D ? 'white' : '#3E3127',
          cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          marginRight: '8px'
        }}
      >
        {is3D ? '🎨 2D' : '🌐 3D'}
      </button>

      {/* Currency + XP */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <button
          onClick={() => addCurrency('fish', 10)}
          style={{
            background: 'rgba(255,255,255,0.9)', border: '2px solid #D4B896',
            borderRadius: '18px', padding: '5px 12px',
            display: 'flex', alignItems: 'center', gap: '4px',
            fontWeight: 800, fontSize: '13px', color: '#3E3127',
            cursor: 'pointer', boxShadow: '0 2px 6px rgba(62,49,39,0.1)',
          }}
        >
          🐟 {fish.toLocaleString()}
          <span style={{ color: '#B08060', fontSize: '12px', marginLeft: '1px' }}>+</span>
        </button>
        <button
          onClick={() => addCurrency('paw', 10)}
          style={{
            background: 'rgba(255,255,255,0.9)', border: '2px solid #D4B896',
            borderRadius: '18px', padding: '5px 12px',
            display: 'flex', alignItems: 'center', gap: '4px',
            fontWeight: 800, fontSize: '13px', color: '#3E3127',
            cursor: 'pointer', boxShadow: '0 2px 6px rgba(62,49,39,0.1)',
          }}
        >
          🍪 {paw.toLocaleString()}
          <span style={{ color: '#B08060', fontSize: '12px', marginLeft: '1px' }}>+</span>
        </button>
      </div>
    </div>
  );
};

// ─── Greeting ────────────────────────────────────────────────────
const HomeGreeting = () => {
  const { charName, burnoutLevel, quests, programWeek, programStage } = useGameStore();
  return (
    <div style={{ textAlign: 'center', padding: '12px 24px 0', flexShrink: 0 }}>
      <h1 style={{
        fontSize: '22px', fontWeight: 900, color: '#3E3127',
        margin: 0, letterSpacing: '-0.5px', lineHeight: 1.35,
      }}>
        {charName}가 오늘도<br />작은 부탁을 건네요.❄️
      </h1>
      <p style={{
        fontSize: '12px', color: '#8B7A6C', marginTop: '7px', lineHeight: 1.65,
      }}>
        {getNudge(charName, burnoutLevel, quests, programWeek, programStage).replace('\n', ' ')}
      </p>
    </div>
  );
};


// ─── Home View ───────────────────────────────────────────────────
const HomeView = () => {
  return (
    <div className="screen" style={{ padding: 0 }}>
      <ComicHomeView />
      <BottomNav />
    </div>
  );
};

// ─── App Shell ───────────────────────────────────────────────────
const AppShell = () => {
  const [showStory, setShowStory] = useState(true);

  const handleStoryFinish = (result) => {
    if (result?.personality) {
      useGameStore.getState().completeStory(result.personality, result.charName);
    }
    setShowStory(false);
  };

  return (
    <div className="app-container">
      <AnimatePresence>
        {showStory && <StoryCut onFinish={handleStoryFinish} />}
      </AnimatePresence>

      {!showStory && (
        <Routes>
          <Route path="/"        element={<HomeView />} />
          <Route path="/growth"  element={<AffinityPage />} />
          <Route path="/archive" element={<DataLogPage />} />
          <Route path="/social"  element={<SocialPage />} />
          <Route path="/diary"   element={<LetterPage />} />
          <Route path="/shop"    element={<IceCubeScene />} />
          <Route path="/settings" element={<AffinityPage />} />
          <Route path="/refrigerator" element={<RefrigeratorPage />} />
        </Routes>
      )}

      <EvolutionModal />
    </div>
  );
};

const App = () => (
  <Router>
    <AppShell />
  </Router>
);

export default App;
