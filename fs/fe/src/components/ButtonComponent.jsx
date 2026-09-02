import { FaSpinner } from 'react-icons/fa';

export default function ButtonComponent({
  isLoading = false,
  disabled = false,
  title,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
}) {
  const variantClass =
    variant === 'danger'
      ? 'btn-danger'
      : variant === 'secondary'
        ? 'btn-secondary'
        : variant === 'outline'
          ? 'btn-outline'
          : 'btn-primary';

  return (
    <button
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
      className={`${variantClass} ${className}`}
    >
      {isLoading ? (
        <>
          <FaSpinner className="animate-spin text-base" />
          <span>Memproses...</span>
        </>
      ) : (
        title
      )}
    </button>
  );
}
