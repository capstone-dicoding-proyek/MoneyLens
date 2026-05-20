import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import GreenRectangle from '../components/LoginPageComponent';
import { GoArrowLeft } from 'react-icons/go';
import { FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';
import { FaKeyboard } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
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
      return false;
    }
    if (count > 0 || isResending) return;

    setIsResending(true);
    try {
      await sendResetPassword(email);
      addToast('Email verifikasi telah dikirim', { type: 'success' });
      startCooldown({ key: RESEND_KEY, duration: RESEND_COOLDOWN, setState: setCount });
      startTimer();
      navigate('/reset-password');
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
        <div className="flex items-center  w-92">
          <GoArrowLeft
            className="cursor-pointer mr-25 size-6"
            onClick={() => navigate(-1)}
          />
          <span>belum menjadi member? </span>
          <Link to={'/login'}>
            <span className="text-primary transition-colors hover:text-secondary cursor-pointer">
              daftar
            </span>
          </Link>
        </div>

        <div className="font-bold text-primary text-5xl mt-14 md:text-4xl md:mt-8">
          Lupa Password?
        </div>

        <div className="text-tthird font-light text-sm mt-8 md:mt-4">
          Masukkan email anda untuk mendapatkan tautan <br />
          reset password.
        </div>

        {/* Form */}
        <FormAuthComponent>
          <InputComponent required={true} label="Email" type="email" placeholder="Masukkan email anda..." value={email} onChangeValue={onChangeEmail} leftIcon={MdEmail} />

          <div className=" items-center  flex justify-center">
            <ButtonComponent
              onClick={handleSend}
              title={isResending
                ? 'Mengirim...'
                : count > 0
                  ? `Kirim ulang dalam ${formatTime(count)}`
                  : 'Kirim'}
              disabled={count > 0 || isResending}
            />
          </div>
        </FormAuthComponent>
      </LayoutAuthComponent>
    </GreenRectangle>
  );
}
