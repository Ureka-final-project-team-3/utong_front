// EventPage.jsx
import React from 'react';
import EventHeader from './components/EventHeader';
import RouletteMessage from './components/RouletteMessage';
import RouletteWheel from './components/RouletteWheel';
import StartButton from './components/StartButton';

const EventPage = () => {
  return (
    <div className="relative w-full h-full">
      {/* 🎨 배경 레이어 (전체 화면을 덮음) */}
      

      {/* 실제 콘텐츠 (z-index 높임) */}
      <div className="relative z-10">
        <EventHeader />
        <RouletteMessage />
        <RouletteWheel />
        <StartButton />
      </div>
    </div>
  );
};

export default EventPage;
