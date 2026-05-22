import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedIce from './AnimatedIce';
import mainBg from '../../shared/assets/main-bg.png';
import { useGameStore } from '../../shared/store/useGameStore';

const MESSAGES = [
  '오늘은 시원한\n물 한 잔 마셔볼까요? 💧',
  '내 몸이 녹지 않게\n방안 온도를 체크해줘요! ❄️',
  '너무 오래 앉아 있으면 답답해요.\n잠깐 산책 어때요? 👟',
  '오늘 마음 상태는 어떤가요?\n기록으로 남겨보세요 📝',
];

const HOTSPOTS = [
  {
    id: 'diary',
    label: '결정의 일기 📔',
    style: { left: '4%', top: '44%', width: '14%', height: '20%' },
    action: 'navigate',
    path: '/diary',
    toast: '📔 결정의 일기',
  },
  {
    id: 'sleep',
    label: '수면 기록 🌙',
    style: { left: '4%', top: '26%', width: '14%', height: '18%' },
    action: 'navigate',
    path: '/archive',
    toast: '🌙 수면 기록',
  },
  {
    id: 'mug',
    label: '수분 보충 💧',
    style: { left: '5%', bottom: '28%', width: '16%', height: '18%' },
    action: 'quest',
    questId: 'water',
    toast: '💧 수분 보충 +1!',
  },
  {
    id: 'yarn',
    label: '눈송이 ❄️',
    style: { right: '4%', bottom: '26%', width: '18%', height: '18%' },
    action: 'toast',
    toast: '❄️ 차가운 눈송이가 좋아요!',
  },
];

const SpeechBubble = ({ message }) => (
  <motion.div
    key={message}
    initial={{ opacity: 0, scale: 0.88, y: 8 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9, y: -6 }}
    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    style={{
      position: 'absolute',
      bottom: '57%',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'white',
      border: '2.5px solid #2c3e50',
      borderRadius: '22px',
      padding: '11px 18px',
      fontSize: '13px',
      fontWeight: 700,
      color: '#2c3e50',
      lineHeight: 1.6,
      textAlign: 'center',
      whiteSpace: 'pre-line',
      boxShadow: '3px 4px 0 rgba(44,62,80,0.12)',
      zIndex: 30,
      minWidth: '170px',
      pointerEvents: 'none',
    }}
  >
    {message}
    <div style={{
      position: 'absolute', bottom: '-13px', left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '11px solid transparent', borderRight: '11px solid transparent',
      borderTop: '13px solid #2c3e50',
    }} />
    <div style={{
      position: 'absolute', bottom: '-10px', left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '9px solid transparent', borderRight: '9px solid transparent',
      borderTop: '11px solid white',
    }} />
  </motion.div>
);

const Toast = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -12, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -8 }}
    style={{
      position: 'absolute',
      top: '7%',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#2c3e50',
      color: 'white',
      padding: '8px 20px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: 800,
      zIndex: 60,
      boxShadow: '0 4px 14px rgba(44,62,80,0.3)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
    }}
  >
    {message}
  </motion.div>
);

const SelectionRing = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.7 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.7 }}
    style={{
      position: 'absolute',
      inset: '-6px',
      borderRadius: '12px',
      border: '2.5px solid #81D4FA',
      boxShadow: '0 0 0 4px rgba(129,212,250,0.3)',
      pointerEvents: 'none',
    }}
  />
);

const Tooltip = ({ label }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    style={{
      position: 'absolute',
      bottom: '110%',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#2c3e50',
      color: 'white',
      fontSize: '11px',
      fontWeight: 800,
      padding: '5px 11px',
      borderRadius: '12px',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 100,
    }}
  >
    {label}
  </motion.div>
);

const Hotspot = ({ spot, selected, onSelect }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div
      whileTap={{ scale: 0.94 }}
      onHoverStart={() => setShowTooltip(true)}
      onHoverEnd={() => setShowTooltip(false)}
      onTap={() => { setShowTooltip(false); onSelect(spot); }}
      style={{
        position: 'absolute',
        cursor: 'pointer',
        ...spot.style,
      }}
    >
      <AnimatePresence>
        {selected && <SelectionRing key="ring" />}
      </AnimatePresence>
      <AnimatePresence>
        {showTooltip && <Tooltip key="tip" label={spot.label} />}
      </AnimatePresence>
    </motion.div>
  );
};

const IceSection = () => {
  const navigate = useNavigate();
  const { tapQuest } = useGameStore();

  const [msgIdx,    setMsgIdx]    = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [toast,     setToast]     = useState(null);

  const fireToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleSelect = (spot) => {
    setSelectedId(prev => prev === spot.id ? null : spot.id);

    if (spot.action === 'navigate') {
      fireToast(spot.toast);
      setTimeout(() => navigate(spot.path), 500);
    } else if (spot.action === 'quest') {
      tapQuest(spot.questId);
      fireToast(spot.toast);
    } else {
      fireToast(spot.toast);
    }
  };

  const handlePet = () => {
    setMsgIdx(i => (i + 1) % MESSAGES.length);
  };

  return (
    <div style={{ position: 'relative', flex: 1, overflow: 'hidden', minHeight: 0 }}>

      <img
        src={mainBg}
        alt="room"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center bottom',
          filter: 'hue-rotate(180deg) brightness(1.1)', // Make it look colder
        }}
      />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%',
        background: 'linear-gradient(to bottom, transparent, rgba(224,247,250,0.95))',
        zIndex: 5,
        pointerEvents: 'none',
      }} />

      <AnimatePresence>
        {toast && <Toast key={toast} message={toast} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <SpeechBubble key={msgIdx} message={MESSAGES[msgIdx]} />
      </AnimatePresence>

      {HOTSPOTS.map(spot => (
        <Hotspot
          key={spot.id}
          spot={spot}
          selected={selectedId === spot.id}
          onSelect={handleSelect}
        />
      ))}

      <div style={{
        position: 'absolute',
        bottom: '14%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 25,
      }}>
        <AnimatedIce onPet={handlePet} />
      </div>

    </div>
  );
};

export default IceSection;
