/* eslint-disable no-unused-vars */
import axios from 'axios';
import { clearTokens, getAccessToken, getRefreshToken } from '../utils/local-storage';



export const api = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
});


api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLoginRequest =
      originalRequest.url === '/auth' && originalRequest.method === 'post';

    if (error.response?.status === 401 && !originalRequest._retry &&  !isLoginRequest) {
      originalRequest._retry = true;

      try {
        const response = await axios.put(`${import.meta.env.VITE_URL_API}/auth`, {
          refreshToken: getRefreshToken(),
        });

        const { accessToken } = response.data.data;

        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (err) {
        clearTokens();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);