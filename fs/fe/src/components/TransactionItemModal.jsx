import { formatRupiah } from '../utils/format-rupiah';
import { formatTime } from '../utils/format-time';

export default function TransactionDetailModal({
  transaction,
  onClose,
  clearDataDetailItem,
}) {
  if (!transaction) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={() => {
        onClose();
        clearDataDetailItem();
      }}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl">
            {transaction.type === 'income'
              ? transaction.nameIncome || '-'
              : transaction.description || '-'}
          </h3>
          <button
            onClick={() => {
              onClose();
              clearDataDetailItem();
            }}
            className="text-tthird hover:text-black transition text-xl"
          >
            ✕
          </button>
        </div>
        <div className="text-sm text-tthird">
          {formatTime(transaction.transactionDate)}
        </div>
        <div className="text-sm text-tthird">
          {transaction.type === 'income' ?transaction.description   : ''}
        </div>
        <div
          className={`text-2xl font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}
        >
          {transaction.type === 'income' ? '+' : ''}
          {formatRupiah(transaction.totalAmount)}
        </div>

        {transaction.items?.length > 0 && (
          <div className="border-t border-line pt-4 space-y-2">
            <div className="text-sm font-semibold text-tthird uppercase tracking-wide">
              Detail Item
            </div>
            <div className="space-y-2">
              {transaction.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-sm bg-gray-50 rounded-lg p-3"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-tthird">
                      {item.quantity}× {formatRupiah(item.unitPrice)}
                    </div>
                  </div>
                  <div className="font-semibold">
                    {formatRupiah(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
