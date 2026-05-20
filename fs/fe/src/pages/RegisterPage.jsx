import { useRef, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useInputs from '../hooks/useInput';
import { useToast } from '../hooks/useToast';
import FormAuthComponent from '../components/FormAuthComponent';
import InputComponent from '../components/InputComponent';
import { Link, useNavigate } from 'react-router-dom';
import GreenRectangle from '../components/LoginPageComponent';
import { GoArrowLeft } from 'react-icons/go';
import { MdEmail } from 'react-icons/md';
import { FaKeyboard, FaLock, FaUser } from 'react-icons/fa';
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
  const navigate = useNavigate();
  const { handleRegister, handleLoginWithGoogle } = useAuth();
  const { addToast } = useToast();
  const debounceRef = useRef(null);

  const loginGoogle = useGoogleLogin({
    onSuccess: handleLoginWithGoogle,
    onError: () => addToast('Login gagal!', { type: 'error' }),
  });



  const validate = () => {
    if (!fullname.trim()) {
      addToast('Nama tidak boleh kosong', { type: 'error' });
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
      await handleRegister({ fullname, email, password });
      setIsLoading(false);
    }, 500);
  };

  return (
    <GreenRectangle>
      <LayoutAuthComponent>
        <div className="flex items-center w-92 ">
          <GoArrowLeft
            className="cursor-pointer mr-24 size-6"
            onClick={() => navigate(-1)}
          />
          <span>sudah menjadi member? </span>
          <Link to={'/login'}>
            <span className="text-primary transition-colors hover:text-secondary cursor-pointer">
              masuk
            </span>
          </Link>
        </div>

        <div className="font-bold text-primary text-5xl mt-14 max-sm:text-4xl max-sm:mt-10 md:text-4xl md:mt-4">
          Daftar
        </div>

        <div className="text-tthird font-light text-sm mt-8 md:mt-4 max-sm:mt-4 md:text-sm">
          Silakan daftar untuk mulai mengelola dan mencatat keuangan Anda.
        </div>

        {/* Form */}
        <FormAuthComponent >
          <InputComponent
            type="text"
            placeholder="Name"
            value={fullname}
            onChangeValue={onChangeFullname}
            leftIcon={FaUser}
          />
          <InputComponent
            type="text"
            placeholder="Email"
            value={email}
            onChangeValue={onChangeEmail}
            leftIcon={MdEmail}
          />

          <InputComponent
            type={showPassword.password ? 'text' : 'password'}
            toggle={true}
            placeholder="Password"
            value={password}
            onChangeToggle={() => setShowPassword((p) => ({ ...p, password: !p.password }))}
            onChangeValue={onChangePassword}
            leftIcon={FaLock}
          />

          <div className="-space-x-4 md:-space-x-2">
            <ul className="ml-4 space-y-2 md:space-y-0 text-xs text-tthird list-disc">
              <li>Password harus minimal 8 karakter</li>
              <li>
                Harus mengandung huruf besar, huruf kecil, angka,
                <br />
                dan simbol{' '}
              </li>
              <li>Contoh simbol: !@#$%^&*</li>
            </ul>
          </div>

          {/* Konfirmasi Password */}
          <InputComponent
            type={showPassword.confirm ? 'text' : 'password'}
            toggle={true}
            onChangeToggle={() => setShowPassword((p) => ({ ...p, confirm: !p.confirm }))}
            placeholder="Password"
            value={confirmPassword}
            onChangeValue={onChangeConfirmPassword}
            leftIcon={FaKeyboard}
          />
        </FormAuthComponent>

        <div className="flex items-center gap-20 mt-10 max-sm:mt-6">
          <ButtonComponent
            onClick={onSubmitRegister}
            title='Submit'
          />
          <div className="text-lg font-normal text-tthird">or</div>
          <FcGoogle
            onClick={() => loginGoogle()}
            className="cursor-pointer text-4xl"
          />
        </div>
      </LayoutAuthComponent>
    </GreenRectangle>
  );
}
