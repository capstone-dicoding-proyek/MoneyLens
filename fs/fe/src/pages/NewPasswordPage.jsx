import { useState } from 'react';
import InputComponent from '../components/InputComponent';
import useInputs from '../hooks/useInput';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api/user';
import FormAuthComponent from '../components/FormAuthComponent';
import { useToast } from '../hooks/useToast';
import { FaLock } from 'react-icons/fa';
import GreenRectangle from '../components/LoginPageComponent';
import LayoutAuthComponent from '../components/LayoutAuthComponent';
import ButtonComponent from '../components/ButtonComponent';

export default function NewPasswordPage() {
  const { addToast, removeToast } = useToast();
  const [query] = useSearchParams();
  const token = query.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [password, onChangePassword] = useInputs();
  const navigate = useNavigate();

  const onSendNewPassword = async () => {
    const loadingId = addToast('Sedang memproses...', { type: 'loading' });
    try {
      await resetPassword({ password, token });
      removeToast(loadingId);
      addToast('Reset password berhasil!', { type: 'success' });
      navigate('/');
    } catch (err) {
      removeToast(loadingId);
      addToast(
        err?.response?.data?.message || err?.message || 'Terjadi kesalahan',
        { type: 'error' }
      );

    }
  };

  return (
    <GreenRectangle>
      <LayoutAuthComponent>
        <FormAuthComponent>
          <div className="font-bold text-primary text-5xl mt-14 max-sm:text-4xl">
            Reset Password
          </div>

          <div className="text-tthird font-light text-sm mt-8">
            Masukkan password baru.
          </div>
          <InputComponent label="Password"
            placeholder='Silahkan masukkan password...'
            toggle={true}
            onChangeToggle={setShowPassword}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChangeValue={onChangePassword}
            leftIcon={FaLock}
          />
          <ButtonComponent
            onClick={onSendNewPassword}
            title='Submit'
          />
        </FormAuthComponent>
      </LayoutAuthComponent>
    </GreenRectangle>
  );
};
