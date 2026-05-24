import { useEffect, useState } from 'react';
import NavbarSide from '../components/NavbarSide';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { IoMdAdd } from 'react-icons/io';
import { MdAddCard, MdFastfood, MdHomeRepairService } from 'react-icons/md';
import { FaBorderAll, FaBox } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import {
  MdShoppingCart,
  MdDirectionsBus,
  MdHealthAndSafety,
} from 'react-icons/md';
import { FaCalendarAlt } from 'react-icons/fa';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import HistoryCardComponent from '../components/HistoryCardComponent';
import { formatRupiah } from '../utils/format-rupiah';
import TopStatComponent from '../components/TopStatComponent';
import CategoryDetailItemComponent from '../components/CategoryDetailItemComponent';
import PieChartComponent from '../components/PieChartComponent';
import LayoutMainContent from '../components/LayoutMainContent';
import { TbTax } from 'react-icons/tb';
import { getTransactionDashboard } from '../api/transaction';
import { useCallback } from 'react';
import CustomDatePickerComponent from '../components/CustomDatePickerComponent';
import { IoAddCircleOutline, IoPersonOutline } from 'react-icons/io5';
import InputTransactionComponent from '../components/InputTransactionComponent';
import { Link } from 'react-router-dom';
import ProfilModalComponent from '../components/ProfilModalComponent';
import LineChartComponent from '../components/LineChartComponent';
import ModalTypeComponent from '../components/ModalTypeComponent';
import TransactionDetailModal from '../components/TransactionItemModal';
import { getDateRange } from '../utils/date-helper';

