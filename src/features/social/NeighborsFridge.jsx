import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BingleCharacter from '../../shared/ui/BingleCharacter.jsx';

const INITIAL_NEIGHBORS = [
  {
    id: 'n_1',
    owner: '민지의_민트동굴 🧊',
    color: '#d1fae5',
    title: '민트 retro 빈티지 냉각고',
    temp: 12,
    mood: 'sleeping',
    likes: 24,
    hasCooled: false,
    inventory: ['💧', '💧', '🍊'],
    speech: '이글루 속에서 시원한 라벤더 우유를 마시고, 빙글이가 아늑한 눈꽃 잠에 빠져들었어! 대성공이야! ❄️💤',
    comments: [
      { author: '산책마스터', text: '이글루 배경이랑 자는 빙글이 조합 진짜 극락이네요... 👍' },
      { author: '번아웃탈출기', text: '제 냉장고는 지금 열기가 펄펄 나는데 부럽습니다!' }
    ]
  },
  {
    id: 'n_2',
    owner: '성진이의_온도경보 ⚠️',
    color: '#fee2e2',
    title: '성진이의 철제 스트레스 극복고',
    temp: 78,
    mood: 'hot',
    likes: 8,
    hasCooled: false,
    inventory: ['🍊'],
    speech: '아악! 오늘 마케팅 기획서 검토 회의 때 기온이 폭등했어!! 빙글이가 빨갛게 달아올라 땀 흘리는 중.. 살려줘!! 🥵',
    comments: [
      { author: '민지의_민트동굴 🧊', text: '성진님 얼른 심호흡 크게 세 번 하시고 얼음 찜질하세요!!' }
    ]
  },
  {
    id: 'n_3',
    owner: '서윤이의_레몬에이드 🍋',
    color: '#fef08a',
    title: '서윤이의 상큼 레몬 아늑고',
    temp: 21,
    mood: 'happy',
    likes: 19,
    hasCooled: false,
    inventory: ['💧', '🍊', '🍫'],
    speech: '오늘 아침 눈꽃 길 산책 1,500보 성공하고 획득한 오렌지 먹여줬더니 이글루 안에서 싱글벙글 기분이 좋아 보여! 🍊✨',
    comments: [
      { author: '꽁꽁이보관소', text: '이글루에 숨어있는 빙글이 너무 귀엽네요!!' }
    ]
  }
];

