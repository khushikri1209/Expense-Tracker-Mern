// utils/api.js - Configured Axios instance with auth header injection

import axios from 'axios';

// Base URL points to the Express backend
const api = axios.create({
  baseURL: '/api',
});

// Safely parse stored user data, returning null on any parse error
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

// Request interceptor: attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const user = getStoredUser();
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
