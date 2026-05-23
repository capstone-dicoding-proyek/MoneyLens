import { useState } from 'react';
import {
  IoClose,
  IoCamera,
  IoCloudUploadOutline,
  IoAdd,
  IoTrashOutline,
  IoReceiptOutline,
  IoWalletOutline,
} from 'react-icons/io5';
import { FaSpinner } from 'react-icons/fa';
import OcrSectionComponent from './OcrSectionComponent';
import { calcGrandTotal, HAS_QUANTITY } from '../utils/transaction-helper';
import ItemRowTransactionComponent from './ItemRowTransactionComponent';
import { createTransaction } from '../api/transaction';
import ModalLayoutInputAndProfil from './ModalLayoutInputAndProfil';
import { useToast } from '../hooks/useToast';

const emptyItem = () => ({
  id: crypto.randomUUID(),
  detailType: 'product',
  name: '',
  unitPrice: '',
  quantity: 1,
});

const todayParam = () => new Date().toISOString().split('T')[0];

export default function InputTransactionComponent({ onClose }) {
  const [type, setType] = useState('expense');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();
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

  const handleOcrResult = (data) => {
    console.log(data);
    return data;

    // if (type === "income") {
    //   setIncome((prev) => ({ ...prev, ...data }));
    // } else {
    //   if (data.items?.length)
    //     setItems(data.items.map((it) => ({ ...emptyItem(), ...it })));
    //   if (data.description)
    //     setExpense((prev) => ({ ...prev, description: data.description }));
    //   if (data.transactionDate)
    //     setExpense((prev) => ({
    //       ...prev,
    //       transactionDate: data.transactionDate,
    //     }));
    // }
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));
  const updateItem = (id, updated) =>
    setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));

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

    setLoading(true);
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
            items: items.map((it) => ({
              detailType: it.detailType,
              name: it.name,
              unitPrice: Number(it.unitPrice),
              ...(HAS_QUANTITY.includes(it.detailType) && {
                quantity: Number(it.quantity),
              }),
            })),
          };

      await createTransaction({ body, type });
      addToast('Transaksi berhasil dibuat!', { type: 'success' });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Gagal menyimpan transaksi');
    } finally {
      setLoading(false);
    }
  };

  const grandTotal =
    type === 'expense'
      ? calcGrandTotal(items)
      : Number(income.totalAmount) || 0;


  return (
    <ModalLayoutInputAndProfil title="Catat Transaksi" onClose={onClose}>
      {/*  Modal header  */}

      {/* Type toggle  */}
      <div className="px-5 pb-3 flex-shrink-0">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition
                ${
    type === 'expense'
      ? 'bg-white text-red-500 shadow-sm'
      : 'text-tthird hover:text-black'
    }`}
          >
            <IoReceiptOutline />
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition
                ${
    type === 'income'
      ? 'bg-white text-primary shadow-sm'
      : 'text-tthird hover:text-black'
    }`}
          >
            <IoWalletOutline />
            Pemasukan
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-2 space-y-3 scrollbar-hide">
        {/* OCR */}
        <OcrSectionComponent type={type} onOcrResult={handleOcrResult} />

        {/*  Income form  */}
        {type === 'income' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-tthird mb-1 block">
                Nama Pemasukan(opsional) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Gaji, freelance, dll..."
                value={income.nameIncome}
                onChange={(e) =>
                  setIncome({ ...income, nameIncome: e.target.value })
                }
                className="w-full border border-line rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-tthird mb-1 block">
                Nominal <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center border border-line rounded-xl overflow-hidden focus-within:border-primary">
                <span className="px-3 py-2.5 text-sm text-tthird bg-gray-50 border-r border-line">
                  Rp
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={income.totalAmount}
                  onChange={(e) =>
                    setIncome({ ...income, totalAmount: e.target.value })
                  }
                  className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-tthird mb-1 block">
                Tanggal <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={income.transactionDate}
                onChange={(e) =>
                  setIncome({ ...income, transactionDate: e.target.value })
                }
                className="w-full border border-line rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-tthird mb-1 block">
                Catatan
              </label>
              <textarea
                placeholder="Keterangan tambahan..."
                value={income.description}
                onChange={(e) =>
                  setIncome({ ...income, description: e.target.value })
                }
                rows={2}
                className="w-full border border-line rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
              />
            </div>
          </div>
        )}

        {/*  Expense form */}
        {type === 'expense' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-semibold text-tthird mb-1 block">
                  Tanggal <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={expense.transactionDate}
                  onChange={(e) =>
                    setExpense({ ...expense, transactionDate: e.target.value })
                  }
                  className="w-full border border-line rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-tthird mb-1 block">
                  Catatan
                </label>
                <input
                  type="text"
                  placeholder="Opsional..."
                  value={expense.description}
                  onChange={(e) =>
                    setExpense({ ...expense, description: e.target.value })
                  }
                  className="w-full border border-line rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-tthird">
                  Item ({items.length})
                </span>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1 text-xs text-primary hover:text-secondary transition font-medium"
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
          </div>
        )}
      </div>

      {/*    Submit  */}
      <div className="flex-shrink-0 border-t border-line px-5 py-4 space-y-3">
        {error && (
          <div className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-tthird font-medium">Total</span>
          <span
            className={`text-xl font-bold ${type === 'income' ? 'text-primary' : 'text-red-500'}`}
          >
            {type === 'income' ? '+' : '-'}Rp{' '}
            {grandTotal.toLocaleString('id-ID')}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Menyimpan...
            </>
          ) : (
            `Simpan ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`
          )}
        </button>
      </div>
    </ModalLayoutInputAndProfil>
  );
}
