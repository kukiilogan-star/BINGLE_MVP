import { motion } from 'framer-motion';
import refrigeratorBg from '../../shared/assets/refrigerator_interior.png';

const RefrigeratorBackground = ({ children }) => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#C8E6F5'
    }}>
      {/* 냉장고 선반 이미지를 배경으로 설정 */}
      <img 
        src={refrigeratorBg} 
        alt="냉장고 내부" 
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
          zIndex: 0
        }} 
      />
      
      {/* 캐릭터들이 배치될 영역 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10
      }}>
        {children}
      </div>
    </div>
  );
};

export default RefrigeratorBackground;
