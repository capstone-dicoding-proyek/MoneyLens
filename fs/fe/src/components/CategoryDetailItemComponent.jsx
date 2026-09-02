/* eslint-disable camelcase */
import { MdFastfood, MdHomeRepairService, MdSelectAll } from 'react-icons/md';
import { formatRupiah } from '../utils/format-rupiah.js';
import { FaBox } from 'react-icons/fa';
import { TbTax } from 'react-icons/tb';

const typeLabel = {
  food_drink: 'Makanan & Minuman',
  service: 'Jasa',
  product: 'Produk',
  fee: 'Pajak',
  other: 'Lainnya',
};

const iconLabel = {
  food_drink: <MdFastfood className="text-xl text-amber-600" />,
  service: <FaBox className="text-xl text-blue-600" />,
  product: <MdHomeRepairService className="text-xl text-emerald-600" />,
  fee: <TbTax className="text-xl text-purple-600" />,
  other: <MdSelectAll className="text-xl text-slate-600" />,
};

const iconBg = {
  food_drink: 'bg-amber-50 border-amber-200/60',
  service: 'bg-blue-50 border-blue-200/60',
  product: 'bg-emerald-50 border-emerald-200/60',
  fee: 'bg-purple-50 border-purple-200/60',
  other: 'bg-slate-100 border-slate-200/60',
};

export default function CategoryDetailItemComponent({ item }) {
  const enhancedItem = {
    ...item,
    name: typeLabel[item.detailType] || item.detailType || 'Lainnya',
    icon: iconLabel[item.detailType] || <MdSelectAll className="text-xl text-slate-600" />,
    bg: iconBg[item.detailType] || 'bg-slate-100 border-slate-200/60',
  };

  return (
    <div className="card-interactive min-w-[200px] flex-shrink-0 space-y-3">
      <div className="flex items-center justify-between">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs ${enhancedItem.bg}`}
        >
          {enhancedItem.icon}
        </div>
        <span className="text-xs font-bold text-[#2FA084] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
          {enhancedItem.percent}%
        </span>
      </div>

      <div>
        <div className="text-xs font-semibold text-slate-500 truncate mb-1">
          {enhancedItem.name}
        </div>
        <div className="font-bold text-lg text-slate-900 tracking-tight">
          {formatRupiah(enhancedItem.total)}
        </div>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#1A7A5E] to-[#2FA084] h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(enhancedItem.percent, 100)}%` }}
        />
      </div>
    </div>
  );
}
