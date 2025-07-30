import { useState, useEffect } from 'react';
import useLivePriceStore from '@/stores/useLivePriceStore';

const useLivePriceMap = (dataCode) => {
  const allPriceMap = useLivePriceStore(state => state.allPriceMap);
  const [priceList, setPriceList] = useState([]);

  useEffect(() => {
    if (!dataCode) {
      setPriceList([]);
      return;
    }
    setPriceList(allPriceMap[dataCode] || []);
  }, [allPriceMap, dataCode]);

  return priceList;
};

export default useLivePriceMap;
