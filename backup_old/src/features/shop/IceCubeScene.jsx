/**
 * IceCubeScene
 *
 * 냉장고/얼음 배경 위에 세 캐릭터(빙글이·쿨이·서리)를 배치합니다.
 * 각 캐릭터는 드래그 가능하며 씬 안에 구속됩니다.
 * 탭하면 반응 말풍선이 뜹니다.
 */
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import IceCubeCharacter from '../refrigerator/IceCubeCharacter';

const REACTIONS = {
  wave: ['안녕하세요! 😄', '물 많이 마셨나요? 💧', '오늘 기분 좋아요! ✨'],
  sit: ['어... 좀 쉬고 싶어요 😵', '피곤해요... 🥱', '잠깐 누워도 될까요? 🛏️'],
  shy: ['부끄러워요 >//< 💕', '쳐다보지 마세요~ 😳', '사실 좋아해요.. ♡'],
};

const Bubble = ({ message, onDone }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.7, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.8, y: -8 }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    onAnimationComplete={onDone}
    style={{
      position: 'absolute',
      bottom: '110%',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'white',
      border: '2px solid #A8D0E6',
      borderRadius: '16px 16px 16px 4px',
      padding: '7px 13px',
      fontSize: 12,
      fontWeight: 800,
      color: '#2A5A78',
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 12px rgba(42,90,120,0.15)',
      zIndex: 50,
      pointerEvents: 'none',
    }}
  >
    {message}
  </motion.div>
);

const CharacterWithBubble = ({ type, dragArea, style }) => {
  const [bubble, setBubble] = useState(null);
  const [msgIdx, setMsgIdx] = useState(0);
  const timerRef = useRef(null);

  const handleTap = () => {
    const msgs = REACTIONS[type];
    const msg  = msgs[msgIdx % msgs.length];
    setBubble(msg);
    setMsgIdx(i => i + 1);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setBubble(null), 2000);
  };

  return (
    <div style={{ position: 'relative' }}>
      <AnimatePresence>
        {bubble && (
          <Bubble key={bubble} message={bubble} onDone={() => {}} />
        )}
      </AnimatePresence>
      <IceCubeCharacter
        type={type}
        dragArea={dragArea}
        onTap={handleTap}
        style={style}
      />
    </div>
  );
};

/* ── 씬 배경: 얼음/냉기 느낌의 CSS 배경 ── */
const IceBackground = () => (
  <div style={{
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(170deg, #D6EAF8 0%, #AED6F1 35%, #85C1E9 70%, #A9CCE3 100%)',
    overflow: 'hidden',
  }}>
    {/* 얼음 바닥 반사 효과 */}
    <div style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      height: '38%',
      background: 'linear-gradient(to top, rgba(174,214,241,0.8), transparent)',
    }} />
    {/* 서리 파티클 */}
    {[...Array(18)].map((_, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: 4 + Math.random() * 8,
          height: 4 + Math.random() * 8,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.6)',
          filter: 'blur(1px)',
        }}
        animate={{
          opacity: [0.2, 0.8, 0.2],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: 'easeInOut',
        }}
      />
    ))}
    {/* 바닥 얼음 금 */}
    <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40%' }}
      viewBox="0 0 400 160" preserveAspectRatio="none">
      <path d="M0 80 Q50 60 100 75 Q150 90 200 70 Q250 50 300 72 Q350 90 400 65 L400 160 L0 160 Z"
        fill="rgba(133,193,233,0.4)" />
      <path d="M0 100 Q80 85 160 95 Q240 105 320 88 Q360 80 400 90 L400 160 L0 160 Z"
        fill="rgba(169,204,227,0.5)" />
      {/* 균열 선 */}
      <path d="M60 120 L80 100 L110 115 L130 95" stroke="rgba(255,255,255,0.5)"
        strokeWidth="1" fill="none" />
      <path d="M200 130 L220 108 L240 120 L260 100" stroke="rgba(255,255,255,0.4)"
        strokeWidth="1" fill="none" />
      <path d="M310 115 L330 98 L350 112" stroke="rgba(255,255,255,0.4)"
        strokeWidth="1" fill="none" />
    </svg>
  </div>
);

/* ── 메인 씬 ── */
const IceCubeScene = () => {
  const navigate  = useNavigate();
  const stageRef  = useRef(null);

  return (
    <div className="screen" style={{ background: '#D6EAF8' }}>

      {/* 상단 헤더 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px 0', flexShrink: 0, position: 'relative', zIndex: 10,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255,255,255,0.7)',
            border: '2px solid #A8D0E6',
            borderRadius: '50%',
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, cursor: 'pointer',
          }}
        >←</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 900, fontSize: 18, color: '#2A5A78', fontFamily: "'Outfit', sans-serif" }}>
            ICE FRIENDS
          </div>
          <div style={{ fontSize: 11, color: '#5B9EC9', fontWeight: 700, marginTop: 2 }}>
            드래그해서 놀아보세요 🧊
          </div>
        </div>
        <div style={{ width: 36 }} />
      </div>

      {/* 캐릭터 스테이지 */}
      <div
        ref={stageRef}
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <IceBackground />

        {/* 빙글이 — 왼쪽 서있는 포즈 */}
        <CharacterWithBubble
          type="wave"
          dragArea={stageRef}
          style={{ left: '8%', bottom: '28%', zIndex: 20 }}
        />

        {/* 쿨이 — 오른쪽 기울어진 포즈 */}
        <CharacterWithBubble
          type="sit"
          dragArea={stageRef}
          style={{ right: '5%', bottom: '32%', zIndex: 20 }}
        />

        {/* 서리 — 하단 부끄러운 포즈 */}
        <CharacterWithBubble
          type="shy"
          dragArea={stageRef}
          style={{ left: '28%', bottom: '10%', zIndex: 22 }}
        />

        {/* 캐릭터 이름표 */}
        <div style={{
          position: 'absolute', bottom: '4%', left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 16, zIndex: 30,
          pointerEvents: 'none',
        }}>
          {[
            { name: '빙글이', color: '#5B9EC9' },
            { name: '쿨이',   color: '#3A7CA5' },
            { name: '서리',   color: '#7EB8D4' },
          ].map(c => (
            <div key={c.name} style={{
              fontSize: 10, fontWeight: 800,
              color: c.color,
              background: 'rgba(255,255,255,0.75)',
              padding: '3px 10px', borderRadius: 10,
              border: `1.5px solid ${c.color}40`,
            }}>
              {c.name}
            </div>
          ))}
        </div>
      </div>

      {/* 하단 안내 */}
      <div style={{
        background: 'rgba(255,255,255,0.8)',
        borderTop: '2px solid #A8D0E6',
        padding: '12px 20px',
        textAlign: 'center',
        fontSize: 12,
        color: '#5B9EC9',
        fontWeight: 700,
        flexShrink: 0,
      }}>
        캐릭터를 탭하면 반응해요 💬 &nbsp;|&nbsp; 드래그로 이동 가능 🧊
      </div>
    </div>
  );
};

export default IceCubeScene;
