import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BingleCharacter from '../../shared/ui/BingleCharacter.jsx';

import panel1 from '../../../public/images/panel_1.png';
import panel2 from '../../../public/images/panel_2.png';
import panel3 from '../../../public/images/panel_3.png';
import panel4 from '../../../public/images/panel_4.png';

const PANELS = [
  {
    img: panel1,
    ko: '냉장고 속 어딘가에, 혼자 남겨진 얼음 요정 빙글이가 있어요.',
    caption: '"It\'s so quiet... 문을 열어줄 사람이 있을까?"',
  },
  {
    img: panel2,
    ko: '그런데 어느 날, 냉장고 문이 열렸습니다!',
    caption: '"WHOA!! 세상이 있었어?!"',
  },
  {
    img: panel3,
    ko: '바깥의 온기가 빙글이를 조금씩 변화시킵니다.',
    caption: '"녹는데... 기분이 살아나는 것 같아! ✨"',
  },
  {
    img: panel4,
    ko: '이제 빙글이는 당신과 함께 모험을 떠납니다.',
    caption: '"WE\'RE GONNA HAVE A GRAND ADVENTURE!"',
  },
];

const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'q1',
    category: 'exhaustion',
    q: '요즘 퇴근 후에 현관문을 열고 집에 들어가면 그대로 바닥에 쓰러져 눕고 싶나요? 🛌',
    bingleMood: 'angry'
  },
  {
    id: 'q2',
    category: 'exhaustion',
    q: '쉬어도 쉬어도 아침에 일어날 때 몸이 무거운 돌덩이처럼 천근만근 느껴지나요? 🪨',
    bingleMood: 'hot'
  },
  {
    id: 'q3',
    category: 'exhaustion',
    q: '예전보다 피로가 완전히 풀리기까지 훨씬 긴 시간이 걸리는 것 같나요? ⏳',
    bingleMood: 'angry'
  },
  {
    id: 'q4',
    category: 'exhaustion',
    q: '아무 일도 하지 않고 가만히 누워있기만 해도 몸에 에너지가 전혀 안 도는 것 같나요? 🪫',
    bingleMood: 'hot'
  },
  {
    id: 'q5',
    category: 'exhaustion',
    q: '하루 일과를 마치면 내 에너지 배터리가 0%를 지나 완전히 마이너스가 된 것 같은가요? 🔋',
    bingleMood: 'hot'
  },
  {
    id: 'q6',
    category: 'cognitive',
    q: '최근 들어 아주 사소하고 간단한 작업인데도 도저히 집중하기 힘들 때가 있나요? 🔍',
    bingleMood: 'angry'
  },
  {
    id: 'q7',
    category: 'cognitive',
    q: '방금 하려던 일이나 스마트폰을 어디 두었는지 자주 까먹고 멍- 하니 있을 때가 많나요? 🧠',
    bingleMood: 'sleeping'
  },
  {
    id: 'q8',
    category: 'cognitive',
    q: '머릿속에 하얗고 자욱한 안개가 낀 것처럼 맑지 않고 생각이 안 굴러갈 때가 잦나요? 🌫️',
    bingleMood: 'angry'
  },
  {
    id: 'q9',
    category: 'emotional',
    q: '예전엔 웃어넘겼을 사소한 실수나 말 한마디에도 불쑥 욱하거나 짜증이 솟구치나요? ⚡',
    bingleMood: 'angry'
  },
  {
    id: 'q10',
    category: 'emotional',
    q: '주변의 작은 소음이나 메신저 알림 소리 하나에도 깜짝 놀라거나 심하게 신경 쓰이나요? 🔔',
    bingleMood: 'hot'
  },
  {
    id: 'q11',
    category: 'emotional',
    q: '하루 동안 내 감정이 롤러코스터처럼 너무 심하게 오르락내리락 요동치나요? 🎢',
    bingleMood: 'hot'
  },
  {
    id: 'q12',
    category: 'distance',
    q: '평소 좋아하던 요리나 취미, 일상생활의 아기자기한 낙들이 모두 귀찮고 무의미하게 느껴지나요? 🪹',
    bingleMood: 'sleeping'
  },
  {
    id: 'q13',
    category: 'distance',
    q: '회사 업무나 주변 인간관계에 냉담해지고 "어차피 해봤자 똑같지 뭐..." 하는 무감각한 마음이 드나요? 🧊',
    bingleMood: 'sleeping'
  },
  {
    id: 'q14',
    category: 'distance',
    q: '최근엔 다른 사람들을 만나서 대화하는 것조차 에너지가 아까워서 나를 꽁꽁 닫아걸고 싶나요? 🚪',
    bingleMood: 'sleeping'
  },
  // User Preferences
  {
    id: 'pref_activity',
    category: 'preference',
    q: '빙글이와 함께 해보고 싶은 너만의 마음 충전 움직임 스타일은 뭐야? 🏃‍♀️',
    bingleMood: 'happy',
    options: [
      { text: '🚶‍♀️ 바람을 쐬며 차분하게 산책하기', val: 'walk' },
      { text: '🧘‍♀️ 몸을 부드럽게 늘리는 스트레칭/요가', val: 'yoga' },
      { text: '🏋️‍♀️ 에너지를 쏟아내는 활기찬 홈트', val: 'cardio' },
      { text: '🌬️ 자리에 앉아 차분히 심호흡 명상하기', val: 'meditation' }
    ]
  },
  {
    id: 'pref_sleep',
    category: 'preference',
    q: '잠자리에 들기 전, 어떤 게 너를 가장 포근하고 아늑하게 만들어줘? 💤',
    bingleMood: 'happy',
    options: [
      { text: '🥛 따뜻한 라벤더 우유나 차 마시기', val: 'milk' },
      { text: '🎵 비 내리는 소리나 편안한 자연 소리', val: 'nature_sound' },
      { text: '🕯️ 은은한 아로마 캔들 켜두기', val: 'candle' },
      { text: '🛌 포근한 이불 속에 쏙 들어가서 눈 감기', val: 'bed' }
    ]
  }
];

