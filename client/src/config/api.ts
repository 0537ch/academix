import axios from 'axios';
import { toast } from 'react-toastify';

// API base URL
export const API_BASE_URL = 'http://localhost:7000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Changed to false since we're not using cookies
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url, {
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response from:', response.config.url, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config
    });

    // Extract error message
    const message = error.response?.data?.message || error.message || 'An error occurred';

    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          toast.error('Please log in to continue');
          break;
        case 403:
          // Forbidden
          toast.error('You do not have permission to perform this action');
          break;
        case 404:
          // Not found
          toast.error('The requested resource was not found');
          break;
        case 500:
          // Server error
          toast.error('A server error occurred. Please try again later.');
          break;
        default:
          // Other errors
          toast.error(message);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error details:', {
        readyState: error.request.readyState,
        status: error.request.status,
        statusText: error.request.statusText,
        responseURL: error.request.responseURL,
        responseHeaders: error.request.getAllResponseHeaders()
      });
      toast.error('Unable to connect to the server. Please check your internet connection.');
    } else {
      // Other errors
      console.error('Error:', error);
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
