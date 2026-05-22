import React from 'react';
import { motion } from 'framer-motion';

const TemperatureGauge = ({ temperature }) => {
  // 0 is cold (blue), 100 is hot (red)
  const isWarning = temperature > 70;
  const color = temperature > 70 ? '#FF4D4D' : temperature > 40 ? '#FFAD33' : '#33CCFF';

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: '800', color: '#FFF' }}>내면 온도</span>
        <motion.span 
          animate={{ scale: isWarning ? [1, 1.1, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{ fontSize: '18px', fontWeight: '900', color }}>
          {temperature}°C
        </motion.span>
      </div>

      <div style={{
        height: '12px',
        width: '100%',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '6px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${temperature}%`, backgroundColor: color }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          style={{ height: '100%' }}
        />
      </div>

      <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
        {temperature > 70 ? '⚠️ 빙글이가 위험해요! 휴식이 필요합니다.' : 
         temperature > 40 ? '💡 조금씩 더워지고 있어요. 안정이 필요해요.' : 
         '❄️ 아주 쾌적한 상태입니다. 기분이 좋아요!'}
      </p>
    </div>
  );
};

export default TemperatureGauge;
