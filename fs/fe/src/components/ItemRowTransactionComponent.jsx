import { IoTrashOutline } from 'react-icons/io5';
import { calcItemTotal, DETAIL_TYPES, HAS_QUANTITY } from '../utils/transaction-helper';

export default function ItemRowTransactionComponent({ item, onChange, onRemove, index }) {
  const hasQty = HAS_QUANTITY.includes(item.detailType);

  return (
    <div className="border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5 bg-slate-50/70 hover:bg-white transition-all shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Item #{index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
          title="Hapus item"
        >
          <IoTrashOutline className="text-base" />
        </button>
      </div>

      {/* Type & Name */}
      <div className="flex gap-2 max-sm:flex-col">
        <select
          value={item.detailType}
          onChange={(e) => onChange({ ...item, detailType: e.target.value, quantity: 1 })}
          className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:border-[#2FA084] flex-shrink-0 cursor-pointer"
        >
          {DETAIL_TYPES.map((dt) => (
            <option key={dt.value} value={dt.value}>{dt.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nama barang / menu..."
          value={item.name}
          onChange={(e) => onChange({ ...item, name: e.target.value })}
          className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs bg-white text-slate-900 focus:outline-none focus:border-[#2FA084]"
        />
      </div>

      {/* Price, Qty, Total */}
      <div className="flex gap-2.5 items-end">
        <div className="flex-1">
          <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Harga Satuan</label>
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:border-[#2FA084]">
            <span className="px-2.5 text-xs font-semibold text-slate-400 bg-slate-50 border-r border-slate-200 py-1.5">Rp</span>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={item.unitPrice}
              onChange={(e) => onChange({ ...item, unitPrice: e.target.value })}
              className="flex-1 px-2.5 py-1.5 text-xs font-medium focus:outline-none w-0"
            />
          </div>
        </div>

        {hasQty && (
          <div className="w-20">
            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Qty</label>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => onChange({ ...item, quantity: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold bg-white focus:outline-none focus:border-[#2FA084] text-center"
            />
          </div>
        )}

        <div className="flex-shrink-0 text-right min-w-[90px]">
          <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Subtotal</label>
          <div className="text-xs font-bold text-emerald-700 py-1.5">
            Rp {calcItemTotal(item).toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  );
}