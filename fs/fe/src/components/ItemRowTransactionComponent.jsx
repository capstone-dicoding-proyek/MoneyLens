import { IoTrashOutline } from 'react-icons/io5';
import { calcItemTotal, DETAIL_TYPES, HAS_QUANTITY } from '../utils/transaction-helper';


export default function ItemRowTransactionComponent({ item, onChange, onRemove, index }) {
  const hasQty = HAS_QUANTITY.includes(item.detailType);

  return (
    <div className="group border border-line rounded-xl p-3 space-y-2 bg-gray-50 hover:bg-white transition">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-tthird">Item #{index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="text-tthird hover:text-red-500 transition text-sm"
        >
          <IoTrashOutline />
        </button>
      </div>

      {/* Type  Name */}
      <div className="flex gap-2 max-sm:flex-col">
        <select
          value={item.detailType}
          onChange={(e) => onChange({ ...item, detailType: e.target.value, quantity: 1 })}
          className="border border-line rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-primary flex-shrink-0"
        >
          {DETAIL_TYPES.map((dt) => (
            <option key={dt.value} value={dt.value}>{dt.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nama item..."
          value={item.name}
          onChange={(e) => onChange({ ...item, name: e.target.value })}
          className="flex-1 border border-line rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-primary"
        />
      </div>

      {/* Price  Qty  Total */}
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <label className="text-xs text-tthird mb-1 block">Harga Satuan</label>
          <div className="flex items-center border border-line rounded-lg overflow-hidden bg-white focus-within:border-primary">
            <span className="px-2 text-xs text-tthird bg-gray-50 h-full flex items-center border-r border-line py-1.5">Rp</span>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={item.unitPrice}
              onChange={(e) => onChange({ ...item, unitPrice: e.target.value })}
              className="flex-1 px-2 py-1.5 text-sm focus:outline-none w-0"
            />
          </div>
        </div>

        {hasQty && (
          <div className="w-20">
            <label className="text-xs text-tthird mb-1 block">Qty</label>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => onChange({ ...item, quantity: e.target.value })}
              className="w-full border border-line rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-primary text-center"
            />
          </div>
        )}

        <div className="flex-shrink-0">
          <label className="text-xs text-tthird mb-1 block">Subtotal</label>
          <div className="text-sm font-semibold text-primary py-1.5">
            Rp {calcItemTotal(item).toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  );
}