import { useState } from 'react';
import { formatRupiah } from '../utils/format-rupiah';
import { useToast } from '../hooks/useToast';
import useAuth from '../hooks/useAuth';
import { FaSpinner } from 'react-icons/fa';
import { formatDate } from '../utils/format-time';
import { useDeleteTransactionMutation } from '../hooks/useTransactionsQuery';
import { FiArrowDownLeft, FiArrowUpRight } from 'react-icons/fi';
import { getErrorMessage } from '../utils/get-error-message';
import FormErrorAlert from './FormErrorAlert';

export default function TransactionDetailModal({
  transaction,
  onClose,
  clearDataDetailItem,
  fetchData,
}) {
  const [isDelete, setIsDelete] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();
  const { user } = useAuth();
  const deleteMutation = useDeleteTransactionMutation();
  const loading = deleteMutation.isPending;

  if (!transaction) return null;

  const isIncome = transaction.type === 'income';

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({
        transactionID: transaction.id,
        userID: user.id,
      });
      addToast('Transaksi berhasil dihapus!', { type: 'success' });
      onClose();
      clearDataDetailItem?.();
      fetchData?.();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus transaksi. Silakan coba lagi.'));
    }
  };

  const handleClose = () => {
    onClose();
    clearDataDetailItem?.();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-dialog sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            <span
              className={isIncome ? 'badge-income' : 'badge-expense'}
            >
              {isIncome ? <FiArrowDownLeft /> : <FiArrowUpRight />}
              {isIncome ? 'Pemasukan' : 'Pengeluaran'}
            </span>
          </div>
          <button
            onClick={handleClose}
            type="button"
            className="btn-icon"
            aria-label="Tutup"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body space-y-5">
          {/* Main Title & Amount */}
          <div className="space-y-1">
            <h3 className="font-bold text-xl text-slate-900 tracking-tight">
              {isIncome
                ? transaction.nameIncome || 'Pemasukan'
                : transaction.description || 'Pengeluaran'}
            </h3>
            <p className="text-xs text-slate-400">
              {formatDate(transaction.transactionDate)}
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              isIncome
                ? 'bg-emerald-50/60 border-emerald-100 text-emerald-700'
                : 'bg-rose-50/60 border-rose-100 text-rose-700'
            }`}
          >
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Nominal
            </span>
            <span className="text-2xl font-extrabold tracking-tight">
              {isIncome ? '+' : '-'}
              {formatRupiah(transaction.totalAmount)}
            </span>
          </div>

          {transaction.description && isIncome && (
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
              <span className="font-semibold text-slate-700 block mb-1">Catatan:</span>
              {transaction.description}
            </div>
          )}

          {Number(transaction.discountAmount) > 0 && !isIncome && (
            <div className="flex justify-between items-center text-xs font-medium px-1 text-emerald-600">
              <span>Potongan / Diskon:</span>
              <span>-{formatRupiah(Number(transaction.discountAmount))}</span>
            </div>
          )}

          {/* Itemized list if any */}
          {transaction.items?.length > 0 && (
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Daftar Item ({transaction.items.length})
              </div>
              <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                {transaction.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-xs p-3 bg-slate-50 border border-slate-100 rounded-xl"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">{item.name}</div>
                      <div className="text-slate-400 mt-0.5">
                        {item.quantity} × {formatRupiah(item.unitPrice)}
                      </div>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">
                      {formatRupiah(item.unitPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <FormErrorAlert
              message={error}
              onClose={() => setError('')}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-footer flex-col sm:flex-row gap-2">
          {isDelete ? (
            <div className="w-full space-y-2">
              <p className="text-xs font-semibold text-rose-600 text-center">
                Apakah Anda yakin ingin menghapus transaksi ini?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsDelete(false)}
                  disabled={loading}
                  className="btn-outline flex-1"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleDelete}
                  className="btn-danger flex-1"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    'Ya, Hapus'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={() => setIsDelete(true)}
              className="btn-danger-outline w-full sm:w-auto ml-auto"
            >
              <IoTrashOutline className="text-base" />
              <span>Hapus Transaksi</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
