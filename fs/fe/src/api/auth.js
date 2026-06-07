import { clearTokens, putTokens } from '../utils/local-storage';
import { api } from './axios-instance';

export const login = async ({ email, password }) => {
  const response = await api.post('/auth', { email, password });
  const { accessToken } = response.data.data;
  putTokens({ accessToken });
  return response.data.data;
};

export const verifyEmail = async (token) => {
  const res = await api.get('/auth/verify-email', { params: { token } });
  return res.data.data;
};

export const resendVerifyEmail = async () => {
  const res = await api.post('/auth/resend-verif');
  return res.data.data;
};

export const logout = async () => {
  await api.delete('/auth');

  clearTokens();
};
export const sendResetPassword = async (email) => {
  const res = await api.post('/auth/reset-password', { email });
  return res.data;
};