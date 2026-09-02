// AuthContext.jsx
import { createContext, useEffect, useState } from 'react';
import { login, logout as logoutApi } from '../api/auth';
import { getUserLogged, loginWithGoogle, register } from '../api/user';
import { useToast } from '../hooks/useToast';
import { getAccessToken } from '../utils/local-storage';
import { router } from '../routes/router';
import { queryClient } from '../lib/queryClient';
import { QUERY_KEYS } from '../api/query-keys';
import { getErrorMessage } from '../utils/get-error-message';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast, removeToast } = useToast();

  async function refreshUser() {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      return null;
    }
    try {
      const data = await getUserLogged();
      setUser(data.data.data);
      return data.data.data;
    } catch {
      setUser(null);
      return null;
    }
  }

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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      removeToast(loadingId);
      addToast('Login berhasil!', { type: 'success' });
      router.navigate({ to: '/' });
    } catch (err) {
      removeToast(loadingId);
      addToast(
        getErrorMessage(err, 'Gagal masuk. Periksa kembali email dan kata sandi Anda.'),
        { type: 'error' },
      );
    }
  }

  async function handleLoginWithGoogle(credentialResponse) {
    const loadingId = addToast('Sedang memproses...', { type: 'loading' });
    try {
      await loginWithGoogle(credentialResponse);
      const userData = await getUserLogged();
      setUser(userData.data.data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      removeToast(loadingId);
      addToast('Login berhasil!', { type: 'success' });
      router.navigate({ to: '/' });
    } catch (err) {
      removeToast(loadingId);
      addToast(
        getErrorMessage(err, 'Login dengan Google gagal. Silakan coba lagi.'),
        { type: 'error' },
      );
    }
  }

  async function handleRegister({ fullname, email, password }) {
    const loadingId = addToast('Sedang mendaftar...', { type: 'loading' });
    try {
      await register({ fullname, email, password });
      const userData = await getUserLogged();
      setUser(userData.data.data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user });

      removeToast(loadingId);
      addToast('Registrasi berhasil! Silakan cek email.', { type: 'success' });
      router.navigate({ to: '/auth/resend-verifikasi-email' });
    } catch (err) {
      removeToast(loadingId);
      addToast(
        getErrorMessage(err, 'Pendaftaran akun gagal. Silakan coba beberapa saat lagi.'),
        { type: 'error' },
      );
    }
  }

  async function handleLogout() {
    try {
      await logoutApi();
    } finally {
      queryClient.clear();
      setUser(null);
      router.navigate({ to: '/login' });
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        loading,
        handleLogin,
        handleLoginWithGoogle,
        handleRegister,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;