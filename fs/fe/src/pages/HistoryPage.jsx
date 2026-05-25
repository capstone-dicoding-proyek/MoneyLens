/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from 'react';
import LayoutMainContent from '../components/LayoutMainContent';
import HistoryCardComponent from '../components/HistoryCardComponent';
import { getTransactionHistory } from '../api/transaction';
import {
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
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

const PERIOD_RANGE_MAP = {
  Mingguan: 'week',
  Bulanan: 'month',
  Tahunan: 'year',
};

export default function HistoryPage() {
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
    debounceRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
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
      const res = await getTransactionHistory(params);
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
    }
  }, [buildParams, activePeriod]);

  /* load more */
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    const params = buildParams(nextPage);
    if (!params) return;

    setLoadingMore(true);
    try {
      const res = await getTransactionHistory(params);
      const payload = res.data;

      setHistory((prev) => [...prev, ...(payload.history ?? [])]);
      setHasMore(payload.pagination?.hasMore ?? false);
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, buildParams]);

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
          <div className="max-sm:hidden font-bold text-2xl">Riwayat</div>
          <div className="relative flex">
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="focus:outline-none border border-line p-2 pl-4 pr-10 rounded-full text-sm bg-white placeholder:text-tthird focus:border-primary transition w-52"
            />
            {searchInput.trim() === '' ? (
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-tthird text-sm" />
            ) : (
              <IoCloseOutline
                onClick={() => handleSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tthird text-sm"
              />
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCardComponent
            title="Pemasukan"
            amount={summary.income}
            change={incomeChange}
            colorClass="text-primary"
            loading={loading}
          />
          <SummaryCardComponent
            title="Pengeluaran"
            amount={summary.expense}
            change={-expenseChange}
            colorClass="text-red-500"
            loading={loading}
          />
          <SummaryCardComponent
            title="Saldo Periode Ini"
            amount={Math.abs(summary.balance)}
            change={balanceChange}
            colorClass={
              summary.balance >= 0 ? 'text-green-600' : 'text-red-600'
            }
            balance={summary.balance}
            income={summary.income}
            expense={summary.expense}
            loading={loading}
          />
        </div>

        {/* Period Tabs */}
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => {
                setActivePeriod(p);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition duration-200 cursor-pointer
                ${
            activePeriod === p
              ? 'bg-primary text-white border-primary'
              : 'border-line text-tthird hover:border-primary hover:text-primary'
            }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Custom Date Picker */}
        {activePeriod === 'Custom' && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-line rounded-xl">
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
          <div className="flex items-center justify-between bg-white border border-line rounded-xl px-5 py-3">
            <button
              onClick={goPrev}
              disabled={!canGoPrev}
              className="flex items-center gap-2 text-tthird hover:text-primary transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <FaAngleLeft />
              <span className="text-sm hidden sm:block">{getPrevLabel()}</span>
            </button>
            <div className="text-center">
              <div className="font-bold text-primary text-lg">
                {getPeriodLabel()}
              </div>
              <div className="text-xs text-tthird">{activePeriod}</div>
            </div>
            <button
              onClick={goNext}
              disabled={!canGoNext}
              className="flex items-center gap-2 text-tthird hover:text-primary transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="text-sm hidden sm:block">{getNextLabel()}</span>
              <FaAngleRight />
            </button>
          </div>
        )}

        {/* Transaction List */}
        <div
          className="bg-white rounded-xl border border-line overflow-hidden flex flex-col"
          style={{ minHeight: 400 }}
        >
          <div className="sticky top-0 bg-white border-b border-line px-5 py-2 z-10 flex items-center justify-between">
            {/* Title */}
            <span
              className={`text-sm font-semibold text-tthird transition-opacity duration-200 ${stickyTitle ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              {stickyTitle}
            </span>
            {/* modal type */}
            <ModalTypeComponent
              isOpen={isOpen.modalType}
              setIsOpen={() =>
                setIsOpen((p) => ({ ...p, modalType: !p.modalType }))
              }
              activeType={activeType}
              buttons={[
                {
                  type: 'income',
                  title: 'Pemasukan',
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
                  title: 'Pengeluaran',
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

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto scrollbar-hide"
            style={{ maxHeight: 560 }}
          >
            {loading ? (
              <div className="p-5 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : grouped.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-tthird gap-2">
                <span className="text-4xl">📭</span>
                <span className="text-sm">
                  {searchInput
                    ? 'Tidak ada hasil pencarian'
                    : 'Tidak ada transaksi di periode ini'}
                </span>
              </div>
            ) : (
              grouped.map(([dateKey, items]) => (
                <div key={dateKey}>
                  <div data-date={getDateLabel(dateKey)} className="px-5 pt-5">
                    <div className="flex justify-between">
                      <div className="text-sm font-semibold text-tthird mb-3">
                        {getDateLabel(dateKey)}
                      </div>
                    </div>
                    <div className="space-y-2 pb-4 border-b border-line last:border-0">
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
                  {/* infinite scroll  */}
                  <div ref={sentinelRef} className="py-3 flex justify-center">
                    {loadingMore && (
                      <div className="flex gap-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    )}
                    {!hasMore && history.length > 0 && (
                      <div className="text-xs text-tthird">
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
