import { GoogleLogin } from '@react-oauth/google';
import FormAuthComponent from '../components/FormAuthComponent';
import InputComponent from '../components/InputComponent';
import { useRef, useState } from 'react';
import useInputs from '../hooks/useInput';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

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

  return (
    <section>
      <FormAuthComponent buttonTitle='Login' onClickButton={onSubmitLogin} isLoadingButton={isLoading}>
        <InputComponent value={email} placeholder='Silahkan masukkan email...' onChangeValue={onChangeEmail} label={'Email'} />
        <InputComponent label="Password"
          placeholder='Silahkan masukkan password...'
          toggle={true}
          onChangeToggle={handleToggle}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChangeValue={onChangePassword} />

      </FormAuthComponent>
      <GoogleLogin
        onSuccess={handleLoginWithGoogle}
        onError={() => addToast('Login Google gagal', { type: 'error' })}
      />
    </section>
  );
}