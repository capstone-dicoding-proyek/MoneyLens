import { useState } from 'react';
import FormTransactionComponent from '../components/FormTransactionComponent';
import { postTransactionExpense } from '../api/transaction';
import { useToast } from '../hooks/useToast';

const PLACEHOLDERS = {
  product: 'Tulis nama produk...',
  service: 'Tulis nama jasa...',
  fee: 'Tulis nama fee...',
  other: 'Lainnya...'
};

export default function AddTransactionPage() {
  const [items, setItems] = useState([]);
  const [date, setDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { addToast, removeToast } = useToast();

  const handleTambah = (type) => {
    const newItem = {
      id: + new Date(),
      name: '',
      unitPrice: 0,
      type,
      placeholder: PLACEHOLDERS[type] || '...'
    };
    if (type === 'product') {
      newItem.qty = 1;
    }
    setItems((prev) => [...prev, newItem]);
    setIsOpen(false);
  };

  const handleUpdateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const handleDelete = (id) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const handleSubmit = async () => {
    const payload = {
      items: items.map((item) => ({
        detailType: item.type,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.qty
      })),
      transactionDate: date
    };
    const loadingId = addToast('Sedang memproses...', { type: 'loading' });
    try {
      await postTransactionExpense({ items:payload.items, transactionDate:payload.transactionDate });
      removeToast(loadingId);
      addToast('Tambah transaksi berhasil!', { type: 'success' });

    } catch (err) {
      removeToast(loadingId);
      addToast(
        err?.response?.data?.message || 'Gagal',
        { type: 'error' }
      );
    }

  };

  return (
    <section>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? 'Tutup' : 'Tambah'}
      </button>

      <div
        className={`
          transition-all duration-200 flex flex-col gap-3
          ${isOpen
      ? 'opacity-100 visible'
      : 'opacity-0 invisible'}
        `}
      >
        {Object.keys(PLACEHOLDERS).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleTambah(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <FormTransactionComponent
        items={items}
        handleDelete={handleDelete}
        handleChangeValue={(id, value) =>
          handleUpdateItem(id, 'unitPrice', value)
        }
        handleChangeNameTransaction={(id, value) =>
          handleUpdateItem(id, 'name', value)
        }
        handleChangeQty={(id, value) =>
          handleUpdateItem(id, 'qty', value)
        }
      />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button
        type="button"
        onClick={handleSubmit}
      >
        Tes
      </button>
    </section>
  );
}