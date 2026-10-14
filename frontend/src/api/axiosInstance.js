import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiOrigin = configuredApiUrl || (import.meta.env.DEV ? 'http://localhost:8081' : '');
const API_BASE_URL = apiOrigin
  ? `${apiOrigin.replace(/\/+$/, '').replace(/(?:\/api)+$/i, '')}/api`
  : '/api';
const missingProductionApiUrl = !configuredApiUrl && !import.meta.env.DEV;
const LOGIN_PATH = '/auth/login';

const logLoginTiming = (config, status) => {
  if (config?.url !== LOGIN_PATH || !config.requestStartedAt) return;

  console.info('Login API request completed', {
    method: 'POST',
    path: LOGIN_PATH,
    durationMs: Math.round(performance.now() - config.requestStartedAt),
    status,
  });
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    if (missingProductionApiUrl) {
      const error = new Error('The production API URL is not configured. Set VITE_API_URL in Vercel and redeploy.');
      error.code = 'API_NOT_CONFIGURED';
      return Promise.reject(error);
    }

    if (config.url === LOGIN_PATH) {
      config.requestStartedAt = performance.now();
    }

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
  (response) => {
    logLoginTiming(response.config, response.status);
    return response;
  },
  (error) => {
    logLoginTiming(error.config, error.response?.status ?? 'no response');

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
