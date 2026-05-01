import axios from 'axios';

// Public Axios instance (for login/register)
export const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Private Axios instance with interceptors (used throughout the app)
export const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request Interceptor: Attach current accessToken
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: The Fix for Silent Refresh
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized, intercept
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosPrivate(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint using axiosPublic
        const response = await axiosPublic.get('/api/auth/refresh', {
          withCredentials: true, // Send the secure cookie
        });

        const newAccessToken = response.data.accessToken;
        
        // Update the global Access Token
        localStorage.setItem('token', newAccessToken);
        
        // Process the queued requests with the new token
        processQueue(null, newAccessToken);
        
        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosPrivate(originalRequest);
      } catch (err) {
        // If refresh fails, clear token and redirect to login
        processQueue(err, null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Export axiosPrivate as the default so existing code (import api from './api') works seamlessly
export default axiosPrivate;