const PERIOD_RANGE_MAP = {
  Mingguan: 'week',
  Bulanan: 'month',
  Tahunan: 'year',
  Custom: 'custom',
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [activePeriod, setActivePeriod] = useState('month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [detailItem, setDetailItem] = useState({});
  const [activeType, setActiveType] = useState('pie');
  const [isOpen, setIsOpen] = useState({
    modalTransaction: false,
    modalNavbar: false,
    modalProfil: false,
    modalChart: false,
    modalDetailItem: false,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async (params = '') => {
    setLoading(true);
    try {
      const res = await getTransactionDashboard(params);
      setDashboard(res.data);
    // eslint-disable-next-line no-unused-vars, no-empty
    } catch (err) {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activePeriod === 'custom') return;

    const { startDate, endDate } = getDateRange(activePeriod);

    const params =
      startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard(params);
  }, [activePeriod]);

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return;
    fetchDashboard(`?startDate=${customStart}&endDate=${customEnd}`);
  };

  const summary = dashboard?.summary ?? {};
  const categories = dashboard?.category ?? [];
  const history = dashboard?.history ?? [];
  const chart = dashboard?.chart ?? [];

  const pieData = [
    { name: 'Pemasukan', value: summary.income },
    { name: 'Pengeluaran', value: summary.expense },
  ];

  const handleOpenDetailItem = (data) => {
    setDetailItem(data);
    setIsOpen((p) => ({ ...p, modalDetailItem: true }));
  };
  const clearDataDetailItem = () => {
    setDetailItem([]);
  };
  const hasChartData = (summary.income ?? 0) > 0 || (summary.expense ?? 0) > 0;

  return (
    <LayoutMainContent
      isOpen={isOpen.modalNavbar}
      onChangeIsOpen={() =>
        setIsOpen((p) => ({ ...p, modalNavbar: !p.modalNavbar }))
      }
    >
      <div className="w-full flex flex-col gap-4 p-6 md:p-12 overflow-x-hidden">
        {/* card input transaction */}
        {isOpen.modalTransaction && (
          <InputTransactionComponent
            onClose={() =>
              setIsOpen((p) => ({
                ...p,
                modalTransaction: !p.modalTransaction,
              }))
            }
            fetchData = {fetchDashboard}
          />
        )}
        {isOpen.modalDetailItem && (
          <TransactionDetailModal
            fetchData = {fetchDashboard}
            transaction={detailItem}
            clearDataDetailItem={clearDataDetailItem}
            onClose={() => setIsOpen((p) => ({ ...p, modalDetailItem: false }))}
          />
        )}
        {isOpen.modalProfil && (
          <ProfilModalComponent
            onClose={() =>
              setIsOpen((p) => ({ ...p, modalProfil: !p.modalProfil }))
            }
          />
        )}
        {/* Header  */}
        <div className="flex items-center justify-between">
          <div className="md:hidden">
            <button
              type="button"
              onClick={() =>
                setIsOpen((p) => ({ ...p, modalNavbar: !p.modalNavbar }))
              }
            >
              <RxHamburgerMenu className="text-3xl active:ring-1 active:ring-primary transition ease-in" />
            </button>
          </div>
          <div className="font-bold max-md:hidden text-2xl">
            Money<span className="font-extralight">Lens</span>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div
              onClick={() =>
                setIsOpen((p) => ({
                  ...p,
                  modalTransaction: !p.modalTransaction,
                }))
              }
              className="cursor-pointer  px-2 group rounded-md hover:bg-primary active:bg-primary transition ease-in ring-2 py-1 ring-primary"
            >
              <MdAddCard className=" text-2xl group-hover:text-white group-active:text-white text-primary transition ease-in" />
            </div>
            <div
              onClick={() =>
                setIsOpen((p) => ({ ...p, modalProfil: !p.modalProfil }))
              }
              className="cursor-pointer  px-1  group rounded-full   transition ease-in "
            >
              <IoPersonOutline className=" text-xl group-hover:text-white group-active:text-black/60 text-black transition ease-in" />
            </div>
          </div>
        </div>

        {/*  Period Filter  */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(PERIOD_RANGE_MAP).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setActivePeriod(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition duration-200 cursor-pointer
                ${
            activePeriod === value
              ? 'bg-primary text-white border-primary'
              : 'border-line text-tthird hover:border-primary hover:text-primary'
            }`}
            >
              {key}
            </button>
          ))}

          {activePeriod === null && (
            <CustomDatePickerComponent
              customEnd={customEnd}
              customStart={customStart}
              handleApplyCustom={handleApplyCustom}
              setCustomEnd={setCustomEnd}
              setCustomStart={setCustomStart}
            />
          )}
        </div>

        {/* Top Stats  */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TopStatComponent
            number={summary.expense}
            title="Pengeluaran"
            type="pengeluaran"
            loading={loading}
          />
          <TopStatComponent
            number={summary.income}
            title="Pemasukan"
            type="pemasukan"
            loading={loading}
          />
          <TopStatComponent
            number={summary.balance}
            title="Saldo Bersih"
            type="balance"
            isBalancePositive={(summary.balance ?? 0) >= 0}
            loading={loading}
          />
        </div>

        {/* Kategori  Chart  */}
        <div className="flex gap-4 max-lg:flex-col">
          {/* Kategori */}
          <div className="bg-white lg:w-[55%] rounded-xl border border-line p-5">
            <div className="text-xl font-semibold mb-3">Pengeluaran Saya</div>

            {loading ? (
              <div className="flex gap-3 pb-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[160px] h-40 bg-gray-100 rounded-xl animate-pulse flex-shrink-0"
                  />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-tthird text-sm">
                Belum ada data pengeluaran
              </div>
            ) : (
              <div
                className="flex flex-wrap gap-3 overflow-x-auto scrollbar-hide active:cursor-grabbing pb-2"
                onWheel={(e) => {
                  if (e.deltaY !== 0) {
                    e.currentTarget.scrollLeft += e.deltaY;
                    e.preventDefault();
                  }
                }}
              >
                {categories.map((cat) => (
                  <CategoryDetailItemComponent
                    key={cat.detailType}
                    item={cat}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl border border-line p-5 flex-1">
            <div className="flex justify-between">
              <div>
                <div className="text-xl font-semibold">Perbandingan</div>
                <div className="text-xs text-tthird mb-2">
                  Pemasukan vs Pengeluaran
                </div>
              </div>
              {/* modal type */}
              <ModalTypeComponent
                isOpen={isOpen.modalChart}
                setIsOpen={() =>
                  setIsOpen((p) => ({ ...p, modalChart: !p.modalChart }))
                }
                icon={false}
                activeType={activeType}
                buttons={[
                  {
                    type: 'pie',
                    title: 'Pie chart',
                    onHandle: () => {
                      setActiveType('pie');
                      setIsOpen((p) => ({ ...p, modalChart: false }));
                    },
                  },
                  {
                    type: 'line',
                    title: 'Line chart',
                    onHandle: () => {
                      setActiveType('line');
                      setIsOpen((p) => ({ ...p, modalChart: false }));
                    },
                  },
                ]}
              />
            </div>

            {loading ? (
              <div className="h-52 bg-gray-100 rounded-xl animate-pulse" />
            ) : !hasChartData ? (
              <div className="flex items-center justify-center h-48 text-tthird text-sm">
                Belum ada data
              </div>
            ) : activeType === 'pie' ? (
              <PieChartComponent data={pieData} />
            ) : (
              <LineChartComponent data={chart} />
            )}

            <div className="border-t border-line pt-3 mt-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-tthird flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                  Pemasukan
                </span>
                <span className="font-semibold text-green-500">
                  {formatRupiah(summary.income ?? 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-tthird flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                  Pengeluaran
                </span>
                <span className="font-semibold text-red-500">
                  {formatRupiah(summary.expense ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/*  Aktivitas Terbaru  */}
        <div className="bg-white rounded-xl border border-line p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold text-xl">Aktivitas Terbaru</div>
            <div className="text-tthird hover:text-primary cursor-pointer text-sm transition">
              <Link to="/history">Selengkapnya →</Link>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-tthird text-sm">
              Belum ada aktivitas
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {history.map((tx) => (
                <div key={tx.id} onClick={() => handleOpenDetailItem(tx)}>
                  <HistoryCardComponent item={tx} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutMainContent>
  );
}
