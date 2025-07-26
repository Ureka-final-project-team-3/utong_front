import { useEffect, useState } from 'react';

const useLivePriceMap = () => {
  const [allPriceMap, setAllPriceMap] = useState({}); // { dataCode: avgPerHourList[] }

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/data/current-prices/stream`;
    const eventSource = new EventSource(url);
    console.log(`[SSE] 스트림 연결됨 → ${url}`);

    eventSource.addEventListener('all-chart-initial-data', (event) => {
      try {
        const allData = JSON.parse(event.data);
        // allData = [{ dataCode, avgPerHourList }, ...]
        const newMap = {};
        allData.forEach(({ dataCode, avgPerHourList }) => {
          newMap[dataCode] = avgPerHourList;
        });
        setAllPriceMap(newMap);
      } catch (e) {
        console.error('[SSE] 초기 데이터 파싱 오류', e);
      }
    });

    eventSource.addEventListener('all-chart-hourly-update', (event) => {
      try {
        const allData = JSON.parse(event.data);
        setAllPriceMap(prevMap => {
          const updatedMap = { ...prevMap };
          allData.forEach(({ dataCode, avgPerHourList }) => {
            const prevList = prevMap[dataCode] || [];
            // 최대 9개 유지 + 신규 업데이트 추가
            updatedMap[dataCode] = [...prevList.slice(-9), ...avgPerHourList];
          });
          return updatedMap;
        });
      } catch (e) {
        console.error('[SSE] 실시간 데이터 파싱 오류', e);
      }
    });

    eventSource.onerror = (err) => {
      console.error('[SSE] 에러 발생', err);
    };

    return () => {
      console.log('[SSE] 연결 종료');
      eventSource.close();
    };
  }, []);

  // 현재 dataCode에 맞는 리스트를 꺼내는 함수 반환
  const getPriceListByCode = (dataCode) => {
    return allPriceMap[dataCode] || [];
  };

  return { getPriceListByCode };
};

export default useLivePriceMap;
