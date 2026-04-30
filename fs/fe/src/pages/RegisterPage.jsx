import { useRef, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useInputs from '../hooks/useInput';
import { useToast } from '../hooks/useToast';
import FormAuthComponent from '../components/FormAuthComponent';
import InputComponent from '../components/InputComponent';
import { Link } from 'react-router-dom';

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

  const { handleRegister } = useAuth();
  const { addToast } = useToast();
  const debounceRef = useRef(null);

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
    <section>
      <FormAuthComponent buttonTitle="Daftar" onClickButton={onSubmitRegister} isLoadingButton={isLoading}>
        <InputComponent
          label="Nama"
          placeholder="Silakan masukkan nama..."
          value={fullname}
          onChangeValue={onChangeFullname}
        />
        <InputComponent
          type='email'
          label="Email"
          placeholder="Silakan masukkan email..."
          value={email}
          onChangeValue={onChangeEmail}
        />
        <InputComponent
          label="Password"
          placeholder="Silakan masukkan password..."
          toggle={true}
          onChangeToggle={() => setShowPassword((p) => ({ ...p, password: !p.password }))}
          type={showPassword.password ? 'text' : 'password'}
          value={password}
          onChangeValue={onChangePassword}
        />
        <InputComponent
          label="Konfirmasi Password"
          placeholder="Ulangi password..."
          toggle={true}
          onChangeToggle={() => setShowPassword((p) => ({ ...p, confirm: !p.confirm }))}
          type={showPassword.confirm ? 'text' : 'password'}
          value={confirmPassword}
          onChangeValue={onChangeConfirmPassword}
        />
      </FormAuthComponent>

      <p>
        Sudah punya akun? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}