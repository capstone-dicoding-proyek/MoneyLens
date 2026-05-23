
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