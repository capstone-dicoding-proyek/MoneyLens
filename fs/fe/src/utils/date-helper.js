export  const getMondayOf = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0, 0, 0, 0);
  return d;
};

export const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};


export const toParam = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const formatWeekLabel = (monday) => {
  const sunday = addDays(monday, 6);
  const opts = { day: 'numeric', month: 'short' };
  return `${monday.toLocaleDateString('id-ID', opts)} – ${sunday.toLocaleDateString('id-ID', { ...opts, year: 'numeric' })}`;
};

export const monthRange = (year, month) => ({
  start: new Date(year, month, 1),
  end: new Date(year, month + 1, 0),
});

export const getDateLabel = (isoKey) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tx = new Date(isoKey);
  tx.setHours(0, 0, 0, 0);
  const diff = Math.round((today - tx) / 86400000);
  const fmt = (d, y) =>
    d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      ...(y && { year: 'numeric' }),
    });
  if (diff === 0) return `Hari ini, ${fmt(tx)}`;
  if (diff === 1) return `Kemarin, ${fmt(tx)}`;
  if (diff <= 6) return `${diff} hari lalu, ${fmt(tx)}`;
  return fmt(tx, true);
};

export const groupByDate = (items) => {
  const map = new Map();
  items.forEach((item) => {
    const key = item.transactionDate.split('T')[0];
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  });
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
};




export function getDateRange(period, { month, year, weekMonday } = {}) {
  const pad = (d) => d.toISOString().split('T')[0];
  const today = new Date();

  if (period === 'week') {
    const monday = weekMonday ?? getMondayOf(today);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { startDate: pad(monday), endDate: pad(sunday) };
  }

  if (period === 'month') {
    const m = month ?? today.getMonth();
    const y = year ?? today.getFullYear();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0);
    return { startDate: pad(start), endDate: pad(end) };
  }

  if (period === 'year') {
    const y = year ?? today.getFullYear();
    return {
      startDate: `${y}-01-01`,
      endDate: `${y}-12-31`,
    };
  }

  return {};
}

export const pad = (d) => d.toISOString().split('T')[0];

