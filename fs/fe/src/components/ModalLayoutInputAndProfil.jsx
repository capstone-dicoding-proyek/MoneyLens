import { IoClose } from 'react-icons/io5';

export default function ModalLayoutInputAndProfil({ onClose, title, children }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full  sm:max-w-xl rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col"
        style={{ maxHeight: '92dvh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
          <h2 className="font-bold text-xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-tthird hover:text-black transition text-xl"
          >
            <IoClose />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
