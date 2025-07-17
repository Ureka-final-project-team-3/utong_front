// src/stores/tradeStore.js
import { create } from 'zustand';

const useTradeStore = create((set) => ({
  selectedNetwork: '5G',
  selectedRange: 'today',
  setSelectedNetwork: (network) => set({ selectedNetwork: network }),
  setSelectedRange: (range) => set({ selectedRange: range }),
}));

export default useTradeStore;
