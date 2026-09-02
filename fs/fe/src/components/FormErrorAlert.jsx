import { IoAlertCircle, IoClose } from 'react-icons/io5';

export default function FormErrorAlert({ message, onClose, className = '' }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`form-error-alert ${className}`}
    >
      <div className="form-error-icon">
        <IoAlertCircle className="text-base sm:text-lg flex-shrink-0" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium leading-relaxed">
          {message}
        </p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="form-error-close-btn"
          aria-label="Tutup pesan error"
        >
          <IoClose className="text-base" />
        </button>
      )}
    </div>
  );
}
