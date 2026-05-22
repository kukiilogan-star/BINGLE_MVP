import { useState } from 'react';
import { motion } from 'framer-motion';
import BottomNav from '../../shared/ui/BottomNav';

const POSTS = [
  { id:1, user:'익명의 집사 #1847', cat:'구름', emoji:'☁️', lv:3, msg:'오늘 드디어 물 3잔 다 마셨어요! 구름이도 기뻐하는 것 같아요 ☺️', likes:42, time:'5분 전' },
  { id:2, user:'익명의 집사 #392',  cat:'별이', emoji:'⭐', lv:5, msg:'바쁜 하루였지만 별이 덕분에 스트레칭 다 했어요 🌙', likes:78, time:'12분 전' },
  { id:3, user:'익명의 집사 #2201', cat:'솜이', emoji:'🌫️', lv:1, msg:'솜이가 생긴 지 3일째인데 벌써 Lv.2 목전이에요! 같이 열심히 할게요 💪', likes:23, time:'31분 전' },
  { id:4, user:'익명의 집사 #654',  cat:'루나', emoji:'🌸', lv:4, msg:'오늘 HRV 수치가 많이 올랐어요. 루나 덕분에 꾸준히 관리하게 되는 것 같아요', likes:91, time:'1시간 전' },
  { id:5, user:'익명의 집사 #1102', cat:'모모', emoji:'🍊', lv:6, msg:'드디어 수호 영물 달성!! 2달 동안 매일 퀘스트 완료했어요. 여러분도 할 수 있어요 🌟', likes:234, time:'2시간 전' },
];

export default function SocialPage() {
  const [liked, setLiked] = useState({});
  const toggle = id => setLiked(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className="screen" style={{ background: '#FDFBEE' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 18px 16px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#3E3127', margin: 0 }}>📸 고스타그램</h1>
          <p style={{ color: '#8B7A6C', fontSize: '13px', marginTop: '5px' }}>다른 집사들의 이야기를 구경해요</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {POSTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                background: 'white', border: '2px solid #E8DDD0',
                borderRadius: '20px', padding: '16px',
                borderLeft: i === 0 ? '4px solid #E6A874' : '2px solid #E8DDD0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: '#FDF0E0', border: '2px solid #D4B896',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                }}>{p.emoji}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '12px', color: '#3E3127' }}>{p.user}</div>
                  <div style={{ fontSize: '10px', color: '#B08060' }}>{p.cat} · Lv.{p.lv} · {p.time}</div>
                </div>
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#5A4A3B', marginBottom: '12px' }}>{p.msg}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => toggle(p.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                >
                  <span style={{ fontSize: '18px' }}>{liked[p.id] ? '❤️' : '🤍'}</span>
                  <span style={{ fontSize: '12px', color: '#B08060', fontWeight: 700 }}>{p.likes + (liked[p.id] ? 1 : 0)}</span>
                </motion.button>
                <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#C4A882' }}>💪 응원하기</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
