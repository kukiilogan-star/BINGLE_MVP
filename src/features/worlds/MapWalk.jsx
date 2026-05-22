import { useState, useEffect, useRef } from 'react';
import BingleCharacter from '../../shared/ui/BingleCharacter.jsx';

export default function MapWalk({ gameState, updateGameState, gainXP, showToast }) {
  const selectedTheme = gameState?.fridgeTheme || 'mint';
  const steps = gameState?.steps || 0;
  const currentTemp = gameState?.mindTemperature ?? 25;
  const inventory = gameState?.fridgeInventory || [];

  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibProgress, setCalibProgress] = useState(0);
  const [calibText, setCalibText] = useState('');
  const [isWalking, setIsWalking] = useState(false);
  const [localSteps, setLocalSteps] = useState(steps);
  const [checkpointsUnlocked, setCheckpointsUnlocked] = useState({
    cp1: steps >= 500,
    cp2: steps >= 1200
  });

  const canvasRef = useRef(null);

  // Redraw the map paths on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, 360, 220);

    // Draw grid lines for halftone/retro tech map feel
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 360; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 220);
      ctx.stroke();
    }
    for (let j = 0; j < 220; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(360, j);
      ctx.stroke();
    }

    // Draw hand-drawn trail lines
    ctx.strokeStyle = '#28180b';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([4, 8]); // Dashed path trail

    // Trail coordinates
    ctx.beginPath();
    ctx.moveTo(30, 180); // Start
    ctx.bezierCurveTo(100, 190, 120, 80, 180, 110); // CP1
    ctx.bezierCurveTo(240, 140, 260, 40, 330, 50); // CP2
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Draw starting point
    ctx.fillStyle = '#ff8c69';
    ctx.strokeStyle = '#28180b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(30, 180, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#28180b';
    ctx.font = 'bold 11px Gaegu';
    ctx.fillText('출발지 🏡', 15, 200);

    // Checkpoint 1 (500 steps)
    const cp1X = 180;
    const cp1Y = 110;
    ctx.fillStyle = checkpointsUnlocked.cp1 ? '#67f9e1' : '#ccc';
    ctx.beginPath();
    ctx.arc(cp1X, cp1Y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#28180b';
    ctx.fillText('산들바람 고개 (500보) 💧', cp1X - 60, cp1Y - 16);

    // Checkpoint 2 (1200 steps)
    const cp2X = 330;
    const cp2Y = 50;
    ctx.fillStyle = checkpointsUnlocked.cp2 ? '#fdb64b' : '#ccc';
    ctx.beginPath();
    ctx.arc(cp2X, cp2Y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#28180b';
    ctx.fillText('빙하 정상 (1200보) 🍊', cp2X - 100, cp2Y - 16);

    // Draw active Bingle indicator on map path based on steps percent
    const percent = Math.min(1, steps / 1500);
    // Rough coordinates extrapolation
    let bingleX = 30 + (330 - 30) * percent;
    let bingleY = 180 + (50 - 180) * percent;
    
    // Add small bobbing offset
    const bob = isWalking ? Math.sin(Date.now() / 150) * 4 : 0;

    // Draw indicator dot
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(bingleX, bingleY + bob, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#fff';
    ctx.font = '9px monospace';
    ctx.fillText('🏃', bingleX - 5, bingleY + bob + 3);

  }, [steps, checkpointsUnlocked, isWalking]);

  // Simulate GPS & Gyro calibration
  const handleCalibrate = () => {
    if (isCalibrating) return;
    setIsCalibrating(true);
    setCalibProgress(10);
    setCalibText('📡 스마트폰 GPS 위성 궤도 정렬 중...');

    const interval = setInterval(() => {
      setCalibProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsCalibrating(false);
            showToast('✅ 모바일 하드웨어 센서 및 GPS 정밀 보정이 완료되었습니다!');
          }, 500);
          return 100;
        }
        const next = prev + 15;
        if (next === 40) setCalibText('⚙️ 3축 자이로센서 중력 공명 보정 진행...');
        if (next === 70) setCalibText('🧭 지자기 나침반 지구 자기장 보존 매핑...');
        if (next === 90) setCalibText('🔓 암호화 피드백 게이트 개방...');
        return next;
      });
    }, 400);
  };

  // Simulate Steps
  const handleSimulateSteps = () => {
    setIsWalking(true);
    const stepIncrement = Math.floor(Math.random() * 150) + 120; // 120~270 steps
    const newSteps = steps + stepIncrement;
    
    // Cooling effect: Walking cools temperature closer to 12C!
    const coolAmt = Math.max(12, currentTemp - 8);

    setTimeout(() => {
      setIsWalking(false);

      // Checkpoint Unlocking Logic
      let updatedInv = [...inventory];
      let cp1Now = checkpointsUnlocked.cp1;
      let cp2Now = checkpointsUnlocked.cp2;

      if (newSteps >= 500 && !checkpointsUnlocked.cp1) {
        cp1Now = true;
        // Grant Carbonated Water
        const idx = updatedInv.findIndex(i => i.id === 'water');
        if (idx !== -1) {
          updatedInv[idx] = { ...updatedInv[idx], count: updatedInv[idx].count + 1 };
        } else {
          updatedInv.push({ id: 'water', name: '신선한 탄산수', desc: '온도 -15°C 급속 냉각', count: 1, icon: '💧', color: '#bae6fd', type: 'cool', effect: -15 });
        }
        showToast('🎉 [500보 돌파!] 산들바람 고개에서 [신선한 탄산수 💧] 1개를 수확해 식재료 창고에 넣었습니다!');
        gainXP(25);
      }

      if (newSteps >= 1200 && !checkpointsUnlocked.cp2) {
        cp2Now = true;
        // Grant Orange
        const idx = updatedInv.findIndex(i => i.id === 'orange');
        if (idx !== -1) {
          updatedInv[idx] = { ...updatedInv[idx], count: updatedInv[idx].count + 1 };
        } else {
          updatedInv.push({ id: 'orange', name: '도전 오렌지', desc: '의욕 UP! 경험치 +30', count: 1, icon: '🍊', color: '#ffedd5', type: 'xp', effect: 30 });
        }
        showToast('🎉 [1200보 돌파!] 빙합 정상 도달! [도전 오렌지 🍊] 1개를 수확해 식재료 창고에 넣었습니다!');
        gainXP(35);
      }

      setCheckpointsUnlocked({ cp1: cp1Now, cp2: cp2Now });
      
      updateGameState({
        steps: newSteps,
        mindTemperature: coolAmt,
        fridgeInventory: updatedInv,
        logs: [
          {
            date: new Date().toISOString(),
            type: 'walk',
            text: `🏃 실시간 산책: 센서 연동 걸음 ${stepIncrement}보 추가! (총 ${newSteps}보) 냉각수 냉기 공급. (XP +15)`
          },
          ...(gameState?.logs || [])
        ]
      });

      gainXP(15);
    }, 800);
  };

  return (
    <div className={`fridge-bg fridge-bg-${selectedTheme} ${['black', 'wood'].includes(selectedTheme) ? 'text-white' : 'text-[#28180b]'} min-h-full flex flex-col items-center overflow-x-hidden relative font-['Gaegu'] select-none`}>
      <div className="halftone-bg" />

      <main className="w-full max-w-md pt-4 pb-28 px-4 flex flex-col gap-6 min-h-full relative z-10">
        
        {/* Step panel info */}
        <section className="comic-panel bg-white p-4 border-4 border-black shadow-[4px_4px_0_0_#000] relative">
          <div className="absolute -top-3.5 -left-3 bg-[#ff8c69] border-4 border-black px-3 py-1 font-black text-white transform -rotate-2 z-10 shadow-[3px_3px_0_0_#000]">
            자이로 & GPS 센서 연동 📡
          </div>
          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-sm font-bold text-gray-500">오늘의 누적 걷기 활동</p>
              <h3 className="text-3xl font-black text-black mt-0.5">{steps.toLocaleString()}보</h3>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-500">체온 조절 마찰 온기</p>
              <span className="text-xl font-black text-cyan-600">-{Math.round(steps * 0.02)}°C 냉각 효과</span>
            </div>
          </div>
        </section>

        {/* Dynamic Canvas Map Visualizer */}
        <section className="comic-panel bg-[#e0f2fe] border-4 border-black shadow-[6px_6px_0_0_#000] p-3 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
          <div className="flex justify-between items-center px-1">
            <span className="font-black text-lg text-black">🗺️ 실시간 산책 위치 센서 지도</span>
            {isWalking && (
              <span className="bg-green-500 text-white font-black text-[10px] px-2 py-0.5 rounded animate-pulse">
                센서 감지 중.. 🏃
              </span>
            )}
          </div>
          <canvas 
            ref={canvasRef} 
            width={360} 
            height={220} 
            className="w-full bg-[#f8fafc] border-4 border-black rounded-xl"
          />
        </section>

        {/* Calibration & Active Walk Button */}
        <section className="comic-panel bg-white p-4 border-4 border-black shadow-[4px_4px_0_0_#000] flex flex-col gap-3">
          <h4 className="text-lg font-black border-b-2 border-dashed border-gray-300 pb-1.5">🧭 센서 컨트롤러</h4>
          
          {isCalibrating && (
            <div className="flex flex-col gap-1 my-1">
              <div className="w-full bg-gray-200 border-2 border-black rounded-full h-5 overflow-hidden relative flex items-center justify-center">
                <div className="h-full bg-cyan-400 absolute left-0 top-0 transition-all duration-300" style={{ width: `${calibProgress}%` }} />
                <span className="absolute text-[10px] font-black text-black drop-shadow-[0_1px_0_#fff]">{calibText}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button 
              disabled={isCalibrating || isWalking}
              onClick={handleCalibrate}
              className={`flex-1 border-4 border-black rounded-xl py-3 font-black text-base shadow-[3px_3px_0_0_#000] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 ${
                isCalibrating || isWalking 
                  ? 'bg-gray-100 text-gray-400 border-gray-300 shadow-none' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined font-black">satellite_alt</span>
              <span>센서 정밀 보정</span>
            </button>
            
            <button 
              disabled={isWalking}
              onClick={handleSimulateSteps}
              className={`flex-[2] border-4 border-black rounded-xl py-3 font-black text-lg shadow-[4px_4px_0_0_#000] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-1.5 ${
                isWalking 
                  ? 'bg-gray-100 text-gray-400 border-gray-300 shadow-none animate-pulse' 
                  : 'bg-[#ff8c69] hover:bg-[#ffa07a] text-black'
              }`}
            >
              <span className="material-symbols-outlined font-black">directions_run</span>
              <span>{isWalking ? '자이로 센싱 산책 중...' : '산책 걸음 센서 활성 ⚡'}</span>
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
