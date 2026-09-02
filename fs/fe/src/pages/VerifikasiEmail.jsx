import { useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { verifyEmail } from '../api/auth';
import { useToast } from '../hooks/useToast';
import GreenRectangle from '../components/LoginPageComponent';
import LayoutAuthComponent from '../components/LayoutAuthComponent';
import { FaSpinner } from 'react-icons/fa';

import { getErrorMessage } from '../utils/get-error-message';

export default function VerifikasiEmailPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false });
  const token = searchParams?.token || new URLSearchParams(window.location.search).get('token');
  const { addToast } = useToast();

  useEffect(() => {
    if (!token) return;
    async function sendVerifEmail() {
      try {
        await verifyEmail(token);
        addToast('Verifikasi email berhasil! Selamat datang.', { type: 'success' });
        navigate({ to: '/' });
      } catch (err) {
        addToast(
          getErrorMessage(err, 'Terjadi kesalahan saat memverifikasi email Anda.'),
          { type: 'error' }
        );
        navigate({ to: '/login' });
      }
    }
    sendVerifEmail();
  }, [token, addToast, navigate]);

  return (
    <GreenRectangle>
      <LayoutAuthComponent>
        <div className="text-center space-y-4 py-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 text-[#1A7A5E] flex items-center justify-center text-3xl mx-auto shadow-sm">
            <FaSpinner className="animate-spin text-2xl" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Memverifikasi Akun...
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            Mohon tunggu sebentar selagi kami memvalidasi email Anda.
          </p>
        </div>
      </LayoutAuthComponent>
    </GreenRectangle>
  );
}