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
  food_drink: <MdFastfood className="text-2xl" />,
  service: <FaBox className="text-2xl" />,
  product: <MdHomeRepairService className="text-2xl" />,
  fee: <TbTax className="text-2xl" />,
  other: <MdSelectAll className="text-2xl" />,
};

export default function CategoryDetailItemComponent({ item }) {


  item = item = {
    ...item,
    name: typeLabel[item.detailType] || '',
    icon: iconLabel[item.detailType] || '',
  };

  return (
    <div className="bg-white min-w-[180px] flex-shrink-0 rounded-xl cursor-pointer border border-line hover:bg-line transition duration-300 p-4 space-y-2">
      <div className="bg-secondary items-center flex justify-center w-10 h-10 rounded-lg">
        {item.icon}
      </div>
      <div className="text-sm font-medium leading-tight">{item.name}</div>
      <div className="font-bold text-lg">{formatRupiah(item.total)}</div>
      <div className="text-xs text-tthird">
        Sebesar <span className="text-primary font-bold">{item.percent}%</span>{' '}
        dari total
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className="bg-primary h-1.5 rounded-full"
          style={{ width: `${item.percent}%` }}
        />
      </div>
    </div>
  );
}
