import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { formatRupiah } from '../utils/format-rupiah';
import { WARNING_STYLE } from '../utils/konstata-variabel';
import { getWarning } from '../utils/transaction-helper';

export default function SummaryCardComponent({
  title,
  amount,
  change,
  colorClass,
  loading,
  balance,
  income = 0,
  expense = 0,
}) {
  const isUp = change > 0;
  const isNeutral = change === 0;

  const warning =
    balance !== undefined && balance >= 0 ? getWarning(income, expense) : null;
  const wStyle = warning ? WARNING_STYLE[warning.level] : null;
  const numberColor = wStyle ? wStyle.text : colorClass;

  const bgClass = wStyle
    ? `${wStyle.bg} shadow-xs`
    : balance !== undefined
      ? balance >= 0
        ? 'bg-emerald-50/70 border-emerald-200 shadow-xs'
        : 'bg-rose-50/70 border-rose-200 shadow-xs'
      : 'bg-white border-slate-200/80 shadow-xs';

  return (
    <div className={`card-stat ${bgClass}`}>
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {title}
      </div>

      {loading ? (
        <div className="h-9 bg-slate-100 rounded-lg animate-pulse w-36 mb-2" />
      ) : (
        <div className={`text-2xl sm:text-3xl font-bold tracking-tight mb-2 ${numberColor}`}>
          {formatRupiah(amount)}
        </div>
      )}

      {!loading && change !== null && (
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
              isNeutral
                ? 'bg-slate-100 text-slate-600'
                : isUp
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-100 text-rose-700'
            }`}
          >
            {!isNeutral && (isUp ? <FaCaretUp /> : <FaCaretDown />)}
            {isNeutral
              ? 'Sama dengan periode lalu'
              : `${isUp ? '+' : ''}${change}%`}
          </span>
          <span className="text-xs text-slate-400">dari periode lalu</span>
        </div>
      )}
    </div>
  );
}