export default function NeighborsFridge({ gameState, updateGameState, gainXP, showToast }) {
  const selectedTheme = gameState?.fridgeTheme || 'mint';
  const [neighbors, setNeighbors] = useState(INITIAL_NEIGHBORS);
  const [commentInputs, setCommentInputs] = useState({});
  
  // Posting parameters
  const [newPostText, setNewPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleSupportCooling = (neighborId) => {
    const updated = neighbors.map(n => {
      if (n.id === neighborId) {
        if (n.hasCooled) {
          showToast('❄️ 이미 오늘 한 차례 시원한 냉기 지원을 보냈습니다!');
          return n;
        }

        const coolEffect = Math.max(12, n.temp - 25);
        let newMood = n.mood;
        if (coolEffect <= 25) newMood = 'happy';
        if (coolEffect <= 15) newMood = 'sleeping';

        showToast(`🧊 [${n.owner}]님의 냉장고에 시원한 냉기 정화 기원을 발사했습니다! (XP +10)`);
        gainXP(10);

        const supportComment = {
          author: '마이_빙글이_가드',
          text: `❄️ 냉기 지원 파도! 기온이 ${Math.round(coolEffect)}°C로 아늑해졌기를 바랄게요! 파이팅!`
        };

        return {
          ...n,
          temp: coolEffect,
          mood: newMood,
          likes: n.likes + 1,
          hasCooled: true,
          comments: [...n.comments, supportComment]
        };
      }
      return n;
    });

    setNeighbors(updated);
  };

  const handleAddComment = (neighborId) => {
    const commentText = commentInputs[neighborId];
    if (!commentText || !commentText.trim()) return;

    const updated = neighbors.map(n => {
      if (n.id === neighborId) {
        return {
          ...n,
          comments: [...n.comments, { author: '마이_빙글이_가드', text: commentText }]
        };
      }
      return n;
    });

    setNeighbors(updated);
    setCommentInputs(prev => ({ ...prev, [neighborId]: '' }));
    showToast('💬 따뜻한 격려 댓글을 게시했습니다!');
  };

  // Create User-generated Post to Icestagram
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText || !newPostText.trim()) {
      showToast('⚠️ 공유하고 싶은 힐링 일상을 작성해 주세요!');
      return;
    }

    setIsPosting(true);
    showToast('❄️ 아이스타그램 피드에 나의 빙글이 소식을 전송하는 중...');

    setTimeout(() => {
      const userPostId = `user_${Date.now()}`;
      const newPost = {
        id: userPostId,
        owner: '나의_빙글이_동굴 👑',
        color: '#e0f2fe',
        title: '나의 소중한 이글루 냉각실',
        temp: gameState?.mindTemperature ?? 12,
        mood: gameState?.characterState ?? 'happy',
        likes: 0,
        hasCooled: false,
        inventory: ['💧', '🍊'],
        speech: newPostText.trim(),
        comments: []
      };

      setNeighbors([newPost, ...neighbors]);
      setNewPostText('');
      setIsPosting(false);
      gainXP(15);
      showToast('🎉 게시 성공! 아이스타그램 피드에 나의 빙글이 일상이 업로드되었습니다. (+15 XP)');

      // Simulate a neighboring reaction comment after 3.5 seconds
      setTimeout(() => {
        setNeighbors(prevNeighbors => 
          prevNeighbors.map(n => {
            if (n.id === userPostId) {
              return {
                ...n,
                likes: n.likes + 1,
                comments: [
                  ...n.comments,
                  { author: '민지의_민트동굴 🧊', text: '오와! 이글루 안에서 빙글이가 너무 행복해 보여요! 함께 꽁꽁방 사수해요! ❄️😊' }
                ]
              };
            }
            return n;
          })
        );
        showToast('💬 [민지의_민트동굴]님이 당신의 포스트에 따뜻한 응원 댓글을 달았습니다!');
      }, 3500);

    }, 1200);
  };

  const handleLikePost = (neighborId) => {
    setNeighbors(prev => prev.map(n => {
      if (n.id === neighborId) {
        showToast(`❤️ [${n.owner}]님의 일상을 응원했습니다!`);
        return { ...n, likes: n.likes + 1 };
      }
      return n;
    }));
  };

  return (
    <div className={`fridge-bg fridge-bg-${selectedTheme} ${['black', 'wood'].includes(selectedTheme) ? 'text-white' : 'text-[#28180b]'} min-h-full flex flex-col items-center overflow-x-hidden relative font-['Gaegu'] select-none`}>
      <div className="halftone-bg" />

      <main className="w-full max-w-md pt-4 pb-28 px-4 flex flex-col gap-6 min-h-full relative z-10">
        
        {/* Icestagram Interactive Header */}
        <section className="comic-panel p-4 bg-[#bfeaff] text-black flex items-center justify-between transform -rotate-1 border-4 border-black shadow-[4px_4px_0_0_#000]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-3xl font-black rotate-12 text-[#28180b] bg-white p-1 rounded-lg border-2 border-black">
              ac_unit
            </span>
            <div>
              <h2 className="text-2xl font-black italic tracking-wide text-blue-900">❄️ 아이스타그램 (Icestagram)</h2>
              <p className="text-xs font-black text-blue-950 mt-0.5">이글루 속 빙글이 가디언들의 평화로운 겨울왕국 피드</p>
            </div>
          </div>
        </section>

        {/* USER DAILY CAPTION UPLOADER FORM (Frosted Theme) */}
        <section className="comic-panel bg-white/95 backdrop-blur-md p-4 border-4 border-black shadow-[4px_4px_0_0_#000] flex flex-col gap-3 transform rotate-1">
          <div className="flex justify-between items-center border-b-2 border-black pb-1.5">
            <h3 className="text-lg font-black text-black flex items-center gap-2">
              <span className="material-symbols-outlined font-black text-base bg-blue-100 p-0.5 border border-black rounded">cloud_upload</span>
              이글루 속 치유 일상 공유하기
            </h3>
            <span className="bg-sky-200 border border-black font-black px-2 py-0.5 text-[9px] rounded shadow-[1.5px_1.5px_0_0_#000] text-blue-900">
              눈꽃 안테나 ON
            </span>
          </div>

          <form onSubmit={handleCreatePost} className="flex flex-col gap-2">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="오늘 내 빙글이의 이글루 냉장 힐링 일기를 공유해 보세요! (예: 뽀모도로 공부 후 시원하게 얼려둔 라벤더 우유 먹였어요 🥛)"
              maxLength={150}
              disabled={isPosting}
              className="w-full bg-[#f8fafc] border-3 border-black p-2.5 rounded-lg text-xs font-black placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-3 focus:ring-cyan-300 transition-all resize-none h-16"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <span className="bg-cyan-50 border border-cyan-300 text-cyan-700 font-bold px-1.5 py-0.5 rounded text-[9px]">#이글루아이스타그램</span>
                <span className="bg-blue-50 border border-blue-300 text-blue-700 font-bold px-1.5 py-0.5 rounded text-[9px]">#빙글이눈꽃</span>
              </div>
              <button
                type="submit"
                disabled={isPosting}
                className="bg-[#bfeaff] hover:bg-sky-200 border-3 border-black font-black text-xs px-4 py-1.5 rounded-lg shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1 text-blue-950"
              >
                {isPosting ? (
                  <>
                    <span className="animate-spin text-[10px]">❄️</span>
                    <span>피드 전송 중..</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm font-black">send</span>
                    <span>눈꽃 공유</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Neighbors Feed */}
        <div className="flex flex-col gap-6">
          <AnimatePresence>
            {neighbors.map(neighbor => (
              <motion.article 
                key={neighbor.id} 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="comic-panel p-0 overflow-hidden flex flex-col border-4 border-black shadow-[6px_6px_0_0_#28180b] bg-sky-50/90 backdrop-blur-md relative"
              >
                {/* Frost Glass Ice Bricks Grid border overlay at the top */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-300 via-cyan-100 to-blue-300 z-30" />
                
                {/* Header block with avatar */}
                <div className="bg-gradient-to-r from-blue-100/90 to-cyan-50/90 border-b-4 border-black p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full border-3 border-black bg-blue-200 flex items-center justify-center font-black text-sm text-blue-900 shadow-[1px_1px_0_0_#000]">
                      {neighbor.owner.startsWith('나의') ? '👑' : neighbor.owner[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black leading-none text-blue-950">{neighbor.owner}</span>
                      <span className="text-[10px] font-bold text-blue-700 mt-0.5">{neighbor.title}</span>
                    </div>
                  </div>
                  <div className="bg-white/95 border-3 border-black px-2 py-0.5 font-black text-xs transform rotate-2 shadow-[2px_2px_0_0_#000] text-blue-800">
                    {Math.round(neighbor.temp)}°C {neighbor.temp > 50 ? '🥵' : '🧊'}
                  </div>
                </div>

                {/* Polaroid Square Photo Frame: Ice Igloo BG */}
                <div 
                  className="w-full aspect-square flex flex-col border-b-4 border-black relative overflow-hidden p-4 items-center justify-center"
                  style={{
                    backgroundImage: `url('/images/ice_igloo_bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Frosted ice overlay for premium glassmorphism finish */}
                  <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[0.5px] pointer-events-none z-0" />
                  
                  {/* Frost bricks light borders inside photo */}
                  <div className="absolute inset-2 border-2 border-white/35 rounded-lg pointer-events-none z-10" />

                  {/* Watermark grid badge */}
                  <div className="absolute top-4 left-4 bg-blue-950/80 text-cyan-200 font-mono text-[9px] px-2 py-0.5 rounded border border-cyan-300/40 z-20 shadow-sm">
                    ❄️ Icestagram CAM v2.0
                  </div>

                  {/* Big dynamic wobbly breathing Bingle wrapped in float animation */}
                  <motion.div 
                    className="relative z-10 flex flex-col items-center"
                    animate={{
                      y: [0, -9, 0],
                      rotate: [-1, 1, -1]
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    <BingleCharacter state={neighbor.mood} size={135} className="filter drop-shadow-[6px_6px_0px_rgba(15,23,42,0.22)]" />
                    
                    {/* Floating mood tag */}
                    <div className={`mt-2 border-2 border-black font-black px-2.5 py-0.5 rounded text-xs shadow-[1.5px_1.5px_0_0_#000] ${
                      neighbor.mood === 'happy' ? 'bg-[#67f9e1] text-black' :
                      neighbor.mood === 'sleeping' ? 'bg-cyan-200 text-black' :
                      neighbor.mood === 'angry' ? 'bg-yellow-300 text-black' : 'bg-red-500 text-white'
                    }`}>
                      #{neighbor.mood.toUpperCase()}
                    </div>
                  </motion.div>

                  {/* Decorative ice framing */}
                  <div className="absolute bottom-3 right-3 flex gap-1.5 z-20">
                    {neighbor.inventory.map((inv, idx) => (
                      <span key={idx} className="bg-white/95 border-2 border-black rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-[1.5px_1.5px_0_0_#000]">
                        {inv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Caption / Content Post */}
                <div className="p-4 flex flex-col gap-3">
                  <div className="bg-[#fffbeb] border-3 border-black p-3 rounded-xl shadow-[3px_3px_0_0_#000] relative">
                    {/* Snowy paper texture */}
                    <div className="absolute inset-0 bg-blue-50/10 pointer-events-none rounded-xl" />
                    <p className="text-xs font-black leading-relaxed text-gray-800 relative z-10">
                      "{neighbor.speech}"
                    </p>
                  </div>

                  {/* Actions Ribbon */}
                  <div className="flex gap-2 border-t-3 border-dashed border-black pt-3">
                    <button 
                      onClick={() => handleSupportCooling(neighbor.id)} 
                      className={`flex-1 flex items-center justify-center gap-1.5 font-black text-xs py-1.5 border-3 border-black rounded-lg shadow-[2.5px_2.5px_0_0_#000] active:translate-y-0.5 active:shadow-none transition-all ${
                        neighbor.hasCooled 
                          ? 'bg-blue-50 text-blue-600 border-blue-400 shadow-none cursor-default' 
                          : 'bg-[#67f9e1] hover:bg-[#4ce5cd] text-black'
                      }`}
                    >
                      <span className="material-symbols-outlined font-black text-base">ac_unit</span>
                      <span>{neighbor.hasCooled ? '냉기 지원 발송됨' : '이글루 냉기 보내기'}</span>
                    </button>

                    <button
                      onClick={() => handleLikePost(neighbor.id)}
                      className="bg-white hover:bg-red-50 border-3 border-black px-3 py-1.5 rounded-lg shadow-[2.5px_2.5px_0_0_#000] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1 text-xs font-black"
                    >
                      <span className="material-symbols-outlined font-black text-red-500 text-base">favorite</span>
                      <span>{neighbor.likes}</span>
                    </button>
                  </div>

                  {/* Comments list panel */}
                  {neighbor.comments.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-1 bg-white/70 border-3 border-black p-2.5 rounded-lg max-h-28 overflow-y-auto no-scrollbar">
                      {neighbor.comments.map((c, i) => (
                        <div key={i} className="text-xs font-black leading-tight flex items-start gap-1">
                          <span className="text-[#0284c7] shrink-0 font-bold">{c.author}:</span>
                          <span className="text-gray-700 leading-normal font-medium">{c.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Custom comment input */}
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={commentInputs[neighbor.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [neighbor.id]: e.target.value })}
                      placeholder="따뜻한 눈꽃 격려의 말..."
                      className="flex-1 px-3 py-1 text-xs font-black border-3 border-black focus:outline-none focus:ring-3 focus:ring-cyan-300 rounded-lg"
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(neighbor.id); }}
                    />
                    <button 
                      onClick={() => handleAddComment(neighbor.id)} 
                      className="bg-[#ffd875] border-3 border-black px-3 rounded-lg font-black text-xs shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      작성
                    </button>
                  </div>

                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}

