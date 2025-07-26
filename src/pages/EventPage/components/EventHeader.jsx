import React, { useState } from 'react';
import BackButton from '../../../components/BackButton/BackButton';

// import help from '@/assets/icon/help.svg';
// import EventInfoModal from './EventInfoModal';

const EventHeader = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="w-full relative flex items-center justify-between h-[50px]">
        <div className="absolute left-0">
          <BackButton />
        </div>

        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[length:var(--text-lg)] text-[color:var(--gray-800)] font-bold">
          룰렛 이벤트
        </h1>

        <div className="absolute right-0 flex items-center">
          {/* <img
            src={help}
            alt="도움말"
            draggable={false}
            className="cursor-pointer"
            onClick={() => setShowModal(true)}
          /> */}
          <div className="w-[20px]"></div>
        </div>
      </div>

      {/* {showModal && <EventInfoModal onClose={() => setShowModal(false)} color="blue" />} */}
    </>
  );
};

export default EventHeader;
