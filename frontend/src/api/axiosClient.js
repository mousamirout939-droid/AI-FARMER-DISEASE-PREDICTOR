import axios from 'axios';
import { store } from '../store/store.js';
import { logout, setAccessToken } from '../store/slices/authSlice.js';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api/v1';

export const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach access token to every outgoing request
axiosClient.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let queue = [];

const processQueue = (error, token = null) => {
  queue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  queue = [];
};

// Handle 401s by refreshing the access token once, queueing concurrent requests
axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosClient.post('/auth/refresh-token');

        const newToken = data?.data?.accessToken;

        if (!newToken) {
          throw new Error('No access token returned from refresh endpoint');
        }

        store.dispatch(setAccessToken(newToken));

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        store.dispatch(logout());

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;