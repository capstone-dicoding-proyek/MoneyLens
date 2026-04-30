import {  putTokens } from '../utils/local-storage';
import { api } from './axios-instance';

export const loginWithGoogle = async (credentialResponse) => {
  const res = await api.post('/users/google-login', {
    token: credentialResponse.credential,
  });
  const { accessToken, refreshToken } = res.data.data;
  putTokens({ accessToken, refreshToken });
  return res.data.data;
};

export const register = async ({ fullname, email, password }) => {
  const response = await api.post('/users', { fullname, email, password });
  const { accessToken, refreshToken } = response.data.data;
  putTokens({ accessToken, refreshToken });
};

export const resetPassword = async ({ token, password }) => {
  const res = await api.post('/users/reset-password', { token, password });
  return res.data;
};

export const getUserLogged = async () => {
  const res = await api.get('/users');
  return res.data;
};