import { useMemo, useState } from 'react';
import NavbarSide from '../components/NavbarSide';
import { MdAddCard } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';
import HistoryCardComponent from '../components/HistoryCardComponent';
import { formatRupiah } from '../utils/format-rupiah';
import TopStatComponent from '../components/TopStatComponent';
import CategoryDetailItemComponent from '../components/CategoryDetailItemComponent';
import PieChartComponent from '../components/PieChartComponent';
import LayoutMainContent from '../components/LayoutMainContent';
import CustomDatePickerComponent from '../components/CustomDatePickerComponent';
import { IoPersonOutline } from 'react-icons/io5';
import InputTransactionComponent from '../components/InputTransactionComponent';
import { Link } from '@tanstack/react-router';
import ProfilModalComponent from '../components/ProfilModalComponent';
import LineChartComponent from '../components/LineChartComponent';
import ModalTypeComponent from '../components/ModalTypeComponent';
import TransactionDetailModal from '../components/TransactionItemModal';
import { getDateRange } from '../utils/date-helper';
import { formatDate } from '../utils/format-time';
import { useDashboardQuery } from '../hooks/useTransactionsQuery';

const PERIOD_RANGE_MAP = {
  Mingguan: 'week',
  Bulanan: 'month',
  Tahunan: 'year',
  Custom: 'custom',
};

