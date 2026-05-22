import { motion } from 'framer-motion';
import { useGameStore } from '../../shared/store/useGameStore';

const QuestCard = () => {
  const { quests, tapQuest, programWeek, programStage } = useGameStore();
  
  // Show only a subset of quests or category-based ones
  // For the "Today's Request" panel, we can show both Side and Core
  const completedCount = quests.filter(q => q.progress >= q.target).length;

  return (
    <div style={{
      background: 'rgba(253,251,238,0.97)', border: '2.5px solid #D4B896',
      borderRadius: '28px 28px 0 0', padding: '18px 20px 10px',
      boxShadow: '0 -4px 20px rgba(62,49,39,0.08)', flexShrink: 0
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '16px' }}>🐾</span>
            <span style={{ fontWeight: 900, fontSize: '15px', color: '#3E3127' }}>오늘의 부탁</span>
          </div>
          <span style={{ fontSize: '10px', color: '#B08060', fontWeight: 600, marginLeft: '22px' }}>
            {programWeek}주차: {programStage} 단계
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontWeight: 700, fontSize: '13px', color: '#B08060' }}>
            {completedCount}/{quests.length}
          </span>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        overflowX: 'auto', 
        gap: '12px', 
        paddingBottom: '8px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {quests.map((q) => {
          const isComplete = q.progress >= q.target;
          return (
            <motion.button
              key={q.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => tapQuest(q.id)}
              style={{
                minWidth: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0
              }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                border: `2.5px solid ${isComplete ? '#E6A874' : '#D4B896'}`,
                background: isComplete ? 'rgba(230,168,116,0.15)' : 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', transition: 'all 0.2s',
                position: 'relative'
              }}>
                {isComplete ? '✅' : q.icon}
                {q.category === 'Core' && (
                  <div style={{
                    position: 'absolute', top: -4, right: -4,
                    background: '#FE6B8B', color: 'white', fontSize: '8px',
                    padding: '2px 4px', borderRadius: '10px', fontWeight: 900
                  }}>CORE</div>
                )}
              </div>
              <span style={{
                fontSize: '10px', fontWeight: 800, color: '#3E3127',
                textAlign: 'center', lineHeight: 1.2, whiteSpace: 'pre-line'
              }}>
                {q.name}
              </span>
              <div style={{
                width: '100%', height: '5px',
                background: 'rgba(62,49,39,0.1)', borderRadius: '3px', overflow: 'hidden'
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(q.progress / q.target) * 100}%` }}
                  transition={{ duration: 0.4 }}
                  style={{ height: '100%', background: '#E6A874', borderRadius: '3px' }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestCard;
