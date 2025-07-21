import { useEffect, useState } from 'react';

const useLivePrice = (dataCode) => {
  const [priceList, setPriceList] = useState([]);

  useEffect(() => {
    if (!dataCode) return;

    const url = `${import.meta.env.VITE_API_BASE_URL}/api/data/current-prices/stream/${dataCode}`;
    const eventSource = new EventSource(url);

    console.log(`[SSE] 연결 시도 → ${url}`);

    // 📦 초기 데이터 수신
    eventSource.addEventListener('initial-data', (event) => {
      try {
        const initialData = JSON.parse(event.data);
        setPriceList(initialData);
        console.log(`[SSE][${dataCode}] 초기 데이터 수신:`, initialData);
      } catch (e) {
        console.error(`[SSE][${dataCode}] 초기 데이터 파싱 오류:`, e);
      }
    });

    // 📈 실시간 업데이트 수신
    const hourlyEventName = `${dataCode}-hourly-update`;
    eventSource.addEventListener(hourlyEventName, (event) => {
      try {
        const updates = JSON.parse(event.data);
        setPriceList((prev) => [...prev.slice(-9), ...updates]);
        console.log(`[SSE][${dataCode}] 실시간 업데이트 수신:`, updates);
      } catch (e) {
        console.error(`[SSE][${dataCode}] 실시간 업데이트 파싱 오류:`, e);
      }
    });

    // ❌ 오류 처리 및 재연결 알림
    eventSource.onerror = (err) => {
      console.error(`[SSE][${dataCode}] SSE 연결 오류 발생`, err);

      if (eventSource.readyState === EventSource.CONNECTING) {
        console.log(`[SSE][${dataCode}] 서버와 재연결 중...`);
      } else if (eventSource.readyState === EventSource.CLOSED) {
        console.warn(`[SSE][${dataCode}] 연결이 닫힘 (서버 또는 네트워크 문제)`);
      }
      // eventSource.close(); ← ❌ 자동 재연결을 막으므로 제거
    };

    return () => {
      console.log(`[SSE][${dataCode}] 연결 해제`);
      eventSource.close(); // 컴포넌트 언마운트 시 종료
    };
  }, [dataCode]);

  return priceList;
};

export default useLivePrice;