export default function DashboardPage() {
  const [activePeriod, setActivePeriod] = useState('month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [customApplied, setCustomApplied] = useState({ start: '', end: '' });
  const [detailItem, setDetailItem] = useState({});
  const [activeType, setActiveType] = useState('pie');
  const [isOpen, setIsOpen] = useState({
    modalTransaction: false,
    modalNavbar: false,
    modalProfil: false,
    modalChart: false,
    modalDetailItem: false,
  });

  const params = useMemo(() => {
    if (activePeriod === 'custom') {
      if (!customApplied.start || !customApplied.end) return '';
      return `?startDate=${customApplied.start}&endDate=${customApplied.end}`;
    }
    const { startDate, endDate } = getDateRange(activePeriod);
    return startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
  }, [activePeriod, customApplied]);

  const { data: dashboardRes, isLoading: loading, refetch: fetchDashboard } = useDashboardQuery(params);
  const dashboard = dashboardRes?.data;

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return;
    setCustomApplied({ start: customStart, end: customEnd });
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
            fetchData={fetchDashboard}
          />
        )}
        {isOpen.modalDetailItem && (
          <TransactionDetailModal
            fetchData={fetchDashboard}
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
        <div className="flex items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <button
                type="button"
                onClick={() =>
                  setIsOpen((p) => ({ ...p, modalNavbar: !p.modalNavbar }))
                }
                className="btn-icon"
                aria-label="Buka Menu"
              >
                <RxHamburgerMenu className="text-2xl" />
              </button>
            </div>
            <div>
              <h1 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Ringkasan Finansial
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Pantau arus kas, pengeluaran, dan kesehatan finansial Anda.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() =>
                setIsOpen((p) => ({
                  ...p,
                  modalTransaction: !p.modalTransaction,
                }))
              }
              type="button"
              className="btn-primary"
            >
              <MdAddCard className="text-lg" />
              <span className="hidden sm:inline">Catat Transaksi</span>
            </button>

            <button
              onClick={() =>
                setIsOpen((p) => ({ ...p, modalProfil: !p.modalProfil }))
              }
              type="button"
              className="btn-icon bg-white border border-slate-200 text-slate-700 hover:text-[#1A7A5E] hover:border-emerald-500 shadow-xs"
              aria-label="Profil Pengguna"
            >
              <IoPersonOutline className="text-lg" />
            </button>
          </div>
        </div>

        {/*  Period Filter  */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/60 backdrop-blur-xs rounded-2xl border border-slate-200/80 w-fit shadow-xs">
          {Object.entries(PERIOD_RANGE_MAP).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setActivePeriod(value)}
              className={
                activePeriod === value
                  ? 'pill-button-active'
                  : 'pill-button-inactive'
              }
            >
              {key}
            </button>
          ))}

          {activePeriod === 'custom' && (
            <CustomDatePickerComponent
              customEnd={customEnd}
              customStart={customStart}
              handleApplyCustom={handleApplyCustom}
              setCustomEnd={setCustomEnd}
              setCustomStart={setCustomStart}
            />
          )}
          {activePeriod !== 'custom' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium px-2">
              <span>{formatDate(getDateRange(activePeriod).startDate)}</span>
              <span>–</span>
              <span>{formatDate(getDateRange(activePeriod).endDate)}</span>
            </div>
          )}
        </div>

        {/* Top Stats  */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TopStatComponent
            number={summary.expense}
            title="Pengeluaran"
            type="pengeluaran"
            loading={loading}
            income={summary.income}
            expense={summary.expense}
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
            income={summary.income}
            expense={summary.expense}
          />
        </div>

        {/* Kategori & Chart  */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Kategori */}
          <div className="card-base lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Pengeluaran per Kategori
                </h3>
                <p className="text-xs text-slate-500">
                  Distribusi pengeluaran berdasarkan jenis kebutuhan
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex gap-3 pb-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[180px] h-36 bg-slate-100 rounded-2xl animate-pulse flex-shrink-0"
                  />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-44 text-slate-400 text-sm border border-dashed border-slate-200 rounded-2xl p-6 text-center">
                <span className="font-semibold text-slate-600 mb-1">Belum ada data pengeluaran</span>
                <span className="text-xs">Catat transaksi pertama Anda untuk melihat statistik kategori.</span>
              </div>
            ) : (
              <div
                className="flex gap-3 overflow-x-auto scrollbar-hide active:cursor-grabbing pb-2"
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

          {/* Chart Perbandingan */}
          <div className="card-base lg:col-span-5 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Perbandingan Arus Kas
                </h3>
                <p className="text-xs text-slate-500">
                  Pemasukan vs Pengeluaran
                </p>
              </div>

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
                    title: 'Pie Chart',
                    onHandle: () => {
                      setActiveType('pie');
                      setIsOpen((p) => ({ ...p, modalChart: false }));
                    },
                  },
                  {
                    type: 'line',
                    title: 'Line Chart',
                    onHandle: () => {
                      setActiveType('line');
                      setIsOpen((p) => ({ ...p, modalChart: false }));
                    },
                  },
                ]}
              />
            </div>

            <div className="flex-1 flex items-center justify-center">
              {loading ? (
                <div className="w-full h-48 bg-slate-100 rounded-2xl animate-pulse" />
              ) : !hasChartData ? (
                <div className="flex flex-col items-center justify-center h-44 text-slate-400 text-sm border border-dashed border-slate-200 rounded-2xl w-full p-4 text-center">
                  <span className="font-semibold text-slate-600 mb-1">Tidak ada data untuk grafik</span>
                  <span className="text-xs">Data transaksi akan muncul di sini.</span>
                </div>
              ) : activeType === 'pie' ? (
                <PieChartComponent data={pieData} />
              ) : (
                <LineChartComponent data={chart} />
              )}
            </div>

            <div className="border-t border-slate-100 pt-3 mt-3 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  Pemasukan
                </span>
                <span className="font-bold text-emerald-600">
                  {formatRupiah(summary.income ?? 0)}
                </span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  Pengeluaran
                </span>
                <span className="font-bold text-rose-600">
                  {formatRupiah(summary.expense ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/*  Aktivitas Terbaru  */}
        <div className="card-base">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Aktivitas Terbaru
              </h3>
              <p className="text-xs text-slate-500">
                Daftar mutasi keuangan terakhir pada periode terpilih
              </p>
            </div>
            <Link
              to="/history"
              className="text-xs font-bold text-[#1A7A5E] hover:text-[#2FA084] transition-colors"
            >
              Lihat Semua →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-slate-100 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-28 text-slate-400 text-sm border border-dashed border-slate-200 rounded-2xl p-6 text-center">
              <span className="font-semibold text-slate-600 mb-1">Belum ada aktivitas</span>
              <span className="text-xs">Klik tombol "Catat Transaksi" untuk mulai mencatat keuangan.</span>
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