export default function StoryOnboarding({ updateGameState, navigate, screens }) {
  const [phase, setPhase] = useState('fridge'); // fridge | comic | diagnostic | result
  const [doorOpening, setDoorOpening] = useState(false);
  const [panel, setPanel] = useState(0);

  // Diagnostic states
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [prefs, setPrefs] = useState({ activity: 'walk', sleepRut: 'milk' });

  const finishOnboarding = useCallback((finalScore, level, title, finalPrefs) => {
    updateGameState({
      hasCompletedOnboarding: true,
      burnoutScore: finalScore,
      burnoutLevel: level,
      burnoutTitle: title,
      preferences: finalPrefs,
      currentWeek: 1 // Onboarding always sets Week 1 (Stage 1)
    });
    navigate(screens.HUB);
  }, [updateGameState, navigate, screens]);

  const openDoor = () => {
    if (doorOpening) return;
    setDoorOpening(true);
    setTimeout(() => {
      setPhase('comic');
    }, 1400);
  };

  const nextPanel = () => {
    if (panel < PANELS.length - 1) {
      setPanel(p => p + 1);
    } else {
      setPhase('diagnostic');
    }
  };

  const handleSelectOption = (value, scoreVal = 0) => {
    const currentQ = DIAGNOSTIC_QUESTIONS[currentQIndex];
    if (currentQ.category === 'preference') {
      if (currentQ.id === 'pref_activity') {
        setPrefs(prev => ({ ...prev, activity: value }));
      } else {
        setPrefs(prev => ({ ...prev, sleepRut: value }));
      }
    } else {
      setAnswers(prev => ({ ...prev, [currentQ.id]: scoreVal }));
    }

    if (currentQIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setPhase('result');
    }
  };

  // Skip all diagnostics and generate moderate burnout default state
  const handleSkipOnboarding = () => {
    finishOnboarding(42, 3, '3~4단계 (중등)', { activity: 'walk', sleepRut: 'milk' });
  };

  // ── PHASE: comic ─────────────────────────────────────────────
  if (phase === 'comic') {
    const p = PANELS[panel];
    return (
      <div style={{
        minHeight: '100%', display: 'flex', flexDirection: 'column',
        background: '#1a1a1a', fontFamily: "'Gaegu', cursive",
        padding: '16px 12px 24px',
        boxSizing: 'border-box',
      }}>
        {/* Header Indicator */}
        <div style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.7)',
          fontSize: 16,
          fontWeight: 900,
          marginBottom: 12,
          letterSpacing: '1px'
        }}>
          📖 빙글이의 탄생 스토리 ({panel + 1} / {PANELS.length})
        </div>

        {/* Panel Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, paddingBottom: 16 }}>
          {PANELS.map((_, i) => (
            <div key={i} style={{
              width: 14, height: 14, borderRadius: '50%',
              border: '3px solid white',
              background: i <= panel ? '#ff8c69' : 'transparent',
              transition: 'background 0.3s ease, transform 0.3s ease',
              transform: i === panel ? 'scale(1.2)' : 'scale(1)',
              boxShadow: i === panel ? '0 0 10px #ff8c69' : 'none',
            }} />
          ))}
        </div>

        {/* Comic Panel Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={panel}
            initial={{ x: 80, opacity: 0, rotate: 1 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: -80, opacity: 0, rotate: -1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <div style={{
              border: '6px solid white',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 12px 28px rgba(0,0,0,0.5), 8px 8px 0 rgba(255,255,255,0.1)',
              aspectRatio: '1 / 1',
              width: '100%',
              background: '#e2efe9',
              position: 'relative'
            }}>
              <img 
                src={p.img} 
                alt={`panel-${panel + 1}`} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  display: 'block' 
                }} 
              />
            </div>

            {/* Premium Hand-Drawn Styled Caption Card */}
            <div style={{
              background: 'white',
              border: '4px solid black',
              margin: '16px 0',
              padding: '16px 20px',
              borderRadius: 16,
              boxShadow: '5px 5px 0 rgba(0, 0, 0, 1)',
              position: 'relative'
            }}>
              {/* Corner Tape Deco */}
              <div style={{
                position: 'absolute', top: -10, left: 15,
                background: 'rgba(255,140,105,0.7)',
                width: 50, height: 16,
                transform: 'rotate(-4deg)',
                border: '2px solid black'
              }} />
              <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#111', lineHeight: 1.5 }}>
                {p.ko}
              </p>
              <p style={{ margin: '8px 0 0', fontSize: 20, fontWeight: 900, color: '#e75b33' }}>
                {p.caption}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
          {panel > 0 && (
            <button
              onClick={() => setPanel(p => p - 1)}
              style={{
                flex: 1, padding: '16px 0', fontSize: 19, fontWeight: 900,
                background: 'white', border: '4px solid black',
                boxShadow: '4px 4px 0 black', borderRadius: 16,
                cursor: 'pointer', fontFamily: "'Gaegu', cursive",
              }}
            >
              ← 이전
            </button>
          )}
          <motion.button
            whileTap={{ scale: 0.97, y: 3 }}
            onClick={nextPanel}
            style={{
              flex: 2, padding: '16px 0', fontSize: 21, fontWeight: 900,
              background: '#ff8c69', border: '4px solid black',
              boxShadow: '5px 5px 0 black', borderRadius: 16,
              cursor: 'pointer', fontFamily: "'Gaegu', cursive",
              color: 'black'
            }}
          >
            {panel < PANELS.length - 1 ? '다음 이야기 →' : '빙글이와 대화 나누기 💬'}
          </motion.button>
        </div>
      </div>
    );
  }

  // ── PHASE: diagnostic ─────────────────────────────────────────
  if (phase === 'diagnostic') {
    const qItem = DIAGNOSTIC_QUESTIONS[currentQIndex];
    const isPref = qItem.category === 'preference';
    const totalQs = DIAGNOSTIC_QUESTIONS.length;
    const progressPercent = Math.round(((currentQIndex + 1) / totalQs) * 100);

    return (
      <div style={{
        minHeight: '100%', display: 'flex', flexDirection: 'column',
        background: '#e0f2fe', fontFamily: "'Gaegu', cursive",
        padding: '20px 14px 28px',
        boxSizing: 'border-box',
        backgroundImage: 'radial-gradient(circle, #bae6fd 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}>
        {/* Progress Bar & Stage Indicator */}
        <div style={{
          background: 'white', border: '4px solid black',
          padding: '10px 14px', borderRadius: 14,
          boxShadow: '3px 3px 0 black', marginBottom: 16,
          display: 'flex', flexDirection: 'column', gap: 6
        }}>
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#28180b' }}>
              📋 1단계: 번아웃 진단 & 유대감 쌓기
            </span>
            <span style={{ fontSize: 15, fontWeight: 900, color: '#ff8c69', marginLeft: 'auto' }}>
              {currentQIndex + 1} / {totalQs}
            </span>
          </div>
          <div style={{ width: '100%', height: 16, background: '#f0f0f0', border: '3px solid black', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
            <motion.div 
              style={{ height: '100%', background: '#67f9e1' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Main empathic chat panel */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', gap: 16, marginBottom: 20
        }}>
          {/* Animated Bingle character sitting cozily */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 140, position: 'relative' }}>
            <div className="halftone-bg" style={{ borderRadius: '50%', width: 130, height: 130, background: 'rgba(255,255,255,0.4)', position: 'absolute' }} />
            <BingleCharacter state={qItem.bingleMood} size={130} style={{ position: 'relative', zIndex: 2 }} />
          </div>

          {/* Empathetic Speech Bubble from Bingle */}
          <motion.div
            key={currentQIndex}
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            style={{
              background: 'white', border: '4px solid black',
              borderRadius: 20, padding: '16px 20px',
              boxShadow: '5px 5px 0 black', position: 'relative'
            }}
          >
            {/* Dialogue Tail */}
            <div style={{
              position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '14px solid transparent', borderRight: '14px solid transparent',
              borderBottom: '14px solid black'
            }} />
            <div style={{
              position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '12px solid transparent', borderRight: '12px solid transparent',
              borderBottom: '12px solid white'
            }} />

            <p style={{ margin: 0, fontSize: 19, fontWeight: 900, color: '#28180b', lineHeight: 1.5, textAlign: 'center' }}>
              {qItem.q}
            </p>
          </motion.div>

          {/* Answer Option Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            {isPref ? (
              // Preferences Options
              qItem.options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectOption(opt.val)}
                  style={{
                    background: 'white', border: '4px solid black',
                    borderRadius: 14, padding: '14px 16px',
                    fontSize: 17, fontWeight: 900, color: '#28180b',
                    textAlign: 'left', cursor: 'pointer',
                    boxShadow: '3px 3px 0 black',
                    fontFamily: "'Gaegu', cursive",
                  }}
                >
                  {opt.text}
                </motion.button>
              ))
            ) : (
              // Clinical scale Likert options
              [
                { text: '😊 전혀 그렇지 않아요 쌩쌩해요!', score: 0 },
                { text: '😐 아주 가끔 그럴 때가 있어요', score: 2 },
                { text: '😥 자주 그런 편이고 힘들어요', score: 4 },
                { text: '😭 매일 항상 기진맥진 시달려요', score: 6 }
              ].map((opt, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectOption(opt.text, opt.score)}
                  style={{
                    background: 'white', border: '4px solid black',
                    borderRadius: 14, padding: '12px 16px',
                    fontSize: 17, fontWeight: 900, color: '#28180b',
                    textAlign: 'left', cursor: 'pointer',
                    boxShadow: '3px 3px 0 black',
                    fontFamily: "'Gaegu', cursive",
                  }}
                >
                  {opt.text}
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Footer Warning (empowering & cozy) */}
        <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#554228' }}>
          💡 빙글이와의 대화 속에서 자연스럽게 마음의 온도를 체크합니다.
        </div>
      </div>
    );
  }

  // ── PHASE: result ─────────────────────────────────────────────
  if (phase === 'result') {
    // Calculate final scores
    const rawSum = Object.values(answers).reduce((sum, val) => sum + val, 0);
    // Scale rawSum (max 84) to 90 points to perfectly fit the 0-90 scale benchmark
    const scaledScore = Math.round((rawSum / 84) * 90);

    let level = 1;
    let title = '1단계 (경계 전)';
    let color = '#10b981';
    let desc = '아주 건강하거나 스트레스가 경미한 수준입니다. 빙글이와 편안하게 일상 정서 조절을 이어나갈 수 있습니다!';

    if (scaledScore >= 16 && scaledScore <= 30) {
      level = 2;
      title = '2~3단계 (초기 번아웃)';
      color = '#eab308';
      desc = '업무 마찰열이 서서히 유입되어 몸과 마음이 건조해지고 있습니다. 일과 사생활의 경계를 다잡아야 하는 중요한 골든타임입니다!';
    } else if (scaledScore >= 31 && scaledScore <= 50) {
      level = 3;
      title = '3~4단계 (중등 번아웃)';
      color = '#f97316';
      desc = '피로 누적이 일상화되어 마음에 온기가 끓고 냉각 필터가 오염되었습니다. 빙글이의 냉기 지원 및 소소한 신체 산책 수련이 반드시 필요합니다.';
    } else if (scaledScore >= 51 && scaledScore <= 65) {
      level = 4;
      title = '4~5단계 (중증 번아웃)';
      color = '#ef4444';
      desc = '인지 능력이 멍해지고 감정 기복이 수시로 일어나는 위험 신호입니다! 냉장고 문을 꼭 걸어 잠그고 집중 치유 간식과 심호흡으로 휴식을 채우세요.';
    } else if (scaledScore >= 66) {
      level = 5;
      title = '5~6단계 (심각 번아웃)';
      color = '#b91c1c';
      desc = '에너지가 완전히 고갈되어 깊은 수면조차 방해받고 있습니다. 즉각적인 치유 조치와 철저한 8주 회복 마스터 프로그램이 강력 권장됩니다.';
    }

    return (
      <div style={{
        minHeight: '100%', display: 'flex', flexDirection: 'column',
        background: '#f1f5f9', fontFamily: "'Gaegu', cursive",
        padding: '24px 16px 32px',
        boxSizing: 'border-box',
      }}>
        {/* Diagnostic Sheet Header */}
        <div style={{
          background: 'white', border: '4px solid black',
          padding: '16px 20px', borderRadius: 20,
          boxShadow: '6px 6px 0 black', marginBottom: 20,
          textAlign: 'center', position: 'relative',
          transform: 'rotate(-0.5deg)'
        }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, margin: 0, color: '#28180b' }}>
            📋 내 마음의 번아웃 진단서
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 700, color: '#666' }}>
            BINGLE AI 정서 분석 시스템 결과지
          </p>
        </div>

        {/* High-fidelity Score & classification panel */}
        <div style={{
          background: 'white', border: '4px solid black',
          borderRadius: 22, padding: '20px 18px',
          boxShadow: '8px 8px 0 black', marginBottom: 24,
          display: 'flex', flexDirection: 'column', gap: 14
        }}>
          <div style={{ display: 'flex', justifyContent: 'around', alignItems: 'center', borderBottom: '3px dashed #ccc', paddingBottom: 16 }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#888' }}>마음 온도 지표</span>
              <span style={{ fontSize: 36, fontWeight: 900, color: color, display: 'block', marginTop: 4 }}>
                {scaledScore}점
              </span>
            </div>
            <div style={{ width: 3, height: 50, background: '#eee' }} />
            <div style={{ textAlign: 'center', flex: 1.2 }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#888' }}>번아웃 진단 단계</span>
              <span style={{ fontSize: 21, fontWeight: 900, color: 'black', display: 'block', marginTop: 6, lineHeight: 1.2 }}>
                {title}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#e0f2fe', padding: 12, borderRadius: 14, border: '2px solid black' }}>
            <div style={{ width: 44, height: 44, flexShrink: 0 }}>
              <BingleCharacter state={level >= 3 ? 'angry' : 'happy'} size={44} />
            </div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e3a8a', lineHeight: 1.4 }}>
              "{desc}"
            </p>
          </div>

          {/* User Preferences display */}
          <div style={{ borderTop: '2px dashed #eee', paddingTop: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: '#28180b', display: 'block', marginBottom: 8 }}>
              🌟 설정된 맞춤 솔루션 필터:
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ background: '#e0f2fe', border: '2px solid black', px: 3, py: 1, borderRadius: 10, fontSize: 13, fontWeight: 900, padding: '4px 10px' }}>
                🏃‍♂️ {prefs.activity === 'walk' ? '차분한 바람 산책' : prefs.activity === 'yoga' ? '부드러운 스트레칭' : prefs.activity === 'cardio' ? '땀나는 유산소 홈트' : '심호흡 브리딩'}
              </span>
              <span style={{ background: '#f3e8ff', border: '2px solid black', px: 3, py: 1, borderRadius: 10, fontSize: 13, fontWeight: 900, padding: '4px 10px' }}>
                🥛 {prefs.sleepRut === 'milk' ? '라벤더 우유 한 잔' : prefs.sleepRut === 'nature_sound' ? '빗소리 백색소음' : prefs.sleepRut === 'candle' ? '아로마 캔들' : '포근한 침대 속 휴식'}
              </span>
            </div>
          </div>
        </div>

        {/* 8-WEEK THERAPEUTIC GRADUAL ROADMAP VISUALIZATION */}
        <h3 style={{ fontSize: 19, fontWeight: 900, color: '#28180b', marginBottom: 12, paddingLeft: 4 }}>
          🗓️ 8주 점진적 치유 스토리 로드맵
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {[
            { weeks: '1~2주차', stage: '1단계: 번아웃 신호 자각', text: '빙글이와 1:1 대화 집중, 일일 감정 온도 싱크 및 번아웃 이해', active: true },
            { weeks: '3~4주차', stage: '2단계: 일상 경계 짓기', text: '퇴근 후 Refrigerator 꽁꽁 문단속 개방, 5분 미만 초저난도 일상 부탁출석 수련', active: false },
            { weeks: '5~6주차', stage: '3단계: 행동 활성화', text: '소셜 얼음동굴 커뮤니티 정식 개방! 이웃 냉기 지원 및 V-log 영상 교류', active: false },
            { weeks: '7~8주차', stage: '4단계: 루틴 지속화 설계', text: '축적된 마음 분석 통계 해제, 나만의 평생 지속 가능한 힐링 루틴 수립', active: false }
          ].map((item, idx) => (
            <div 
              key={idx}
              style={{
                background: item.active ? '#ff8c69' : 'white',
                border: '3px solid black',
                borderRadius: 16,
                padding: '12px 14px',
                boxShadow: item.active ? '4px 4px 0 black' : '2px 2px 0 rgba(0,0,0,0.1)',
                opacity: item.active ? 1 : 0.65,
                transform: item.active ? 'scale(1.02)' : 'none',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              {item.active && (
                <div style={{
                  position: 'absolute', top: -8, right: 12,
                  background: '#67f9e1', border: '2px solid black',
                  fontSize: 11, fontWeight: 900, px: 2, py: 0.5, borderRadius: 8,
                  padding: '2px 6px', color: 'black'
                }}>
                  현재 집중 단계 🎯
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: item.active ? 'white' : '#777' }}>
                  {item.weeks}
                </span>
                <span style={{ fontSize: 16, fontWeight: 900, color: item.active ? 'black' : '#444', marginLeft: 8 }}>
                  {item.stage}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: item.active ? 'rgba(0,0,0,0.8)' : '#888', lineHeight: 1.4 }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Start Adventure Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => finishOnboarding(scaledScore, level, title, prefs)}
          style={{
            width: '100%', padding: '18px 0', fontSize: 21, fontWeight: 900,
            background: '#ff8c69', border: '4px solid black',
            boxShadow: '6px 6px 0 black', borderRadius: 18,
            cursor: 'pointer', color: 'black',
            fontFamily: "'Gaegu', cursive",
            marginTop: 'auto'
          }}
        >
          빙글이와 함께 8주 치유 모험 시작하기! 🚀
        </motion.button>
      </div>
    );
  }

  // ── PHASE: fridge ─────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100%', background: '#e6f2f0',
      fontFamily: "'Gaegu', cursive",
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '20px 16px 32px',
      backgroundImage: 'radial-gradient(circle, #c9dad7 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      boxSizing: 'border-box',
    }}>
      {/* Skip Button */}
      <button
        onClick={handleSkipOnboarding}
        style={{
          alignSelf: 'flex-end', marginBottom: 8,
          background: 'white', border: '3px solid black',
          boxShadow: '3px 3px 0 black', padding: '6px 14px',
          fontSize: 15, fontWeight: 900, cursor: 'pointer',
          borderRadius: 12, fontFamily: "'Gaegu', cursive",
        }}
      >
        건너뛰기 ⏩
      </button>

      {/* Main Title & Service Identity */}
      <div style={{
        background: '#28180b', color: '#ffcb2f',
        padding: '8px 18px', fontWeight: 900, fontSize: 17,
        transform: 'rotate(-1deg)', marginBottom: 8,
        border: '3px solid black',
        boxShadow: '3px 3px 0 black',
        borderRadius: '8px'
      }}>
        🧊 마음 냉장고 BINGLE (빙글)
      </div>

      <div style={{
        fontSize: 14,
        fontWeight: 900,
        color: '#ff8c69',
        background: 'rgba(255,140,105,0.1)',
        padding: '3px 10px',
        borderRadius: 20,
        marginBottom: 12,
        border: '1.5px solid #ff8c69'
      }}>
        정서 조절 & 행동 활성화 디지털 테라피 플랫폼
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 900, textAlign: 'center', lineHeight: 1.4, margin: '0 0 16px', color: '#333' }}>
        스트레스로 녹아내리는 얼음 요정,<br />
        <span style={{ color: '#ff8c69' }}>빙글이</span>를 차갑게 지켜주세요!
      </h2>

      {/* Refrigerator UI Container */}
      <div style={{ perspective: 1500, marginBottom: 20, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div 
          onClick={openDoor}
          style={{
            width: 290, height: 370,
            background: '#ffefd5', border: '8px solid black',
            borderRadius: 36, boxShadow: '12px 12px 0 black',
            position: 'relative', overflow: 'hidden',
            cursor: doorOpening ? 'default' : 'pointer',
            transition: 'transform 0.2s',
            transform: doorOpening ? 'none' : 'hover:scale(1.02)'
          }}
        >
          {/* Refrigerator Interior Shelf (Visible when doors swing open) */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at center, #d8f5fc 30%, #a4e6f4 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            paddingTop: 20
          }}>
            {/* Ice Cold Condensation/Fog effect */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)',
              pointerEvents: 'none'
            }} />
            
            {/* The beautiful cropped sleep asset */}
            <BingleCharacter state="sleeping" size={145} />
            
            <div style={{
              background: 'rgba(255,255,255,0.8)',
              border: '3px solid black',
              padding: '4px 10px',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 900,
              marginTop: 10,
              boxShadow: '2px 2px 0 black',
              zIndex: 1
            }}>
              💤 쿨쿨 잠자는 빙글이
            </div>
          </div>

          {/* LEFT DOOR */}
          <motion.div
            animate={{ rotateY: doorOpening ? -135 : 0 }}
            style={{ 
              originX: 0,
              position: 'absolute', left: 0, top: 0,
              width: '50%', height: '100%',
              background: 'linear-gradient(to right, #e0f2f1 0%, #b2dfdb 100%)',
              borderRight: '4px solid black',
              border: '4px solid black', borderLeft: 'none', borderTop: 'none', borderBottom: 'none',
              zIndex: 10,
              transformStyle: 'preserve-3d',
              boxShadow: doorOpening ? 'none' : 'inset -4px 0 10px rgba(0,0,0,0.1)'
            }}
            transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Refrigerator Magnet: Cute Bingle Magnet */}
            <div style={{
              position: 'absolute', top: 50, left: 20,
              width: 55, height: 55,
              borderRadius: '50%', background: 'white',
              border: '3px solid black',
              boxShadow: '3px 3px 0 rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'rotate(-8deg)'
            }}>
              <span style={{ fontSize: 32 }}>🧊</span>
            </div>

            {/* Sticker: Calender checklist */}
            <div style={{
              position: 'absolute', bottom: 70, left: 15,
              width: 70, height: 85,
              background: '#fff9c4',
              border: '2px solid black',
              boxShadow: '3px 3px 0 rgba(0,0,0,0.15)',
              transform: 'rotate(5deg)',
              padding: 6,
              fontSize: 10,
              fontWeight: 900,
              color: '#333'
            }}>
              <div style={{ borderBottom: '1px solid black', paddingBottom: 2, marginBottom: 4, textAlign: 'center', fontSize: 11 }}>CHECK</div>
              <div>□ 걷기 🏃</div>
              <div>□ 일기 ✍</div>
              <div>□ 호흡 🌬</div>
            </div>

            {/* Chrome Handle Left */}
            <div style={{ 
              width: 14, height: 75, 
              background: 'linear-gradient(to right, #cfd8dc, #90a4ae)', 
              border: '3px solid black', 
              borderRadius: '0 8px 8px 0', 
              position: 'absolute', right: -7, top: '40%', 
              transform: 'translateY(-50%)',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.2)'
            }} />
          </motion.div>

          {/* RIGHT DOOR */}
          <motion.div
            animate={{ rotateY: doorOpening ? 135 : 0 }}
            style={{ 
              originX: 1,
              position: 'absolute', right: 0, top: 0,
              width: '50%', height: '100%',
              background: 'linear-gradient(to left, #e0f2f1 0%, #b2dfdb 100%)',
              borderLeft: '4px solid black',
              border: '4px solid black', borderRight: 'none', borderTop: 'none', borderBottom: 'none',
              zIndex: 10,
              transformStyle: 'preserve-3d',
              boxShadow: doorOpening ? 'none' : 'inset 4px 0 10px rgba(0,0,0,0.1)'
            }}
            transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Thermometer Display screen on Right Door */}
            <div style={{
              position: 'absolute', top: 40, right: 15,
              background: '#263238', border: '3px solid black',
              borderRadius: 12, padding: '6px 12px',
              color: '#00e676', fontFamily: 'monospace',
              fontSize: 15, fontWeight: 'bold',
              textAlign: 'center',
              boxShadow: 'inset 0 0 5px rgba(0,230,118,0.5)'
            }}>
              <div>TEMP</div>
              <div style={{ fontSize: 18, color: '#ff1744' }}>85°C 🥵</div>
            </div>

            {/* Sticker: Warm message */}
            <div style={{
              position: 'absolute', bottom: 50, right: 12,
              background: '#ffccbc',
              border: '2px solid black',
              boxShadow: '3px 3px 0 rgba(0,0,0,0.15)',
              transform: 'rotate(-4deg)',
              padding: '6px 10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 900,
              color: '#d84315'
            }}>
              빙글이를 구해줘!
            </div>

            {/* Chrome Handle Right */}
            <div style={{ 
              width: 14, height: 75, 
              background: 'linear-gradient(to left, #cfd8dc, #90a4ae)', 
              border: '3px solid black', 
              borderRadius: '8px 0 0 8px', 
              position: 'absolute', left: -7, top: '40%', 
              transform: 'translateY(-50%)',
              boxShadow: '-2px 2px 0 rgba(0,0,0,0.2)'
            }} />
          </motion.div>
        </div>
      </div>

      {/* Guide Card (Perfect Service Description) */}
      <div style={{
        width: '100%', maxWidth: 320,
        background: 'white', border: '4px solid black',
        boxShadow: '5px 5px 0 black', borderRadius: 18,
        padding: '16px 20px', marginBottom: 20, transform: 'rotate(-0.5deg)',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          fontSize: 18, 
          fontWeight: 900, 
          borderBottom: '2.5px dashed black', 
          paddingBottom: 8, 
          marginBottom: 12,
          color: '#28180b'
        }}>
          📖 마음 냉장고 수호 설명서
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20 }}>🥵</span>
            <p style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#444', lineHeight: 1.5 }}>
              스트레스로 마음에 열기가 가득 차면, 냉장실 기온이 올라 <strong>빙글이가 녹아버려요!</strong>
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20 }}>🏃</span>
            <p style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#444', lineHeight: 1.5 }}>
              걷기(만보기)를 실천해 <strong>차가운 마찰 온기 XP</strong>를 만들고 냉기를 공급하세요!
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20 }}>✍️</span>
            <p style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#444', lineHeight: 1.5 }}>
              심호흡과 기분 기록 일기를 작성하여 <strong>냉장실 적정 온도(12°C)</strong>로 낮추어 지켜주세요.
            </p>
          </div>
        </div>
      </div>

      {/* Open Refrigerator Door Button */}
      <motion.button
        whileTap={{ scale: 0.96, y: 3 }}
        onClick={openDoor}
        disabled={doorOpening}
        style={{
          width: '100%', maxWidth: 320,
          padding: '18px 0', fontSize: 21, fontWeight: 900,
          background: doorOpening ? '#ccc' : '#ff8c69',
          border: '4px solid black', boxShadow: '6px 6px 0 black',
          borderRadius: 18, cursor: doorOpening ? 'not-allowed' : 'pointer',
          fontFamily: "'Gaegu', cursive",
          color: 'black'
        }}
      >
        {doorOpening ? '🔑 아늑한 냉장실 여는 중...' : '🔑 마음 냉장실 문 열고 빙글이 구하기!'}
      </motion.button>
    </div>
  );
}
