import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export const NAV_ITEMS = [
  { emoji: '🐱', label: '고양이', path: '/' },
  { emoji: '💕', label: '호감도', path: '/growth' },
  { emoji: '🛒', label: '상점', path: '/shop' },
  { emoji: '📖', label: '기록소', path: '/archive' },
  { emoji: '⚙️', label: '설정', path: '/settings' },
  { emoji: '📸', label: '고스타그램', path: '/social' },
  { emoji: '✉️', label: '편지', path: '/diary' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{
      background: 'white', borderTop: '2px solid #E8DDD0',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '10px 0 max(env(safe-area-inset-bottom, 0px), 12px)',
      flexShrink: 0
    }}>
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <motion.button
            key={item.path}
            whileTap={{ scale: 0.85 }}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '3px', background: 'transparent', border: 'none',
              cursor: 'pointer', padding: '4px 4px 0', minWidth: 0
            }}
          >
            <span style={{ fontSize: '21px', lineHeight: 1 }}>{item.emoji}</span>
            <span style={{
              fontSize: '9px', fontWeight: isActive ? 900 : 600,
              color: isActive ? '#3E3127' : '#B08060',
              whiteSpace: 'nowrap'
            }}>
              {item.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                style={{
                  width: '4px', height: '4px', borderRadius: '50%',
                  background: '#E6A874', marginTop: '1px'
                }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default BottomNav;
