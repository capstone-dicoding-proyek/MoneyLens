import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

export default function InputComponent({
  toggle,
  onChangeToggle,
  type = 'text',
  placeholder,
  label,
  value,
  onChangeValue,
  leftIcon: LeftIcon,
  required = false,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="input-label">{label}</label>}

      <div className="relative flex items-center border-b border-slate-200 focus-within:border-[#2FA084] pb-2 transition-colors">
        {LeftIcon && (
          <LeftIcon className="mr-3 text-slate-400 text-lg flex-shrink-0" />
        )}

        <input
          required={required}
          type={type}
          className="w-full bg-transparent text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none pr-8"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChangeValue(e.target.value)}
        />

        {toggle && (
          <button
            type="button"
            onClick={onChangeToggle}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
            aria-label="Toggle password visibility"
          >
            {type === 'password' ? (
              <IoEyeOffOutline className="text-lg" />
            ) : (
              <IoEyeOutline className="text-lg" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}