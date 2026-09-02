/* eslint-disable react-hooks/set-state-in-effect */
import { Link, useNavigate } from '@tanstack/react-router';
import GreenRectangle from '../components/LoginPageComponent';
import { MdEmail } from 'react-icons/md';
import InputComponent from '../components/InputComponent';
import useInputs from '../hooks/useInput';
import { useEffect, useRef, useState } from 'react';
import { getRemainingCooldown, startCooldown } from '../utils/resend-cooldown';
import { useToast } from '../hooks/useToast';
import { sendResetPassword } from '../api/auth';
import { formatTime } from '../utils/format-time';
import FormAuthComponent from '../components/FormAuthComponent';
import LayoutAuthComponent from '../components/LayoutAuthComponent';
import ButtonComponent from '../components/ButtonComponent';

import { getErrorMessage } from '../utils/get-error-message';

const RESEND_KEY = 'resend_reset_password_end_time';
const RESEND_COOLDOWN = 180;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, onChangeEmail] = useInputs();
  const [count, setCount] = useState(() => getRemainingCooldown(RESEND_KEY));
  const [isResending, setIsResending] = useState(false);
  const timerRef = useRef(null);
  const { addToast } = useToast();

  const startTimer = () => {
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
  };

  useEffect(() => {
    const remaining = getRemainingCooldown(RESEND_KEY);
    if (remaining > 0) {
      setCount(remaining);
      startTimer();
    }
    return () => clearInterval(timerRef.current);
  }, []);

  const handleSend = async () => {
    if (!email.trim()) {
      addToast('Email tidak boleh kosong', { type: 'error' });
      return;
    }
    if (count > 0 || isResending) return;

    setIsResending(true);
    try {
      await sendResetPassword(email);
      addToast('Email reset password telah dikirim!', { type: 'success' });
      startCooldown({ key: RESEND_KEY, duration: RESEND_COOLDOWN, setState: setCount });
      startTimer();
      navigate({ to: '/reset-password' });
    } catch (err) {
      addToast(
        getErrorMessage(err, 'Gagal mengirim ulang email reset password.'),
        { type: 'error' }
      );
    } finally {
      setIsResending(false);
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
            Lupa Password?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            Masukkan email terdaftar untuk menerima tautan reset kata sandi Anda.
          </p>
        </div>

        {/* Form */}
        <FormAuthComponent>
          <InputComponent
            required={true}
            label="Email Terdaftar"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChangeValue={onChangeEmail}
            leftIcon={MdEmail}
          />

          <ButtonComponent
            onClick={handleSend}
            isLoading={isResending}
            title={
              isResending
                ? 'Mengirim...'
                : count > 0
                  ? `Kirim ulang (${formatTime(count)})`
                  : 'Kirim Tautan Reset'
            }
            disabled={count > 0 || isResending}
            className="w-full py-3"
          />
        </FormAuthComponent>

        <div className="text-center pt-2 text-xs text-slate-500">
          Ingat kata sandi Anda?{' '}
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
