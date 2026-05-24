import { IoIosPaper } from 'react-icons/io';
import { formatRupiah } from '../utils/format-rupiah.js';
import { formatDate } from '../utils/format-time.js';
export default function HistoryCardComponent({ item }) {


  return (
    <div  className="bg-white rounded-xl border border-line p-4 flex items-center gap-3 hover:bg-line cursor-pointer transition duration-200">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                    ${item.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}
      >
        <IoIosPaper
          className={`text-xl ${item.type === 'income' ? 'text-green-500' : 'text-red-400'}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">
          {' '}
          {item.type === 'expense'
            ? item.description?.trim() || '-'
            : item.nameIncome?.trim() || '-'}
        </div>
        <div className="text-xs text-tthird">
          {formatDate(item.transactionDate)}
        </div>
        {item.items?.length > 0 && (
          <div className="text-xs text-tthird mt-0.5">
            {item.items.length} item · klik untuk detail
          </div>
        )}
      </div>
      <div
        className={`flex-shrink-0 font-bold text-sm ${item.type === 'income' ? 'text-green-500' : 'text-red-500'}`}
      >
        {item.type === 'income' ? '+' : ''}
        {formatRupiah(item.totalAmount)}
      </div>
    </div>
  );
}
