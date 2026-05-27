/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../api/auth';
import { useToast } from '../hooks/useToast';
import GreenRectangle from '../components/LoginPageComponent';
import LayoutAuthComponent from '../components/LayoutAuthComponent';
import FormAuthComponent from '../components/FormAuthComponent';

export default function VerifikasiEmailPage() {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const token = query.get('token');
  const { addToast } = useToast();
  useEffect(() => {
    if (!token) return;
    async function sendVerifEmail() {
      try {
        await verifyEmail(token);
        addToast('Login berhasil!', { type: 'success' });
        navigate('/');
      } catch (err) {
        addToast(
          err?.response?.data?.message || err?.message || 'Terjadi kesalahan',
          { type: 'error' }
        );
        navigate('/');
      }
    }
    sendVerifEmail();
  }, [token]);
  return (
    <GreenRectangle>
      <LayoutAuthComponent>
        <FormAuthComponent >
          <h2 className='font-bold text-primary text-5xl mt-14 max-sm:text-4xl'>Sedang verifikasi....</h2>
        </FormAuthComponent >
      </LayoutAuthComponent >
    </GreenRectangle>
  );
}