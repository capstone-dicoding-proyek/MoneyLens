import { useState } from 'react';
import {
  IoAdd,
  IoReceiptOutline,
  IoWalletOutline,
} from 'react-icons/io5';
import { FaSpinner } from 'react-icons/fa';
import OcrSectionComponent from './OcrSectionComponent';
import { calcGrandTotal, HAS_QUANTITY } from '../utils/transaction-helper';
import ItemRowTransactionComponent from './ItemRowTransactionComponent';
import ModalLayoutInputAndProfil from './ModalLayoutInputAndProfil';
import { useToast } from '../hooks/useToast';
import { useCreateTransactionMutation } from '../hooks/useTransactionsQuery';
import { getErrorMessage } from '../utils/get-error-message';

const emptyItem = () => ({
  id: crypto.randomUUID(),
  detailType: 'product',
  name: '',
  unitPrice: '',
  quantity: 1,
});

const todayParam = () => new Date().toISOString().split('T')[0];

export default function InputTransactionComponent({ onClose, fetchData }) {
  const [type, setType] = useState('expense');
  const [error, setError] = useState('');
  const { addToast } = useToast();
  const createMutation = useCreateTransactionMutation();
  const loading = createMutation.isPending;

  const [income, setIncome] = useState({
    totalAmount: '',
    transactionDate: todayParam(),
    nameIncome: '',
    description: '',
  });
  const [expense, setExpense] = useState({
    transactionDate: todayParam(),
    description: '',
  });
  const [items, setItems] = useState([emptyItem()]);
  const [discount, setDiscount] = useState({ type: 'rupiah', value: '' });

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id));
  const updateItem = (id, updated) =>
    setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));

  const handleOcrResult = (response) => {
    const data = response.message.data[0];
    if (!data) return;
    if (data.items?.length) {
      setItems(
        data.items.map((item) => ({
          ...emptyItem(),
          detailType: item.detailType ?? 'product',
          name: item.name ?? '',
          quantity: item.quantity ?? 1,
          unitPrice: item.unitPrice ?? '',
        }))
      );
    }
    setExpense((prev) => ({
      ...prev,
      ...(data.description && { description: data.description }),
      ...(data.transactionDate && {
        transactionDate: data.transactionDate.split('T')[0],
      }),
    }));
  };

  const subtotal =
    type === 'expense' ? calcGrandTotal(items) : Number(income.totalAmount) || 0;


  const discountAmount = (() => {
    const raw = Number(discount.value) || 0;
    if (subtotal <= 0 || raw <= 0) return 0;
    const amount =
      discount.type === 'persen'
        ? Math.round((subtotal * Math.min(raw, 100)) / 100)
        : raw;
    return Math.min(amount, subtotal);
  })();

  const grandTotal = subtotal - discountAmount;

  const handleDiscountChange = (val) => {
    if (discount.type === 'persen') {
      if (Number(val) > 100) val = '100';
    } else {
      if (Number(val) > subtotal) val = String(subtotal);
    }
    if (Number(val) < 0) val = '0';
    setDiscount((prev) => ({ ...prev, value: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (type === 'income') {
      if (!income.totalAmount || Number(income.totalAmount) <= 0)
        return setError('Nominal harus diisi');
      if (!income.transactionDate) return setError('Tanggal harus diisi');
    } else {
      if (items.length === 0) return setError('Tambahkan minimal 1 item');
      const invalid = items.find((it) => !it.name || !it.unitPrice);
      if (invalid) return setError('Nama dan harga setiap item harus diisi');
    }

    try {
      const body =
        type === 'income'
          ? {
            totalAmount: Number(income.totalAmount),
            transactionDate: income.transactionDate,
            nameIncome: income.nameIncome,
            description: income.description,
          }
          : {
            transactionDate: expense.transactionDate,
            description: expense.description,
            discountAmount,
            items: items.map((it) => ({
              detailType: it.detailType,
              name: it.name,
              unitPrice: Number(it.unitPrice),
              ...(HAS_QUANTITY.includes(it.detailType) && {
                quantity: Number(it.quantity),
              }),
            })),
          };

      await createMutation.mutateAsync({ body, type });
      addToast('Transaksi berhasil dibuat!', { type: 'success' });
      onClose();
      fetchData?.();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan transaksi. Silakan periksa kembali data input.'));
    }
  };

  return (
    <ModalLayoutInputAndProfil title="Catat Transaksi" onClose={onClose}>
      {/* Type toggle */}
      <div className="px-6 pt-2 pb-3 flex-shrink-0">
        <div className="flex bg-slate-100 rounded-2xl p-1 gap-1">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              type === 'expense'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <IoReceiptOutline className="text-base" />
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              type === 'income'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <IoWalletOutline className="text-base" />
            Pemasukan
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4 custom-scrollbar">
        {type === 'expense' && (
          <OcrSectionComponent type={type} onOcrResult={handleOcrResult} />
        )}

        {/* Income form */}
        {type === 'income' && (
          <div className="space-y-4">
            <div>
              <label className="input-label">
                Nama Pemasukan <span className="font-normal text-slate-400 lowercase">(opsional)</span>
              </label>
              <input
                type="text"
                placeholder="Gaji, freelance, investasi..."
                value={income.nameIncome}
                onChange={(e) => setIncome({ ...income, nameIncome: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">
                Nominal <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#2FA084] focus-within:ring-3 focus-within:ring-emerald-500/15 bg-white transition-all">
                <span className="px-3.5 py-2.5 text-xs font-bold text-slate-500 bg-slate-50 border-r border-slate-200 select-none">
                  Rp
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={income.totalAmount}
                  onChange={(e) => setIncome({ ...income, totalAmount: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="input-label">
                Tanggal <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={income.transactionDate}
                onChange={(e) => setIncome({ ...income, transactionDate: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Catatan</label>
              <textarea
                placeholder="Keterangan tambahan..."
                value={income.description}
                onChange={(e) => setIncome({ ...income, description: e.target.value })}
                rows={2}
                className="input-field resize-none"
              />
            </div>
          </div>
        )}

        {/* Expense form */}
        {type === 'expense' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="input-label">
                  Tanggal <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={expense.transactionDate}
                  onChange={(e) =>
                    setExpense({ ...expense, transactionDate: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Catatan</label>
                <input
                  type="text"
                  placeholder="Opsional..."
                  value={expense.description}
                  onChange={(e) =>
                    setExpense({ ...expense, description: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Daftar Item ({items.length})
                </span>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-1 text-xs text-[#1A7A5E] hover:text-[#2FA084] font-bold cursor-pointer"
                >
                  <IoAdd className="text-base" /> Tambah Item
                </button>
              </div>
              {items.map((item, i) => (
                <ItemRowTransactionComponent
                  key={item.id}
                  item={item}
                  index={i}
                  onChange={(updated) => updateItem(item.id, updated)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>

            {/* Diskon */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Diskon / Potongan
                </label>
                <div className="flex bg-slate-200/70 rounded-lg p-0.5 gap-0.5">
                  <button
                    type="button"
                    onClick={() => setDiscount({ type: 'rupiah', value: '' })}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      discount.type === 'rupiah'
                        ? 'bg-white text-slate-800 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Nominal (Rp)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscount({ type: 'persen', value: '' })}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      discount.type === 'persen'
                        ? 'bg-white text-slate-800 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Persen (%)
                  </button>
                </div>
              </div>

              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#2FA084] focus-within:ring-2 focus-within:ring-emerald-500/15 bg-white">
                <span className="px-3 py-2 text-xs font-bold text-slate-400 bg-slate-50 border-r border-slate-200 select-none">
                  {discount.type === 'rupiah' ? 'Rp' : '%'}
                </span>
                <input
                  type="number"
                  min="0"
                  max={discount.type === 'persen' ? 100 : subtotal}
                  placeholder="0"
                  value={discount.value}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm focus:outline-none"
                />
                {discount.type === 'persen' && discountAmount > 0 && (
                  <span className="px-3 text-xs font-semibold text-emerald-600 whitespace-nowrap">
                    = Rp {discountAmount.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Sticky Footer */}
      <div className="modal-footer flex-col sm:flex-row gap-3">
        {error && (
          <div className="w-full text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3">
            {error}
          </div>
        )}

        <div className="w-full flex items-center justify-between">
          <div className="text-left">
            <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">
              Total {type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
            </span>
            <span
              className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                type === 'income' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {type === 'income' ? '+' : '-'}Rp {grandTotal.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin text-sm" />
                <span>Menyimpan...</span>
              </>
            ) : (
              `Simpan ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`
            )}
          </button>
        </div>
      </div>
    </ModalLayoutInputAndProfil>
  );
}