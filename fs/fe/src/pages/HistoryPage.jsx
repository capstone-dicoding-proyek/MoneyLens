/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import LayoutMainContent from '../components/LayoutMainContent';
import HistoryCardComponent from '../components/HistoryCardComponent';
import { getTransactionHistory } from '../api/transaction';
import { QUERY_KEYS } from '../api/query-keys';
import {
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
  FaSpinner,
  FaCaretUp,
  FaCaretDown,
} from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import { FaCalendarAlt } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import {
  addDays,
  formatWeekLabel,
  getDateLabel,
  getMondayOf,
  groupByDate,
  monthRange,
  toParam,
} from '../utils/date-helper';
import { calcChange } from '../utils/format-rupiah';
import SummaryCardComponent from '../components/SummaryCardComponent';
import CustomDatePickerComponent from '../components/CustomDatePickerComponent';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { IoIosClose } from 'react-icons/io';
import ModalTypeComponent from '../components/ModalTypeComponent';
import TransactionDetailModal from '../components/TransactionItemModal';

const PERIODS = ['Mingguan', 'Bulanan', 'Tahunan', 'Custom'];
const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];


export default function HistoryPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState({
    modalItem: false,
    modalNavbar: false,
    modalType: false,
  });
  const [activePeriod, setActivePeriod] = useState('Bulanan');
  const [activeType, setActiveType] = useState('');
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [prevSummary, setPrevSummary] = useState({ income: 0, expense: 0 });
  const [availableYears, setAvailableYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stickyTitle, setStickyTitle] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [detailItem, setDetailItem] = useState({});

  const today = new Date();
  const [weekMonday, setWeekMonday] = useState(getMondayOf(today));
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [yearIdx, setYearIdx] = useState(0);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [customApplied, setCustomApplied] = useState({ start: '', end: '' });

  const scrollRef = useRef(null);
  const sentinelRef = useRef(null);
  const debounceRef = useRef(null);

  /* handle search */
  const handleSearchInput = (val) => {
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    if (val.trim() !== search) {
      setIsSearching(true);
    }
    debounceRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 1000);
  };

  const handleClearSearch = () => {
    clearTimeout(debounceRef.current);
    setSearchInput('');
    setSearch('');
    setPage(1);
    setIsSearching(false);
  };

  const buildParams = useCallback(
    (overridePage = 1) => {
      const base = new URLSearchParams();

      if (activePeriod === 'Custom') {
        if (!customApplied.start || !customApplied.end) return null;
        base.set('startDate', customApplied.start);
        base.set('endDate', customApplied.end);
      } else if (activePeriod === 'Mingguan') {
        base.set('startDate', toParam(weekMonday));
        base.set('endDate', toParam(addDays(weekMonday, 6)));
      } else if (activePeriod === 'Bulanan') {
        const { start, end } = monthRange(year, month);
        base.set('startDate', toParam(start));
        base.set('endDate', toParam(end));
      } else if (activePeriod === 'Tahunan' && availableYears.length > 0) {
        const y = availableYears[yearIdx];
        base.set('startDate', `${y}-01-01`);
        base.set('endDate', `${y}-12-31`);
      } else {
        return null;
      }

      if (search) base.set('search', search);
      if (activeType) base.set('type', activeType);
      base.set('page', overridePage);
      base.set('limit', 20);

      return `?${base.toString()}`;
    },
    [
      activePeriod,
      weekMonday,
      month,
      year,
      availableYears,
      yearIdx,
      customApplied,
      search,
      activeType,
    ],
  );

  /* fetch history */
  const fetchHistory = useCallback(async () => {
    const params = buildParams(1);
    if (!params) return;
    setLoading(true);
    setPage(1);
    try {
      const res = await queryClient.fetchQuery({
        queryKey: QUERY_KEYS.history(params),
        queryFn: () => getTransactionHistory(params),
        staleTime: 1000 * 60 * 5,
      });
      const payload = res.data;
      setHistory(payload.history ?? []);
      setSummary(payload.summary ?? { income: 0, expense: 0, balance: 0 });
      setPrevSummary(payload.previousSummary ?? { income: 0, expense: 0 });
      setHasMore(payload.pagination?.hasMore ?? false);

      const years = payload.availableYears ?? [];
      setAvailableYears(years);
      setYearIdx((prev) => {
        if (activePeriod === 'Tahunan' && years.length > 0 && prev === 0) {
          const idx = years.indexOf(today.getFullYear());
          return idx >= 0 ? idx : years.length - 1;
        }
        return prev;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [buildParams, activePeriod, queryClient]);

  /* load more */
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    const params = buildParams(nextPage);
    if (!params) return;

    setLoadingMore(true);
    try {
      const res = await queryClient.fetchQuery({
        queryKey: QUERY_KEYS.history(params),
        queryFn: () => getTransactionHistory(params),
        staleTime: 1000 * 60 * 5,
      });
      const payload = res.data;

      setHistory((prev) => [...prev, ...(payload.history ?? [])]);
      setHasMore(payload.pagination?.hasMore ?? false);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, buildParams, queryClient]);

  /* infinite scroll */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  /* render period search type lek berubah */
  useEffect(() => {
    if (activePeriod === 'Custom') return;
    fetchHistory();
  }, [activePeriod, weekMonday, month, year, yearIdx, search, activeType]);

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return;
    setCustomApplied({ start: customStart, end: customEnd });
  };

  useEffect(() => {
    if (!customApplied.start || !customApplied.end) return;
    fetchHistory();
  }, [customApplied]);

  const goPrev = () => {
    if (activePeriod === 'Mingguan') setWeekMonday((d) => addDays(d, -7));
    else if (activePeriod === 'Bulanan') {
      if (month === 0) {
        setMonth(11);
        setYear((y) => y - 1);
      } else setMonth((m) => m - 1);
    } else if (activePeriod === 'Tahunan') {
      setYearIdx((i) => Math.max(0, i - 1));
    }
  };

  const goNext = () => {
    if (activePeriod === 'Mingguan') setWeekMonday((d) => addDays(d, 7));
    else if (activePeriod === 'Bulanan') {
      if (month === 11) {
        setMonth(0);
        setYear((y) => y + 1);
      } else setMonth((m) => m + 1);
    } else if (activePeriod === 'Tahunan') {
      setYearIdx((i) => Math.min(availableYears.length - 1, i + 1));
    }
  };

  const getPeriodLabel = () => {
    if (activePeriod === 'Mingguan') return formatWeekLabel(weekMonday);
    if (activePeriod === 'Bulanan') return `${MONTHS[month]} ${year}`;
    if (activePeriod === 'Tahunan')
      return availableYears[yearIdx]?.toString() ?? '–';
    if (activePeriod === 'Custom' && customStart)
      return `${customStart} – ${customEnd}`;
    return 'Pilih rentang';
  };

  const getPrevLabel = () => {
    if (activePeriod === 'Mingguan')
      return formatWeekLabel(addDays(weekMonday, -7)).split('–')[0].trim();
    if (activePeriod === 'Bulanan') return MONTHS[month === 0 ? 11 : month - 1];
    if (activePeriod === 'Tahunan')
      return availableYears[yearIdx - 1]?.toString() ?? '';
    return '';
  };

  const getNextLabel = () => {
    if (activePeriod === 'Mingguan')
      return formatWeekLabel(addDays(weekMonday, 7)).split('–')[0].trim();
    if (activePeriod === 'Bulanan') return MONTHS[month === 11 ? 0 : month + 1];
    if (activePeriod === 'Tahunan')
      return availableYears[yearIdx + 1]?.toString() ?? '';
    return '';
  };

  const canGoPrev =
    activePeriod !== 'Custom' && !(activePeriod === 'Tahunan' && yearIdx === 0);
  const canGoNext =
    activePeriod !== 'Custom' &&
    !(activePeriod === 'Tahunan' && yearIdx === availableYears.length - 1);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    container.querySelectorAll('[data-date]').forEach((section) => {
      const rect = section.getBoundingClientRect();
      const cRect = container.getBoundingClientRect();
      if (rect.top <= cRect.top + 80 && rect.bottom >= cRect.top + 40)
        setStickyTitle(section.getAttribute('data-date'));
    });
  };
  const grouped = groupByDate(history);

  const incomeChange = calcChange(summary.income, prevSummary.income);
  const expenseChange = calcChange(summary.expense, prevSummary.expense);
  const balanceChange = calcChange(
    summary.balance,
    prevSummary.income - prevSummary.expense,
  );
  const handleOpenDetailItem = (data) => {
    setDetailItem(data);
    setIsOpen((p) => ({ ...p, modalDetailItem: true }));
  };
  const clearDataDetailItem = () => {
    setDetailItem([]);
  };
  return (
    <LayoutMainContent
      isOpen={isOpen.modalNavbar}
      onChangeIsOpen={() =>
        setIsOpen((p) => ({ ...p, modalNavbar: !p.modalNavbar }))
      }
    >
      {isOpen.modalDetailItem && (
        <TransactionDetailModal
          fetchData={fetchHistory}
          transaction={detailItem}
          clearDataDetailItem={clearDataDetailItem}
          onClose={() => setIsOpen((p) => ({ ...p, modalDetailItem: false }))}
        />
      )}
      <div className="w-full flex flex-col gap-5 p-6 md:p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-1">
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
                Riwayat Mutasi
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Daftar lengkap catatan keuangan dan pelacakan transaksi
              </p>
            </div>
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="w-48 sm:w-64 px-4 py-2 pl-9 pr-8 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2FA084] focus:ring-2 focus:ring-emerald-500/15 shadow-2xs transition-all"
            />
            <div className="absolute left-3 flex items-center justify-center pointer-events-none text-xs">
              {isSearching ? (
                <FaSpinner className="animate-spin text-[#1A7A5E] text-xs" />
              ) : (
                <FaSearch className="text-slate-400 text-xs" />
              )}
            </div>
            {searchInput.trim() !== '' && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Hapus pencarian"
              >
                <IoCloseOutline className="text-base" />
              </button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCardComponent
            title="Pemasukan"
            amount={summary.income}
            change={incomeChange}
            colorClass="text-emerald-600"
            loading={loading}
          />
          <SummaryCardComponent
            title="Pengeluaran"
            amount={summary.expense}
            change={-expenseChange}
            colorClass="text-rose-600"
            loading={loading}
          />
          <SummaryCardComponent
            title="Saldo Periode Ini"
            amount={summary.balance}
            change={balanceChange}
            colorClass={
              summary.balance >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }
            balance={summary.balance}
            income={summary.income}
            expense={summary.expense}
            loading={loading}
          />
        </div>

        {/* Period Tabs & Navigator Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/60 backdrop-blur-xs rounded-2xl border border-slate-200/80 shadow-xs">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setActivePeriod(p);
                  setPage(1);
                }}
                className={
                  activePeriod === p
                    ? 'pill-button-active'
                    : 'pill-button-inactive'
                }
              >
                {p}
              </button>
            ))}
          </div>

          {/* Type filter badge dropdown */}
          <div className="flex items-center gap-2">
            <ModalTypeComponent
              isOpen={isOpen.modalType}
              setIsOpen={() =>
                setIsOpen((p) => ({ ...p, modalType: !p.modalType }))
              }
              activeType={activeType}
              buttons={[
                {
                  type: '',
                  title: 'Semua Transaksi',
                  onHandle: () => {
                    setActiveType('');
                    setPage(1);
                    setIsOpen((p) => ({ ...p, modalType: false }));
                  },
                },
                {
                  type: 'income',
                  title: 'Pemasukan Saja',
                  onHandle: () => {
                    setActiveType((prev) =>
                      prev === 'income' ? '' : 'income',
                    );
                    setPage(1);
                    setIsOpen((p) => ({ ...p, modalType: false }));
                  },
                },
                {
                  type: 'expense',
                  title: 'Pengeluaran Saja',
                  onHandle: () => {
                    setActiveType((prev) =>
                      prev === 'expense' ? '' : 'expense',
                    );
                    setPage(1);
                    setIsOpen((p) => ({ ...p, modalType: false }));
                  },
                },
              ]}
            />
          </div>
        </div>

        {/* Custom Date Picker */}
        {activePeriod === 'Custom' && (
          <div className="card-base p-4">
            <CustomDatePickerComponent
              customEnd={customEnd}
              customStart={customStart}
              handleApplyCustom={handleApplyCustom}
              setCustomEnd={setCustomEnd}
              setCustomStart={setCustomStart}
            />
          </div>
        )}

        {/* Navigator */}
        {activePeriod !== 'Custom' && (
          <div className="card-base p-4 flex items-center justify-between shadow-2xs">
            <button
              onClick={goPrev}
              disabled={!canGoPrev}
              className="btn-outline text-xs px-3 py-1.5"
            >
              <FaAngleLeft />
              <span className="hidden sm:inline">{getPrevLabel()}</span>
            </button>
            <div className="text-center">
              <div className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                {getPeriodLabel()}
              </div>
              <div className="text-xs text-slate-400 font-medium">{activePeriod}</div>
            </div>
            <button
              onClick={goNext}
              disabled={!canGoNext}
              className="btn-outline text-xs px-3 py-1.5"
            >
              <span className="hidden sm:inline">{getNextLabel()}</span>
              <FaAngleRight />
            </button>
          </div>
        )}

        {/* Transaction List */}
        <div
          className="card-base p-0 overflow-hidden flex flex-col shadow-xs"
          style={{ minHeight: 400 }}
        >
          <div className="sticky top-0 bg-slate-50/90 backdrop-blur-xs border-b border-slate-100 px-6 py-3 z-10 flex items-center justify-between">
            <span
              className={`text-xs font-bold text-slate-500 uppercase tracking-wider transition-opacity duration-200 ${
                stickyTitle ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {stickyTitle}
            </span>
            <div className="text-xs font-semibold text-slate-400">
              {activeType === 'income'
                ? 'Hanya Pemasukan'
                : activeType === 'expense'
                  ? 'Hanya Pengeluaran'
                  : 'Semua Kategori'}
            </div>
          </div>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto custom-scrollbar"
            style={{ maxHeight: 560 }}
          >
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-slate-100 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : grouped.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-2 p-6 text-center">
                <span className="text-4xl">📭</span>
                <span className="text-sm font-semibold text-slate-600">
                  {searchInput
                    ? 'Tidak ada transaksi yang cocok dengan pencarian'
                    : 'Belum ada catatan transaksi pada periode ini'}
                </span>
                <span className="text-xs text-slate-400">
                  Ubah filter periode atau tambahkan transaksi baru.
                </span>
              </div>
            ) : (
              grouped.map(([dateKey, items]) => (
                <div key={dateKey}>
                  <div data-date={getDateLabel(dateKey)} className="px-6 pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {getDateLabel(dateKey)}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {items.length} transaksi
                      </span>
                    </div>
                    <div className="space-y-2.5 pb-4 border-b border-slate-100 last:border-0">
                      {items.map((tx) => (
                        <div
                          key={tx.id}
                          onClick={() => handleOpenDetailItem(tx)}
                        >
                          <HistoryCardComponent item={tx} />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* infinite scroll */}
                  <div ref={sentinelRef} className="py-4 flex justify-center">
                    {loadingMore && (
                      <div className="flex gap-2 items-center">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-[#2FA084] rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    )}
                    {!hasMore && history.length > 0 && (
                      <div className="text-xs text-slate-400 font-medium">
                        Semua transaksi sudah ditampilkan
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </LayoutMainContent>
  );
}
