import { useEffect, useRef } from 'react';
import useLivePriceStore from '@/stores/useLivePriceStore';

const useLivePriceSSE = (token) => {
  const setAllPriceMap = useLivePriceStore(state => state.setAllPriceMap);
  const updatePriceMap = useLivePriceStore(state => state.updatePriceMap);
  const setIsConnected = useLivePriceStore(state => state.setIsConnected);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const url = `${import.meta.env.VITE_API_BASE_URL}/sse/chart?token=${token}`;
    const source = new EventSource(url);

    source.onopen = () => {
      setIsConnected(true);
      console.log('[LivePrice SSE] 연결됨');
    };

    source.addEventListener('all-chart-initial-data', (e) => {
      try {
        const data = JSON.parse(e.data);
        const newMap = {};
        data.forEach(({ dataCode, avgPerHourList }) => {
          newMap[dataCode] = avgPerHourList;
        });
        setAllPriceMap(newMap);
      } catch (err) {
        console.error('[LivePrice SSE] 초기 데이터 오류', err);
      }
    });

    source.addEventListener('all-chart-hourly-update', (e) => {
      try {
        updatePriceMap(JSON.parse(e.data));
      } catch (err) {
        console.error('[LivePrice SSE] 실시간 데이터 오류', err);
      }
    });

    source.onerror = (err) => {
      console.error('[LivePrice SSE] 에러 발생', err);
      setIsConnected(false);
    };

    eventSourceRef.current = source;

    return () => {
      source.close();
      setIsConnected(false);
      console.log('[LivePrice SSE] 연결 종료');
    };
  }, [token]);
};

export default useLivePriceSSE;
