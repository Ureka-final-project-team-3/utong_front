import React, { useState } from 'react'
import BackButton from '../../../components/BackButton/BackButton'
import help from '@/assets/icon/help.svg';
import EventInfoModal from './EventInfoModal';


const EventHeader = () => {
     const [showModal, setShowModal] = useState(false);
  return (
    <>
    <div className="w-full   flex items-center justify-between">
      <BackButton />

      <h1 className="text-[length:var(--text-lg)] text-[color:var(--gray-800)] font-bold">
        룰렛 이벤트
      </h1>

      <img
                src={help}
                alt="도움말"
                draggable={false}
                className="cursor-pointer"
                onClick={() => setShowModal(true)}
              />
    </div>
     {showModal && <EventInfoModal onClose={() => setShowModal(false)} color="blue" />}
    </>
  )
}

export default EventHeader;