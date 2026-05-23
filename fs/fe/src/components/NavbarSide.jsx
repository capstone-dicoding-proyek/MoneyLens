/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { GoHomeFill } from 'react-icons/go';
import { FaUser, FaHistory } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { HiMenuAlt2 } from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const navItems = [
  { icon: GoHomeFill, label: 'Beranda', link: '/', key: 'home' },
  { icon: FaHistory, label: 'Riwayat', link: '/history', key: 'history' },
];

export default function NavbarSide({ isOpen, onChangeIsOpen }) {
  const { pathname } = useLocation();
  const { handleLogout } = useAuth();
  const isActive = (link) =>
    link === '/' ? pathname === '/' : pathname.startsWith(link);
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
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
          width: 220,
          background:
            'linear-gradient(160deg, #1A7A5E 0%, #2FA084 45%, #6FCF97 100%)',
          borderRadius: '0 20px 20px 0',
          padding: '28px 16px',
          boxShadow: '8px 0 32px rgba(47,160,132,0.22)',
          overflow: 'hidden',
        }}
      >
        {/* Dekor lingkaran */}
        <div className="pointer-events-none absolute -top-16 -right-12 w-48 h-48 rounded-full bg-white/[0.07]" />
        <div className="pointer-events-none absolute bottom-10 -left-10 w-32 h-32 rounded-full bg-white/[0.05]" />

        {/* Tombol tutup  */}
        <button
          onClick={onChangeIsOpen}
          className="absolute top-5 right-4 md:hidden text-white/70 hover:text-white transition"
        >
          <IoMdCloseCircleOutline size={26} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 px-2 pb-6 mb-5 border-b border-white/15">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-white font-semibold text-[15px] tracking-tight">
            Money<span className="font-extralight text-white">Lens</span>
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label, key, link }) => {
            const active = isActive(link);
            return (
              <Link
                to={link}
                key={key}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onChangeIsOpen();
                  }
                }}
                className={`
                flex items-center gap-3 px-3 py-[10px] rounded-xl w-full text-left
                transition-all duration-200
                ${active ? 'bg-white/95' : 'hover:bg-white/18'}
              `}
              >
                <span
                  className={`
                  w-9 h-9 flex items-center justify-center rounded-[9px] flex-shrink-0 transition-all
                  ${active ? 'bg-[#2FA084]/12' : 'bg-white/15'}
                `}
                >
                  <Icon
                    className={`text-[17px] transition-colors ${
                      active ? 'text-[#2FA084]' : 'text-white/90'
                    }`}
                  />
                </span>
                <span
                  className={`text-sm font-medium transition-colors ${
                    active ? 'text-[#1A7A5E] font-semibold' : 'text-white/90'
                  }`}
                >
                  {label}
                </span>
                {active && (
                  <span className="ml-auto w-[6px] h-[6px] rounded-full bg-[#2FA084]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="h-px bg-white/12 mx-1 my-3" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-[10px] rounded-xl w-full group transition-all duration-200 bg-white/8 border border-white/12 hover:bg-red-500/20 hover:border-red-400/30">
          <MdLogout className="text-[17px] text-white/80 group-hover:text-red-300 transition-colors" />
          <span className="text-sm font-medium text-white/80 group-hover:text-red-300 transition-colors">
            Keluar
          </span>
        </button>
      </aside>
    </>
  );
}
