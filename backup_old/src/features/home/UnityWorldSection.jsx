import React from 'react';
import UnityContainer from '../../shared/ui/UnityContainer';

const UnityWorldSection = () => {
  return (
    <div style={{ 
      position: 'relative', 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      padding: '0 18px 20px',
      minHeight: '400px'
    }}>
      <div style={{ 
        flex: 1, 
        borderRadius: '32px', 
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        border: '3px solid #2c3e50',
        position: 'relative',
        background: '#e0f7fa'
      }}>
        <UnityContainer />
      </div>
      
      {/* Unity UI Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '40px',
        right: '40px',
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '12px 24px',
          borderRadius: '20px',
          border: '2px solid #2c3e50',
          boxShadow: '0 4px 0 #2c3e50',
          pointerEvents: 'auto'
        }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#2c3e50' }}>
            🧊 얼음 요정 다이오라마 활성화됨
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnityWorldSection;
