import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FoodVector from './FoodVector.jsx';

// ── DEFAULT PNG BINGLE CHARACTER (BREATHING & ALIVE) ─────────────────
export default function BingleCharacter({ state = 'happy', size = 160, className = '', style = {}, onClick, feedTrigger = 0, fedItemType = 'water', isHungry = false }) {
  const isClickable = !!onClick;
  
  // React states for 3D Parallax Tilt, Squash Tap and Reactions
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isTapped, setIsTapped] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);
  const [particles, setParticles] = useState([]);
  const [speechBubble, setSpeechBubble] = useState(null);

  // Handle direct feeding trigger reaction!
  useEffect(() => {
    if (feedTrigger > 0) {
      setIsFeeding(true);
      const timer = setTimeout(() => {
        setIsFeeding(false);
      }, 1500); // Show eating image for 1.5 seconds during feeding!
      handleFeedReaction();
      return () => clearTimeout(timer);
    }
  }, [feedTrigger]);

  // Auto-hide speech bubble after 1.5 seconds
  useEffect(() => {
    if (speechBubble?.visible) {
      const timer = setTimeout(() => {
        setSpeechBubble(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [speechBubble]);

  // Map emotional states to the original PNG images provided by the user
  const imageMap = {
    happy: '/images/bingle_happy.png',
    sleeping: '/images/bingle_sleeping.png',
    angry: '/images/bingle_angry.png',
    hot: '/images/bingle_hot.png',
    crying: '/images/bingle_crying.png',
    excited: '/images/bingle_excited.png',
    tired: '/images/bingle_tired.png',
    shocked: '/images/bingle_shocked.png',
    frozen: '/images/bingle_frozen.png',
    eating: '/images/bingle_eating.png',
  };

  // If Bingle is currently feeding, show eating image! Otherwise if dragged nearby, show excited!
  const effectiveState = isFeeding
    ? 'eating'
    : (isHungry
        ? (['sleeping', 'tired', 'happy', 'frozen'].includes(state) ? 'excited' : state)
        : state);

  const imageSrc = imageMap[effectiveState] || '/images/bingle_happy.png';

  // Hover 3D Parallax mouse tracking
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt max 14 degrees
    const tiltX = ((y - centerY) / centerY) * -14;
    const tiltY = ((x - centerX) / centerX) * 14;
    setRotateX(tiltX);
    setRotateY(tiltY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Squash & Stretch click animation + Floating particles + Speech popups
  const handleTap = () => {
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 550);

    // Spawn 8 radial explosion particles!
    const burstCount = 8;
    const newParticles = [];
    
    // Choose decorative vector particle color and shape matching Bingle's emotional state
    const getDecoProps = (s) => {
      switch (s) {
        case 'happy':
        case 'excited':
          return { type: Math.random() > 0.5 ? 'star' : 'heart', fill: '#fbbf24' }; // Gold stars and pink hearts
        case 'sleeping':
        case 'tired':
          return { type: 'sparkle', fill: '#93c5fd' }; // Cozy blue sparkles
        case 'angry':
        case 'hot':
          return { type: 'star', fill: '#ef4444' }; // Angry red sparks
        case 'crying':
          return { type: 'heart', fill: '#60a5fa' }; // Tearful blue hearts
        case 'shocked':
        case 'frozen':
          return { type: 'sparkle', fill: '#22d3ee' }; // Shivering cyan sparkles
        default:
          return { type: 'sparkle', fill: '#fcd34d' };
      }
    };

    const deco = getDecoProps(state);

    for (let i = 0; i < burstCount; i++) {
      const angle = (i * 2 * Math.PI) / burstCount + (Math.random() - 0.5) * 0.4;
      const velocity = 35 + Math.random() * 40; // Speed of propagation
      const isVector = i % 2 === 0; // Alternate between Bingle vector stamps and beautiful hand-drawn decorative shapes!
      
      newParticles.push({
        id: Date.now() + Math.random() + i,
        isBingleVector: isVector,
        vectorState: state,
        isDecoVector: !isVector,
        decoType: deco.type,
        decoFill: deco.fill,
        targetX: Math.cos(angle) * velocity,
        targetY: Math.sin(angle) * velocity - 40,
        startX: (Math.random() - 0.5) * 15,
        startY: -40 + (Math.random() - 0.5) * 15
      });
    }

    setParticles(prev => [...prev, ...newParticles].slice(-24));

    // Wobbly cute caption reactive popup matching the emotional state
    const captions = {
      happy: ["시원하고 너무 상쾌해! 😊", "헤헤, 같이 놀아줘서 기뻐! ✨", "오늘 기분 완전 최고야! 💖", "파랗고 맑은 하루네! 🌈"],
      sleeping: ["음냐냐... 조금만 더 잘래... 💤", "아늑한 냉장고 안이 최고야... 🫧", "새록새록... 쿨쿨... 😴"],
      angry: ["으앙! 건드리지 마, 화났어! 😤", "마음에 열이 펄펄 끓는다구! 💥", "스트레스 폭발 직전이야! ⚡"],
      hot: ["으아앗 뜨거워어! 녹아내려요! 🥵", "얼른 냉장실 문을 닫아줘어! 🌋", "송풍 팬을 가동해 줘! 💧"],
      crying: ["흐아앙... 속상한 일이 있어... 😭", "훌쩍훌쩍... 위로해 줘서 고마워 🥺", "마음의 비가 그치지 않아 ☔"],
      excited: ["야호! 신난다아아! 🤩", "둠칫둠칫! 기분 째진다구! 🎈", "축제다 축제! 에너지가 넘쳐! 🎉"],
      tired: ["흐아암... 모든 에너지가 제로야... 🥱", "귀차니즘이 가득가득... 🐌", "조금 누워있고 싶어... 💤"],
      shocked: ["헉! 깜짝이야! 😲", "찌릿찌릿! 방어 모드 발동! ⚡", "심장이 쿵 내려앉았잖아! 👀"],
      frozen: ["우와아 꽁꽁 얼어서 단단해졌어! 🥶", "차가워서 머리가 띵해! ❄️", "시원한 아이스 월드가 최고야! 🧊"]
    };

    const stateCaptions = captions[state] || ["안녕! 반가워! 👋"];
    const randomCaption = stateCaptions[Math.floor(Math.random() * stateCaptions.length)];
    
    setSpeechBubble({
      text: randomCaption,
      visible: true,
      id: Date.now()
    });

    if (onClick) onClick();
  };

  const handleFeedReaction = () => {
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 550);

    const foodStates = {
      water: 'happy',
      orange: 'excited',
      chocolate: 'happy',
      melon: 'happy',
      milk: 'sleeping',
      icecream: 'frozen',
      apple: 'happy',
      coffee: 'excited',
      cake: 'excited'
    };
    const reactionState = foodStates[fedItemType] || 'happy';

    // Spawn 10 radial explosion particles!
    const burstCount = 10;
    const newParticles = [];
    for (let i = 0; i < burstCount; i++) {
      const angle = (i * 2 * Math.PI) / burstCount + (Math.random() - 0.5) * 0.4;
      const velocity = 40 + Math.random() * 45;
      const isVector = i % 2 === 0; // Alternate between Bingle vector stamps and custom food vectors!
      
      newParticles.push({
        id: Date.now() + Math.random() + i,
        isBingleVector: isVector,
        vectorState: reactionState,
        isFoodVector: !isVector,
        foodId: fedItemType,
        targetX: Math.cos(angle) * velocity,
        targetY: Math.sin(angle) * velocity - 40,
        startX: (Math.random() - 0.5) * 15,
        startY: -40 + (Math.random() - 0.5) * 15
      });
    }

    setParticles(prev => [...prev, ...newParticles].slice(-32));

    const captions = {
      water: ["냠냠! 캬아~ 속이 뻥 뚫리고 시원해! 💧", "꿀꺽꿀꺽! 열기가 다 식어버렸어! ❄️"],
      orange: ["냠냠! 상큼새콤! 에너지가 100% 충전되는 맛이야! 🍊", "우와! 비타민 폭탄으로 피로가 싹 가셔! ⚡"],
      chocolate: ["냠냠! 사르르.. 번아웃 피로가 다 녹아내려! 🍫", "달콤해... 머리가 맑아지는 기분이야! 💖"],
      melon: ["냠냠! 말랑말랑~ 마음에 평온이 차올라! 🍈", "음~ 부드러운 평온함이 온몸을 휘감아! 🌱"],
      milk: ["냠냠! 고소해.. 눈꺼풀이 무거워져요... 💤", "따뜻한 우유 한 잔에 깊은 수면으로 스르륵... 🥛"],
      icecream: ["냠냠! 꽁꽁 얼어붙을 만큼 머리가 찡한 달콤함! 🍦", "앗 시원해! 마찰열이 영하로 수직 낙하 중! ❄️"],
      apple: ["냠냠! 아삭아삭 청사과 디톡스로 머리가 맑아져! 🍏", "완전 상쾌해! 몸속 독소가 다 정화되는 맛! 🌱"],
      coffee: ["냠냠! 역시 현대인의 생명수 아메리카노! +40 XP ☕", "정신이 바짝 나네! 둠칫둠칫 활력 1000%!! ⚡"],
      cake: ["냠냠! 사르르 녹아내리는 극강의 부드러움! 🍰", "마음의 상처가 사르르 달콤하게 치유됐어! 💖"]
    };

    const stateCaptions = captions[fedItemType] || ["우와! 정말 맛있어요! 😋"];
    const randomCaption = stateCaptions[Math.floor(Math.random() * stateCaptions.length)];
    
    setSpeechBubble({
      text: randomCaption,
      visible: true,
      id: Date.now()
    });
  };

  // ── Framer Motion Breathing & State Physics ──
  const getAnimationProps = () => {
    switch (effectiveState) {
      case 'eating':
        return {
          animate: {
            scaleY: [1, 1.15, 0.9, 1.1, 0.95, 1], // Cute, highly dynamic chewing/bouncing animation!
            scaleX: [1, 0.88, 1.12, 0.93, 1.05, 1],
            y: [0, -18, 0, -6, 0], // Big excited hops while munching!
            rotate: [0, -3, 3, -1, 1, 0],
          },
          transition: {
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 'happy':
        return {
          animate: {
            y: [0, -12, 0],
            scaleY: [1, 1.08, 0.92, 1.05, 1],
            scaleX: [1, 0.93, 1.07, 0.96, 1],
            rotate: [0, -2, 2, -1, 0],
          },
          transition: {
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 'sleeping':
        return {
          animate: {
            scale: [1, 1.03, 0.98, 1],
            y: [0, 2.5, 0],
            rotate: [-1.5, 1, -1.5],
          },
          transition: {
            duration: 4.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 'angry':
        return {
          animate: {
            x: [0, -2.5, 2.5, -2, 2, -1, 1, 0],
            y: [0, 1.5, -1.5, 1, -1, 0],
            rotate: [-1.5, 1.5, -1, 1, 0],
          },
          transition: {
            duration: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 'hot':
        return {
          animate: {
            scaleY: [1, 0.86, 0.92, 0.88, 1],
            scaleX: [1, 1.06, 0.98, 1.04, 1],
            y: [0, 3, 0],
            skewX: [-2.5, 2.5, -1, 1, 0],
          },
          transition: {
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 'crying':
        return {
          animate: {
            x: [0, -1, 1, -1, 1, 0],
            y: [0, 1.5, 0],
            scaleY: [1, 0.95, 1.01, 0.97, 1],
            scaleX: [1, 1.02, 0.98, 1.01, 1],
          },
          transition: {
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 'excited':
        return {
          animate: {
            y: [0, -22, 0],
            scaleY: [1, 1.15, 0.85, 1.1, 1],
            scaleX: [1, 0.85, 1.15, 0.9, 1],
            rotate: [0, -4, 4, -2, 0],
          },
          transition: {
            duration: 0.95,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 'tired':
        return {
          animate: {
            scaleY: [1, 0.93, 0.97, 0.94, 1],
            scaleX: [1, 1.03, 0.98, 1.02, 1],
            y: [0, 5, 0],
            rotate: [-1, 0.5, -0.5, 0, -1],
          },
          transition: {
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 'shocked':
        return {
          animate: {
            x: [0, -3.5, 3.5, -3.5, 3.5, -1.5, 1.5, 0],
            y: [0, -3, 3, -3, 3, 0],
            scale: [1, 1.08, 0.94, 1.06, 1],
          },
          transition: {
            duration: 0.65,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      case 'frozen':
        return {
          animate: {
            x: [0, -0.6, 0.6, -0.6, 0.6, 0],
            scale: [1, 0.99, 1],
          },
          transition: {
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }
        };
      default:
        return {
          animate: { y: [0, -5, 0] },
          transition: { duration: 3, repeat: Infinity }
        };
    }
  };

  const anim = getAnimationProps();

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
      className={`relative select-none flex items-center justify-center ${className} ${isClickable ? 'cursor-pointer' : ''}`}
      style={{ 
        width: size, 
        height: size, 
        perspective: 1000,
        ...style 
      }}
    >
      {/* ── Background Shadow Ring ── */}
      <div 
        className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/15 blur-[4px] transition-all"
        style={{
          width: size * 0.7,
          height: size * 0.12,
          transform: `translateX(-50%) scale(${state === 'happy' ? 0.9 : state === 'sleeping' ? 1.02 : state === 'frozen' ? 1.08 : 1.1})`
        }}
      />

      {/* ── Main Interactive PNG Character Wrapper (Hover 3D Parallax & Spring Drag & Squash Tap) ── */}
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.65}
        dragTransition={{ bounceStiffness: 500, bounceDamping: 14 }}
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
          scale: isTapped ? 0.82 : 1,
          rotate: isTapped ? -3.5 : 0
        }}
        transition={{
          rotateX: { type: 'spring', stiffness: 220, damping: 20 },
          rotateY: { type: 'spring', stiffness: 220, damping: 20 },
          scale: { type: 'spring', stiffness: 400, damping: 10 },
          rotate: { type: 'spring', stiffness: 400, damping: 10 }
        }}
        className="w-full h-full relative cursor-grab active:cursor-grabbing flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.img
          src={imageSrc}
          alt={`Bingle ${effectiveState}`}
          animate={anim.animate}
          transition={anim.transition}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: effectiveState === 'sleeping'
              ? 'drop-shadow(3px 3px 0px rgba(0,0,0,0.2)) drop-shadow(0 0 16px rgba(103, 249, 225, 0.95)) drop-shadow(0 0 4px rgba(34, 211, 238, 0.8))'
              : 'drop-shadow(5px 5px 0px rgba(0,0,0,0.18))',
            opacity: effectiveState === 'sleeping' ? 1.0 : 1.0, // Force full opacity
            pointerEvents: 'none' // Let dragging trigger on parent div
          }}
        />
      </motion.div>

      {/* ── Speech Bubble Popup ── */}
      <AnimatePresence>
        {speechBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.8, y: -20, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="absolute -top-16 left-1/2 bg-white border-3 border-black px-3.5 py-1.5 rounded-2xl shadow-[3px_3px_0_0_#000] z-[99] min-w-[130px] max-w-[200px] text-center font-['Gaegu'] font-black text-sm text-black leading-tight select-none pointer-events-none speech-bubble-popup"
          >
            {speechBubble.text}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-3 border-b-3 border-black rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tap Floating Feedback Particles ── */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.4, x: p.startX, y: p.startY }}
            animate={{ 
              opacity: [1, 1, 0], // Stay visible then fade at the end
              scale: 1.3, 
              x: p.targetX, 
              y: p.targetY, 
              rotate: Math.random() * 80 - 40 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute pointer-events-none select-none z-50 flex items-center justify-center"
            style={{ width: 36, height: 36 }}
            onAnimationComplete={() => {
              setParticles(prev => prev.filter(item => item.id !== p.id));
            }}
          >
            {p.isBingleVector ? (
              <BingleVectorCharacter state={p.vectorState} size={30} />
            ) : p.isFoodVector ? (
              <FoodVector id={p.foodId} size={28} />
            ) : p.isDecoVector ? (
              p.decoType === 'star' ? (
                <span className="text-xl font-bold" style={{ color: p.decoFill, textShadow: '0 0 6px rgba(0,0,0,0.2)' }}>⭐</span>
              ) : p.decoType === 'heart' ? (
                <span className="text-xl font-bold" style={{ color: p.decoFill, textShadow: '0 0 6px rgba(0,0,0,0.2)' }}>💖</span>
              ) : (
                <span className="text-xl font-bold" style={{ color: p.decoFill, textShadow: '0 0 6px rgba(0,0,0,0.2)' }}>✨</span>
              )
            ) : (
              <span className="text-xl font-bold">{p.icon}</span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── Overlay Secondary Animated Assets ── */}
      
      {/* 1. SLEEPING: Snore Bubble & Zzz */}
      {state === 'sleeping' && (
        <>
          {/* Animated Snore bubble (puffs up & shrinks) */}
          <motion.div
            className="absolute top-[35%] right-[22%] w-[16px] h-[16px] rounded-full border-2 border-black bg-cyan-300/80 shadow-inner pointer-events-none"
            animate={{
              scale: [0.3, 1.8, 0.3],
              opacity: [0.8, 0.3, 0.8],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Drifting Zzz letters */}
          <div className="absolute -top-1 right-2 pointer-events-none flex flex-col font-black text-cyan-600/80 font-['Gaegu'] select-none">
            <motion.span
              animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0 }}
              className="text-base"
            >Z</motion.span>
            <motion.span
              animate={{ y: [0, -14, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.0 }}
              className="text-xs ml-3"
            >z</motion.span>
            <motion.span
              animate={{ y: [0, -18, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 2.0 }}
              className="text-[10px] ml-5"
            >z</motion.span>
          </div>
        </>
      )}


      {/* 2. ANGRY: Drifting Steam Clouds */}
      {state === 'angry' && (
        <>
          <motion.div
            className="absolute -top-3 left-4 font-black text-red-500/80 text-xl pointer-events-none"
            animate={{ y: [0, -12, 0], scale: [0.8, 1.2, 0.8], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: 0 }}
          >
            ☁️
          </motion.div>
          <motion.div
            className="absolute -top-1.5 right-4 font-black text-red-500/80 text-xl pointer-events-none"
            animate={{ y: [0, -12, 0], scale: [0.8, 1.2, 0.8], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: 0.55 }}
          >
            ☁️
          </motion.div>
        </>
      )}

      {/* 3. HOT: Sweat Drops Sliding Down */}
      {state === 'hot' && (
        <>
          {/* Sliding Sweat Drop Left */}
          <motion.div
            className="absolute top-[42%] left-[28%] w-2 h-3.5 rounded-full bg-cyan-400 border border-black pointer-events-none"
            animate={{
              y: [0, 12, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeIn',
            }}
          />
          {/* Sliding Sweat Drop Right */}
          <motion.div
            className="absolute top-[48%] right-[26%] w-2.5 h-4 rounded-full bg-cyan-400 border border-black pointer-events-none"
            animate={{
              y: [0, 15, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.1,
              repeat: Infinity,
              ease: 'easeIn',
              delay: 0.6,
            }}
          />
        </>
      )}

      {/* 4. HAPPY: Sparkling Twinkle Stars */}
      {state === 'happy' && (
        <>
          <motion.span
            className="absolute -top-3 left-2 text-yellow-400 font-bold text-lg pointer-events-none"
            animate={{ scale: [0.6, 1.3, 0.6], rotate: [0, 180, 360] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            ✨
          </motion.span>
          <motion.span
            className="absolute top-4 right-1 text-yellow-400 font-bold text-base pointer-events-none"
            animate={{ scale: [1.3, 0.6, 1.3], rotate: [360, 180, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            ✨
          </motion.span>
        </>
      )}

      {/* 5. CRYING: Tears sliding down */}
      {state === 'crying' && (
        <>
          {/* Sliding Tear Left */}
          <motion.div
            className="absolute top-[48%] left-[32%] w-2.5 h-4.5 bg-cyan-400 border border-black pointer-events-none"
            style={{ borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%' }}
            animate={{
              y: [0, 24, 30],
              scaleY: [1, 1.4, 0.5],
              opacity: [0.8, 1, 0],
            }}
            transition={{
              duration: 2.0,
              repeat: Infinity,
              ease: 'easeIn',
            }}
          />
          {/* Sliding Tear Right */}
          <motion.div
            className="absolute top-[48%] right-[32%] w-2.5 h-4.5 bg-cyan-400 border border-black pointer-events-none"
            style={{ borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%' }}
            animate={{
              y: [0, 24, 30],
              scaleY: [1, 1.4, 0.5],
              opacity: [0.8, 1, 0],
            }}
            transition={{
              duration: 2.0,
              repeat: Infinity,
              ease: 'easeIn',
              delay: 1.0,
            }}
          />
        </>
      )}

      {/* 6. EXCITED: Sparkling Star Sparks & Confetti */}
      {state === 'excited' && (
        <>
          <motion.span
            className="absolute -top-6 left-1 text-yellow-400 font-bold text-2xl pointer-events-none"
            animate={{ scale: [0.5, 1.5, 0.5], y: [0, -15, 0], rotate: [0, 360] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            ✨
          </motion.span>
          <motion.span
            className="absolute -top-4 right-1 text-yellow-400 font-bold text-xl pointer-events-none"
            animate={{ scale: [1.5, 0.5, 1.5], y: [0, -12, 0], rotate: [360, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.3 }}
          >
            🌟
          </motion.span>
          <motion.span
            className="absolute top-1/2 -left-6 text-pink-500 font-bold text-xl pointer-events-none"
            animate={{ x: [0, -15, 0], y: [0, -10, 0], rotate: [0, 180] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🎉
          </motion.span>
          <motion.span
            className="absolute top-1/2 -right-6 text-cyan-400 font-bold text-xl pointer-events-none"
            animate={{ x: [0, 15, 0], y: [0, -10, 0], rotate: [0, -180] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          >
            🎊
          </motion.span>
        </>
      )}

      {/* 7. TIRED: Exhausted Sigh Bubbles */}
      {state === 'tired' && (
        <>
          <motion.div
            className="absolute -top-3.5 right-6 text-lg pointer-events-none"
            animate={{ y: [0, -12, 0], x: [0, 6, 0], opacity: [0, 0.8, 0], scale: [0.7, 1.1, 0.7] }}
            transition={{ duration: 2.0, repeat: Infinity, ease: 'easeOut' }}
          >
            💨
          </motion.div>
          <motion.div
            className="absolute -top-1 left-6 text-xs pointer-events-none opacity-60"
            animate={{ y: [0, -8, 0], x: [0, -4, 0], opacity: [0, 0.6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: 1.2 }}
          >
            💤
          </motion.div>
        </>
      )}

      {/* 8. SHOCKED: Spark symbols & Electric effect */}
      {state === 'shocked' && (
        <>
          <motion.div
            className="absolute -top-6 left-5 text-xl pointer-events-none font-black text-cyan-500"
            animate={{ scale: [0.8, 1.4, 0.8], y: [0, -8, 0], rotate: [-10, 10, -10] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            ❓
          </motion.div>
          <motion.div
            className="absolute -top-8 right-6 text-xl pointer-events-none font-black text-[#ff8c69]"
            animate={{ scale: [1.4, 0.8, 1.4], y: [0, -10, 0], rotate: [10, -10, 10] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
          >
            ❗
          </motion.div>
          <motion.span
            className="absolute top-1/3 -left-3 text-lg pointer-events-none"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
          >
            ⚡
          </motion.span>
          <motion.span
            className="absolute top-1/3 -right-3 text-lg pointer-events-none"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 0.4, repeat: Infinity, delay: 0.3 }}
          >
            ⚡
          </motion.span>
        </>
      )}

      {/* 9. FROZEN: Cozy frosting shimmer & snow drift */}
      {state === 'frozen' && (
        <>
          <motion.span
            className="absolute -top-3.5 left-3 text-cyan-400 font-bold text-lg pointer-events-none"
            animate={{ scale: [0.5, 1.2, 0.5], rotate: [0, 180], y: [0, -5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            ❄️
          </motion.span>
          <motion.span
            className="absolute -top-4 right-3 text-blue-300 font-bold text-base pointer-events-none"
            animate={{ scale: [1.2, 0.5, 1.2], rotate: [180, 0], y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          >
            ❄️
          </motion.span>
          <motion.div
            className="absolute inset-0 border-4 border-cyan-300/40 rounded-3xl pointer-events-none"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3.0, repeat: Infinity }}
            style={{ filter: 'blur(1px)' }}
          />
        </>
      )}
    </div>
  );
}

// ── VECTOR CLAYMATION SVG BINGLE CHARACTER (SEPARATE LAB VERSION) ──
export function BingleVectorCharacter({ state = 'happy', size = 160, className = '', style = {}, onClick }) {
  const bodyVariants = {
    happy: {
      y: [0, -10, 0],
      scaleX: [1, 0.94, 1.06, 1],
      scaleY: [1, 1.06, 0.94, 1],
      rotate: [-1, 2, -2, 0],
      transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }
    },
    sleeping: {
      scale: [1, 1.04, 1],
      y: [0, 3, 0],
      rotate: [-2, 1, -2],
      transition: { repeat: Infinity, duration: 4.0, ease: 'easeInOut' }
    },
    angry: {
      x: [0, -3, 3, -3, 3, 0],
      y: [0, 2, -2, 2, -2, 0],
      scaleY: [1, 0.96, 1.02, 1],
      rotate: [-2, 2, -2, 2, 0],
      transition: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' }
    },
    hot: {
      scaleY: [1, 0.88, 0.94, 1],
      x: [-2, 2, -2, 2, -2],
      transition: { repeat: Infinity, duration: 1.0, ease: 'easeInOut' }
    },
    crying: {
      y: [0, 2, 0],
      scaleY: [1, 0.96, 1],
      transition: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' }
    },
    excited: {
      y: [0, -15, 0],
      scaleX: [1, 0.9, 1.1, 1],
      scaleY: [1, 1.1, 0.9, 1],
      transition: { repeat: Infinity, duration: 1.0, ease: 'easeInOut' }
    },
    tired: {
      scaleY: [1, 0.93, 1],
      y: [0, 4, 0],
      transition: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' }
    },
    shocked: {
      x: [0, -3, 3, -3, 3, 0],
      y: [0, -2, 2, -2, 2, 0],
      scale: [1, 1.05, 0.95, 1],
      transition: { repeat: Infinity, duration: 0.65, ease: 'easeInOut' }
    },
    frozen: {
      x: [0, -0.5, 0.5, -0.5, 0.5, 0],
      scale: [1, 0.99, 1],
      transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
    }
  };

  const currentVariant = bodyVariants[state] || bodyVariants.happy;

  return (
    <motion.div
      onClick={onClick}
      animate={currentVariant}
      className={`relative select-none flex items-center justify-center ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={{
        width: size,
        height: size,
        ...style
      }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        {/* Shadow */}
        <ellipse cx="60" cy="104" rx="35" ry="8" fill="rgba(40,24,11,0.18)" />

        {/* Happy state SVG */}
        {state === 'happy' && (
          <g>
            <path
              d="M30 35 C 30 25, 40 22, 60 22 C 80 22, 90 25, 90 35 C 90 60, 93 75, 87 90 C 80 97, 40 97, 33 90 C 27 75, 30 60, 30 35 Z"
              fill="#d0f4ff"
              stroke="#000"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path d="M35 38 C 35 30, 42 27, 58 27" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            <path d="M78 85 C 84 80, 85 70, 85 55" stroke="#a4e4f7" strokeWidth="4" strokeLinecap="round" />
            <circle cx="43" cy="67" r="7" fill="#ff9fa5" opacity="0.8" />
            <circle cx="77" cy="67" r="7" fill="#ff9fa5" opacity="0.8" />
            {/* Pure solid black circle eyes as requested */}
            <circle cx="46" cy="58" r="4.5" fill="#28180b" />
            <circle cx="74" cy="58" r="4.5" fill="#28180b" />
            <path d="M55 68 Q 60 74, 65 68" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M26 62 Q 15 54, 18 46" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M94 62 Q 105 58, 108 66" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Sleeping state SVG */}
        {state === 'sleeping' && (
          <g transform="rotate(-6 60 60)">
            <path
              d="M32 38 C 32 28, 42 25, 60 25 C 78 25, 88 28, 88 38 C 88 62, 90 77, 85 92 C 78 97, 42 97, 35 92 C 30 77, 32 62, 32 38 Z"
              fill="#bfeaff"
              stroke="#000"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path d="M37 40 C 37 32, 44 29, 58 29" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            <path d="M42 58 Q 47 62, 52 58" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M68 58 Q 73 62, 78 58" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <circle cx="60" cy="68" r="3.5" fill="#28180b" />
            <circle cx="39" cy="65" r="5" fill="#ffa8b2" opacity="0.6" />
            <circle cx="81" cy="65" r="5" fill="#ffa8b2" opacity="0.6" />
            <motion.circle
              cx="67"
              cy="67"
              r="7"
              fill="rgba(103,249,225,0.7)"
              stroke="#28180b"
              strokeWidth="2.5"
              animate={{ scale: [1, 2.2, 1], opacity: [0.9, 0.4, 0.9] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            />
          </g>
        )}

        {/* Angry state SVG */}
        {state === 'angry' && (
          <g>
            <path
              d="M30 35 C 30 25, 40 22, 60 22 C 80 22, 90 25, 90 35 C 90 60, 93 75, 87 90 C 80 97, 40 97, 33 90 C 27 75, 30 60, 30 35 Z"
              fill="#ff8d85"
              stroke="#000"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path d="M32 64 Q 38 68, 44 64" stroke="#e0301e" strokeWidth="3" fill="none" />
            <path d="M76 64 Q 82 68, 88 64" stroke="#e0301e" strokeWidth="3" fill="none" />
            <path d="M35 32 L 44 40 L 40 45" stroke="#28180b" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M82 82 L 76 76 L 79 72" stroke="#28180b" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M42 54 L 51 60 L 42 66" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M78 54 L 69 60 L 78 66" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M50 72 L 70 72" stroke="#28180b" strokeWidth="5.5" strokeLinecap="round" />
          </g>
        )}

        {/* Hot state SVG */}
        {state === 'hot' && (
          <g>
            <path
              d="M33 50 C 33 30, 40 22, 60 22 C 80 22, 87 30, 87 50 C 87 68, 105 85, 95 97 C 82 104, 38 104, 25 97 C 15 85, 33 68, 33 50 Z"
              fill="#ffa4a2"
              stroke="#000"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path
              d="M15 97 C 15 94, 105 94, 105 97 C 105 106, 15 106, 15 97 Z"
              fill="#e65a5d"
              stroke="#000"
              strokeWidth="3"
            />
            {/* Pure solid black circle eyes as requested */}
            <circle cx="46" cy="58" r="4.5" fill="#28180b" />
            <circle cx="74" cy="58" r="4.5" fill="#28180b" />
            <path d="M52 68 Q 60 76, 68 68" stroke="#28180b" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <path d="M57 71 C 57 77, 63 77, 63 71 Z" fill="#ff768e" stroke="#28180b" strokeWidth="2.5" />
          </g>
        )}

        {/* Crying state SVG */}
        {state === 'crying' && (
          <g>
            <path
              d="M30 35 C 30 25, 40 22, 60 22 C 80 22, 90 25, 90 35 C 90 60, 93 75, 87 90 C 80 97, 40 97, 33 90 C 27 75, 30 60, 30 35 Z"
              fill="#b4e4ff"
              stroke="#000"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path d="M35 38 C 35 30, 42 27, 58 27" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            {/* Sad Eyes */}
            <path d="M 37 57 Q 43 51, 49 57" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 71 57 Q 77 51, 83 57" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Sad Frowning Mouth */}
            <path d="M 52 73 Q 60 66, 68 73" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Tears */}
            <motion.path 
              d="M 43 60 C 43 72, 47 72, 47 60 Z" 
              fill="#38bdf8" 
              stroke="#000" 
              strokeWidth="2" 
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            />
            <motion.path 
              d="M 77 60 C 77 72, 73 72, 73 60 Z" 
              fill="#38bdf8" 
              stroke="#000" 
              strokeWidth="2"
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, delay: 0.9 }}
            />
            {/* Sad Arms */}
            <path d="M 26 65 Q 16 75, 20 85" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 94 65 Q 104 75, 100 85" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Excited state SVG */}
        {state === 'excited' && (
          <g>
            <path
              d="M30 35 C 30 25, 40 22, 60 22 C 80 22, 90 25, 90 35 C 90 60, 93 75, 87 90 C 80 97, 40 97, 33 90 C 27 75, 30 60, 30 35 Z"
              fill="#e0faff"
              stroke="#000"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path d="M35 38 C 35 30, 42 27, 58 27" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            {/* Star Eyes */}
            <path d="M 43 49 L 45 53 L 49 53 L 46 56 L 47 60 L 43 58 L 39 60 L 40 56 L 37 53 L 41 53 Z" fill="#28180b" stroke="#28180b" strokeWidth="1" />
            <path d="M 77 49 L 79 53 L 83 53 L 80 56 L 81 60 L 77 58 L 73 60 L 74 56 L 71 53 L 75 53 Z" fill="#28180b" stroke="#28180b" strokeWidth="1" />
            {/* Blushing cheeks */}
            <circle cx="39" cy="65" r="5" fill="#ff768e" opacity="0.6" />
            <circle cx="81" cy="65" r="5" fill="#ff768e" opacity="0.6" />
            {/* Big Open Joyful Mouth */}
            <path d="M 50 68 Q 60 84, 70 68 Z" fill="#28180b" stroke="#28180b" strokeWidth="2" />
            <path d="M 54 74 Q 60 82, 66 74" fill="#ff768e" />
            {/* Excited Celebratory Arms Raised Up */}
            <path d="M 26 55 Q 12 40, 16 28" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 94 55 Q 108 40, 104 28" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Tired state SVG */}
        {state === 'tired' && (
          <g>
            <path
              d="M30 35 C 30 25, 40 22, 60 22 C 80 22, 90 25, 90 35 C 90 60, 93 75, 87 90 C 80 97, 40 97, 33 90 C 27 75, 30 60, 30 35 Z"
              fill="#b8e2f2"
              stroke="#000"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path d="M35 38 C 35 30, 42 27, 58 27" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            {/* Tired Solid Black Eyes */}
            <circle cx="46" cy="58" r="4.5" fill="#28180b" />
            <circle cx="74" cy="58" r="4.5" fill="#28180b" />
            {/* Yawning / sighing weary mouth */}
            <ellipse cx="60" cy="70" rx="6" ry="8" fill="#28180b" />
            {/* Drooping arms */}
            <path d="M 26 65 Q 22 75, 24 88" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 94 65 Q 98 75, 96 88" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Shocked state SVG */}
        {state === 'shocked' && (
          <g>
            <path
              d="M30 35 C 30 25, 40 22, 60 22 C 80 22, 90 25, 90 35 C 90 60, 93 75, 87 90 C 80 97, 40 97, 33 90 C 27 75, 30 60, 30 35 Z"
              fill="#d0f4ff"
              stroke="#000"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path d="M35 38 C 35 30, 42 27, 58 27" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            {/* Shocked Wider Black Eyes */}
            <circle cx="44" cy="58" r="6" fill="#28180b" />
            <circle cx="76" cy="58" r="6" fill="#28180b" />
            {/* Large surprised gasping mouth */}
            <circle cx="60" cy="72" r="8" fill="#28180b" />
            {/* Startled arms raised */}
            <path d="M 26 58 Q 12 45, 14 33" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 94 58 Q 108 45, 106 33" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Frozen state SVG */}
        {state === 'frozen' && (
          <g>
            <path
              d="M30 35 C 30 25, 40 22, 60 22 C 80 22, 90 25, 90 35 C 90 60, 93 75, 87 90 C 80 97, 40 97, 33 90 C 27 75, 30 60, 30 35 Z"
              fill="#e3f8ff"
              stroke="#000"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path d="M35 38 C 35 30, 42 27, 58 27" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            {/* Frost/Icicles at the bottom of the body */}
            <path d="M33 90 L 35 98 L 40 90 L 45 101 L 50 90 L 58 98 L 65 90 L 72 102 L 78 90 L 83 97 L 87 90" stroke="#000" strokeWidth="3" fill="#e3f8ff" strokeLinejoin="round" />
            {/* Frozen Black Eyes */}
            <circle cx="46" cy="58" r="4.5" fill="#28180b" />
            <circle cx="74" cy="58" r="4.5" fill="#28180b" />
            {/* Shivering happy smile */}
            <path d="M 52 70 Q 56 66, 60 70 Q 64 74, 68 70" stroke="#28180b" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Arms shivering */}
            <path d="M 26 62 Q 18 56, 22 50" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 94 62 Q 102 56, 98 50" stroke="#28180b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}
