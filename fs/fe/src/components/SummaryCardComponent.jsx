import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { formatRupiah } from '../utils/format-rupiah';
import { WARNING_STYLE } from '../utils/konstata-variabel';
import { getWarning } from '../utils/transaction-helper';

export default function SummaryCardComponent({
  title, amount, change, colorClass, loading,
  balance, income = 0, expense = 0,
}) {
  const isUp      = change > 0;
  const isNeutral = change === 0;

  // Warning hanya kalau balance card (balance prop di-pass)
  const warning = balance !== undefined ? getWarning(income, expense) : null;
  const wStyle  = warning ? WARNING_STYLE[warning.level] : null;
  const numberColor = wStyle ? wStyle.text : colorClass;

  // bg: warning override → balance default → putih
  const bgClass = wStyle
    ? wStyle.bg
    : balance !== undefined
      ? balance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      : 'bg-white border-line';

  return (
    <div className={`rounded-xl border p-5 space-y-1 ${bgClass}`}>
      <div className="text-tthird text-sm">{title}</div>

      {loading ? (
        <div className="h-9 bg-gray-100 rounded-lg animate-pulse w-36" />
      ) : (
        // ✅ pakai colorClass dari parent langsung
        <div className={`text-3xl font-bold ${numberColor}`}>
          {formatRupiah(amount)}
        </div>
      )}

      {!loading && change !== null && (
        <div className={`flex items-center gap-1 text-xs font-medium
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