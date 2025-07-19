import { useEffect, useState } from 'react';

const useLivePrice = (dataCode) => {
  const [priceList, setPriceList] = useState([]);

  useEffect(() => {
    if (!dataCode) return;

    const url = `${import.meta.env.VITE_API_BASE_URL}/api/data/current-prices/stream/${dataCode}`;
    const eventSource = new EventSource(url);

    // 기본 message 이벤트
    eventSource.onmessage = (event) => {
      try {
        const newPrice = JSON.parse(event.data);
        setPriceList((prev) => [...prev.slice(-49), newPrice]);
      } catch (e) {
        console.error('시세 파싱 오류:', e);
      }
    };

    // initial-data 이벤트 따로 처리
    eventSource.addEventListener('initial-data', (event) => {
      try {
        const initialData = JSON.parse(event.data);
        setPriceList(initialData);
        console.log('초기 데이터 수신:', initialData);
      } catch (e) {
        console.error('초기 데이터 파싱 오류:', e);
      }
    });

    eventSource.onerror = (err) => {
      console.error('SSE 연결 오류:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [dataCode]);

  return priceList;
};

export default useLivePrice;
