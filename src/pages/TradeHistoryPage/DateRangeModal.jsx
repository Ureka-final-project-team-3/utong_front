import { motion } from 'framer-motion';
import checkIcon from '@/assets/image/check.png';

const DateRangeModal = ({ show, range, onSelect, onClose, ranges }) => {
  if (!show) return null;
  return (
    <div className="absolute inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <motion.div
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 300, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl pb-5"
      >
        <div className="px-4 py-3 font-semibold text-sm text-gray-800 text-center">날짜 선택</div>
        <div className="flex flex-col">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => onSelect(r.value)}
              className="flex items-center justify-between px-5 py-3 text-sm text-gray-800 cursor-pointer"
            >
              <span>{r.label}</span>
              {range === r.value && <img src={checkIcon} alt="선택됨" className="w-6 h-6" />}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DateRangeModal;
