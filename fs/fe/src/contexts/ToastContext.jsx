import { createContext, useState, useEffect, useRef } from 'react';

const ToastContext = createContext();

const ICONS = {
  normal: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
    </svg>
  ),
  success: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

const ICON_STYLES = {
  normal: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  success: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
  error:   'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
  loading: 'border-purple-200 border-t-purple-600 dark:border-purple-800 dark:border-t-purple-400',
};

const BAR_STYLES = {
  normal:  'bg-purple-500 dark:bg-purple-400',
  success: 'bg-green-500 dark:bg-green-400',
  error:   'bg-red-500 dark:bg-red-400',
  loading: 'bg-purple-500 dark:bg-purple-400 animate-pulse',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  function addToast(message, { duration = 3000, type = 'normal' } = {}) {
    // eslint-disable-next-line react-hooks/purity
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, progress: 100, duration, type }]);
    return id;
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timersRef.current[id]) {
      clearInterval(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setToasts((prev) =>
        prev
          .map((t) => {
            if (t.type === 'loading') return t;
            const decrement = 100 / (t.duration / 40);
            return { ...t, progress: Math.max(t.progress - decrement, 0) };
          })
          .filter((t) => !(t.type !== 'loading' && t.progress <= 0))
      );
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      <div className="fixed top-14 right-5 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="w-68 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg"
            style={{ animation: 'toastIn 0.2s ease' }}
          >
            <div className="flex items-center gap-2.5 px-3 py-2.5 min-h-11.5">

              {t.type === 'loading' ? (
                <div className="w-5.5 h-5.5 rounded-full border-2 border-purple-200 border-t-purple-600 dark:border-purple-800 dark:border-t-purple-400 animate-spin shrink-0" />
              ) : (
                <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 ${ICON_STYLES[t.type]}`}>
                  {ICONS[t.type]}
                </div>
              )}

              <span className="flex-1 text-sm text-gray-800 dark:text-gray-100 leading-snug">
                {t.message}
              </span>

              {t.type !== 'loading' && (
                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  aria-label="Close"
                  className="shrink-0 w-5.5 h-5.5 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div
              className={`h-[2.5px] transition-all duration-75 ${BAR_STYLES[t.type]}`}
              style={{ width: t.type === 'loading' ? '100%' : `${t.progress}%` }}
            />
          </div>
        ))}
      </div>

      <style>{'@keyframes toastIn { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: translateX(0); } }'}</style>
    </ToastContext.Provider>
  );
}

export default ToastContext;