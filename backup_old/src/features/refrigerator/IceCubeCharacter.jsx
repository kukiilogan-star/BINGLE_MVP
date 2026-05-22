import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { motion, AnimatePresence } from 'framer-motion';

import waveIceImg from '../../shared/assets/wave_ice.png';
import sitIceImg  from '../../shared/assets/sit_ice.png';
import shyIceImg  from '../../shared/assets/shy_ice.png';
import meltingSpriteImg from '../../shared/assets/melting_sprite.png';

const CHARS = {
  wave: { img: waveIceImg, width: 100, height: 120, name: '안녕 빙글이', emoji: '🙂 ⚡', emojiPos: { bottom: 10, right: -10 } },
  sit:  { img: sitIceImg,  width: 120, height: 110, name: '편안한 빙글이', emoji: '☹️ ⚡', emojiPos: { top: 0, right: -20 } },
  shy:  { img: shyIceImg,  width: 100, height: 100, name: '부끄 빙글이', emoji: '🙂 ⚡', emojiPos: { top: -15, right: 10 } },
};

const REACTIONS = {
  wave: ['앗 뜨거! 빨리 식혀줘!', '간식 주면 얼음 땡! 🧊', '너무 더워요... 🥵'],
  sit:  ['선풍기 좀 틀어줄래?', '점점 녹는 기분이야 💧', '놀아주면 시원해져!'],
  shy:  ['물바다가 되기 싫어 🌊', '에어컨 켜줘... ><', '온도가 오르고 있어!'],
};

const Bubble = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.7, y: 8 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.8, y: -6 }}
    transition={{ type: 'spring', stiffness: 420, damping: 22 }}
    style={{
      position: 'absolute',
      bottom: '105%',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(255,255,255,0.95)',
      border: '2px solid #333',
      borderRadius: '14px 14px 14px 4px',
      padding: '7px 13px',
      fontSize: 12,
      fontWeight: 800,
      color: '#333',
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
      pointerEvents: 'none',
      zIndex: 50,
    }}
  >
    {message}
    <div style={{
      position: 'absolute',
      top: '100%', left: 14,
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderTop: '6px solid #333',
    }} />
  </motion.div>
);

// 녹아내리는 효과 및 움직이는 스프라이트 시트 컴포넌트
const MeltingSprite = ({ progress }) => {
  const [frame, setFrame] = useState(0);

  // 스프라이트 시트 (2x2 그리드, 총 3~4프레임)
  // 최대한 살아있는 것처럼 보이도록 일정 주기로 프레임 자동 순환 (애니메이션)
  useEffect(() => {
    // 온도가 높을수록 더 빠르게 숨쉬고 녹는 듯한 애니메이션 속도
    const speed = progress > 50 ? 300 : 600; 
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 3); // 3프레임 반복
    }, speed);
    return () => clearInterval(interval);
  }, [progress]);

  const x = (frame % 2) * 100;
  const y = Math.floor(frame / 2) * 100;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundImage: `url(${meltingSpriteImg})`,
      backgroundSize: '200% 200%',
      backgroundPosition: `${x}% ${y}%`,
      pointerEvents: 'none',
      filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))',
      transition: 'background-position 0.1s steps(1)'
    }} />
  );
};

const IceCubeCharacter = ({
  engine,
  type = 'wave',
  initialX = 0,
  initialY = 0,
  temperature = 0, // 0 ~ 100
  style = {},
}) => {
  const char = CHARS[type];
  const [bubble, setBubble] = useState(null);
  const [msgIdx, setMsgIdx] = useState(0);
  const timerRef = useRef(null);
  const divRef = useRef(null);
  const bodyRef = useRef(null);

  // 물리 엔진 Body 생성 및 동기화
  useEffect(() => {
    if (!engine) return;
    
    // 얼음 큐브 박스 콜라이더
    const body = Matter.Bodies.rectangle(initialX, initialY, char.width * 0.7, char.height * 0.7, {
      restitution: 0.6,
      friction: 0.8,
      frictionAir: 0.02,
      density: 0.05,
      label: type
    });
    bodyRef.current = body;
    Matter.Composite.add(engine.world, body);

    const updatePosition = () => {
      if (divRef.current && bodyRef.current) {
        // 중심축을 기준으로 div 위치를 업데이트
        const x = body.position.x - char.width / 2;
        const y = body.position.y - char.height / 2;
        const angle = body.angle;
        divRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;
      }
    };

    Matter.Events.on(engine, 'afterUpdate', updatePosition);

    return () => {
      Matter.Events.off(engine, 'afterUpdate', updatePosition);
      Matter.Composite.remove(engine.world, body);
    };
  }, [engine, initialX, initialY, char.width, char.height, type]);

  const handleTap = () => {
    // 물리적 반발력 (점프)
    if (bodyRef.current) {
      Matter.Body.setVelocity(bodyRef.current, { 
        x: (Math.random() - 0.5) * 10, 
        y: -15 
      });
      Matter.Body.setAngularVelocity(bodyRef.current, (Math.random() - 0.5) * 0.2);
    }

    const msgs = REACTIONS[type];
    setBubble(msgs[msgIdx % msgs.length]);
    setMsgIdx(i => i + 1);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setBubble(null), 2500);
  };

  // 온도가 50이 넘어가면 녹기 시작
  const isMelting = temperature > 50;
  const meltProgress = isMelting ? Math.min((temperature - 50) * 2, 100) : 0;

  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: char.width,
        height: char.height,
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style,
      }}
      onPointerDown={handleTap}
    >
      {/* 이모지 상태 아이콘 */}
      <div style={{
        position: 'absolute',
        ...char.emojiPos,
        fontSize: 16,
        fontWeight: 'bold',
        textShadow: '0px 2px 4px rgba(0,0,0,0.3)',
        pointerEvents: 'none',
        zIndex: 5,
        opacity: isMelting ? 0.3 : 1, // 녹으면 이모지도 흐려짐
      }}>
        {char.emoji}
      </div>

      {/* 말풍선 */}
      <div style={{ position: 'relative', width: '100%' }}>
        <AnimatePresence>
          {bubble && <Bubble key={bubble} message={bubble} />}
        </AnimatePresence>
      </div>

      {/* 캐릭터 이미지 (녹는 상태에 따라 스프라이트 교체) */}
      <motion.div 
        style={{ width: '100%', height: '100%', transformOrigin: 'bottom center' }}
        animate={{
          scaleY: [1, 0.94, 1],
          scaleX: [1, 1.03, 1],
        }}
        transition={{
          duration: 1.5 + Math.random() * 0.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {isMelting ? (
          <MeltingSprite progress={meltProgress} />
        ) : (
          <img
            src={char.img}
            alt={char.name}
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))',
              pointerEvents: 'none',
            }}
          />
        )}
      </motion.div>

      {/* 이름 뱃지 */}
      <div style={{
        marginTop: -10,
        fontSize: 14,
        fontWeight: 900,
        color: '#111',
        background: '#FFF',
        padding: '4px 14px',
        borderRadius: 14,
        border: '2px solid #333',
        boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 10,
        opacity: isMelting ? 0.5 : 1,
      }}>
        {char.name}
      </div>
    </div>
  );
};

export default IceCubeCharacter;
