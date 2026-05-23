import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { formatRupiah } from '../utils/format-rupiah';

export default function SummaryCardComponent({
  title,
  amount,
  change,
  colorClass,
  bgClass,
  borderClass,
  loading,
}) {
  const isUp = change > 0;
  const isNeutral = change === 0;

  return (
    <div
      className={`rounded-xl border p-5 space-y-1 ${bgClass ?? 'bg-white'} ${borderClass ?? 'border-line'}`}
    >
      <div className="text-tthird text-sm">{title}</div>
      {loading ? (
        <div className="h-9 bg-gray-100 rounded-lg animate-pulse w-36" />
      ) : (
        <div className={`text-3xl font-bold ${colorClass}`}>
          {formatRupiah(amount)}
        </div>
      )}
      {!loading && change !== null && (
        <div
          className={`flex items-center gap-1 text-xs font-medium
          ${isNeutral ? 'text-tthird' : isUp ? 'text-green-500' : 'text-red-500'}`}
        >
          {!isNeutral && (isUp ? <FaCaretUp /> : <FaCaretDown />)}
          {isNeutral
            ? 'Sama dengan periode lalu'
            : `${isUp ? '+' : ''}${change}% dari periode lalu`}
        </div>
      )}
    </div>
  );
}