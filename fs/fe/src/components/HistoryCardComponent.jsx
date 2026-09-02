import { FiArrowDownLeft, FiArrowUpRight } from 'react-icons/fi';
import { formatRupiah } from '../utils/format-rupiah.js';
import { formatDate } from '../utils/format-time.js';

export default function HistoryCardComponent({ item }) {
  const isIncome = item.type === 'income';

  return (
    <div className="card-interactive p-4 flex items-center gap-3.5 group">
      <div
        className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border transition-colors ${
          isIncome
            ? 'bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:bg-emerald-100'
            : 'bg-rose-50 border-rose-100 text-rose-600 group-hover:bg-rose-100'
        }`}
      >
        {isIncome ? (
          <FiArrowDownLeft className="text-xl" />
        ) : (
          <FiArrowUpRight className="text-xl" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-slate-900 truncate">
          {isIncome
            ? item.nameIncome?.trim() || '-'
            : item.description?.trim() || '-'}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
          <span>{formatDate(item.transactionDate)}</span>
          {item.items?.length > 0 && (
            <>
              <span>•</span>
              <span className="text-slate-500 font-medium">{item.items.length} item</span>
            </>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        <div
          className={`font-bold text-sm sm:text-base tracking-tight ${
            isIncome ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {isIncome ? '+' : '-'}
          {formatRupiah(item.totalAmount)}
        </div>
        {Number(item.discountAmount) > 0 && !isIncome && (
          <div className="text-[11px] font-semibold text-emerald-600">
            Diskon: -{formatRupiah(Number(item.discountAmount))}
          </div>
        )}
      </div>
    </div>
  );
}
