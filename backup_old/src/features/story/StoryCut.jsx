import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Personality matrix ──────────────────────────────────────────
const PERSONALITY_MATRIX = {
  'busy-open':   { type: '보호형 집사',  emoji: '🛡️', desc: '지쳐있으면서도 먼저 손을 내미는 당신.\n따뜻한 보호본능이 넘쳐 흘러요.' },
  'busy-wait':   { type: '안정형 집사',  emoji: '⚓',  desc: '바쁜 일상 속에서도 여유를 찾는 당신.\n먼지에게 가장 든든한 안식처가 될 거예요.' },
  'busy-talk':   { type: '활력형 집사',  emoji: '⚡',  desc: '먼저 다가가는 용기와 에너지!\n활발한 파동으로 먼지를 이끌어줄 거예요.' },
  'dreamy-open': { type: '치유형 집사',  emoji: '🌸',  desc: '꿈꾸듯 바라보다 따뜻하게 맞이하는 당신.\n먼지와 서로를 천천히 치유해나갈 거예요.' },
  'dreamy-wait': { type: '감성형 집사',  emoji: '🌙',  desc: '조용히 곁을 지키는 섬세한 당신.\n먼지의 마음을 가장 잘 이해할 거예요.' },
  'dreamy-talk': { type: '공감형 집사',  emoji: '💫',  desc: '감성적이면서도 소통을 먼저 여는 당신.\n먼지와 깊은 대화를 나눌 거예요.' },
  'solo-open':   { type: '독립형 집사',  emoji: '🌿',  desc: '혼자를 사랑하지만 마음이 열려있는 당신.\n먼지와 적절한 거리감을 지키며 성장할 거예요.' },
  'solo-wait':   { type: '평온형 집사',  emoji: '🍵',  desc: '고요한 일상을 사랑하는 당신.\n먼지와 함께 조용하고 깊은 행복을 만들 거예요.' },
  'solo-talk':   { type: '탐구형 집사',  emoji: '🔭',  desc: '혼자이지만 새로운 연결을 즐기는 당신.\n먼지와 함께 많은 것을 탐험해나갈 거예요.' },
};

// ── Floating dust decoration ─────────────────────────────────────
const Dust = ({ style, delay = 0 }) => (
  <motion.div
    animate={{ y: [0, -18, 0], x: [0, 8, 0], opacity: [0.3, 0.7, 0.3] }}
    transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay, ease: 'easeInOut' }}
    style={{ position: 'absolute', borderRadius: '50%', ...style }}
  />
);

// ── Panel 0: Title ───────────────────────────────────────────────
const TitlePanel = ({ onNext }) => (
  <div style={{
    height: '100%', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: 'radial-gradient(circle at 30% 60%, #1e2d4a 0%, #0f172a 70%)',
    padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden',
  }}>
    <Dust style={{ width: 12, height: 12, background: '#FF8E53', left: '15%', top: '18%' }} delay={0} />
    <Dust style={{ width: 8,  height: 8,  background: '#FE6B8B', left: '80%', top: '12%' }} delay={1} />
    <Dust style={{ width: 14, height: 14, background: '#8DA399', left: '65%', top: '68%' }} delay={0.6} />
    <Dust style={{ width: 10, height: 10, background: '#D6C0A4', left: '25%', top: '65%' }} delay={1.4} />
    <Dust style={{ width: 7,  height: 7,  background: '#FF8E53', left: '72%', top: '38%' }} delay={2} />

    <motion.div
      animate={{ y: [0, -16, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ fontSize: '90px', marginBottom: '28px' }}
    >🌫️</motion.div>

    <motion.h1
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      style={{
        fontSize: '48px', fontWeight: 900, marginBottom: '10px', letterSpacing: '-2px',
        background: 'linear-gradient(135deg, #FF8E53, #FE6B8B)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}
    >BINGLE</motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      style={{ color: '#94A3B8', fontSize: '15px', lineHeight: 1.9, marginBottom: '52px', maxWidth: '280px' }}
    >
      작은 먼지 하나의 이야기,<br />
      그리고 당신과의 특별한 인연
    </motion.p>

    <motion.button
      initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      onClick={onNext}
      className="premium-button"
      style={{ padding: '16px 52px', fontSize: '18px', fontWeight: 800, borderRadius: '100px', letterSpacing: '-0.5px' }}
    >이야기 시작하기 ✨</motion.button>
  </div>
);

// ── Story panel ──────────────────────────────────────────────────
const StoryPanel = ({ panel, onNext }) => (
  <div
    onClick={onNext}
    style={{
      height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer',
      background: 'linear-gradient(160deg, #1a2744 0%, #0f172a 100%)',
      padding: '50px 28px 40px', userSelect: 'none',
    }}
  >
    <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#FF8E53', fontWeight: 700, textTransform: 'uppercase', marginBottom: '28px' }}>
      BINGLE STORY · {panel.tag || 'PROLOGUE'}
    </div>

    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: '96px' }}
      >{panel.emoji}</motion.div>
    </div>

    <div style={{
      background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
      borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)',
      padding: '28px', marginBottom: '24px',
    }}>
      {panel.caption && (
        <div style={{ fontSize: '11px', color: '#FF8E53', fontWeight: 700, marginBottom: '10px', letterSpacing: '1px' }}>
          {panel.caption}
        </div>
      )}
      <p style={{ fontSize: '22px', fontWeight: 800, color: 'white', lineHeight: 1.45, marginBottom: panel.subtext ? '12px' : 0 }}>
        {panel.text}
      </p>
      {panel.subtext && (
        <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.75 }}>{panel.subtext}</p>
      )}
    </div>

    <div style={{ textAlign: 'right', color: '#475569', fontSize: '12px', fontWeight: 600 }}>
      화면을 탭하여 계속 →
    </div>
  </div>
);

