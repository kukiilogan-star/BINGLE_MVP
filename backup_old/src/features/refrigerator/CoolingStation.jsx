import React from 'react';
import { motion } from 'framer-motion';

const CoolingStation = ({ onCoolDown }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: '20px'
    }}>
      <CoolingItem 
        icon="❄️" 
        label="냉기 주입" 
        onClick={() => onCoolDown(5)} 
        color="#33CCFF"
      />
      <CoolingItem 
        icon="🌬️" 
        label="환기하기" 
        onClick={() => onCoolDown(2)} 
        color="#A3E4D7"
      />
      <CoolingItem 
        icon="🧊" 
        label="얼음 보충" 
        onClick={() => onCoolDown(10)} 
        color="#85C1E9"
      />
    </div>
  );
};

const CoolingItem = ({ icon, label, onClick, color }) => (
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      color: '#FFF',
      transition: 'all 0.2s ease'
    }}
  >
    <span style={{ fontSize: '24px' }}>{icon}</span>
    <span style={{ fontSize: '12px', fontWeight: 'bold', color }}>{label}</span>
  </motion.button>
);

export default CoolingStation;
