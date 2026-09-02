/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from 'react';
import { sendResetPassword } from '../api/auth';
import InputComponent from '../components/InputComponent';
import useInputs from '../hooks/useInput';
import { getRemainingCooldown, startCooldown } from '../utils/resend-cooldown';
import { useToast } from '../hooks/useToast';
import { formatTime } from '../utils/format-time';
import { Link, useNavigate } from '@tanstack/react-router';
import GreenRectangle from '../components/LoginPageComponent';
import LayoutAuthComponent from '../components/LayoutAuthComponent';
import FormAuthComponent from '../components/FormAuthComponent';
import ButtonComponent from '../components/ButtonComponent';
import { MdEmail } from 'react-icons/md';

import { getErrorMessage } from '../utils/get-error-message';

const RESEND_KEY = 'resend_reset_password_end_time';
const RESEND_COOLDOWN = 180;

export default function ResetPasswordPage() {
  const [email, onChangeEmail] = useInputs();
  const [count, setCount] = useState(() => getRemainingCooldown(RESEND_KEY));
  const [isResending, setIsResending] = useState(false);
  const timerRef = useRef(null);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          localStorage.removeItem(RESEND_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    const remaining = getRemainingCooldown(RESEND_KEY);
    if (remaining > 0) {
      setCount(remaining);
      startTimer();
    }
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const handleSend = async () => {
    if (!email.trim()) {
      addToast('Email tidak boleh kosong', { type: 'error' });
      return;
    }
    if (count > 0 || isResending) return;

    setIsResending(true);
    try {
      await sendResetPassword(email);
      addToast('Email verifikasi telah dikirim', { type: 'success' });
      startCooldown({
        key: RESEND_KEY,
        duration: RESEND_COOLDOWN,
        setState: setCount,
      });
      startTimer();
      navigate({ to: '/reset-password' });
    } catch (err) {
      addToast(getErrorMessage(err, 'Gagal mengirim ulang email reset password.'), {
        type: 'error',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <GreenRectangle>
      <LayoutAuthComponent>
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A7A5E] to-[#2FA084] text-white flex items-center justify-center font-black text-xl mx-auto shadow-md shadow-emerald-800/20 mb-3">
            M
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Verifikasi Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            Masukkan email Anda untuk menerima tautan konfirmasi.
          </p>
        </div>

        <FormAuthComponent>
          <InputComponent
            label="Email"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChangeValue={onChangeEmail}
            leftIcon={MdEmail}
            required
          />

          <ButtonComponent
            onClick={handleSend}
            isLoading={isResending}
            title={
              isResending
                ? 'Mengirim...'
                : count > 0
                  ? `Kirim ulang (${formatTime(count)})`
                  : 'Kirim Tautan'
            }
            disabled={count > 0 || isResending}
            className="w-full py-3"
          />
        </FormAuthComponent>

        <div className="text-center pt-2 text-xs text-slate-500">
          <Link
            to="/login"
            className="font-bold text-[#1A7A5E] hover:text-[#2FA084] transition-colors"
          >
            Kembali ke Login
          </Link>
        </div>
      </LayoutAuthComponent>
    </GreenRectangle>
  );
}