// ── Choice panel ─────────────────────────────────────────────────
const ChoicePanel = ({ panel, onChoose }) => {
  const [selected, setSelected] = useState(null);

  const pick = (opt) => {
    if (selected) return;
    setSelected(opt.value);
    setTimeout(() => onChoose(panel.choiceKey, opt.value), 550);
  };

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(160deg, #1a1f3a 0%, #0f172a 100%)',
      padding: '50px 24px 40px',
    }}>
      <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#FE6B8B', fontWeight: 700, marginBottom: '28px', textTransform: 'uppercase' }}>
        당신의 선택
      </div>

      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <motion.div
          animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: '52px', marginBottom: '18px' }}
        >{panel.emoji}</motion.div>
        <h2 style={{ fontSize: '21px', fontWeight: 900, color: 'white', lineHeight: 1.5 }}>
          {panel.question}
        </h2>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
        {panel.options.map(opt => {
          const isSelected = selected === opt.value;
          return (
            <motion.button
              key={opt.value}
              whileHover={!selected ? { scale: 1.02, x: 6 } : {}}
              whileTap={!selected ? { scale: 0.97 } : {}}
              onClick={() => pick(opt)}
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(255,142,83,0.25), rgba(254,107,139,0.25))'
                  : 'rgba(255,255,255,0.06)',
                border: isSelected ? '2px solid #FF8E53' : '1px solid rgba(255,255,255,0.12)',
                borderRadius: '18px', padding: '18px 20px',
                display: 'flex', alignItems: 'center', gap: '16px',
                cursor: selected ? 'default' : 'pointer', width: '100%', textAlign: 'left',
                transition: 'all 0.3s',
              }}
            >
              <span style={{ fontSize: '34px', flexShrink: 0 }}>{opt.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'white', marginBottom: '3px' }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{opt.desc}</div>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ fontSize: '22px', color: '#FF8E53', flexShrink: 0 }}
                >✓</motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ── Result panel ─────────────────────────────────────────────────
const ResultPanel = ({ choices, onStart }) => {
  const [catName, setCatName] = useState('');
  const key = `${choices.dayType || 'dreamy'}-${choices.reaction || 'wait'}`;
  const p = PERSONALITY_MATRIX[key] || PERSONALITY_MATRIX['dreamy-wait'];

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'radial-gradient(circle at 50% 30%, #2d1a3d 0%, #0f172a 70%)',
      padding: '50px 24px 40px', alignItems: 'center', textAlign: 'center',
      overflowY: 'auto',
    }}>
      <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#FF8E53', fontWeight: 700, marginBottom: '28px' }}>
        분석 완료
      </div>

      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
        style={{ fontSize: '80px', marginBottom: '20px' }}
      >{p.emoji}</motion.div>

      <div style={{
        background: 'rgba(255,142,83,0.15)', border: '1px solid rgba(255,142,83,0.35)',
        borderRadius: '100px', padding: '5px 20px', marginBottom: '18px',
        fontSize: '11px', fontWeight: 700, color: '#FF8E53', letterSpacing: '1px',
      }}>당신의 유형</div>

      <h2 style={{
        fontSize: '30px', fontWeight: 900, marginBottom: '14px',
        background: 'linear-gradient(135deg, #FF8E53, #FE6B8B)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>{p.type}</h2>

      <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: 1.9, marginBottom: '40px', whiteSpace: 'pre-line', maxWidth: '300px' }}>
        {p.desc}
      </p>

      <div style={{ width: '100%', maxWidth: '340px', marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '10px', fontWeight: 600 }}>
          당신의 먼지에게 이름을 지어주세요
        </div>
        <input
          value={catName}
          onChange={e => setCatName(e.target.value)}
          placeholder="먼지"
          maxLength={8}
          style={{
            width: '100%', background: 'rgba(255,255,255,0.08)',
            border: '2px solid rgba(255,255,255,0.15)', borderRadius: '16px',
            padding: '16px', fontSize: '22px', fontWeight: 900,
            textAlign: 'center', color: 'white', outline: 'none',
            fontFamily: 'inherit', boxSizing: 'border-box',
          }}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        onClick={() => onStart({ personality: p, catName: catName || '먼지' })}
        className="premium-button"
        style={{ width: '100%', maxWidth: '340px', padding: '18px', fontSize: '18px', fontWeight: 900, borderRadius: '18px' }}
      >
        {(catName || '먼지')}와 함께 시작하기 🐾
      </motion.button>
    </div>
  );
};

