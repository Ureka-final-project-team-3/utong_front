import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/icon/logo.svg';

const StartPage = () => {
  const [showChart, setShowChart] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    const chartTimer = setTimeout(() => setShowChart(true), 100);
    const logoTimer = setTimeout(() => {
      setShowLogo(true);

      // 로고 등장 후 2초 뒤 login 페이지로 이동
      setTimeout(() => {
        navigate('/login');
      }, 6000);
    }, 1500);

    return () => {
      clearTimeout(chartTimer);
      clearTimeout(logoTimer);
    };
  }, [navigate]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const offsetX = (e.clientX / innerWidth - 0.5) * 60;
      const offsetY = (e.clientY / innerHeight - 0.5) * 30;
      setMousePos({ x: offsetX, y: offsetY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const candleData = [
    [100, 180, 90, 130],
    [130, 160, 100, 120],
    [120, 140, 85, 100],
    [100, 135, 75, 125],
    [125, 170, 110, 140],
    [140, 190, 120, 130],
    [130, 180, 115, 160],
    [160, 195, 150, 155],
    [155, 190, 145, 180],
    [180, 210, 160, 200],
    [200, 230, 190, 210],
    [210, 220, 180, 190],
    [190, 215, 170, 205],
    [205, 225, 180, 195],
    [195, 220, 170, 180],
    [180, 210, 160, 185],
    [130, 180, 115, 160],
    [160, 195, 150, 155],
    [155, 190, 145, 180],
    [180, 210, 160, 200],
    [200, 230, 190, 210],
    [210, 220, 180, 190],
    [190, 215, 170, 205],
    [205, 225, 180, 195],
    [200, 230, 190, 210],
    [210, 220, 180, 190],
    [190, 215, 170, 205],
    [205, 225, 180, 195],
    [195, 230, 190, 215],
    [215, 240, 200, 225],
    [225, 250, 210, 235],
    [235, 260, 220, 245],
    [245, 270, 230, 255],
    [255, 280, 240, 265],
    [265, 290, 250, 275],
    [275, 300, 260, 285],
    [285, 310, 270, 295],
    [295, 320, 280, 305],
  ];

  const candleData2 = [
    [300, 340, 280, 320],
    [320, 350, 300, 310],
    [310, 345, 290, 305],
    [305, 335, 285, 300],
    [300, 320, 270, 290],
    [290, 310, 260, 280],
    [280, 300, 250, 270],
    [270, 290, 240, 260],
    [260, 280, 230, 250],
    [250, 270, 220, 240],
    [240, 265, 210, 255],
    [255, 280, 230, 270],
    [270, 295, 250, 275],
    [275, 300, 260, 290],
    [290, 320, 270, 310],
    [310, 335, 280, 325],
    [325, 350, 300, 330],
    [330, 360, 310, 340],
    [335, 370, 320, 350],
    [345, 380, 330, 360],
    [360, 390, 340, 370],
    [365, 395, 350, 380],
    [360, 390, 340, 360],
    [350, 375, 330, 350],
    [340, 360, 320, 330],
    [330, 355, 310, 320],
    [320, 345, 300, 310],
    [310, 335, 290, 300],
    [305, 325, 280, 295],
    [295, 315, 270, 285],
    [285, 305, 260, 275],
    [275, 295, 250, 265],
    [265, 285, 240, 255],
    [255, 275, 230, 245],
    [245, 265, 220, 235],
  ];

  return (
    <div className="relative flex items-center justify-center h-screen bg-white overflow-hidden">
      {/* 배경 SVG */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          transform: `scale(1.5) translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
          transformOrigin: 'center center',
        }}
      >
        {showChart && (
          <svg width="1920" height="300" viewBox="0 0 1920 300" className="overflow-visible">
            <defs>
              <pattern id="grid" width="60" height="30" patternUnits="userSpaceOnUse">
                <path
                  d="M 60 0 L 0 0 0 30"
                  fill="none"
                  stroke="rgba(200, 200, 200, 0.2)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="1920" height="300" fill="url(#grid)" opacity="0.5" />
            {candleData.map(([open, high, low, close], i) => {
              const x = i * 40 + 100;
              const candleWidth = 12;
              const color = close > open ? '#3B82F6' : '#EF4444';
              const top = Math.min(open, close);
              const bottom = Math.max(open, close);

              return (
                <g
                  key={`main-${i}`}
                  style={{
                    animation: `candle-grow 0.5s ease-out forwards`,
                    animationDelay: `${i * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  <line x1={x} x2={x} y1={0 - high} y2={0 - low} stroke={color} strokeWidth="1" />
                  <rect
                    x={x - candleWidth / 2}
                    y={0 - bottom}
                    width={candleWidth}
                    height={Math.max(1, bottom - top)}
                    fill={color}
                  />
                </g>
              );
            })}
            {candleData2.map(([open, high, low, close], i) => {
              const x = i * 60 + 100;
              const candleWidth = 12;
              const color = close > open ? '#3B82F6' : '#EF4444';
              const top = Math.min(open, close);
              const bottom = Math.max(open, close);

              return (
                <g
                  key={`lower-${i}`}
                  style={{
                    animation: `candle-grow 0.7s ease-out forwards`,
                    animationDelay: `${i * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  <line
                    x1={x}
                    x2={x}
                    y1={400 - high}
                    y2={400 - low}
                    stroke={color}
                    strokeWidth="1"
                  />
                  <rect
                    x={x - candleWidth / 2}
                    y={400 - bottom}
                    width={candleWidth}
                    height={Math.max(1, bottom - top)}
                    fill={color}
                  />
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* 블러 오버레이 */}
      <div
        className={`absolute inset-0 z-10 pointer-events-none transition-all duration-700 ${
          showLogo ? 'bg-white/10 backdrop-blur-[5px] opacity-100' : 'opacity-0'
        }`}
      />

      {/* 로고 영역 */}
      {showLogo && (
        <div className="flex flex-col items-center z-20 animate-fade-up">
          <img src={logo} alt="유통 로고" className="w-32 h-32" />
          <p className="text-[25px] text-gray-500 font-bold">너로 통하다</p>
        </div>
      )}

      {/* 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes fade-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes candle-grow {
          0% {
            opacity: 0;
            transform: scaleY(0.3) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scaleY(1) translateY(0);
          }
        }

        .animate-fade-up {
          animation: fade-up 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StartPage;
