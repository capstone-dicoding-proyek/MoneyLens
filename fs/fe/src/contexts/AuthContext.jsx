// AuthContext.jsx
import { createContext, useEffect, useState } from 'react';
import { login, logout as logoutApi } from '../api/auth';
import { loginWithGoogle, register } from '../api/user';
import { getUserLogged } from '../api/user';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../utils/local-storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast, removeToast } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    async function initAuth() {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getUserLogged();
        setUser(data.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  async function handleLogin({ email, password }) {
    const loadingId = addToast('Sedang memproses...', { type: 'loading' });
    try {
      await login({ email, password });
      const userData = await getUserLogged();
      setUser(userData.data.data);
      removeToast(loadingId);
      addToast('Login berhasil!', { type: 'success' });
      navigate('/');
    } catch (err) {
      removeToast(loadingId);
      addToast(
        err?.response?.data?.message || err?.message || 'Terjadi kesalahan',
        { type: 'error' }
      );
    }
  }

  async function handleLoginWithGoogle(credentialResponse) {
    const loadingId = addToast('Sedang memproses...', { type: 'loading' });
    try {
      await loginWithGoogle(credentialResponse);
      const userData = await getUserLogged();
      setUser(userData.data.data);
      removeToast(loadingId);
      addToast('Login berhasil!', { type: 'success' });
    } catch (err) {
      removeToast(loadingId);
      addToast(
        err?.response?.data?.message || err?.message || 'Terjadi kesalahan',
        { type: 'error' }
      );
    }
  }

  async function handleRegister({ fullname, email, password }) {
    const loadingId = addToast('Sedang mendaftar...', { type: 'loading' });
    try {
      await register({ fullname, email, password });
      const userData = await getUserLogged();
      setUser(userData.data.data);

      removeToast(loadingId);
      addToast('Registrasi berhasil! Silakan cek email.', { type: 'success' });
      navigate('/auth/resend-verifikasi-email');
    } catch (err) {
      removeToast(loadingId);
      addToast(
        err?.response?.data?.message || err?.message || 'Terjadi kesalahan',
        { type: 'error' }
      );
    }
  }

  async function handleLogout() {
    try {
      await logoutApi();
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleLoginWithGoogle, handleRegister, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;