import { FaCalendarAlt } from 'react-icons/fa';
import { formatDate } from '../utils/format-time';

export default function CustomDatePickerComponent({
  customStart,
  setCustomStart,
  customEnd,
  setCustomEnd,
  handleApplyCustom,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 ml-2">
      <div className="flex items-center gap-1 text-sm text-tthird">
        <FaCalendarAlt className="text-primary" />
        <input
          type="date"
          value={customStart}
          onChange={(e) => setCustomStart(e.target.value)}
          className="border border-line rounded-md px-2 py-1 text-sm focus:outline-none focus:border-primary"
        />
        <span>–</span>
        <input
          type="date"
          value={customEnd}
          onChange={(e) => setCustomEnd(e.target.value)}
          className="border border-line rounded-md px-2 py-1 text-sm focus:outline-none focus:border-primary"
        />
      </div>
      <button
        onClick={handleApplyCustom}
        disabled={!customStart || !customEnd}
        className="bg-primary text-white text-sm px-4 py-1.5 rounded-lg hover:bg-secondary transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        Terapkan
      </button>
      {customStart && customEnd ? (
        <div className="flex  gap-3 *:text-tthird *:text-sm">
          <p>{formatDate(customStart)}</p>
          <span> - </span>
          <p>{formatDate(customEnd)}</p>
        </div>
      ) : null}
    </div>
  );
}
