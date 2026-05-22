import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../shared/ui/BottomNav';
import { useGameStore, LEVEL_THRESHOLDS } from '../../shared/store/useGameStore';

export default function AffinityPage() {
  const { userEXP, userLevel, catName, personality, getExpProgress } = useGameStore();
  const progress  = getExpProgress();
  const current   = LEVEL_THRESHOLDS.find(t => t.level === userLevel) || LEVEL_THRESHOLDS[0];
  const next      = LEVEL_THRESHOLDS.find(t => t.level === userLevel + 1);

  return (
    <div className="screen" style={{ background: '#FDFBEE' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 20px' }}>

        {/* Page title */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#3E3127', margin: 0 }}>
            💕 호감도 대시보드
          </h1>
          <p style={{ color: '#8B7A6C', fontSize: '13px', marginTop: '5px' }}>
            {catName || '먼지'}와의 성장 기록이에요
          </p>
        </div>

        {/* Cat card */}
        <div style={{
          background: 'white', border: '2.5px solid #D4B896', borderRadius: '24px',
          padding: '24px', textAlign: 'center', marginBottom: '18px',
          boxShadow: '0 4px 0 rgba(62,49,39,0.06)',
        }}>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: '64px', marginBottom: '10px' }}
          >{current.emoji}</motion.div>

          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#3E3127', margin: '0 0 4px' }}>
            {catName || '먼지'}
          </h2>
          <p style={{ color: '#8B7A6C', fontSize: '13px', margin: '0 0 20px' }}>
            Lv.{userLevel} · {current.name}
          </p>

          {personality && (
            <div style={{
              background: 'rgba(230,168,116,0.12)', border: '1.5px solid #E6A874',
              borderRadius: '14px', padding: '12px 16px', marginBottom: '18px',
            }}>
              <div style={{ fontSize: '11px', color: '#E6A874', fontWeight: 800, marginBottom: '3px' }}>집사 유형</div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#3E3127' }}>
                {personality.emoji} {personality.type}
              </div>
            </div>
          )}

          {/* EXP bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#B08060', marginBottom: '6px', fontWeight: 700 }}>
              <span>{userEXP} EXP</span>
              <span>{next ? `→ ${next.exp} EXP` : '✨ 최고 레벨'}</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(62,49,39,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8 }}
                style={{ height: '100%', background: '#E6A874', borderRadius: '4px' }}
              />
            </div>
          </div>
        </div>

        {/* Evolution stages */}
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#B08060', letterSpacing: '1.5px', marginBottom: '12px', textTransform: 'uppercase' }}>
          진화 단계
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {LEVEL_THRESHOLDS.map((lv, i) => {
            const unlocked = userLevel >= lv.level;
            const active   = userLevel === lv.level;
            return (
              <motion.div
                key={lv.level}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: active ? 'rgba(230,168,116,0.1)' : 'white',
                  border: `2px solid ${active ? '#E6A874' : '#E8DDD0'}`,
                  borderRadius: '18px', padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  opacity: unlocked ? 1 : 0.45,
                }}
              >
                <div style={{ fontSize: '28px' }}>{unlocked ? lv.emoji : '🔒'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 900, fontSize: '14px', color: '#3E3127' }}>Lv.{lv.level}</span>
                    <span style={{ fontSize: '13px', color: '#8B7A6C' }}>{lv.name}</span>
                    {active && (
                      <span style={{
                        fontSize: '9px', background: '#E6A874', color: 'white',
                        padding: '2px 8px', borderRadius: '100px', fontWeight: 800,
                      }}>현재</span>
                    )}
                  </div>
                  {lv.reward && (
                    <div style={{ fontSize: '11px', color: unlocked ? '#E6A874' : '#B08060', marginTop: '2px', fontWeight: 600 }}>
                      {unlocked ? '✓ ' : ''}{lv.reward}
                    </div>
                  )}
                  <div style={{ fontSize: '10px', color: '#C4A882', marginTop: '1px' }}>{lv.exp}+ EXP</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
