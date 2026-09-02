import { GoHomeFill } from 'react-icons/go';
import { FaHistory } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { Link, useRouterState } from '@tanstack/react-router';
import useAuth from '../hooks/useAuth';

const navItems = [
  { icon: GoHomeFill, label: 'Beranda', link: '/', key: 'home' },
  { icon: FaHistory, label: 'Riwayat', link: '/history', key: 'history' },
];

export default function NavbarSide({ isOpen, onChangeIsOpen }) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const { user, handleLogout } = useAuth();
  const isActive = (link) =>
    link === '/' ? pathname === '/' : pathname.startsWith(link);

  const initials = (user?.fullname || user?.email || 'U')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
          onClick={onChangeIsOpen}
        />
      )}

      <aside
        className={`
          fixed md:relative z-50 h-screen flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{
          width: 230,
          background:
            'linear-gradient(175deg, #135A45 0%, #1A7A5E 40%, #2FA084 100%)',
          borderRadius: '0 24px 24px 0',
          padding: '24px 16px',
          boxShadow: '12px 0 36px rgba(19,90,69,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* Ambient decorative glow */}
        <div className="pointer-events-none absolute -top-16 -right-12 w-44 h-44 rounded-full bg-emerald-400/10 blur-xl" />
        <div className="pointer-events-none absolute bottom-12 -left-10 w-36 h-36 rounded-full bg-emerald-300/10 blur-xl" />

        {/* Mobile close button */}
        <button
          onClick={onChangeIsOpen}
          className="absolute top-5 right-4 md:hidden text-white/70 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Tutup menu"
        >
          <IoClose size={24} />
        </button>

        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 pb-6 mb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shadow-inner">
            <span className="text-white font-extrabold text-base tracking-tight">M</span>
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight block">
              Money<span className="text-emerald-200 font-light">Lens</span>
            </span>
            <span className="text-[10px] text-emerald-200/70 uppercase tracking-widest font-semibold block">
              Finance Tracker
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const NavIcon = item.icon;
            const active = isActive(item.link);
            return (
              <Link
                to={item.link}
                key={item.key}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onChangeIsOpen();
                  }
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl w-full text-left transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-white text-[#1A7A5E] shadow-md shadow-emerald-950/20 font-bold'
                    : 'text-white/85 hover:text-white hover:bg-white/12 font-medium'
                }`}
              >
                <span
                  className={`
                    w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-all
                    ${active ? 'bg-emerald-50 text-[#1A7A5E]' : 'bg-white/10 text-white'}
                  `}
                >
                  <NavIcon className="text-base" />
                </span>
                <span className="text-xs tracking-wide">{item.label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1A7A5E]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Mini Profile Snippet */}
        {user && (
          <div className="p-2.5 rounded-xl bg-white/8 border border-white/10 mb-2 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {user.fullname || 'Pengguna'}
              </div>
              <div className="text-[10px] text-white/60 truncate">{user.email}</div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl w-full group transition-all duration-200 bg-white/6 border border-white/10 hover:bg-rose-500/20 hover:border-rose-400/30 cursor-pointer text-white/80 hover:text-rose-200"
        >
          <MdLogout className="text-base group-hover:text-rose-300 transition-colors" />
          <span className="text-xs font-semibold group-hover:text-rose-300 transition-colors">
            Keluar
          </span>
        </button>
      </aside>
    </>
  );
}
