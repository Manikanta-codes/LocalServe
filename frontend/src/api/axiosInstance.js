import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('localserve_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global 401 unauthenticated errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      if (localStorage.getItem('localserve_token')) {
        localStorage.removeItem('localserve_token');
        localStorage.removeItem('localserve_user');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
