// EventPage.jsx
import React from 'react';
import EventHeader from './components/EventHeader';
import RouletteEventExtras from './components/RouletteEventExtras';
import RouletteWheel from './components/RouletteWheel';
import StartButton from './components/StartButton';

const EventPage = () => {
  return (
    <div className="relative">
      <EventHeader />
      <RouletteEventExtras />
      <RouletteWheel />
      <StartButton />
    </div>
  );
};



export default EventPage;
