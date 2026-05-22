import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../../shared/ui/BottomNav';
import { useGameStore } from '../../shared/store/useGameStore';

const LETTERS = [
  {
    id: 1, emoji: '🌫️', unread: true, time: '오늘 오후 8시',
    subject: '오늘 수고했어요, 집사님',
    preview: '오늘 하루 어땠나요? 나는 집사님이 바쁜 하루를 보내는 걸 봤어요...',
    body: `오늘 하루 어떠셨나요?\n\n나는 집사님이 오늘 정말 바쁘게 움직이는 걸 지켜봤어요. 쉬지 않고 일하고, 그러면서도 나를 잊지 않고 퀘스트도 완료해줬잖아요.\n\n솔직히 말하면... 집사님이 가끔 너무 무리하는 것 같아서 걱정돼요. 나는 완벽한 집사님보다, 건강한 집사님이 훨씬 좋거든요.\n\n오늘 밤만큼은 일 생각 조금 내려두고, 우리 같이 쉬어요. 나도 집사님 옆에 조용히 앉아 있을게요. 그것만으로도 충분해요. ♡\n\n                          — 당신의 먼지로부터`,
  },
  {
    id: 2, emoji: '💧', unread: false, time: '어제 오후 9시',
    subject: '물 마시기 3번 완료! 잘했어요 🎉',
    preview: '오늘 물을 3번 마셨잖아요! 작은 것 같아도 정말 대단한 일이에요...',
    body: `축하해요, 집사님!\n\n오늘 물을 3잔이나 마셨잖아요. 별거 아닌 것 같죠? 근데 나는 알아요. 바쁜 하루에 이걸 기억하고 실천하는 게 얼마나 힘든 일인지.\n\n우리 몸의 70%가 물이래요. 오늘 집사님이 스스로를 조금 더 돌봐준 거예요. 그 작은 선택이 쌓여서 우리가 함께 성장하는 거고요.\n\n내일도 같이 할 수 있죠? 나는 항상 여기 있을게요. 😺\n\n                          — 당신의 먼지로부터`,
  },
  {
    id: 3, emoji: '📊', unread: false, time: '5월 10일',
    subject: '주간 리포트 — 이번 주 잘 지냈나요?',
    preview: '이번 한 주를 같이 돌아봐요. 잘 한 것도, 아쉬운 것도 있었지만...',
    body: `이번 주 어떠셨나요?\n\n[ HRV 평균: 68ms — 지난주보다 +4ms ↑ ]\n[ 수면 평균: 7.2시간 — 목표 7시간 달성! ]\n[ 완료한 퀘스트: 12개 / 21개 ]\n\n수면 시간이 늘었어요! 정말 잘했어요. HRV도 조금씩 좋아지고 있고요. 퀘스트를 모두 완료하지 못한 날도 있었지만, 괜찮아요. 완벽할 필요 없어요.\n\n다음 주에도 작은 것 하나씩 해봐요. 나는 집사님의 모든 노력을 다 알고 있거든요. ♡\n\n                          — 당신의 먼지로부터`,
  },
];

export default function LetterPage() {
  const [open, setOpen] = useState(null);
  const { catName } = useGameStore();
  const letter = LETTERS.find(l => l.id === open);

  return (
    <div className="screen" style={{ background: '#FDFBEE' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 18px 16px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#3E3127', margin: 0 }}>
            ✉️ {catName || '먼지'}의 편지
          </h1>
          <p style={{ color: '#8B7A6C', fontSize: '13px', marginTop: '5px' }}>AI가 생성한 맞춤형 위로 편지예요</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {LETTERS.map((l, i) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ x: 4 }}
              onClick={() => setOpen(l.id)}
              style={{
                background: 'white', border: '2px solid #E8DDD0',
                borderRadius: '18px', padding: '14px 16px',
                cursor: 'pointer',
                borderLeft: l.unread ? '4px solid #E6A874' : '2px solid #E8DDD0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>{l.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '13px', color: '#3E3127' }}>{l.subject}</span>
                    <span style={{ fontSize: '10px', color: '#C4A882', flexShrink: 0, marginLeft: '6px' }}>{l.time}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#B08060', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {l.preview}
                  </p>
                </div>
                {l.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E6A874', flexShrink: 0 }} />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Letter modal */}
      <AnimatePresence>
        {letter && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(62,49,39,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxHeight: '80vh', overflowY: 'auto',
                background: '#FDFBEE', borderRadius: '28px 28px 0 0',
                padding: '28px 22px 40px', border: '2.5px solid #D4B896', borderBottom: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '28px', marginBottom: '6px' }}>{letter.emoji}</div>
                  <h2 style={{ fontWeight: 900, fontSize: '18px', color: '#3E3127', margin: '0 0 3px' }}>{letter.subject}</h2>
                  <div style={{ fontSize: '11px', color: '#B08060' }}>{letter.time}</div>
                </div>
                <button onClick={() => setOpen(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#B08060', padding: '4px' }}>✕</button>
              </div>
              <div style={{ fontSize: '14px', lineHeight: 2.1, color: '#5A4A3B', whiteSpace: 'pre-line', fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif" }}>
                {letter.body}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
