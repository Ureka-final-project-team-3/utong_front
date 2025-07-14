import React, { useState } from 'react';
import BackButton from '../../../../components/BackButton/BackButton';
import help from '@/assets/icon/help.svg';
import ModalInfo from '../../components/ModalInfo';

const BuyDataHeader = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <BackButton />

        <h1 className="text-[length:var(--text-lg)] text-[color:var(--blue)] font-bold">
          구매하기
        </h1>

        <img
          src={help}
          alt="도움말"
          draggable={false}
          className="cursor-pointer"
          onClick={() => setShowModal(true)}
        />
      </div>

      {showModal && <ModalInfo onClose={() => setShowModal(false)} color="blue" />}
    </>
  );
};

export default BuyDataHeader;
