import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Matter from 'matter-js';
import RefrigeratorBackground from './RefrigeratorBackground';
import IceCubeCharacter from './IceCubeCharacter';
import TemperatureGauge from './TemperatureGauge';
import CoolingStation from './CoolingStation';

const RefrigeratorPage = () => {
  const navigate  = useNavigate();
  const stageRef  = useRef(null);
  const [temperature, setTemperature] = useState(25); // 온도 0 ~ 100
  const engineRef = useRef(null);

  // 1. Matter.js 엔진 설정 및 마우스 상호작용
  useEffect(() => {
    const engine = Matter.Engine.create();
    engineRef.current = engine;

    // 냉장고 선반을 Static 물리 객체로 배치 (스크린샷 비율 참고)
    const W = 500; // 예상 모바일 화면 너비 기준 (필요시 window.innerWidth 연동)
    const H = 800; // 예상 모바일 화면 높이 기준
    
    const shelf1 = Matter.Bodies.rectangle(W/2, 280, W, 20, { isStatic: true, render: { visible: false } });
    const shelf2 = Matter.Bodies.rectangle(W/2, 500, W, 20, { isStatic: true, render: { visible: false } });
    const shelf3 = Matter.Bodies.rectangle(W/2, 750, W, 20, { isStatic: true, render: { visible: false } });
    const leftWall = Matter.Bodies.rectangle(-10, H/2, 20, H, { isStatic: true, render: { visible: false } });
    const rightWall = Matter.Bodies.rectangle(W+10, H/2, 20, H, { isStatic: true, render: { visible: false } });

    // 마우스 드래그 상호작용 추가
    const mouse = Matter.Mouse.create(document.body);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.1, render: { visible: false } }
    });

    Matter.Composite.add(engine.world, [shelf1, shelf2, shelf3, leftWall, rightWall, mouseConstraint]);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, []);

  // 2. 방치 시 온도 상승 시뮬레이션
  useEffect(() => {
    const timer = setInterval(() => {
      setTemperature(prev => Math.min(prev + 2, 100));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. 사용자 상호작용 시 온도 감소 (시원해짐)
  const coolDown = (amount = 20) => {
    setTemperature(prev => Math.max(prev - amount, 0));
  };

  const textStrokeStyle = {
    color: '#FFF',
    WebkitTextStroke: '1px #333',
    textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
    fontWeight: 900,
    fontFamily: "'Outfit', 'Noto Sans KR', sans-serif"
  };

  return (
    <div className="screen" style={{ backgroundColor: '#000' }}>
      <div ref={stageRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        <RefrigeratorBackground>

          {/* 상단 오버레이 UI (온도 시스템) */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            padding: '24px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            zIndex: 30,
            pointerEvents: 'none',
          }}>
            <h1 style={{ 
              ...textStrokeStyle, 
              fontSize: 24, 
              margin: 0, 
              letterSpacing: '-0.5px' 
            }}>
              냉장고 요정 빙글이들
            </h1>
            
            {/* 🌡 온도 게이지 컴포넌트 */}
            <TemperatureGauge temperature={temperature} />
          </div>

          <div style={{
            position: 'absolute',
            top: 140, left: 20, right: 20,
            zIndex: 35,
          }}>
            <CoolingStation onCoolDown={coolDown} />
          </div>

          {/* 물리 엔진이 적용된 캐릭터 렌더링 */}
          <IceCubeCharacter engine={engineRef.current} type="wave" initialX={120} initialY={100} temperature={temperature} />
          <IceCubeCharacter engine={engineRef.current} type="sit" initialX={300} initialY={300} temperature={temperature} />
          <IceCubeCharacter engine={engineRef.current} type="shy" initialX={180} initialY={550} temperature={temperature} />

        </RefrigeratorBackground>

        {/* 하단 내비게이션 (누르면 온도 쿨다운) */}
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          padding: '0 20px',
          display: 'flex',
          gap: 12,
          zIndex: 40,
        }}>
          {['🍪 간식 주기', '▶️ 놀아 주기', '🛠️ 집 꾸미기'].map((text, idx) => (
            <button key={idx} onClick={coolDown} style={{
              flex: 1,
              background: idx === 1 ? '#E6F4FB' : '#F6F9FC',
              border: '2px solid #333',
              borderRadius: 12,
              padding: '12px 0',
              fontSize: 15,
              fontWeight: 800,
              color: '#111',
              boxShadow: '0 4px 0 #333',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RefrigeratorPage;
