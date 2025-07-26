import { create } from 'zustand';

const useTradeStore = create((set) => ({
  selectedNetwork: localStorage.getItem('selectedNetwork') || '5G',
  selectedRange: 'today',
  setSelectedNetwork: (network) => {
    localStorage.setItem('selectedNetwork', network);
    set({ selectedNetwork: network });
  },
  setSelectedRange: (range) => set({ selectedRange: range }),
}));

export default useTradeStore;
