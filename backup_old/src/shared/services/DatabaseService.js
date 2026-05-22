/**
 * DatabaseService.js
 * Manages game state persistence using LocalStorage (simulating a real DB like Supabase/Firebase).
 */

const DB_KEY = 'BINGLE_GAME_DATA';

export const saveGameState = (state) => {
  try {
    const dataToSave = {
      userEXP: state.userEXP,
      userLevel: state.userLevel,
      fish: state.fish,
      paw: state.paw,
      charName: state.charName,
      burnoutLevel: state.burnoutLevel,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(DB_KEY, JSON.stringify(dataToSave));
    console.log('Game state saved to local DB.');
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

export const loadGameState = () => {
  try {
    const savedData = localStorage.getItem(DB_KEY);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};
