// stores/modalStore.js
import { create } from 'zustand';

const useModalStore = create((set) => ({
  showRechargeModal: false,
  showSuccessModal: false,
  showReservationModal: false,
  showPaymentCompleteModal: false,

  openModal: (modalName) => set({ [modalName]: true }),
  closeModal: (modalName) => set({ [modalName]: false }),
  resetModals: () =>
    set({
      showRechargeModal: false,
      showSuccessModal: false,
      showReservationModal: false,
      showPaymentCompleteModal: false,
    }),
}));

export default useModalStore;
