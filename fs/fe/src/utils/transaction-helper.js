
export const calcItemTotal = (item) => {
  const price = Number(item.unitPrice) || 0;
  const qty   = HAS_QUANTITY.includes(item.detailType) ? Number(item.quantity) || 1 : 1;
  return price * qty;
};

export const calcGrandTotal = (items) =>
  items.reduce((sum, item) => sum + calcItemTotal(item), 0);


export const DETAIL_TYPES = [
  { value: 'food_drink', label: 'Makanan & Minuman' },
  { value: 'product',    label: 'Produk / Barang' },
  { value: 'service',    label: 'Jasa' },
  { value: 'fee',        label: 'Biaya / Tagihan' },
  { value: 'other',      label: 'Lainnya' },
];

export const HAS_QUANTITY = ['food_drink', 'product'];


export const getWarning = (income, expense) => {
  if (income === 0 && expense === 0) return null;
  if (income === 0 && expense > 0)
    return { label: 'Tidak ada pemasukan!', level: 'danger' };
  const ratio = expense / income;
  if (ratio >= 0.8) return { label: 'Boros! Hampir habis',     level: 'danger' };
  if (ratio >= 0.5) return { label: 'Hati-hati, cukup tinggi', level: 'warn'   };
  return null;
};
