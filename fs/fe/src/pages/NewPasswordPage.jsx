import { useState } from 'react';
import InputComponent from '../components/InputComponent';
import useInputs from '../hooks/useInput';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { resetPassword } from '../api/user';
import FormAuthComponent from '../components/FormAuthComponent';
import { useToast } from '../hooks/useToast';
import { FaLock } from 'react-icons/fa';
import GreenRectangle from '../components/LoginPageComponent';
import LayoutAuthComponent from '../components/LayoutAuthComponent';
import ButtonComponent from '../components/ButtonComponent';

import { getErrorMessage } from '../utils/get-error-message';

export default function NewPasswordPage() {
  const { addToast, removeToast } = useToast();
  const searchParams = useSearch({ strict: false });
  const token = searchParams?.token || new URLSearchParams(window.location.search).get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [password, onChangePassword] = useInputs();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSendNewPassword = async () => {
    if (!password || password.length < 8) {
      addToast('Password minimal 8 karakter', { type: 'error' });
      return;
    }
    const loadingId = addToast('Sedang memproses...', { type: 'loading' });
    setIsLoading(true);
    try {
      await resetPassword({ password, token });
      removeToast(loadingId);
      addToast('Reset password berhasil!', { type: 'success' });
      navigate({ to: '/login' });
    } catch (err) {
      removeToast(loadingId);
      addToast(
        getErrorMessage(err, 'Gagal memperbarui kata sandi. Silakan coba lagi.'),
        { type: 'error' }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GreenRectangle>
      <LayoutAuthComponent>
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A7A5E] to-[#2FA084] text-white flex items-center justify-center font-black text-xl mx-auto shadow-md shadow-emerald-800/20 mb-3">
            M
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Atur Password Baru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            Buat kata sandi baru yang kuat untuk mengamankan akun Anda.
          </p>
        </div>

        <FormAuthComponent>
          <InputComponent
            label="Password Baru"
            placeholder="Minimal 8 karakter..."
            toggle={true}
            onChangeToggle={() => setShowPassword((p) => !p)}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChangeValue={onChangePassword}
            leftIcon={FaLock}
            required
          />

          <ButtonComponent
            onClick={onSendNewPassword}
            isLoading={isLoading}
            title="Perbarui Password"
            className="w-full py-3"
          />
        </FormAuthComponent>
      </LayoutAuthComponent>
    </GreenRectangle>
  );
}
