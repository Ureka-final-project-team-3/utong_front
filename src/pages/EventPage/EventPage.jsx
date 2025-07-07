// EventPage.jsx
import React from 'react';
import EventHeader from './components/EventHeader';
import RouletteMessage from './components/RouletteMessage';
import RouletteWheel from './components/RouletteWheel';
import StartButton from './components/StartButton';
import BackButton from '../../components/BackButton/BackButton';

const EventPage = () => {
  return (
    <div className="relative w-full h-full">
      <BackButton />
      <div className="relative">
        <EventHeader />
        <RouletteMessage />
        <RouletteWheel />
        <StartButton />
      </div>
    </div>
  );
};

export default EventPage;
