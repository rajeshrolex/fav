import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // enables sending cookies / PHP sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach authentication token to headers if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Automatically handle API successes/errors and toaster popups
api.interceptors.response.use(
  (response) => {
    // If the API specifies a custom success message, we can toast it
    if (response.data && response.data.success && response.config.method !== 'get') {
      const msg = response.data.message || 'Operation completed successfully';
      toast.success(msg);
    }
    return response.data;
  },
  (error) => {
    const response = error.response;
    let message = 'An unexpected error occurred. Please try again.';

    if (response && response.data) {
      message = response.data.message || message;
      
      // Auto logout if token expires (401 Unauthorized), but NOT on the login page itself
      if (response.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin-login') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin-login';
      }
    } else if (error.code === 'ERR_NETWORK' || !response) {
      message = 'Unable to connect to server. Please ensure backend server is running.';
    }

    // Do not toast error on auth actions or read-only GET requests (to avoid spamming popups on initial page loads)
    const isAuthRequest = error.config && error.config.url && error.config.url.includes('auth.php');
    const isGetRequest = error.config && error.config.method && error.config.method.toLowerCase() === 'get';

    if (!isAuthRequest && !isGetRequest) {
      toast.error(message, { id: message });
    }

    return Promise.reject(error);
  }
);

export default api;
