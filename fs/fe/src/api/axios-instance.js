import axios from 'axios';
import { clearTokens, getAccessToken } from '../utils/local-storage';
import { startProgress, stopProgress } from '../lib/nprogress';

export const api = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    startProgress();
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    stopProgress();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    stopProgress();
    return response;
  },
  async (error) => {
    stopProgress();
    const originalRequest = error.config;
    const isLoginRequest =
      originalRequest?.url === '/auth' && originalRequest?.method === 'post';

    if (error.response?.status === 401 && !originalRequest?._retry && !isLoginRequest) {
      originalRequest._retry = true;

      try {
        const response = await axios.put(`${import.meta.env.VITE_URL_API}/auth`, {}, { withCredentials: true });

        const { accessToken } = response.data.data;

        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        clearTokens();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);