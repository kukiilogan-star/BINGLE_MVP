import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../shared/store/useGameStore';

/* ── Ice Particle (Petting effect) ─────────────────────────────── */
const IceParticle = ({ id, onDone }) => {
  const angle = (Math.random() - 0.5) * 140;
  const dist  = 55 + Math.random() * 35;
  return (
    <motion.div
      initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
      animate={{
        opacity: 0, scale: 1.3,
        x: Math.sin((angle * Math.PI) / 180) * dist,
        y: -(dist * 0.85 + Math.random() * 25),
      }}
      transition={{ duration: 0.85, ease: 'easeOut' }}
      onAnimationComplete={onDone}
      style={{
        position: 'absolute', top: '25%', left: '50%',
        transform: 'translate(-50%,-50%)',
        fontSize: '18px', pointerEvents: 'none', zIndex: 40,
      }}
    >
      ❄️
    </motion.div>
  );
};

/* ── Frost Character (Level 1-2) ────────────────── */
const FrostSVG = ({ color = '#E0F7FA' }) => (
  <svg viewBox="0 0 120 120" width="100" height="100">
    <motion.g
      animate={{ 
        scale: [1, 1.05, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <defs>
        <radialGradient id="frostGradient">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      {/* Fuzzy frost body */}
      <circle cx="60" cy="60" r="45" fill="url(#frostGradient)" opacity="0.8" />
      <circle cx="60" cy="60" r="48" fill="white" opacity="0.2" />
      
      {/* Eyes */}
      <circle cx="48" cy="55" r="4" fill="#2c3e50" opacity="0.6" />
      <circle cx="72" cy="55" r="4" fill="#2c3e50" opacity="0.6" />
    </motion.g>
  </svg>
);

/* ── Ice Cube Character (Level 3+) ──────────────────── */
const IceCubeSVG = ({ isPetting, blinkY }) => {
  return (
    <svg viewBox="0 0 180 200" width="150" height="180" overflow="visible">
      {/* Body Shadow */}
      <rect x="40" y="45" width="100" height="100" rx="20" fill="#2c3e50" opacity="0.1" />
      
      {/* Main Body */}
      <motion.rect 
        x="40" y="40" width="100" height="100" rx="20" 
        fill="#B3E5FC" 
        stroke="#81D4FA" 
        strokeWidth="4"
        animate={{
          fill: isPetting ? "#81D4FA" : "#B3E5FC"
        }}
      />
      
      {/* Inner Glow */}
      <rect x="50" y="50" width="80" height="80" rx="15" fill="white" opacity="0.4" />
      
      {/* Top Shine */}
      <rect x="55" y="55" width="25" height="15" rx="8" fill="white" opacity="0.7" />

      {/* Eyes */}
      <motion.ellipse 
        cx="72" cy="85" rx="8" ry={10 * blinkY} 
        fill="#2c3e50" 
        style={{ originX: '72px', originY: '85px' }}
      />
      <motion.ellipse 
        cx="108" cy="85" rx="8" ry={10 * blinkY} 
        fill="#2c3e50" 
        style={{ originX: '108px', originY: '85px' }}
      />

      {/* Cheeks when petting */}
      {isPetting && (
        <>
          <circle cx="60" cy="105" r="8" fill="#FFCDD2" opacity="0.6" />
          <circle cx="120" cy="105" r="8" fill="#FFCDD2" opacity="0.6" />
        </>
      )}

      {/* Tiny hands */}
      <motion.rect 
        x="25" y="90" width="20" height="10" rx="5" fill="#81D4FA"
        animate={{ rotate: isPetting ? -20 : 0 }}
      />
      <motion.rect 
        x="135" y="90" width="20" height="10" rx="5" fill="#81D4FA"
        animate={{ rotate: isPetting ? 20 : 0 }}
      />
    </svg>
  );
};

/* ── AnimatedIce (main export) ──────────────────── */
const AnimatedIce = ({ onPet }) => {
  const [isPetting, setIsPetting] = useState(false);
  const [blinkY,    setBlinkY]    = useState(1);
  const [particles, setParticles] = useState([]);
  const [nextId,    setNextId]    = useState(0);
  
  const userLevel = useGameStore(s => s.userLevel);

  /* Blink loop */
  useEffect(() => {
    const doBlink = () => {
      setBlinkY(0.1);
      setTimeout(() => setBlinkY(1), 150);
      setTimeout(doBlink, 3000 + Math.random() * 4000);
    };
    const t = setTimeout(doBlink, 2000);
    return () => clearTimeout(t);
  }, []);

  const handlePet = () => {
    if (isPetting) return;
    setIsPetting(true);
    const ids = Array.from({ length: 5 }, (_, i) => nextId + i);
    setParticles(p => [...p, ...ids.map(id => ({ id }))]);
    setNextId(id => id + 5);
    setTimeout(() => setIsPetting(false), 1200);
    onPet?.();
  };

  return (
    <div
      onClick={handlePet}
      style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          animate={{ scaleY: [1, 1.03, 1], scaleX: [1, 0.98, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'bottom center' }}
        >
          {userLevel <= 2 ? (
            <FrostSVG color={userLevel === 1 ? '#E0F7FA' : '#B2EBF2'} />
          ) : (
            <IceCubeSVG isPetting={isPetting} blinkY={blinkY} />
          )}
        </motion.div>
      </motion.div>

      {/* Ice burst */}
      {particles.map(p => (
        <IceParticle key={p.id} id={p.id} onDone={() => setParticles(arr => arr.filter(x => x.id !== p.id))} />
      ))}
    </div>
  );
};

export default AnimatedIce;
