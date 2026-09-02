import { useState } from 'react';
import ModalLayoutInputAndProfil from './ModalLayoutInputAndProfil';
import useAuth from '../hooks/useAuth';
import useInputs from '../hooks/useInput';
import { useToast } from '../hooks/useToast';
import { FaSpinner } from 'react-icons/fa';
import { useUpdateProfileMutation } from '../hooks/useTransactionsQuery';
import { IoMailOutline, IoPersonOutline } from 'react-icons/io5';
import { getErrorMessage } from '../utils/get-error-message';
import FormErrorAlert from './FormErrorAlert';

export default function ProfilModalComponent({ onClose }) {
  const { addToast } = useToast();
  const [error, setError] = useState('');
  const { user, refreshUser } = useAuth();
  const [fullName, onChangeFullName] = useInputs(user?.fullname || '');
  const updateMutation = useUpdateProfileMutation();
  const loading = updateMutation.isPending;

  const handleUpdateName = async () => {
    if (fullName.trim() === user?.fullname?.trim()) {
      onClose();
      return;
    }
    try {
      await updateMutation.mutateAsync({ fullname: fullName });
      await refreshUser?.();
      onClose();
      addToast('Update profil berhasil!', { type: 'success' });
    } catch (err) {
      setError(
        getErrorMessage(err, 'Gagal memperbarui profil. Silakan coba lagi.'),
      );
    }
  };

  const initials = (user?.fullname || user?.email || 'U')
    .slice(0, 2)
    .toUpperCase();

  return (
    <ModalLayoutInputAndProfil title="Profil Pengguna" onClose={onClose}>
      <div className="p-6 space-y-5">
        {/* User Hero Avatar */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1A7A5E] to-[#2FA084] text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-emerald-800/20">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-slate-900 truncate">
              {user?.fullname || 'Pengguna MoneyLens'}
            </h3>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            {user?.verified_email && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full mt-1">
                Terverifikasi
              </span>
            )}
          </div>
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="input-label">Email</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm">
              <IoMailOutline className="text-slate-400 text-base" />
              <span className="truncate">{user?.email}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="input-label">Nama Lengkap</label>
            <div className="relative flex items-center">
              <IoPersonOutline className="absolute left-3.5 text-slate-400 text-base pointer-events-none" />
              <input
                type="text"
                onChange={(e) => onChangeFullName(e.target.value)}
                value={fullName}
                placeholder="Masukkan nama baru..."
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>

        {error && (
          <FormErrorAlert
            message={error}
            onClose={() => setError('')}
          />
        )}
      </div>

      <div className="modal-footer">
        <button
          type="button"
          onClick={onClose}
          className="btn-outline"
        >
          Batal
        </button>
        <button
          onClick={handleUpdateName}
          type="button"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            'Simpan Perubahan'
          )}
        </button>
      </div>
    </ModalLayoutInputAndProfil>
  );
}
