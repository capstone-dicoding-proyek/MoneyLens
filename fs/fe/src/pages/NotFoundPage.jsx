import { Link } from '@tanstack/react-router';
import { IoArrowBackOutline } from 'react-icons/io5';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-5 bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl shadow-slate-900/5">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-[#1A7A5E] flex items-center justify-center font-black text-3xl mx-auto border border-emerald-100 shadow-sm">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="btn-primary w-full py-3"
          >
            <IoArrowBackOutline className="text-base" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
