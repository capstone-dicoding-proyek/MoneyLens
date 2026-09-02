/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useToast } from '../hooks/useToast';
import { resendVerifyEmail } from '../api/auth';
import useAuth from '../hooks/useAuth';
import { getRemainingCooldown, startCooldown } from '../utils/resend-cooldown';
import { formatTime } from '../utils/format-time';
import GreenRectangle from '../components/LoginPageComponent';
import LayoutAuthComponent from '../components/LayoutAuthComponent';
import FormAuthComponent from '../components/FormAuthComponent';
import ButtonComponent from '../components/ButtonComponent';
import { IoMailUnreadOutline } from 'react-icons/io5';

import { getErrorMessage } from '../utils/get-error-message';

const RESEND_KEY = 'resend_email_end_time';
const RESEND_COOLDOWN = 180;

export default function ResendVerifikasiEmailPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  const [count, setCount] = useState(() => getRemainingCooldown(RESEND_KEY));
  const [isResending, setIsResending] = useState(false);
  const timerRef = useRef(null);

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
    if (user?.verified_email) navigate({ to: '/', replace: true });
  }, [user, navigate]);

  useEffect(() => {
    const remaining = getRemainingCooldown(RESEND_KEY);
    if (remaining > 0) {
      setCount(remaining);
      startTimer();
    }
    return () => clearInterval(timerRef.current);
  }, []);

  const handleResend = async () => {
    if (count > 0 || isResending) return;

    setIsResending(true);
    try {
      await resendVerifyEmail();
      addToast('Email verifikasi telah dikirim!', { type: 'success' });
      startCooldown({ key: RESEND_KEY, duration: RESEND_COOLDOWN, setState: setCount });
      startTimer();
    } catch (err) {
      addToast(
        getErrorMessage(err, 'Gagal mengirim ulang email verifikasi.'),
        { type: 'error' }
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <GreenRectangle>
      <LayoutAuthComponent>
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 text-[#1A7A5E] flex items-center justify-center text-3xl mx-auto shadow-sm">
            <IoMailUnreadOutline />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Verifikasi Email Anda
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            Kami telah mengirim tautan verifikasi ke email Anda. Silakan periksa kotak masuk atau folder spam.
          </p>
        </div>

        <FormAuthComponent>
          <ButtonComponent
            onClick={handleResend}
            isLoading={isResending}
            title={
              isResending
                ? 'Mengirim...'
                : count > 0
                  ? `Kirim ulang (${formatTime(count)})`
                  : 'Kirim Ulang Email Verifikasi'
            }
            disabled={count > 0 || isResending}
            className="w-full py-3"
          />
        </FormAuthComponent>
      </LayoutAuthComponent>
    </GreenRectangle>
  );
}