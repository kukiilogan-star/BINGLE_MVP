import { create } from 'zustand';
import { fetchWeather } from '../services/WeatherService';
import { saveGameState, loadGameState } from '../services/DatabaseService';

export const LEVEL_THRESHOLDS = [
  { level: 1, exp: 0,    name: '성에',           emoji: '🌫️', color: '#E0F7FA', reward: null },
  { level: 2, exp: 101,  name: '작은 얼음 조각', emoji: '✨', color: '#B2EBF2', reward: '기본 장식 해금!' },
  { level: 3, exp: 301,  name: '얼음 요정',      emoji: '🧊', color: '#81D4FA', reward: '투명도가 개선되었습니다' },
  { level: 4, exp: 601,  name: '성숙한 요정',    emoji: '❄️', color: '#4FC3F7', reward: 'Nudge 대사 풀이 확장됩니다' },
  { level: 5, exp: 1001, name: '수호 얼음령',    emoji: '💎', color: '#29B6F6', reward: '다이오라마 공간이 확장됩니다' },
  { level: 6, exp: 1501, name: '영겁의 결정',    emoji: '🌌', color: '#039BE5', reward: '신비로운 한기가 느껴집니다' },
];

function getLevelInfo(exp) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (exp >= LEVEL_THRESHOLDS[i].exp) return LEVEL_THRESHOLDS[i];
  }
  return LEVEL_THRESHOLDS[0];
}

function getNextThreshold(level) {
  const next = LEVEL_THRESHOLDS.find(t => t.level === level + 1);
  return next ? next.exp : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].exp;
}

export const useGameStore = create((set, get) => ({
  // User
  userEXP: 0,
  userLevel: 1,
  fish: 1250,
  paw: 3450,
  charName: '성에',
  personality: null,
  storyCompleted: false,
  burnoutLevel: 3,
  temperature: 20,
  weatherCondition: 'Clear',
  programWeek: 1, // 1-8 weeks
  programStage: 'Recognize', // Recognize, Relieve, Activate, Internalize
  is3D: false, // 2D/3D View mode toggle

  setViewMode: (mode) => set({ is3D: mode === '3d' }),

  // Evolution modal
  showEvolutionModal: false,
  newLevelInfo: null,

  // Quests
  quests: [
    { id: 'water',      icon: '💧', name: '물 마시기',   progress: 0, target: 3, exp: 30,  auto: false, unit: '잔', category: 'Side' },
    { id: 'mood',       icon: '📝', name: '1분 감정 일기', progress: 0, target: 1, exp: 50,  auto: false, unit: '회', category: 'Core' },
    { id: 'walk_short', icon: '👟', name: '5분 걷기',     progress: 0, target: 1, exp: 40,  auto: true,  unit: '회', category: 'Side' },
    { id: 'contact',    icon: '📱', name: '지인 연락하기', progress: 0, target: 1, exp: 50,  auto: false, unit: '회', category: 'Side' },
    { id: 'breathing',  icon: '🌬️', name: '박스 호흡법',   progress: 0, target: 1, exp: 40,  auto: false, unit: '회', category: 'Core' },
  ],

  // Actions
  addEXP: (amount) => {
    const { userEXP, userLevel } = get();
    const newEXP = userEXP + amount;
    const newLevelInfo = getLevelInfo(newEXP);

    if (newLevelInfo.level > userLevel) {
      set({
        userEXP: newEXP,
        userLevel: newLevelInfo.level,
        showEvolutionModal: true,
        newLevelInfo,
      });
    } else {
      set({ userEXP: newEXP, userLevel: newLevelInfo.level });
    }
  },

  addCurrency: (type, amount) => {
    if (type === 'fish') set(s => ({ fish: s.fish + amount }));
    if (type === 'paw')  set(s => ({ paw:  s.paw  + amount }));
  },

  tapQuest: (questId) => {
    const { quests, addEXP, addCurrency } = get();
    let expGained = 0;
    let fishGained = 0;

    const updated = quests.map(q => {
      if (q.id !== questId || q.auto) return q;
      const wasComplete = q.progress >= q.target;
      if (wasComplete) return q;
      const newProgress = Math.min(q.progress + 1, q.target);
      const nowComplete = newProgress >= q.target;
      if (nowComplete) { expGained = q.exp; fishGained = q.exp * 2; }
      else { expGained = 5; fishGained = 10; }
      return { ...q, progress: newProgress };
    });

    set({ quests: updated });
    if (expGained) { addEXP(expGained); addCurrency('fish', fishGained); }
  },

  closeEvolutionModal: () => set({ showEvolutionModal: false, newLevelInfo: null }),

  completeStory: (personality, charName) =>
    set({ storyCompleted: true, personality, charName: charName || '성에' }),

  setBurnoutLevel: (level) => {
    set({ burnoutLevel: level });
    saveGameState(get());
  },

  // Async Actions
  updateWeather: async (city) => {
    const data = await fetchWeather(city);
    set({ 
      temperature: data.temp, 
      weatherCondition: data.condition,
      // Logic: High temperature increases melting (burnoutLevel visually)
      burnoutLevel: data.temp > 25 ? Math.min(get().burnoutLevel + 1, 4) : get().burnoutLevel
    });
  },

  initGame: () => {
    const saved = loadGameState();
    if (saved) {
      set({ ...saved });
    }
  },

  // Helper selectors (call directly on state)
  getExpProgress: () => {
    const { userEXP, userLevel } = get();
    const current = LEVEL_THRESHOLDS.find(t => t.level === userLevel);
    const next = LEVEL_THRESHOLDS.find(t => t.level === userLevel + 1);
    if (!next) return 100;
    const range = next.exp - current.exp;
    const progress = userEXP - current.exp;
    return Math.min(100, Math.round((progress / range) * 100));
  },
}));
