import { formatRupiah } from '../utils/format-rupiah';
import { WARNING_STYLE } from '../utils/konstata-variabel';
import { getWarning } from '../utils/transaction-helper';
import { FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import { IoWalletOutline } from 'react-icons/io5';

export default function TopStatComponent({
  type,
  number,
  title,
  isBalancePositive,
  loading,
  income = 0,
  expense = 0,
}) {
  const warning =
    type === 'balance' && isBalancePositive ? getWarning(income, expense) : null;
  const wStyle = warning ? WARNING_STYLE[warning.level] : null;

  const bgClass =
    type === 'pengeluaran' || type === 'pemasukan'
      ? 'bg-white border-slate-200/80 shadow-xs'
      : wStyle
        ? `${wStyle.bg} shadow-xs`
        : isBalancePositive
          ? 'bg-emerald-50/70 border-emerald-200 shadow-xs'
          : 'bg-rose-50/70 border-rose-200 shadow-xs';

  const numberColor =
    type === 'pengeluaran'
      ? 'text-rose-600'
      : type === 'balance'
        ? wStyle
          ? wStyle.text
          : isBalancePositive
            ? 'text-emerald-700'
            : 'text-rose-700'
        : 'text-emerald-600';

  const hint =
    type === 'balance'
      ? warning
        ? warning.label
        : isBalancePositive
          ? 'Keuangan Anda sehat'
          : 'Pengeluaran melebihi pemasukan'
      : 'Periode ini';

  const hintBadge =
    type === 'balance'
      ? isBalancePositive
        ? 'badge-income'
        : 'badge-expense'
      : 'badge-neutral';

  const IconComponent =
    type === 'pengeluaran'
      ? FiTrendingDown
      : type === 'pemasukan'
        ? FiTrendingUp
        : IoWalletOutline;

  const iconBg =
    type === 'pengeluaran'
      ? 'bg-rose-100/80 text-rose-600'
      : type === 'pemasukan'
        ? 'bg-emerald-100/80 text-emerald-600'
        : 'bg-teal-100/80 text-teal-700';

  return (
    <div className={`card-stat ${bgClass}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${iconBg}`}>
          <IconComponent />
        </div>
      </div>

      {loading ? (
        <div className="h-8 bg-slate-100 rounded-lg animate-pulse w-36 mb-2" />
      ) : (
        <div className={`text-2xl sm:text-3xl font-bold tracking-tight mb-2 ${numberColor}`}>
          {formatRupiah(number ?? 0)}
        </div>
      )}

      {!loading && (
        <div className="flex items-center gap-1.5">
          <span className={hintBadge}>{hint}</span>
        </div>
      )}
    </div>
  );
}