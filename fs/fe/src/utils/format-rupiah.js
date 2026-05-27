export const formatRupiah = (amount = 0) => {
  return `Rp ${  amount.toLocaleString('id-ID')}`;
};

export const calcChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};
