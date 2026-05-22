import { useState } from 'react';
import { motion } from 'framer-motion';
import BottomNav from '../../shared/ui/BottomNav';

const HRV   = [58,62,55,70,65,72,68,60,74,71,63,66,69,75,72];
const SLEEP  = [6.5,7,5.5,8,7.5,6,7,6.5,8,7.2,6.8,7.5,8,7,7.3];
const DAYS   = ['5/1','5/2','5/3','5/4','5/5','5/6','5/7','5/8','5/9','5/10','5/11','5/12','5/13','5/14','오늘'];

const Bar = ({ value, max, color }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '4px' }}>
    <div style={{ width: '100%', height: '72px', display: 'flex', alignItems: 'flex-end' }}>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${(value / max) * 72}px` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%', background: color, borderRadius: '3px 3px 0 0', minHeight: 2 }}
      />
    </div>
  </div>
);

export default function DataLogPage() {
  const [tab, setTab] = useState('hrv');
  const data  = tab === 'hrv' ? HRV : SLEEP;
  const maxV  = Math.max(...data);
  const barColor = tab === 'hrv' ? '#E6A874' : '#8DA399';

  return (
    <div className="screen" style={{ background: '#FDFBEE' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 18px 16px' }}>

        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#3E3127', margin: 0 }}>📊 건강 기록소</h1>
          <p style={{ color: '#8B7A6C', fontSize: '13px', marginTop: '5px' }}>웨어러블과 연동된 생체 데이터예요</p>
        </div>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[
            { icon: '❤️', label: 'HRV 평균', value: '68ms', delta: '+3ms ↑' },
            { icon: '🌙', label: '수면 평균', value: '7.2h', delta: '-0.3h ↓' },
            { icon: '😰', label: '스트레스', value: '42%', delta: null },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: 'white', border: '2px solid #E8DDD0',
              borderRadius: '16px', padding: '12px 10px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#3E3127' }}>{s.value}</div>
              <div style={{ fontSize: '9px', color: '#B08060', marginTop: '2px' }}>{s.label}</div>
              {s.delta && (
                <div style={{ fontSize: '9px', color: s.delta.includes('↑') ? '#4CAF50' : '#EF5350', marginTop: '2px', fontWeight: 700 }}>
                  {s.delta}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tab */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          {['hrv','sleep'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '7px 18px', borderRadius: '100px', border: '2px solid #E8DDD0',
              background: tab === t ? '#3E3127' : 'white', color: tab === t ? 'white' : '#8B7A6C',
              fontWeight: 800, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {t === 'hrv' ? 'HRV' : '수면'}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div style={{
          background: 'white', border: '2px solid #E8DDD0',
          borderRadius: '20px', padding: '16px', marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
            {data.map((v, i) => <Bar key={i} value={v} max={maxV} color={barColor} />)}
          </div>
          <div style={{ display: 'flex', gap: '3px', marginTop: '6px' }}>
            {DAYS.map((d, i) => (
              <div key={i} style={{ flex: 1, fontSize: '7px', color: '#C4A882', textAlign: 'center', fontWeight: 600 }}>{d}</div>
            ))}
          </div>
        </div>

        {/* Burnout */}
        <div style={{ background: 'white', border: '2px solid #E8DDD0', borderRadius: '20px', padding: '16px' }}>
          <div style={{ fontWeight: 900, fontSize: '14px', color: '#3E3127', marginBottom: '12px' }}>번아웃 지수</div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
            {[1,2,3,4,5,6].map(n => (
              <div key={n} style={{
                flex: 1, height: '8px', borderRadius: '4px',
                background: n <= 3 ? `rgba(76,175,80,${0.35+n*0.12})` : n <= 5 ? `rgba(255,152,0,${0.3+(n-3)*0.2})` : 'rgba(239,83,80,0.8)',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#C4A882', fontWeight: 700 }}>
            <span>안정</span><span>주의</span><span>위험</span>
          </div>
          <p style={{ fontSize: '12px', color: '#8B7A6C', marginTop: '10px', lineHeight: 1.6 }}>
            현재 <span style={{ color: '#4CAF50', fontWeight: 800 }}>3단계 (보통)</span> — 수면과 수분 섭취를 꾸준히 유지해요!
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
