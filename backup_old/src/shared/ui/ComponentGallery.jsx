import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import Greeting from '../../features/home/Greeting';
import CatSection from '../../features/home/CatSection';
import QuestCard from '../../features/home/QuestCard';
import BottomNav from './BottomNav';
import mainBg from '../assets/main-bg.png';

// Isolated previews — no Router context needed for static renders
const COMPONENTS = [
  {
    id: 'header',
    name: 'Header',
    desc: '로고 + 재화 뱃지',
    color: '#FFF8EE',
    preview: () => (
      <div style={{ background: '#FDFBEE', padding: '10px 0 14px' }}>
        <Header />
      </div>
    ),
  },
  {
    id: 'greeting',
    name: 'Greeting',
    desc: '인사 & 부제목',
    color: '#FFF3E8',
    preview: () => (
      <div style={{ background: '#FDFBEE', padding: '18px 0' }}>
        <Greeting />
      </div>
    ),
  },
  {
    id: 'cat',
    name: 'Cat Section',
    desc: '배경 일러스트 + 말풍선',
    color: '#EEF3E8',
    preview: () => (
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden', borderRadius: '12px' }}>
        <img src={mainBg} alt="room" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom' }} />
        <div style={{
          position: 'absolute', bottom: '60%', left: '50%', transform: 'translateX(-50%)',
          background: 'white', border: '2.5px solid #3E3127', borderRadius: '20px',
          padding: '10px 16px', fontSize: '12px', fontWeight: 700, color: '#3E3127',
          textAlign: 'center', whiteSpace: 'nowrap', boxShadow: '3px 3px 0 rgba(62,49,39,0.1)'
        }}>
          친구야, 오늘은 나랑<br />물 한 잔 마셔요 💕
        </div>
      </div>
    ),
  },
  {
    id: 'quest',
    name: 'Quest Card',
    desc: '오늘의 부탁 + 진행바',
    color: '#F8F0E8',
    preview: () => (
      <div style={{ background: '#FDFBEE' }}>
        <QuestCard />
      </div>
    ),
  },
  {
    id: 'nav',
    name: 'Bottom Nav',
    desc: '7개 탭 내비게이션',
    color: '#F0EEF8',
    preview: () => (
      <div style={{ background: 'white', borderTop: '2px solid #E8DDD0', padding: '10px 0 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {[
            { emoji: '🐱', label: '고양이', active: true },
            { emoji: '💕', label: '호감도' },
            { emoji: '🛒', label: '상점' },
            { emoji: '📖', label: '기록소' },
            { emoji: '⚙️', label: '설정' },
            { emoji: '📸', label: '고스타그램' },
            { emoji: '✉️', label: '편지' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <span style={{ fontSize: '20px' }}>{item.emoji}</span>
              <span style={{ fontSize: '9px', fontWeight: item.active ? 900 : 600, color: item.active ? '#3E3127' : '#B08060' }}>
                {item.label}
              </span>
              {item.active && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#E6A874' }} />}
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

// --- Full-screen Component Detail ---

const ComponentDetail = ({ comp, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'rgba(62,49,39,0.6)', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.92, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.92, y: 20 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: 'white', borderRadius: '28px', overflow: 'hidden',
        width: '100%', boxShadow: '0 20px 60px rgba(62,49,39,0.3)'
      }}
    >
      {/* Detail header */}
      <div style={{
        background: comp.color, padding: '16px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '2px solid #E8DDD0'
      }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: '16px', color: '#3E3127' }}>{comp.name}</div>
          <div style={{ fontSize: '12px', color: '#8B7A6C', marginTop: '2px' }}>{comp.desc}</div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'white', border: '2px solid #D4B896', borderRadius: '50%',
            width: '32px', height: '32px', cursor: 'pointer', fontSize: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >✕</button>
      </div>

      {/* Component preview */}
      <div style={{ padding: comp.id === 'cat' ? '16px' : '0' }}>
        <comp.preview />
      </div>

      {/* Actions */}
      <div style={{ padding: '16px 20px', display: 'flex', gap: '10px', borderTop: '2px solid #F0EAE0' }}>
        <button
          style={{
            flex: 1, background: '#E6A874', border: '2.5px solid #3E3127',
            borderRadius: '20px', padding: '10px', fontWeight: 900,
            fontSize: '13px', color: '#3E3127', cursor: 'pointer',
            boxShadow: '0 3px 0 rgba(62,49,39,0.15)'
          }}
        >
          이 디자인 사용
        </button>
        <button
          onClick={onClose}
          style={{
            flex: 1, background: 'white', border: '2.5px solid #D4B896',
            borderRadius: '20px', padding: '10px', fontWeight: 700,
            fontSize: '13px', color: '#8B7A6C', cursor: 'pointer'
          }}
        >
          돌아가기
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// --- Gallery Grid ---

const ComponentGallery = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <div className="screen" style={{ background: '#F5EFE8' }}>
      {/* Page header */}
      <div style={{
        background: 'white', padding: '16px 20px 14px',
        borderBottom: '2px solid #E8DDD0', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', fontSize: '22px',
              cursor: 'pointer', padding: '0 4px', lineHeight: 1
            }}
          >←</button>
          <div>
            <div style={{ fontWeight: 900, fontSize: '18px', color: '#3E3127' }}>컴포넌트 갤러리</div>
            <div style={{ fontSize: '12px', color: '#8B7A6C', marginTop: '2px' }}>
              각 컴포넌트를 탭해서 미리보기하세요
            </div>
          </div>
        </div>
      </div>

      {/* Component cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {COMPONENTS.map((comp, idx) => (
          <motion.div
            key={comp.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(comp)}
            style={{
              background: 'white', borderRadius: '24px',
              border: '2px solid #E8DDD0', overflow: 'hidden',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(62,49,39,0.08)'
            }}
          >
            {/* Card label */}
            <div style={{
              background: comp.color, padding: '12px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: '2px solid #E8DDD0'
            }}>
              <div>
                <span style={{ fontWeight: 900, fontSize: '14px', color: '#3E3127' }}>{comp.name}</span>
                <span style={{ fontSize: '12px', color: '#8B7A6C', marginLeft: '8px' }}>{comp.desc}</span>
              </div>
              <span style={{ fontSize: '14px', color: '#B08060' }}>탭하여 보기 →</span>
            </div>

            {/* Thumbnail preview */}
            <div style={{
              padding: comp.id === 'cat' ? '12px' : '0',
              pointerEvents: 'none',
              transform: 'scale(0.9)', transformOrigin: 'top center',
              marginBottom: comp.id === 'cat' ? '-10px' : '-18px'
            }}>
              <comp.preview />
            </div>
          </motion.div>
        ))}

        {/* Full page preview link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: COMPONENTS.length * 0.06 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
          style={{
            background: '#E6A874', border: '2.5px solid #3E3127', borderRadius: '24px',
            padding: '18px', textAlign: 'center', cursor: 'pointer',
            boxShadow: '0 4px 0 rgba(62,49,39,0.15)'
          }}
        >
          <div style={{ fontWeight: 900, fontSize: '16px', color: '#3E3127' }}>🐱 전체 화면으로 보기</div>
          <div style={{ fontSize: '12px', color: '#6B5A4E', marginTop: '4px' }}>메인 홈 화면 확인</div>
        </motion.div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <ComponentDetail comp={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComponentGallery;
