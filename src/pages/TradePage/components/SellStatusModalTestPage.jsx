// 📁 SellSuccessModalTestPage.jsx

import React, { useState } from 'react';
import SellSuccessModal from '../SellDataPage/components/SellSuccessModal';
import BuySuccessModal from '../BuyDataPage/components/BuySuccessModal';
import SellPaymentCompleteModal from '../SellDataPage/components/SellPaymentCompleteModal';
import PaymentCompleteModal from '../BuyDataPage/components/PaymentCompleteModal';

const SellSuccessModalTestPage = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="h-screen flex items-center justify-center">
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShow(true)}>
        모달 열기
      </button>

      <PaymentCompleteModal show={show} onClose={() => setShow(false)} />
    </div>
  );
};

export default SellSuccessModalTestPage;
