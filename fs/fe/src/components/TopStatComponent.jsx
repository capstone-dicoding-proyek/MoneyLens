import { formatRupiah } from '../utils/format-rupiah';

export default function TopStatComponent({
  type,
  number,
  title,
  isBalancePositive,
}) {
  return (
    <div
      className={`rounded-xl border p-5 space-y-1 ${
        type === 'balance'
          ? isBalancePositive
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
          : 'bg-white border-line'
      }`}
    >
      <div className="text-tthird text-sm">{title}</div>

      <div
        className={`text-2xl font-bold ${
          type === 'pengeluaran' ? 'text-red-500' : !isBalancePositive && type === 'balance' ? 'text-red-500' : 'text-green-500 '
        }`}
      >
        {formatRupiah(number)}
      </div>

      <div
        className={`text-xs font-medium ${
          type === 'balance'
            ? isBalancePositive
              ? 'text-green-500'
              : 'text-red-500'
            : 'text-tthird'
        }`}
      >
        {type === 'balance'
          ? isBalancePositive
            ? 'Keuangan Anda sehat!'
            : 'Pengeluaran melebihi pemasukan'
          : 'Periode ini'}
      </div>
    </div>
  );
}
