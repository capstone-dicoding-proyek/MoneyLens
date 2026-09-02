import { useGoogleLogin } from '@react-oauth/google';
import FormAuthComponent from '../components/FormAuthComponent';
import InputComponent from '../components/InputComponent';
import { useRef, useState } from 'react';
import useInputs from '../hooks/useInput';
import { Link } from '@tanstack/react-router';
import useAuth from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import GreenRectangle from '../components/LoginPageComponent';
import { MdEmail } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import LayoutAuthComponent from '../components/LayoutAuthComponent';
import ButtonComponent from '../components/ButtonComponent';

export default function LoginPage() {
  const [email, onChangeEmail] = useInputs();
  const [password, onChangePassword] = useInputs();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef(null);
  const { handleLogin, handleLoginWithGoogle } = useAuth();
  const { addToast } = useToast();

  const handleToggle = () => setShowPassword((prev) => !prev);

  const onSubmitLogin = () => {
    if (!email || !password) {
      addToast('Email dan password wajib diisi', { type: 'error' });
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        await handleLogin({ email, password });
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: (token) => handleLoginWithGoogle(token),
    onError: () => addToast('Login gagal!', { type: 'error' }),
    flow: 'auth-code',
  });

  return (
    <GreenRectangle>
      <LayoutAuthComponent>
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A7A5E] to-[#2FA084] text-white flex items-center justify-center font-black text-xl mx-auto shadow-md shadow-emerald-800/20 mb-3">
            M
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Masuk ke MoneyLens
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola keuangan dan catat pengeluaran Anda dengan mudah.
          </p>
        </div>

        {/* Form */}
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

          <InputComponent
            label="Password"
            placeholder="Masukkan kata sandi..."
            toggle={true}
            onChangeToggle={handleToggle}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChangeValue={onChangePassword}
            leftIcon={FaLock}
            required
          />

          <div className="flex items-center justify-end">
            <Link
              to="/reset-password"
              className="text-xs font-semibold text-[#1A7A5E] hover:text-[#2FA084] transition-colors"
            >
              Lupa Password?
            </Link>
          </div>

          <ButtonComponent
            onClick={onSubmitLogin}
            isLoading={isLoading}
            title="Masuk"
            className="w-full py-3"
          />

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 font-medium uppercase tracking-wider absolute">
              atau
            </span>
          </div>

          <button
            type="button"
            onClick={() => loginGoogle()}
            className="btn-outline w-full py-2.5 flex items-center justify-center gap-2.5 font-semibold text-xs sm:text-sm border-slate-200 hover:border-slate-300 shadow-2xs"
          >
            <FcGoogle className="text-xl" />
            <span>Masuk dengan Google</span>
          </button>
        </FormAuthComponent>

        <div className="text-center pt-2 text-xs text-slate-500">
          Belum punya akun?{' '}
          <Link
            to="/register"
            className="font-bold text-[#1A7A5E] hover:text-[#2FA084] transition-colors"
          >
            Daftar Sekarang
          </Link>
        </div>
      </LayoutAuthComponent>
    </GreenRectangle>
  );
}
