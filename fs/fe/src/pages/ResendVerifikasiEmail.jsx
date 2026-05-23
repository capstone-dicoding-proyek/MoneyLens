/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { resendVerifyEmail } from '../api/auth';
import useAuth from '../hooks/useAuth';
import { getRemainingCooldown, startCooldown } from '../utils/resend-cooldown';
import { formatTime } from '../utils/format-time';
import GreenRectangle from '../components/LoginPageComponent';
import LayoutAuthComponent from '../components/LayoutAuthComponent';
import FormAuthComponent from '../components/FormAuthComponent';
import ButtonComponent from '../components/ButtonComponent';

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
    if (user?.verified_email) navigate('/', { replace: true });
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
      addToast('Email verifikasi telah dikirim', { type: 'success' });
      startCooldown({ key: RESEND_KEY, duration: RESEND_COOLDOWN, setState: setCount });
      startTimer();
    } catch (err) {
      addToast(
        err?.response?.data?.message || 'Gagal mengirim ulang email',
        { type: 'error' }
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <GreenRectangle>
      <LayoutAuthComponent>
        <FormAuthComponent >
          <h2 className='font-bold text-primary text-5xl mt-14 max-sm:text-4xl'>Verifikasi Email</h2>
          <p className='text-tthird font-light text-sm mt-8'>
            Kami telah mengirim link verifikasi ke email kamu.
            Cek inbox atau folder spam.
          </p>
          <ButtonComponent
            onClick={handleResend}
            title={isResending
              ? 'Mengirim...'
              : count > 0
                ? `Kirim ulang dalam ${formatTime(count)}`
                : 'Kirim'}
            disabled={count > 0 || isResending}
          />
        </FormAuthComponent >
      </LayoutAuthComponent >
    </GreenRectangle>
  );
}