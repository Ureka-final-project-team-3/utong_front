// 📁 SellSuccessModalTestPage.jsx

import React, { useState } from 'react';
import SellSuccessModal from '../SellDataPage/components/SellSuccessModal';

const statusCodes = [200, 400];
const statusKeysByCode = {
  200: ['ALL_COMPLETE', 'PART_COMPLETE', 'WAITING'],
  400: ['BORDERLESS', 'NEED_DEFAULT_LINE', 'EXCEED_SALE_LIMIT', 'EXIST_BUY_REQUEST', 'UNIT_ERROR'],
};

const SellSuccessModalTestPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [statusCode, setStatusCode] = useState(200);
  const [statusKey, setStatusKey] = useState('ALL_COMPLETE');

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">🧪 SellSuccessModal 테스트</h1>

      <div className="space-y-4">
        <div>
          <label>✅ Status Code:</label>
          <select
            className="border ml-2 p-1"
            value={statusCode}
            onChange={(e) => {
              const code = parseInt(e.target.value);
              setStatusCode(code);
              setStatusKey(statusKeysByCode[code][0]);
            }}
          >
            <option value={200}>200 (성공)</option>
            <option value={400}>400 (에러)</option>
          </select>
        </div>

        <div>
          <label>📌 Status Key:</label>
          <select
            className="border ml-2 p-1"
            value={statusKey}
            onChange={(e) => setStatusKey(e.target.value)}
          >
            {statusKeysByCode[statusCode].map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setShowModal(true)}
        >
          모달 보기
        </button>
      </div>

      <SellSuccessModal
        show={showModal}
        statusKey={statusKey}
        statusCode={statusCode}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default SellSuccessModalTestPage;
