import { useEffect, useRef, useState } from 'react';

const useLivePrice = (targetDataCode) => {
  const [priceList, setPriceList] = useState([]);
  const dataCodeRef = useRef(targetDataCode); // 최신 dataCode 기억용
  const eventSourceRef = useRef(null);

  useEffect(() => {
    dataCodeRef.current = targetDataCode;
  }, [targetDataCode]);

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/data/current-prices/stream`;
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;
    console.log(`[SSE] 스트림 연결됨 → ${url}`);

    eventSource.addEventListener('all-chart-initial-data', (event) => {
      try {
        const allData = JSON.parse(event.data);
        const chart = allData.find(c => c.dataCode === dataCodeRef.current);
        if (chart) setPriceList(chart.avgPerHourList);
      } catch (e) {
        console.error(`[SSE] 초기 데이터 파싱 오류`, e);
      }
    });

    eventSource.addEventListener('all-chart-hourly-update', (event) => {
      try {
        const allData = JSON.parse(event.data);
        const chart = allData.find(c => c.dataCode === dataCodeRef.current);
        if (chart) {
          const updates = chart.avgPerHourList;
          setPriceList(prev => [...prev.slice(-9), ...updates]);
        }
      } catch (e) {
        console.error(`[SSE] 실시간 데이터 파싱 오류`, e);
      }
    });

    eventSource.onerror = (err) => {
      console.error(`[SSE] 에러 발생`, err);
    };

    return () => {
      console.log(`[SSE] 연결 종료`);
      eventSource.close();
    };
  }, []);

  return priceList;
};

export default useLivePrice;
