import { create } from 'zustand';

const DEFAULT_POSTS = [
  {
    id: 'post_1',
    author: '꽁꽁이_키퍼',
    level: 3,
    state: 'happy',
    temp: 12,
    steps: 6420,
    caption: '오늘 퇴근길에 6천걸음 채웠더니 빙글이 기분 짱좋음! 🧊 모두 빙글빙글한 하루 되세요!',
    likes: 42,
    hasLiked: false,
    comments: [
      { author: '얼음공주', text: '와 벌써 6천걸음이라니 대단해요! 👍' },
      { author: '녹아내리는중', text: '우리 빙글이는 지금 땀흘리고 있어요 부럽네요..' }
    ],
    timestamp: '15분 전'
  },
  {
    id: 'post_2',
    author: '스트레스만렙',
    level: 2,
    state: 'hot',
    temp: 85,
    steps: 1200,
    caption: '오늘 야근 확정.. 빙글이 머리에서 김이 솔솔 나고 있네요 🔥 얼른 심호흡으로 달래주는 중 🥵',
    likes: 12,
    hasLiked: false,
    comments: [
      { author: '산책마스터', text: '호흡 10번 하구 물 한잔 마시구 힘내요!! 💧' }
    ],
    timestamp: '1시간 전'
  },
  {
    id: 'post_3',
    author: '꿀잠러',
    level: 5,
    state: 'sleeping',
    temp: 8,
    steps: 4300,
    caption: '따뜻한 이불 속에서 빙글이랑 같이 꿀잠 잡니다. 잘자요 모두 🌙 Zzz..',
    likes: 29,
    hasLiked: false,
    comments: [],
    timestamp: '3시간 전'
  }
];

export const useGameStore = create((set) => ({
  charName: 'Bingle',
  userLevel: 1,
  burnoutLevel: 3, // 1 to 5
  defrostProgress: 20,
  fish: 100,
  paw: 50,
  mindTemperature: 25, // 0 to 100
  steps: 0,
  characterState: 'happy', // happy, angry, sleeping, hot
  fridgeMode: 'smart', // smart, freeze, defrost
  icestagramPosts: DEFAULT_POSTS,

  setLevel: (lvl) => set({ userLevel: lvl }),
  setBurnout: (lvl) => set({ burnoutLevel: lvl }),
  addCurrency: (type, amt) => set((state) => ({ [type]: state[type] + amt })),
  setMindTemperature: (temp) => set({ mindTemperature: Math.max(0, Math.min(100, temp)) }),
  setSteps: (steps) => set({ steps: steps }),
  setCharacterState: (state) => set({ characterState: state }),
  setFridgeMode: (mode) => set({ fridgeMode: mode }),
  
  // Ice-stagram actions
  likeIcestagramPost: (postId) => set((state) => ({
    icestagramPosts: state.icestagramPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !post.hasLiked
        };
      }
      return post;
    })
  })),

  addIcestagramComment: (postId, author, text) => set((state) => ({
    icestagramPosts: state.icestagramPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { author, text }]
        };
      }
      return post;
    })
  })),

  addIcestagramPost: (post) => set((state) => ({
    icestagramPosts: [post, ...state.icestagramPosts]
  })),

  completeOnboarding: () => set({ userLevel: 1 }),
}));

