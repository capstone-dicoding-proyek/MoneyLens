import { useRef, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useInputs from '../hooks/useInput';
import { useToast } from '../hooks/useToast';
import FormAuthComponent from '../components/FormAuthComponent';
import InputComponent from '../components/InputComponent';
import { Link } from '@tanstack/react-router';
import GreenRectangle from '../components/LoginPageComponent';
import { MdEmail } from 'react-icons/md';
import { FaLock, FaUser } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import LayoutAuthComponent from '../components/LayoutAuthComponent';
import ButtonComponent from '../components/ButtonComponent';

export default function RegisterPage() {
  const [email, onChangeEmail] = useInputs();
  const [fullname, onChangeFullname] = useInputs();
  const [password, onChangePassword] = useInputs();
  const [confirmPassword, onChangeConfirmPassword] = useInputs();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { handleRegister, handleLoginWithGoogle } = useAuth();
  const { addToast } = useToast();
  const debounceRef = useRef(null);

  const loginGoogle = useGoogleLogin({
    onSuccess: (token) => handleLoginWithGoogle(token),
    onError: () => addToast('Pendaftaran Google gagal!', { type: 'error' }),
    flow: 'auth-code',
  });

  const validate = () => {
    if (!fullname.trim()) {
      addToast('Nama lengkap tidak boleh kosong', { type: 'error' });
      return false;
    }
    if (!email.trim()) {
      addToast('Email tidak boleh kosong', { type: 'error' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addToast('Format email tidak valid', { type: 'error' });
      return false;
    }
    if (password.length < 8) {
      addToast('Password minimal 8 karakter', { type: 'error' });
      return false;
    }
    if (password !== confirmPassword) {
      addToast('Konfirmasi password tidak cocok', { type: 'error' });
      return false;
    }
    return true;
  };

  const onSubmitRegister = () => {
    if (!validate()) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        await handleRegister({ fullname, email, password });
      } finally {
        setIsLoading(false);
      }
    }, 300);
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
            Buat Akun Baru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Daftar untuk mulai mencatat keuangan dan analisa arus kas.
          </p>
        </div>

        {/* Form */}
        <FormAuthComponent>
          <InputComponent
            label="Nama Lengkap"
            type="text"
            placeholder="John Doe"
            value={fullname}
            onChangeValue={onChangeFullname}
            leftIcon={FaUser}
            required
          />

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
            type={showPassword.password ? 'text' : 'password'}
            toggle={true}
            placeholder="Minimal 8 karakter"
            value={password}
            onChangeToggle={() => setShowPassword((p) => ({ ...p, password: !p.password }))}
            onChangeValue={onChangePassword}
            leftIcon={FaLock}
            required
          />

          <InputComponent
            label="Konfirmasi Password"
            type={showPassword.confirm ? 'text' : 'password'}
            toggle={true}
            placeholder="Ketik ulang password..."
            value={confirmPassword}
            onChangeToggle={() => setShowPassword((p) => ({ ...p, confirm: !p.confirm }))}
            onChangeValue={onChangeConfirmPassword}
            leftIcon={FaLock}
            required
          />

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700 block">Kriteria Password:</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span>Minimal 8 karakter</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span>Kombinasi huruf besar & kecil</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span>Mengandung angka & simbol (@#$%^&*)</span>
            </div>
          </div>

          <ButtonComponent
            isLoading={isLoading}
            onClick={onSubmitRegister}
            title="Daftar Sekarang"
            className="w-full py-3"
          />

          <div className="relative flex items-center justify-center my-3">
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
            <span>Daftar dengan Google</span>
          </button>
        </FormAuthComponent>

        <div className="text-center pt-2 text-xs text-slate-500">
          Sudah punya akun?{' '}
          <Link
            to="/login"
            className="font-bold text-[#1A7A5E] hover:text-[#2FA084] transition-colors"
          >
            Masuk ke Akun
          </Link>
        </div>
      </LayoutAuthComponent>
    </GreenRectangle>
  );
}
