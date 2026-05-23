import { useState } from 'react';
import ModalLayoutInputAndProfil from './ModalLayoutInputAndProfil';
import useAuth from '../hooks/useAuth';
import useInputs from '../hooks/useInput';
import { putUserName } from '../api/user';
import { useToast } from '../hooks/useToast';
import { FaSpinner } from 'react-icons/fa';

export default function ProfilModalComponent({ onClose }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [fullName, onChangeFullName] = useInputs(user.fullname);
  const handleUpdateName = async () => {
    if (fullName.trim() === user.fullname.trim()) {
      onClose();
      return;
    }
    setLoading(true);
    try {
      await putUserName({ fullname: fullName });
      setLoading(false);
      onClose();
      addToast('Update profil berhasil!', { type: 'success' });
    } catch (err) {
      setLoading(false);
      setError(
        err?.response?.data?.message || err?.message || 'Terjadi kesalahan',
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <ModalLayoutInputAndProfil title="Profil" onClose={onClose}>
      {/* body */}
      <div className="group border border-line rounded-xl m-3 p-3 space-y-2 bg-gray-50 hover:bg-white transition">
        {/* Type  Name */}

        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <label className="text-xs text-tthird mb-1 block">Email</label>
            <div className="flex items-center border border-line rounded-lg overflow-hidden bg-white focus-within:border-primary">
              <p className="flex-1 px-2 py-1.5 text-sm w-0">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <label className="text-xs text-tthird mb-1 block">Nama</label>
            <div className="flex items-center border border-line rounded-lg overflow-hidden bg-white focus-within:border-primary">
              <input
                type="text"
                onChange={(e) => onChangeFullName(e.target.value)}
                value={fullName}
                placeholder="Ubah nama..."
                className="flex-1 px-2 py-1.5 text-sm focus:outline-none w-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/*   Total  Submit */}
      <div className="flex-shrink-0 border-t border-line px-5 py-4 space-y-3">
        {error && (
          <div className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        <button
          onClick={handleUpdateName}
          type="button"
          disabled={loading}
          className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Menyimpan...
            </>
          ) : (
            'Simpan'
          )}
        </button>
      </div>
    </ModalLayoutInputAndProfil>
  );
}