// ── Panel definitions ────────────────────────────────────────────
const PANELS = [
  { id: 'title', type: 'title' },
  {
    id: 'intro1', type: 'story', emoji: '🌫️', tag: 'PROLOGUE',
    text: '2024년 봄, 도시의 어느 골목...',
    subtext: '세상 어딘가에, 아주 작은 먼지 하나가 홀로 떠돌고 있었어요.',
  },
  {
    id: 'intro2', type: 'story', emoji: '💨', tag: 'PROLOGUE',
    text: '먼지는 오랫동안 혼자였어요.',
    subtext: '따뜻한 햇살이 드는 창가를 바라보며, 언젠가 누군가를 만나길 기다리고 있었죠.',
  },
  {
    id: 'choice1', type: 'choice',
    emoji: '🕐', question: '그날, 당신은 어떤 하루를 보내고 있었나요?',
    choiceKey: 'dayType',
    options: [
      { value: 'busy',   icon: '💼', label: '바쁘게 일하다 지쳐있었어요',      desc: '끝없는 할 일들 사이에서...' },
      { value: 'dreamy', icon: '🌥️', label: '멍하니 창밖을 바라보고 있었어요', desc: '생각이 많아지는 그런 날이었어요' },
      { value: 'solo',   icon: '🎵', label: '혼자만의 시간을 조용히 즐겼어요', desc: '나만의 세계에 있었어요' },
    ],
  },
  {
    id: 'middle', type: 'story', emoji: '👀', tag: 'ENCOUNTER',
    text: '그 순간, 먼지는 당신을 발견했어요.',
    subtext: '"저 사람... 뭔가 특별해 보여. 다가가도 될까...?" 작은 먼지가 조심스럽게 생각했어요.',
  },
  {
    id: 'choice2', type: 'choice',
    emoji: '🤝', question: '먼지가 살며시 당신 곁에 다가왔어요. 당신은?',
    choiceKey: 'reaction',
    options: [
      { value: 'open', icon: '🤲', label: '손을 내밀어 맞이했어요', desc: '열린 마음으로 받아들였어요' },
      { value: 'wait', icon: '🌿', label: '가만히 기다려 줬어요',   desc: '조용히 공간을 내어주었어요' },
      { value: 'talk', icon: '💬', label: '먼저 말을 건넸어요',     desc: '"안녕, 나랑 친구할래?" 라고 했어요' },
    ],
  },
  {
    id: 'ending', type: 'story', emoji: '🏠', tag: 'EPILOGUE',
    text: '그렇게... 먼지는 당신과 함께하기로 했어요.',
    subtext: '이 작은 인연이, 서로에게 특별한 이야기가 될 거예요. ♡',
  },
  { id: 'result', type: 'result' },
];

// ── Main component ───────────────────────────────────────────────
const StoryCut = ({ onFinish }) => {
  const [panelIndex, setPanelIndex] = useState(0);
  const [choices, setChoices] = useState({});
  const [transitioning, setTransitioning] = useState(false);

  const goNext = () => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setPanelIndex(i => Math.min(i + 1, PANELS.length - 1));
      setTransitioning(false);
    }, 250);
  };

  const handleChoice = (key, value) => {
    setChoices(prev => ({ ...prev, [key]: value }));
    setTimeout(goNext, 650);
  };

  const handleStart = ({ personality, catName }) => {
    onFinish({ personality, catName });
  };

  const current = PANELS[panelIndex];

  const renderPanel = () => {
    switch (current.type) {
      case 'title':  return <TitlePanel onNext={goNext} />;
      case 'story':  return <StoryPanel panel={current} onNext={goNext} />;
      case 'choice': return <ChoicePanel panel={current} onChoose={handleChoice} />;
      case 'result': return <ResultPanel choices={choices} onStart={handleStart} />;
      default:       return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.4 }}
      style={{ position: 'fixed', inset: 0, zIndex: 100, overflow: 'hidden' }}
    >
      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.08)', zIndex: 10 }}>
        <motion.div
          animate={{ width: `${(panelIndex / (PANELS.length - 1)) * 100}%` }}
          transition={{ duration: 0.4 }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #FF8E53, #FE6B8B)' }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={panelIndex}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ height: '100%' }}
        >
          {renderPanel()}
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div style={{
        position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '5px', zIndex: 10, pointerEvents: 'none',
      }}>
        {PANELS.map((_, i) => (
          <motion.div
            key={i}
            animate={{ width: i === panelIndex ? 20 : 6, opacity: i <= panelIndex ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
            style={{ height: '4px', borderRadius: '2px', background: '#FF8E53' }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default StoryCut;
