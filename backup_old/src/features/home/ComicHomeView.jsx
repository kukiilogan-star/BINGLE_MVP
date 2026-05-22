import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../shared/store/useGameStore';
import { Cloud, Sun, Thermometer, MapPin, MessageCircle } from 'lucide-react';

const ComicHomeView = () => {
  const { 
    charName, 
    userLevel, 
    fish, 
    paw, 
    temperature, 
    weatherCondition, 
    burnoutLevel,
    updateWeather,
    initGame 
  } = useGameStore();

  useEffect(() => {
    initGame();
    updateWeather('Seoul');
  }, []);

  // Character state based on burnout (melting)
  const getCharacterExpression = () => {
    if (burnoutLevel >= 4) return '🥵 어우... 좀 덥네... 나 좀 녹고 있나?';
    if (burnoutLevel === 3) return '음~ 딱 기분 좋은 한기야! ✨';
    return '헤헤, 기분 최고! 같이 놀자! 🧊';
  };

  return (
    <div className="comic-container" style={{
      width: '100vw',
      height: '100vh',
      backgroundImage: 'url("/comic_room.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Gaegu', cursive, sans-serif"
    }}>
      {/* Warm Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(rgba(255, 180, 0, 0.1), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Game UI - Top Bar */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100
      }}>
        {/* User Info (Hand-drawn style card) */}
        <div style={{
          background: 'white',
          border: '3px solid #3E3127',
          borderRadius: '20px',
          padding: '8px 16px',
          boxShadow: '4px 4px 0px #3E3127'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3E3127' }}>
            Lv.{userLevel} {charName}
          </div>
        </div>

        {/* Real-time Environment (Game Widget) */}
        <div style={{
          display: 'flex',
          gap: '10px'
        }}>
          <div style={{
            background: '#E0F7FA',
            border: '2px solid #3E3127',
            borderRadius: '15px',
            padding: '5px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: '#3E3127',
            fontSize: '14px'
          }}>
            <Thermometer size={16} /> {temperature}°C
          </div>
          <div style={{
            background: '#FFF9C4',
            border: '2px solid #3E3127',
            borderRadius: '15px',
            padding: '5px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: '#3E3127',
            fontSize: '14px'
          }}>
            <MapPin size={16} /> Seoul
          </div>
        </div>
      </div>

      {/* Central Character Area */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Dialogue Bubble (Comic Style) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          style={{
            background: 'white',
            border: '3px solid #3E3127',
            borderRadius: '30px',
            padding: '15px 25px',
            position: 'relative',
            marginBottom: '30px',
            maxWidth: '280px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ fontSize: '18px', color: '#3E3127', textAlign: 'center' }}>
            {getCharacterExpression()}
          </div>
          {/* Bubble Tail */}
          <div style={{
            position: 'absolute',
            bottom: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderTop: '15px solid #3E3127'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: '12px solid white'
          }} />
        </motion.div>

        {/* Character Image */}
        <motion.img 
          src="/bingle_character.png"
          alt="Bingle"
          animate={{
            y: [0, -10, 0],
            rotate: burnoutLevel >= 4 ? [0, 2, -2, 0] : 0
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: '240px',
            height: 'auto',
            filter: burnoutLevel >= 4 ? 'sepia(0.2) saturate(1.5) hue-rotate(-20deg)' : 'none'
          }}
        />
      </div>

      {/* Currency & Inventory (Bottom Game UI) */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '15px'
      }}>
        <div style={{
          background: 'white',
          border: '3px solid #3E3127',
          borderRadius: '25px',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '4px 4px 0px #3E3127'
        }}>
          <span style={{ fontSize: '20px' }}>🐟</span>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{fish.toLocaleString()}</span>
        </div>
        <div style={{
          background: 'white',
          border: '3px solid #3E3127',
          borderRadius: '25px',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '4px 4px 0px #3E3127'
        }}>
          <span style={{ fontSize: '20px' }}>🍪</span>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{paw.toLocaleString()}</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&display=swap');
      ` }} />
    </div>
  );
};

export default ComicHomeView;
