import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import FormAuthComponent from '../components/FormAuthComponent';
import InputComponent from '../components/InputComponent';
import { useRef, useState } from 'react';
import useInputs from '../hooks/useInput';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import GreenRectangle from '../components/LoginPageComponent';
import { GoArrowLeft } from 'react-icons/go';
import { MdEmail } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import LoadingHand from '../components/LoadingHand';
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
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      await handleLogin({ email, password });
      setIsLoading(false);
    }, 500);
  };
  const loginGoogle = useGoogleLogin({
    onSuccess: handleLoginWithGoogle,
    onError: () => addToast('Login gagal!', { type: 'error' }),
  });

  return (
    <GreenRectangle>
      <LayoutAuthComponent>
        <div className="flex items-center  w-92">
          <GoArrowLeft className="cursor-pointer mr-25 size-6" />
          <span className="max-sm:text-xs ">belum menjadi member? </span>
          <Link to="/register">
            <span className="text-primary transition-colors hover:text-secondary cursor-pointer max-sm:text-xs">
              daftar
            </span>
          </Link>
        </div>

        <div className="font-bold text-primary text-5xl mt-14 max-sm:text-4xl">
          Masuk
        </div>

        <div className="text-tthird font-light text-sm mt-8">
          Silakan masuk untuk mulai mengelola dan mencatat keuangan Anda.
        </div>

        {/* Form */}
        <FormAuthComponent >
          <InputComponent
            type="email"
            placeholder="Email"
            value={email}
            onChangeValue={onChangeEmail}
            leftIcon={MdEmail}
          />

          <InputComponent
            placeholder='Password'
            toggle={true}
            onChangeToggle={handleToggle}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChangeValue={onChangePassword}
            leftIcon={FaLock}
          />

          <div className="-space-x-4y">
            <ul className="ml-4 space-y-2 text-xs text-tthird list-disc ">
              <li>Password harus minimal 8 karakter</li>
              <li>
                Harus mengandung huruf besar, huruf kecil, angka,
                <br />
                dan simbol{' '}
              </li>
              <li>Contoh simbol: !@#$%^&*</li>
            </ul>
          </div>
        </FormAuthComponent>

        <div className="flex items-center gap-20 mt-10">
          <ButtonComponent
            onClick={onSubmitLogin}
            title='Masuk'
          />

          <div className="text-lg font-normal text-tthird">or</div>
          <FcGoogle
            onClick={() => loginGoogle()}
            className="cursor-pointer text-4xl"
          />
        </div>

        <div className="mt-4">
          <Link to='/reset-password'>
            <span className="text-tthird text-sm mt-8 hover:text-primary transition-colors duration-300 cursor-pointer max-sm:text-xs">
              Lupa Password atau Email?
            </span>
          </Link>
        </div>
      </LayoutAuthComponent>
    </GreenRectangle>
  );
}
