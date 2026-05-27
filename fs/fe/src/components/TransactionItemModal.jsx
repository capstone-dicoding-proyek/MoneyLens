import { useState } from 'react';
import { formatRupiah } from '../utils/format-rupiah';
import { deleteTransaction } from '../api/transaction';
import { useToast } from '../hooks/useToast';
import useAuth from '../hooks/useAuth';
import { FaSpinner } from 'react-icons/fa';
import { formatDate } from '../utils/format-time';

export default function TransactionDetailModal({
  transaction,
  onClose,
  clearDataDetailItem,
  fetchData,
}) {
  const [isDelete, setIsDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();
  const { user } = useAuth();

  if (!transaction) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteTransaction({
        transactionID: transaction.id,
        userID: user.id,
      });
      addToast('Transaksi berhasil dihapus!', { type: 'success' });
      onClose();
      fetchData();
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Gagal menyimpan transaksi');
    } finally {
      setLoading(false);
    }
  };
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
          {formatDate(transaction.transactionDate)}
        </div>
        <div className="text-sm text-tthird">
          {transaction.type === 'income' ? transaction.description : ''}
        </div>
        <div
          className={`text-2xl font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}
        >
          <div className="flex flex-col">
            {Number(transaction.discountAmount) > 0 && transaction.type === 'expense' && (
              <span className="text-green-500!">
                -{formatRupiah(Number(transaction.discountAmount))}
              </span>
            )}
            {transaction.type === 'income' ? '+' : ''}
            {formatRupiah(transaction.totalAmount)}
          </div>
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
        {/*    button  */}
        <div className="flex-shrink-0 border-t border-line px-5 py-4 space-y-3">
          {error && (
            <div className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {isDelete && (
            <p className="text-tthird text-sm">Yakin ingin menghapus?</p>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              isDelete ? handleDelete() : setIsDelete((prev) => !prev);
            }}
            className="w-full bg-red-500 hover:bg-red-500/60 active:bg-red-500/60 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center ease-in justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Loading...
              </>
            ) : isDelete ? (
              'Lanjutkan'
            ) : (
              'Delete'
            )}
          </button>
          {isDelete && (
            <button
              type="button"
              onClick={() => setIsDelete((prev) => !prev)}
              disabled={loading}
              className="w-full bg-white ring-1 ring-tthird active:opacity-75 hover:opacity-75  text-tthird font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed ease-in flex items-center justify-center gap-2 cursor-pointer"
            >
              Batal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
