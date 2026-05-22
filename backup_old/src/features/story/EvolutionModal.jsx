import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../shared/store/useGameStore';
import confetti from 'canvas-confetti';

const EvolutionModal = () => {
  const { showEvolutionModal, newLevelInfo, closeEvolutionModal } = useGameStore();

  if (!showEvolutionModal || !newLevelInfo) return null;

  // Trigger confetti when modal opens
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FF8E53', '#FE6B8B', '#FFFFFF']
  });

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(8px)'
    }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel"
        style={{
          padding: '40px', textAlign: 'center', maxWidth: '400px', width: '90%',
          border: '2px solid var(--primary)'
        }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ fontSize: '64px', marginBottom: '20px' }}
        >
          ✨
        </motion.div>
        <h2 style={{ fontSize: '32px', marginBottom: '10px', background: 'linear-gradient(45deg, #FF8E53, #FE6B8B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          진화했습니다!
        </h2>
        <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
          Lv.{newLevelInfo.level} {newLevelInfo.name}
        </p>
        <p style={{ color: '#94A3B8', marginBottom: '30px' }}>
          {newLevelInfo.description}
        </p>
        <button className="premium-button" onClick={closeEvolutionModal} style={{ width: '100%' }}>
          확인
        </button>
      </motion.div>
    </div>
  );
};

export default EvolutionModal;
