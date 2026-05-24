import { formatRupiah } from '../utils/format-rupiah';
import { WARNING_STYLE } from '../utils/konstata-variabel';
import { getWarning } from '../utils/transaction-helper';



export default function TopStatComponent({
  type, number, title, isBalancePositive, loading, income = 0, expense = 0,
}) {

  const warning = type === 'balance' ? getWarning(income, expense) : null;
  const wStyle  = warning ? WARNING_STYLE[warning.level] : null;

  const bgClass =
    type === 'pengeluaran' || type === 'pemasukan'
      ? 'bg-white border-line'
      : wStyle
        ? wStyle.bg
        : isBalancePositive
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200';

  const numberColor =
  type === 'pengeluaran'
    ? 'text-red-500'
    : type === 'balance'
      ? wStyle
        ? wStyle.text
        : isBalancePositive ? 'text-green-600' : 'text-red-600'
      : 'text-green-500';

  const hint =
    type === 'balance'
      ? warning
        ? warning.label
        : isBalancePositive
          ? 'Keuangan Anda sehat!'
          : 'Pengeluaran melebihi pemasukan'
      : 'Periode ini';

  const hintColor =
    type === 'balance'
      ? wStyle
        ? wStyle.text
        : isBalancePositive ? 'text-green-500' : 'text-red-500'
      : 'text-tthird';

  return (
    <div className={`rounded-xl border p-5 space-y-1 ${bgClass}`}>
      <div className="text-tthird text-sm">{title}</div>

      {loading ? (
        <div className="h-8 bg-gray-100 rounded-lg animate-pulse w-36" />
      ) : (
        <div className={`text-2xl font-bold ${numberColor}`}>
          {formatRupiah(number ?? 0)}
        </div>
      )}

      {!loading && (
        <div className={`flex items-center gap-1 text-xs font-medium ${hintColor}`}>
          {hint}
        </div>
      )}
    </div>
  );
}