import React, { useState, useEffect } from 'react';

const statusMap = {
  '001': '완료',
  '002': '부분판매',
  '003': '대기중',
  '004': '취소',
};

const statusClassMap = {
  '001': 'bg-green-600 text-white',
  '002': 'bg-yellow-400 text-black',
  '003': 'bg-gray-500 text-white',
  '004': 'bg-red-600 text-white',
};

const quantityClassMap = {
  complete: 'text-green-600 font-bold',
  partial: 'text-yellow-500 font-bold',
  waiting: 'text-gray-500 font-bold',
};

const dataTypeMap = {
  '001': 'LTE',
  '002': '5G',
};

const itemsPerPage = 20;

export default function DataTradeHistory() {
  const [token, setToken] = useState('');
  const [endpoint, setEndpoint] = useState('sale');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentData, setCurrentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedRows, setExpandedRows] = useState({}); // {rowId: true}

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    setFromDate(lastWeek.toISOString().split('T')[0]);
    setToDate(today.toISOString().split('T')[0]);
  }, []);

  async function fetchHistory() {
    if (!token.trim()) {
      alert('JWT 토큰을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setCurrentData([]);
    setCurrentPage(1);
    setExpandedRows({});

    try {
      const url = new URL(`/api/data/${endpoint}`, import.meta.env.VITE_API_BASE_URL);

      if (fromDate) url.searchParams.append('fromDate', fromDate);
      if (toDate) url.searchParams.append('toDate', toDate);

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.trim()}`,
        },
      });

      const data = await res.json();

      if (data.resultCode === 200) {
        setCurrentData(data.data);
      } else {
        setError(`오류: ${data.message}`);
      }
    } catch (err) {
      setError(`❌ 요청 실패: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function displayStats(data) {
    const totalTransactions = data.length;
    const totalAmount = data.reduce((sum, item) => sum + item.totalPay, 0);
    const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
    const avgPrice = totalQuantity > 0 ? Math.round(totalAmount / totalQuantity) : 0;

    return (
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[150px] bg-blue-100 rounded-xl p-5 text-center text-blue-800 shadow-md">
          <div className="text-2xl font-extrabold mb-1">{totalTransactions.toLocaleString()}</div>
          <div className="font-semibold">총 거래 건수</div>
        </div>
        <div className="flex-1 min-w-[150px] bg-blue-100 rounded-xl p-5 text-center text-blue-800 shadow-md">
          <div className="text-2xl font-extrabold mb-1">{totalAmount.toLocaleString()}원</div>
          <div className="font-semibold">총 거래 금액</div>
        </div>
        <div className="flex-1 min-w-[150px] bg-blue-100 rounded-xl p-5 text-center text-blue-800 shadow-md">
          <div className="text-2xl font-extrabold mb-1">{totalQuantity.toLocaleString()}GB</div>
          <div className="font-semibold">총 거래 용량</div>
        </div>
        <div className="flex-1 min-w-[150px] bg-blue-100 rounded-xl p-5 text-center text-blue-800 shadow-md">
          <div className="text-2xl font-extrabold mb-1">{avgPrice.toLocaleString()}원</div>
          <div className="font-semibold">평균 GB당 가격</div>
        </div>
      </div>
    );
  }

  function getStatusText(status) {
    return statusMap[status] || status;
  }

  function getStatusClass(status) {
    return statusClassMap[status] || 'bg-green-600 text-white';
  }

  function getDataTypeText(dataCode) {
    return dataTypeMap[dataCode] || dataCode;
  }

  function toggleContract(rowId) {
    setExpandedRows((prev) => {
      const newState = { ...prev };
      if (newState[rowId]) {
        delete newState[rowId];
      } else {
        newState[rowId] = true;
      }
      return newState;
    });
  }

  function displayHistory(data) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = data.slice(startIndex, endIndex);

    if (pageData.length === 0) {
      return (
        <tr>
          <td colSpan="8" className="text-center text-gray-500 py-6 font-semibold">
            조회된 거래 내역이 없습니다.
          </td>
        </tr>
      );
    }

    return pageData.map((item, index) => {
      const dateStr = item.tradeDate || item.requestDate || '';
      const tradeDate = new Date(dateStr);
      const status = getStatusText(item.status);
      const statusClass = getStatusClass(item.status);
      const dataType = getDataTypeText(item.dataCode);
      const rowId = `row-${startIndex + index}`;

      const requestedQuantity = item.quantity;
      const contractedQuantity = item.contractDto.reduce(
        (sum, contract) => sum + contract.contractQuantity,
        0
      );
      const remainingQuantity = item.remaining;

      let quantityDisplay = '';
      let quantityClass = '';

      if (contractedQuantity === requestedQuantity) {
        quantityDisplay = `${requestedQuantity}GB (완료)`;
        quantityClass = quantityClassMap.complete;
      } else if (contractedQuantity > 0) {
        quantityDisplay = `${contractedQuantity}/${requestedQuantity}GB`;
        quantityClass = quantityClassMap.partial;
      } else {
        quantityDisplay = `0/${requestedQuantity}GB (대기)`;
        quantityClass = quantityClassMap.waiting;
      }

      const contractCount = item.contractDto.length;
      const contractSummary =
        contractCount > 0 ? `${contractCount}건의 체결 내역` : '체결 내역 없음';

      return (
        <React.Fragment key={rowId}>
          <tr className="cursor-pointer hover:bg-blue-50" onClick={() => toggleContract(rowId)}>
            <td className="whitespace-nowrap px-3 py-2 text-sm">{tradeDate.toLocaleString()}</td>
            <td className="px-3 py-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}
              >
                {status}
              </span>
            </td>
            <td className="whitespace-nowrap px-3 py-2 text-sm">{dataType}</td>
            <td className="text-center px-3 py-2">
              <span className={quantityClass}>{quantityDisplay}</span>
              {remainingQuantity > 0 && (
                <>
                  <br />
                  <small className="text-gray-500">잔여: {remainingQuantity}GB</small>
                </>
              )}
            </td>
            <td className="whitespace-nowrap px-3 py-2 text-right">
              {item.pricePerGb.toLocaleString()}원
            </td>
            <td className="whitespace-nowrap px-3 py-2 text-right">
              {item.totalPay.toLocaleString()}원
            </td>
            <td className="whitespace-nowrap px-3 py-2 font-semibold text-blue-600">
              {item.phoneNumber}
            </td>
            <td className="whitespace-nowrap px-3 py-2">
              <div className="flex items-center select-none text-gray-700 font-medium text-sm">
                <span
                  className={`inline-block w-3 h-3 mr-2 transform transition-transform ${
                    expandedRows[rowId] ? 'rotate-90' : ''
                  }`}
                >
                  ▶
                </span>
                {contractSummary}
              </div>
            </td>
          </tr>

          {expandedRows[rowId] && (
            <tr className="bg-gray-50">
              <td colSpan="8" className="p-4">
                <div className="mb-6 bg-gray-100 p-4 rounded-lg text-gray-700">
                  <h5 className="mb-3 font-semibold text-lg">📊 거래 요약</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <strong>요청 수량:</strong> {requestedQuantity}GB
                    </div>
                    <div>
                      <strong>체결 수량:</strong> {contractedQuantity}GB
                    </div>
                    <div>
                      <strong>잔여 수량:</strong> {remainingQuantity}GB
                    </div>
                    <div>
                      <strong>체결률:</strong>{' '}
                      {requestedQuantity > 0
                        ? Math.round((contractedQuantity / requestedQuantity) * 100)
                        : 0}
                      %
                    </div>
                  </div>
                </div>

                <h4 className="mb-4 font-semibold text-lg text-gray-700">📋 상세 체결 내역</h4>

                {contractCount > 0 ? (
                  item.contractDto.map((contract, cIndex) => {
                    const contractDate = new Date(contract.contractDate);
                    const timeDiff = Math.abs(contractDate - tradeDate);
                    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
                    const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                    let timingInfo = '';
                    if (hoursDiff > 0) {
                      timingInfo = `(${hoursDiff}시간 ${minutesDiff}분 후 체결)`;
                    } else if (minutesDiff > 0) {
                      timingInfo = `(${minutesDiff}분 후 체결)`;
                    } else {
                      timingInfo = '(즉시 체결)';
                    }

                    return (
                      <div
                        key={cIndex}
                        className="border border-gray-300 rounded-md p-4 mb-3 bg-white shadow-sm"
                      >
                        <strong className="block mb-2 text-blue-700">체결 #{cIndex + 1}</strong>
                        <div className="text-sm mb-1">
                          📅 체결일시: {contractDate.toLocaleString()}
                        </div>
                        <div className="text-sm mb-1">📊 수량: {contract.contractQuantity}GB</div>
                        <div className="text-sm mb-1">
                          💰 단가: {contract.pricePerUnit.toLocaleString()}원/GB
                        </div>
                        <div className="text-sm mb-1">
                          💵 금액:{' '}
                          {(contract.contractQuantity * contract.pricePerUnit).toLocaleString()}원
                        </div>
                        <div className="text-xs italic text-gray-500">⏱️ {timingInfo}</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    📭 아직 체결된 내역이 없습니다.
                    {remainingQuantity > 0 && (
                      <>
                        <br />
                        잔여 {remainingQuantity}GB 대기 중
                      </>
                    )}
                  </div>
                )}
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    });
  }

  return (
    <div className="max-w-5xl mx-auto my-8 bg-white p-6 rounded-2xl shadow-lg font-sans text-gray-900">
      <h2 className="text-3xl font-bold mb-6 text-blue-600">데이터 거래 내역 조회</h2>

      {/* 입력 폼 */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label htmlFor="token" className="block font-medium mb-1">
            JWT 토큰
          </label>
          <input
            id="token"
            type="text"
            placeholder="토큰 입력"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="endpoint" className="block font-medium mb-1">
            API 종류
          </label>
          <select
            id="endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="sale">판매 내역</option>
            <option value="purchase">구매 내역</option>
          </select>
        </div>

        <div>
          <label htmlFor="fromDate" className="block font-medium mb-1">
            조회 시작일
          </label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label htmlFor="toDate" className="block font-medium mb-1">
            조회 종료일
          </label>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <button
            onClick={fetchHistory}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold transition-colors"
          >
            조회
          </button>
        </div>
      </div>

      {/* 상태 표시 */}
      {loading && (
        <div className="text-center py-8 text-blue-600 font-bold text-lg">조회 중...</div>
      )}
      {error && <div className="text-center py-8 text-red-600 font-bold text-lg">{error}</div>}

      {/* 통계 */}
      {currentData.length > 0 && !loading && !error && displayStats(currentData)}

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-3 py-3 text-left whitespace-nowrap rounded-tl-lg">거래일시</th>
              <th className="px-3 py-3 text-left whitespace-nowrap">상태</th>
              <th className="px-3 py-3 text-left whitespace-nowrap">데이터 종류</th>
              <th className="px-3 py-3 text-center whitespace-nowrap">수량</th>
              <th className="px-3 py-3 text-right whitespace-nowrap">단가 (원/GB)</th>
              <th className="px-3 py-3 text-right whitespace-nowrap">총 금액 (원)</th>
              <th className="px-3 py-3 text-left whitespace-nowrap">전화번호</th>
              <th className="px-3 py-3 text-left whitespace-nowrap rounded-tr-lg">체결 내역</th>
            </tr>
          </thead>
          <tbody>{displayHistory(currentData)}</tbody>
        </table>
      </div>

      {/* 페이징 */}
      {currentData.length > itemsPerPage && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {Array.from({ length: Math.ceil(currentData.length / itemsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-1 rounded-md font-semibold transition-colors ${
                currentPage === i + 1
                  ? 'bg-blue-800 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
