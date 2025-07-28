import { create } from 'zustand';

const useSellModalStore = create((set) => ({
  showSellSuccessModal: false,
  showSellReservationModal: false,
  showSellPaymentCompleteModal: false,

  openModal: (modalName) => set({ [modalName]: true }),
  closeModal: (modalName) => set({ [modalName]: false }),
  resetModals: () =>
    set({
      showSellSuccessModal: false,
      showSellReservationModal: false,
      showSellPaymentCompleteModal: false,
    }),
}));

export default useSellModalStore;
