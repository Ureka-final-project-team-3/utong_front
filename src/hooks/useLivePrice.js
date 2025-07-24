import { useEffect, useState } from 'react';

const useLivePrice = (targetDataCode) => {
  const [priceList, setPriceList] = useState([]);

  useEffect(() => {
    if (!targetDataCode) return;

    const url = `${import.meta.env.VITE_API_BASE_URL}/api/data/current-prices/stream`;
    const eventSource = new EventSource(url);
    console.log(`[SSE] 통합 스트림 연결 시도 → ${url}`);

   eventSource.addEventListener('all-chart-initial-data', (event) => {
  try {
    console.log(`[SSE][${targetDataCode}] 전체 초기 데이터 수신 (event.data):`, event.data); 

    const allData = JSON.parse(event.data); 
    console.log(`[SSE][${targetDataCode}] allData:`, allData); 

    const chart = allData.find(c => c.dataCode === targetDataCode);
    console.log(`[SSE][${targetDataCode}] 필터링된 chart:`, chart); 

   if (chart) {
  setPriceList(chart.avgPerHourList); 
  console.log(`[SSE][${targetDataCode}] 초기 데이터 수신 완료:`, chart.avgPerHourList); 
}

  } catch (e) {
    console.error(`[SSE][${targetDataCode}] 초기 데이터 파싱 오류`, e);
  }
});


    eventSource.addEventListener('all-chart-hourly-update', (event) => {
  try {
    console.log(`[SSE][${targetDataCode}] 실시간 데이터 수신 (event.data):`, event.data); 

    const allData = JSON.parse(event.data);
    console.log(`[SSE][${targetDataCode}] allData (hourly):`, allData); 

    const chart = allData.find(c => c.dataCode === targetDataCode);
    console.log(`[SSE][${targetDataCode}] 실시간 chart:`, chart); 

    if (chart) {
      const updates = chart.avgPerHourList; 

      setPriceList(prev => [...prev.slice(-9), ...updates]);
      console.log(`[SSE][${targetDataCode}] 실시간 업데이트 완료:`, updates);
    }
  } catch (e) {
    console.error(`[SSE][${targetDataCode}] 업데이트 파싱 오류`, e);
  }
});


    eventSource.onerror = (err) => {
      console.error(`[SSE][${targetDataCode}] SSE 오류 발생`, err);
    };

    return () => {
      console.log(`[SSE][${targetDataCode}] 연결 해제`);
      eventSource.close();
    };
  }, [targetDataCode]);

  return priceList;
};

export default useLivePrice;
