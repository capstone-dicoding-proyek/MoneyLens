import { IoClose } from 'react-icons/io5';

export default function ModalLayoutInputAndProfil({ onClose, title, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxHeight: '92dvh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon text-slate-400 hover:text-slate-700"
            aria-label="Tutup modal"
          >
            <IoClose className="text-xl" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
